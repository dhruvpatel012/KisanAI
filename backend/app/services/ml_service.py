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
                raise HTTPException(status_code=500, detail="ML prediction failed")
                
            data = response.json()
            
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
            
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="ML service unavailable")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail="ML prediction failed")
