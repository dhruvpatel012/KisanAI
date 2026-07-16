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

    # Verify image exists on disk or is Base64
    saved_filename = scan.get("saved_filename")
    temp_file_path = None
    
    if saved_filename and saved_filename.startswith("data:"):
        import base64
        import tempfile
        try:
            # Parse header data:image/png;base64,
            header, encoded = saved_filename.split(",", 1)
            file_bytes = base64.b64decode(encoded)
            # Create a temporary file
            temp_fd, temp_file_path = tempfile.mkstemp(suffix=".jpg")
            with os.fdopen(temp_fd, 'wb') as tmp:
                tmp.write(file_bytes)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to decode Base64 image: {str(e)}")
    else:
        # Standard file path on disk
        file_path = scan.get("file_path")
        if not file_path or not os.path.exists(file_path):
            raise HTTPException(status_code=500, detail="Image file not found on server disk")
        temp_file_path = file_path

    # Call ML prediction
    try:
        ml_result = await predict_disease(temp_file_path)
    finally:
        # Clean up temporary file if we created one
        if saved_filename and saved_filename.startswith("data:") and temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as e:
                print("Failed to remove temp file:", e)
    
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
        "scan_type": scan.get("scan_type"),
        "plant_result": scan.get("plant_result"),
        "land_result": scan.get("land_result"),
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
        "image_url": scan.get('saved_filename') if (scan.get('saved_filename') and scan.get('saved_filename').startswith("data:")) else (f"/uploads/{scan.get('saved_filename')}" if scan.get('saved_filename') else None),
        "created_at": scan.get("created_at")
    }

@router.get("/scans")
async def get_scans_list(
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")
    cursor = database["scans"].find({"user_id": user_id}).sort("created_at", -1).limit(50)
    scans_list = []
    async for scan in cursor:
        created_at = scan.get("created_at")
        if created_at and isinstance(created_at, datetime):
            created_at_str = created_at.isoformat()
        elif created_at:
            created_at_str = str(created_at)
        else:
            created_at_str = None
            
        scans_list.append({
            "upload_id": str(scan["_id"]),
            "scan_type": scan.get("scan_type"),
            "crop": scan.get("crop"),
            "disease": scan.get("disease"),
            "confidence": scan.get("confidence"),
            "severity": scan.get("severity"),
            "is_healthy": scan.get("is_healthy"),
            "status": scan.get("status"),
            "plant_result": scan.get("plant_result"),
            "land_result": scan.get("land_result"),
            "image_url": scan.get('saved_filename') if (scan.get('saved_filename') and scan.get('saved_filename').startswith("data:")) else (f"/uploads/{scan.get('saved_filename')}" if scan.get('saved_filename') else None),
            "created_at": created_at_str
        })
    return scans_list


class BulkDeleteRequest(BaseModel):
    scan_ids: list[str]


@router.delete("/scans/{scan_id}")
async def delete_single_scan(
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
        
    await database["scans"].delete_one({"_id": ObjectId(scan_id)})
    return {"status": "success", "message": "Scan deleted successfully"}


@router.post("/scans/delete-bulk")
async def delete_scans_bulk(
    request_data: BulkDeleteRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")
    object_ids = []
    for s_id in request_data.scan_ids:
        if ObjectId.is_valid(s_id):
            object_ids.append(ObjectId(s_id))
            
    if not object_ids:
        return {"status": "success", "deleted_count": 0}
        
    # Delete only those scans belonging to the current user
    res = await database["scans"].delete_many({
        "_id": {"$in": object_ids},
        "user_id": user_id
    })
    
    return {"status": "success", "deleted_count": res.deleted_count}



