import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import api from "../../lib/axios";
import { useLanguage } from "../../context/LanguageContext";
const WEATHER_CODE_MAPPING = {
  0: { desc: "Clear sky", desc_hi: "साफ़ आसमान", emoji: "☀️" },
  1: { desc: "Mainly clear", desc_hi: "मुख्यतः साफ़", emoji: "🌤️" },
  2: { desc: "Partly cloudy", desc_hi: "आंशिक रूप से बादल", emoji: "⛅" },
  3: { desc: "Overcast", desc_hi: "बादलों से घिरा", emoji: "☁️" },
  45: { desc: "Foggy", desc_hi: "कोहरा", emoji: "🌫️" },
  48: { desc: "Dense fog", desc_hi: "घना कोहरा", emoji: "🌫️" },
  51: { desc: "Light drizzle", desc_hi: "हल्की बूंदाबांदी", emoji: "🌦️" },
  53: { desc: "Moderate drizzle", desc_hi: "मध्यम बूंदाबांदी", emoji: "🌦️" },
  55: { desc: "Dense drizzle", desc_hi: "तेज़ बूंदाबांदी", emoji: "🌦️" },
  61: { desc: "Slight rain", desc_hi: "हल्की बारिश", emoji: "🌧️" },
  63: { desc: "Moderate rain", desc_hi: "मध्यम बारिश", emoji: "🌧️" },
  65: { desc: "Heavy rain", desc_hi: "तेज़ बारिश", emoji: "🌧️" },
  71: { desc: "Light snow", desc_hi: "हल्की बर्फबारी", emoji: "❄️" },
  73: { desc: "Moderate snow", desc_hi: "मध्यम बर्फबारी", emoji: "❄️" },
  75: { desc: "Heavy snow", desc_hi: "तेज़ बर्फबारी", emoji: "❄️" },
  80: { desc: "Slight rain showers", desc_hi: "हल्की बौछारें", emoji: "🌦️" },
  81: { desc: "Moderate rain showers", desc_hi: "मध्यम बौछारें", emoji: "🌦️" },
  82: { desc: "Violent rain showers", desc_hi: "तेज़ बौछारें", emoji: "🌦️" },
  95: { desc: "Thunderstorm", desc_hi: "आंधी-तूफान", emoji: "⛈️" },
  96: { desc: "Thunderstorm with slight hail", desc_hi: "ओलावृष्टि के साथ तूफान", emoji: "⛈️" },
  99: { desc: "Thunderstorm with heavy hail", desc_hi: "भारी ओलावृष्टि के साथ तूफान", emoji: "⛈️" },
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setTimeOfDay("morning");
    } else if (hours < 17) {
      setTimeOfDay("afternoon");
    } else {
      setTimeOfDay("evening");
    }

    const fetchRecentScans = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/scans");
        setScans(response.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch recent scans:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchWeather = async (lat, lng, cityName = "") => {
      try {
        setWeatherLoading(true);
        
        // Fetch weather directly from Open-Meteo on browser client to bypass Cloud IP 429 rate limit
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
        const weatherResp = await fetch(weatherUrl);
        const data = await weatherResp.json();
        
        const current = data.current || {};
        const daily = data.daily || {};
        
        const getMappedWeather = (code) => {
          return WEATHER_CODE_MAPPING[code] || { desc: "Overcast", desc_hi: "बादल", emoji: "☁️" };
        };
        
        const currentMapped = getMappedWeather(current.weather_code || 0);
        
        const parsedForecast = [];
        const times = daily.time || [];
        const tempMaxs = daily.temperature_2m_max || [];
        const tempMins = daily.temperature_2m_min || [];
        const codes = daily.weather_code || [];
        
        for (let i = 0; i < Math.min(3, times.length); i++) {
          const dayMapped = getMappedWeather(codes[i] || 0);
          parsedForecast.push({
            date: times[i],
            temp_max: tempMaxs[i],
            temp_min: tempMins[i],
            description: dayMapped.desc,
            description_hi: dayMapped.desc_hi,
            emoji: dayMapped.emoji
          });
        }

        setWeather({
          current: {
            temperature: current.temperature_2m,
            humidity: current.relative_humidity_2m,
            wind_speed: current.wind_speed_10m,
            description: currentMapped.desc,
            description_hi: currentMapped.desc_hi,
            emoji: currentMapped.emoji
          },
          forecast: parsedForecast
        });

        if (cityName) {
          setLocationName(cityName);
        } else {
          try {
            const geoResp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`,
              { headers: { "User-Agent": "KisanAI-App/1.0" } }
            );
            const geoData = await geoResp.json();
            const addr = geoData.address || {};
            const city = addr.city || addr.town || addr.village || addr.suburb || addr.state || "My Location";
            setLocationName(city);
          } catch (geoErr) {
            console.error("Failed to reverse geocode:", geoErr);
            setLocationName("My Location");
          }
        }
      } catch (err) {
        console.warn("Direct weather fetch failed, trying backend fallback:", err);
        try {
          const response = await api.get(`/api/weather?lat=${lat}&lng=${lng}`);
          setWeather(response.data);
          if (cityName) setLocationName(cityName);
        } catch (backendErr) {
          console.error("Backend weather fallback failed:", backendErr);
        }
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchRecentScans();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation access denied or failed, using default (Delhi)");
          fetchWeather(28.6139, 77.2090, "Delhi");
        },
        { timeout: 3000, enableHighAccuracy: false, maximumAge: 600000 }
      );
    } else {
      fetchWeather(28.6139, 77.2090, "Delhi");
    }
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getSeverityVariant = (scan) => {
    if (scan.status === "low_confidence") return "warning";
    if (scan.status === "uploaded") return "info";
    if (scan.is_healthy) return "success";
    
    switch (scan.severity?.toLowerCase()) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "gray";
    }
  };

  const getSeverityLabel = (scan) => {
    if (scan.status === "low_confidence") return t("Unclear", "अस्पष्ट");
    if (scan.status === "uploaded") return t("Analyzing...", "विश्लेषण...");
    if (scan.is_healthy) return t("Healthy", "स्वस्थ");

    switch (scan.severity?.toLowerCase()) {
      case "high":
        return t("High Risk", "उच्च जोखिम");
      case "medium":
        return t("Medium Risk", "मध्यम जोखिम");
      case "low":
        return t("Low Risk", "कम जोखिम");
      default:
        return t("Unknown", "अज्ञात");
    }
  };

  const getCropEmoji = (cropName) => {
    if (!cropName) return "🌱";
    const name = cropName.toLowerCase();
    if (name.includes("potato")) return "🥔";
    if (name.includes("tomato")) return "🍅";
    if (name.includes("wheat") || name.includes("rice")) return "🌾";
    return "🌱";
  };

  // Resolve Image URL
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const getImageUrl = (scan) => {
    if (!scan.image_url) return null;
    return (scan.image_url.startsWith("http") || scan.image_url.startsWith("data:"))
      ? scan.image_url
      : `${backendUrl}${scan.image_url}`;
  };

  const greeting = timeOfDay === "morning"
    ? t("Good Morning", "सुप्रभात")
    : timeOfDay === "afternoon"
    ? t("Good Afternoon", "नमस्कार")
    : t("Good Evening", "शुभ संध्या");

  const displayLocation = locationName === "Delhi"
    ? t("Delhi", "दिल्ली")
    : locationName === "My Location"
    ? t("My Location", "मेरा स्थान")
    : locationName;

  const getLeftBorderColor = (scan) => {
    if (scan.status === "low_confidence") return "border-l-4 border-amber-500";
    if (scan.status === "uploaded") return "border-l-4 border-blue-500";
    if (scan.is_healthy) return "border-l-4 border-green-500";
    
    switch (scan.severity?.toLowerCase()) {
      case "high":
        return "border-l-4 border-red-500";
      case "medium":
        return "border-l-4 border-amber-500";
      case "low":
      case "none":
        return "border-l-4 border-green-500";
      default:
        return "border-l-4 border-green-500";
    }
  };

  return (
    <PageLayout>
      {/* SECTION 1 - Greeting */}
      <div className="mb-6 mt-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {greeting} <span className="animate-bounce">👋</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {t("How are your crops today?", "आज आपकी फसलें कैसी हैं?")}
        </p>
      </div>

      {/* SECTION 1.5 - Weather Card */}
      {weatherLoading ? (
        <Card className="mb-6 h-36 bg-gray-100 animate-pulse border border-gray-200" />
      ) : weather ? (
        <Card className="mb-6 bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm p-4 relative overflow-hidden rounded-2xl">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {t("Local Weather", "स्थानीय मौसम")}{displayLocation ? ` — ${displayLocation}` : ""}
              </span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-3xl font-extrabold text-emerald-950">
                  {Math.round(weather.current.temperature)}°C
                </span>
                <span className="text-2xl">{weather.current.emoji}</span>
                <span className="text-sm font-bold text-emerald-800">
                  {t(weather.current.description, weather.current.description_hi)}
                </span>
              </div>
              <div className="flex gap-4 mt-2 text-xs font-semibold text-emerald-800">
                <span>💧 {t("Humidity", "आर्द्रता")}: {weather.current.humidity}%</span>
                <span>💨 {t("Wind", "हवा")}: {weather.current.wind_speed} km/h</span>
              </div>
            </div>
          </div>
          
          {/* 3-Day Forecast */}
          <div className="border-t border-emerald-100/70 pt-2 mt-2">
            <p className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold mb-1.5">
              {t("3-Day Forecast", "3-दिवसीय पूर्वानुमान")}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {weather.forecast.map((day, idx) => {
                const dateLabel = idx === 0 
                  ? t("Today", "आज") 
                  : idx === 1 
                  ? t("Tomorrow", "कल") 
                  : formatDate(day.date).split(",")[0];
                return (
                  <div key={idx} className="bg-white/50 rounded-xl p-2 text-center border border-emerald-100/50">
                    <p className="text-[10px] font-bold text-emerald-900 leading-tight">
                      {dateLabel}
                    </p>
                    <p className="text-lg my-1">{day.emoji}</p>
                    <p className="text-[10px] font-bold text-emerald-955">
                      {Math.round(day.temp_max)}°/{Math.round(day.temp_min)}°
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      ) : null}

      {/* SECTION 2 - Hero Scan Card */}
      <Card
        className="mb-6 text-white border-0 shadow-lg relative overflow-hidden rounded-2xl"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.1) 1.5px, transparent 1.5px), linear-gradient(135deg, #15803d, #16a34a, #10b981)",
          backgroundSize: "16px 16px, 100% 100%"
        }}
      >
        <div className="relative z-10 py-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full font-semibold">
                {t("Crop Health Scan", "फसल जाँच")}
              </span>
              <h3 className="text-xl font-bold mt-2">
                {t("Scan Your Crop", "फसल की जाँच करें")}
              </h3>
              <p className="text-green-50 text-xs mt-1 max-w-[200px]">
                {t("Detect diseases instantly using your mobile camera.", "अपने मोबाइल कैमरे से तुरंत रोगों का पता लगाएं।")}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
              📸
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate("/scan")}
            className="bg-white border-white text-green-800 hover:bg-green-50 font-bold"
          >
            {t("Start Scan →", "जाँच शुरू करें →")}
          </Button>
        </div>
        
        {/* Background decorative leaf shape */}
        <div className="absolute -top-4 -right-4 opacity-20 text-8xl rotate-12 select-none pointer-events-none font-bold">
          🍃
        </div>
        
        <div className="absolute right-[-20px] bottom-[-20px] text-white/5 text-[150px] pointer-events-none select-none font-bold">
          🌾
        </div>
      </Card>

      {/* SECTION 3 - Recent Scans */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">
          {t("Recent Scans", "हालिया जाँच")}
        </h3>
        <Link
          to="/history"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          {t("See All", "सभी देखें")} <i className="ri-arrow-right-s-line text-sm"></i>
        </Link>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 bg-gray-100 animate-pulse rounded-2xl border border-gray-200" />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && scans.length === 0 && (
        <div className="text-center py-6 text-sm text-gray-500 font-medium bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          {t("No scans yet", "कोई जाँच नहीं")}
        </div>
      )}

      {/* DYNAMIC SCANS FEED */}
      {!loading && scans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {scans.map((scan) => {
            const imgUrl = getImageUrl(scan);
            return (
              <Card
                key={scan.upload_id}
                onClick={() => navigate(`/result/${scan.upload_id}`)}
                className={`flex items-center justify-between hover:shadow-md transition-all duration-200 cursor-pointer border border-emerald-50 ${getLeftBorderColor(scan)}`}
              >
                <div className="flex items-center gap-3">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt="Crop Thumbnail"
                      className="w-12 h-12 rounded-xl object-cover border border-emerald-100/50 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-2xl border border-brand-100/50 flex-shrink-0">
                      {getCropEmoji(scan.crop)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm truncate max-w-[150px]">
                      {scan.crop || t("Unknown", "अज्ञात")}
                    </h4>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                      {scan.status === "uploaded"
                        ? t("Analyzing...", "विश्लेषण...")
                        : scan.disease || (scan.status === "low_confidence" ? t("Unclear Image", "अस्पष्ट चित्र") : t("Healthy", "स्वस्थ"))}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {formatDate(scan.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge variant={getSeverityVariant(scan)}>
                    {getSeverityLabel(scan)}
                  </Badge>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
};

export default DashboardPage;
