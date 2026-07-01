from fastapi import APIRouter, HTTPException
import urllib.request
import json
import urllib.error
import time
import threading

router = APIRouter(prefix="/api", tags=["Weather"])

# In-memory cache for weather data
# Cache key: (round(lat, 2), round(lng, 2))
# Cache value: (expiry_timestamp, weather_data)
_weather_cache = {}
_cache_lock = threading.Lock()
CACHE_DURATION = 900  # 15 minutes in seconds

# Mapping weather code to description, emoji, and translation
WEATHER_CODE_MAPPING = {
    0: {"desc": "Clear sky", "desc_hi": "साफ़ आसमान", "emoji": "☀️"},
    1: {"desc": "Mainly clear", "desc_hi": "मुख्यतः साफ़", "emoji": "🌤️"},
    2: {"desc": "Partly cloudy", "desc_hi": "आंशिक रूप से बादल", "emoji": "⛅"},
    3: {"desc": "Overcast", "desc_hi": "बादलों से घिरा", "emoji": "☁️"},
    45: {"desc": "Foggy", "desc_hi": "कोहरा", "emoji": "🌫️"},
    48: {"desc": "Depositing rime fog", "desc_hi": "घना कोहरा", "emoji": "🌫️"},
    51: {"desc": "Light drizzle", "desc_hi": "हल्की बूंदाबांदी", "emoji": "🌦️"},
    53: {"desc": "Moderate drizzle", "desc_hi": "मध्यम बूंदाबांदी", "emoji": "🌦️"},
    55: {"desc": "Dense drizzle", "desc_hi": "तेज़ बूंदाबांदी", "emoji": "🌦️"},
    61: {"desc": "Slight rain", "desc_hi": "हल्की बारिश", "emoji": "🌧️"},
    63: {"desc": "Moderate rain", "desc_hi": "मध्यम बारिश", "emoji": "🌧️"},
    65: {"desc": "Heavy rain", "desc_hi": "तेज़ बारिश", "emoji": "🌧️"},
    71: {"desc": "Light snow", "desc_hi": "हल्की बर्फबारी", "emoji": "❄️"},
    73: {"desc": "Moderate snow", "desc_hi": "मध्यम बर्फबारी", "emoji": "❄️"},
    75: {"desc": "Heavy snow", "desc_hi": "तेज़ बर्फबारी", "emoji": "❄️"},
    80: {"desc": "Slight rain showers", "desc_hi": "हल्की बौछारें", "emoji": "🌦️"},
    81: {"desc": "Moderate rain showers", "desc_hi": "मध्यम बौछारें", "emoji": "🌦️"},
    82: {"desc": "Violent rain showers", "desc_hi": "तेज़ बौछारें", "emoji": "🌦️"},
    95: {"desc": "Thunderstorm", "desc_hi": "आंधी-तूफान", "emoji": "⛈️"},
    96: {"desc": "Thunderstorm with slight hail", "desc_hi": "ओलावृष्टि के साथ तूफान", "emoji": "⛈️"},
    99: {"desc": "Thunderstorm with heavy hail", "desc_hi": "भारी ओलावृष्टि के साथ तूफान", "emoji": "⛈️"},
}

def get_weather_info(code: int) -> dict:
    return WEATHER_CODE_MAPPING.get(code, {"desc": "Overcast", "desc_hi": "बादल", "emoji": "☁️"})

@router.get("/weather")
async def get_weather(lat: float = 28.6139, lng: float = 77.2090):
    lat_key = round(lat, 2)
    lng_key = round(lng, 2)
    cache_key = (lat_key, lng_key)
    now = time.time()
    
    # Check cache first
    with _cache_lock:
        if cache_key in _weather_cache:
            expiry, cached_data = _weather_cache[cache_key]
            if now < expiry:
                return cached_data

    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lng}"
        f"&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m"
        f"&daily=weather_code,temperature_2m_max,temperature_2m_min"
        f"&timezone=auto"
    )
    
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "KisanAI/1.0"})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode("utf-8"))
            
        current = data.get("current", {})
        daily = data.get("daily", {})
        
        current_code = current.get("weather_code", 0)
        current_mapped = get_weather_info(current_code)
        
        # Parse 3-day forecast
        forecast = []
        times = daily.get("time", [])
        temp_maxs = daily.get("temperature_2m_max", [])
        temp_mins = daily.get("temperature_2m_min", [])
        codes = daily.get("weather_code", [])
        
        # Take up to 3 days (Today, Tomorrow, Day After)
        for i in range(min(3, len(times))):
            day_code = codes[i] if i < len(codes) else 0
            day_mapped = get_weather_info(day_code)
            forecast.append({
                "date": times[i],
                "temp_max": temp_maxs[i] if i < len(temp_maxs) else None,
                "temp_min": temp_mins[i] if i < len(temp_mins) else None,
                "description": day_mapped["desc"],
                "description_hi": day_mapped["desc_hi"],
                "emoji": day_mapped["emoji"]
            })
            
        result = {
            "current": {
                "temperature": current.get("temperature_2m"),
                "humidity": current.get("relative_humidity_2m"),
                "wind_speed": current.get("wind_speed_10m"),
                "description": current_mapped["desc"],
                "description_hi": current_mapped["desc_hi"],
                "emoji": current_mapped["emoji"]
            },
            "forecast": forecast
        }
        
        # Save to cache
        with _cache_lock:
            _weather_cache[cache_key] = (now + CACHE_DURATION, result)
            
        return result
        
    except urllib.error.URLError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Weather provider unreachable: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch weather data: {str(e)}"
        )
