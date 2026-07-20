import os
import re
from fastapi import HTTPException
import httpx
from app.config import settings

async def predict_disease(image_path: str) -> dict:
    if settings.use_mock_ml:
        return {
            "status": "success",
            "crop": "Potato",
            "disease": "Potato Early blight",
            "is_healthy": False,
            "confidence": 0.9250,
            "severity": "medium",
            "treatment_steps": [
                "Remove infected leaves immediately",
                "Apply copper-based fungicide",
                "Improve drainage around plants"
            ],
            "fertilizer": "Reduce nitrogen application",
            "prevention": "Use resistant varieties and crop rotation",
            "urgency": "high",
            "disclaimer": "Model trained on lab images. Real-world accuracy may vary.",
            "similar_diseases": [
                {
                    "name": "Potato Late blight",
                    "confidence": 0.052,
                    "severity": "high",
                    "treatment_steps": [
                        "Remove all infected plants",
                        "Apply fungicide immediately",
                        "Avoid overhead irrigation"
                    ],
                    "fertilizer": "Avoid high nitrogen fertilizers",
                    "prevention": "Use crop rotation and good sanitation"
                },
                {
                    "name": "Potato healthy",
                    "confidence": 0.023,
                    "severity": "none",
                    "treatment_steps": [],
                    "fertilizer": "Standard balanced fertilizer",
                    "prevention": "Maintain current good practices"
                }
            ]
        }

    # Real ML prediction mode
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image file not found")

    try:
        async with httpx.AsyncClient() as client:
            with open(image_path, "rb") as f:
                files = {"file": (os.path.basename(image_path), f, "image/jpeg")}
                response = await client.post(
                    f"{settings.ml_service_url.rstrip('/')}{settings.ml_endpoint}",
                    files=files,
                    timeout=30.0
                )
            
            if response.status_code != 200:
                print("ML service response status:", response.status_code)
                print("ML service response body:", response.text)
                raise HTTPException(status_code=500, detail=f"ML prediction failed: status {response.status_code}, body: {response.text}")

                
            data = response.json()
            
            if data.get("status") == "low_confidence":
                conf = data.get("confidence", 0.0)
                if conf > 1.0:
                    conf = conf / 100.0
                return {
                    "status": "low_confidence",
                    "confidence": conf,
                    "message": data.get("message", "Image unclear. Please take a closer photo of the affected leaf in good lighting.")
                }

            
            # Clean and normalize fields
            disease = data.get("disease", "")
            disease = re.sub(r"\s+", " ", disease).strip()
            
            # Convert confidence from 0-100 to 0-1
            conf = data.get("confidence", 0.0)
            if conf > 1.0:
                conf = conf / 100.0
                
            similar_diseases = []
            for item in data.get("similar_diseases", []):
                sim_conf = item.get("confidence", 0.0)
                if sim_conf > 1.0:
                    sim_conf = sim_conf / 100.0
                similar_diseases.append({
                    "name": re.sub(r"\s+", " ", item.get("name", "")).strip(),
                    "confidence": sim_conf,
                    "severity": item.get("severity", "none"),
                    "treatment_steps": item.get("treatment_steps", []),
                    "fertilizer": item.get("fertilizer", ""),
                    "prevention": item.get("prevention", "")
                })

            return {
                "status": "success",
                "crop": data.get("crop", "Unknown"),
                "disease": disease,
                "is_healthy": data.get("is_healthy", False),
                "confidence": conf,
                "severity": data.get("severity", "medium"),
                "treatment_steps": data.get("treatment_steps", []),
                "fertilizer": data.get("fertilizer", ""),
                "prevention": data.get("prevention", ""),
                "urgency": data.get("urgency", "low"),
                "disclaimer": data.get("disclaimer", "Model prediction results."),
                "similar_diseases": similar_diseases
            }
            
    except httpx.RequestError as e:
        print("ML service request error:", str(e))
        raise HTTPException(status_code=503, detail="ML service unavailable")
    except Exception as e:
        print("ML prediction exception:", str(e))
        import traceback
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"ML prediction failed: {str(e)}")


async def identify_plant(image_path: str) -> dict:
    if settings.use_mock_ml:
        return {
            "status": "success",
            "plant_name": "Tomato",
            "scientific_name": "Solanum lycopersicum",
            "family": "Solanaceae",
            "confidence": 0.9450
        }

    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image file not found")

    try:
        with open(image_path, "rb") as f:
            image_bytes = f.read()
    except Exception:
        raise HTTPException(status_code=404, detail="Image file not found")

    try:
        url = f"{settings.ml_service_url.rstrip('/')}/identify"
        files = {"file": ("image.jpg", image_bytes, "image/jpeg")}
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, files=files, timeout=30.0)
            
        if response.status_code == 200:
            data = response.json()
            if data.get("error"):
                error_msg = data.get("error", "")
                if "401" in error_msg:
                    raise HTTPException(
                        status_code=503,
                        detail="Plant identification service quota exceeded. Please try again later."
                    )
                raise HTTPException(status_code=503, detail=f"Plant identification failed: {error_msg}")

            if data.get("status") == "low_confidence":
                return {
                    "status": "low_confidence",
                    "message": data.get("message"),
                    "confidence": data.get("confidence"),
                    "plant_name": data.get("best_guess") or "Unknown Plant"
                }
            if data.get("status") == "success":
                return {
                    "status": "success",
                    "plant_name": data.get("plant_name"),
                    "scientific_name": data.get("scientific_name"),
                    "family": data.get("family"),
                    "confidence": data.get("confidence")
                }
            return data

        raise HTTPException(status_code=503, detail="Plant identification service unavailable")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=503, detail="Plant identification service error")


async def analyze_land(image_path: str) -> dict:
    if settings.use_mock_ml:
        return {
            "status": "success",
            "soil_type": "Loamy Soil",
            "soil_color": "Reddish Brown",
            "estimated_ph": "6.5 - Slightly Acidic",
            "moisture_level": "Moderate",
            "fertility": "Medium to High",
            "best_crops": ["Soybeans", "Corn (Maize)", "Wheat", "Tomato", "Cotton"],
            "avoid_crops": ["Paddy Rice (requires clayey flooded soil)", "Cranberry"],
            "fertilizer_recommendation": "Apply balanced N-P-K (10-26-26) and organic compost to enrich organic matter.",
            "irrigation_advice": "Drip irrigation or sprinkler irrigation every 3 to 4 days during dry seasons.",
            "soil_improvement_tips": [
                "Incorporate bio-fertilizers and green manure to maintain microbial activity and soil structure.",
                "Practice crop rotation with legumes to naturally enrich soil nitrogen."
            ]
        }

    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image file not found")

    try:
        with open(image_path, "rb") as f:
            image_bytes = f.read()
    except Exception:
        raise HTTPException(status_code=404, detail="Image file not found")

    try:
        url = f"{settings.ml_service_url.rstrip('/')}/land"
        files = {"file": ("image.jpg", image_bytes, "image/jpeg")}
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, files=files, timeout=60.0)
            
        if response.status_code == 200:
            data = response.json()
            tips = data.get("soil_improvement_tips", ["Use green manure to improve soil quality."])
            if isinstance(tips, str):
                tips = [tips]
            return {
                "status": "success",
                "soil_type": data.get("soil_type", "Loamy Soil"),
                "soil_color": data.get("soil_color", "Reddish Brown"),
                "estimated_ph": data.get("estimated_ph", "6.5"),
                "moisture_level": data.get("moisture_level", "Moderate"),
                "fertility": data.get("fertility", "Medium to High"),
                "best_crops": data.get("best_crops", ["Soybeans", "Corn", "Wheat"]),
                "avoid_crops": data.get("avoid_crops", ["Paddy Rice"]),
                "fertilizer_recommendation": data.get("fertilizer_recommendation", "Apply balanced N-P-K and organic compost."),
                "irrigation_advice": data.get("irrigation_advice", "Drip irrigation recommended."),
                "soil_improvement_tips": tips
            }

        raise HTTPException(status_code=503, detail="Land analysis service unavailable")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=503, detail="Land analysis service error")





