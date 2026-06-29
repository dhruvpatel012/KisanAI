from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt import verify_token
from app.database import database
from app.services.ml_service import predict_disease
from bson import ObjectId
from datetime import datetime, timezone
import os
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api", tags=["Analyze"])
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )
    return payload

class AnalyzeRequest(BaseModel):
    upload_id: str
    lat: float = Field(default=20.5937)
    lng: float = Field(default=78.9629)

@router.post("/analyze")
async def analyze_crop(
    payload: AnalyzeRequest,
    current_user: dict = Depends(get_current_user)
):
    upload_id = payload.upload_id
    
    # Validate upload_id format
    if not ObjectId.is_valid(upload_id):
        raise HTTPException(status_code=400, detail="Invalid upload_id format")

    # Find scan in database
    scan = await database["scans"].find_one({"_id": ObjectId(upload_id)})
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found")
    
    # Verify ownership
    user_id = current_user.get("user_id")
    if scan.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: You do not own this scan")
        
    # If already analyzed, return existing result
    if scan.get("status") in ["analyzed", "low_confidence"]:
        return {
            "upload_id": upload_id,
            "disease": scan.get("disease"),
            "confidence": scan.get("confidence"),
            "severity": scan.get("severity"),
            "is_healthy": scan.get("is_healthy"),
            "crop": scan.get("crop"),
            "treatment_steps": scan.get("treatment_steps", []),
            "fertilizer": scan.get("fertilizer"),
            "prevention": scan.get("prevention"),
            "urgency": scan.get("urgency"),
            "similar_diseases": scan.get("similar_diseases", []),
            "disclaimer": scan.get("disclaimer"),
            "status": scan.get("status"),
            "message": scan.get("message") if scan.get("status") == "low_confidence" else "Analysis complete"
        }

    # Verify image exists on disk
    file_path = scan.get("file_path")
    if not file_path or not os.path.exists(file_path):
        raise HTTPException(status_code=500, detail="Image file not found on server disk")

    # Call ML prediction
    ml_result = await predict_disease(file_path)
    
    # Update MongoDB scan record
    if ml_result.get("status") == "low_confidence":
        update_data = {
            "status": "low_confidence",
            "confidence": ml_result.get("confidence"),
            "message": ml_result.get("message"),
            "analyzed_at": datetime.now(timezone.utc)
        }
        await database["scans"].update_one(
            {"_id": ObjectId(upload_id)},
            {"$set": update_data}
        )
        return {
            "upload_id": upload_id,
            "status": "low_confidence",
            "confidence": ml_result.get("confidence"),
            "message": ml_result.get("message"),
            "disease": None,
            "crop": None,
            "treatment_steps": [],
            "severity": "none",
            "is_healthy": False,
            "fertilizer": "",
            "prevention": "",
            "urgency": "low",
            "similar_diseases": [],
            "disclaimer": "Model prediction results."
        }

    update_data = {
        "disease": ml_result.get("disease"),
        "confidence": ml_result.get("confidence"),
        "severity": ml_result.get("severity"),
        "is_healthy": ml_result.get("is_healthy"),
        "crop": ml_result.get("crop"),
        "treatment_steps": ml_result.get("treatment_steps"),
        "fertilizer": ml_result.get("fertilizer"),
        "prevention": ml_result.get("prevention"),
        "urgency": ml_result.get("urgency"),
        "similar_diseases": ml_result.get("similar_diseases"),
        "disclaimer": ml_result.get("disclaimer"),
        "status": "analyzed",
        "analyzed_at": datetime.now(timezone.utc)
    }
    
    await database["scans"].update_one(
        {"_id": ObjectId(upload_id)},
        {"$set": update_data}
    )
    
    return {
        "upload_id": upload_id,
        "disease": ml_result.get("disease"),
        "confidence": ml_result.get("confidence"),
        "severity": ml_result.get("severity"),
        "is_healthy": ml_result.get("is_healthy"),
        "crop": ml_result.get("crop"),
        "treatment_steps": ml_result.get("treatment_steps"),
        "fertilizer": ml_result.get("fertilizer"),
        "prevention": ml_result.get("prevention"),
        "urgency": ml_result.get("urgency"),
        "similar_diseases": ml_result.get("similar_diseases"),
        "disclaimer": ml_result.get("disclaimer"),
        "status": "analyzed",
        "message": "Analysis complete"
    }

@router.get("/scans/{scan_id}")
async def get_scan_details(
    scan_id: str,
    current_user: dict = Depends(get_current_user)
):
    if not ObjectId.is_valid(scan_id):
        raise HTTPException(status_code=400, detail="Invalid scan ID format")
        
    scan = await database["scans"].find_one({"_id": ObjectId(scan_id)})
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    if scan.get("user_id") != current_user.get("user_id"):
        raise HTTPException(status_code=403, detail="Forbidden: You do not own this scan")
        
    return {
        "upload_id": str(scan["_id"]),
        "status": scan.get("status"),
        "crop": scan.get("crop"),
        "disease": scan.get("disease"),
        "confidence": scan.get("confidence"),
        "severity": scan.get("severity"),
        "is_healthy": scan.get("is_healthy"),
        "treatment_steps": scan.get("treatment_steps", []),
        "fertilizer": scan.get("fertilizer"),
        "prevention": scan.get("prevention"),
        "urgency": scan.get("urgency"),
        "similar_diseases": scan.get("similar_diseases", []),
        "disclaimer": scan.get("disclaimer"),
        "message": scan.get("message") if scan.get("status") == "low_confidence" else "Analysis complete",
        "image_url": f"/uploads/{scan.get('saved_filename')}",
        "created_at": scan.get("created_at")
    }

