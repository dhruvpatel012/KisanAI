from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database import database
from app.utils.jwt import verify_token
from app.services.ml_service import identify_plant, analyze_land
from bson import ObjectId
from datetime import datetime, timezone
import os
import base64
import tempfile
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["Extra Scans"])
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

class ExtraScanRequest(BaseModel):
    upload_id: str

@router.post("/plant-identify")
async def plant_identify(
    payload: ExtraScanRequest,
    current_user: dict = Depends(get_current_user)
):
    upload_id = payload.upload_id
    if not ObjectId.is_valid(upload_id):
        raise HTTPException(status_code=400, detail="Invalid upload_id")
        
    scan = await database["scans"].find_one({"_id": ObjectId(upload_id)})
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    user_id = current_user.get("user_id")
    if scan.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    saved_filename = scan.get("saved_filename")
    temp_file_path = None
    
    if saved_filename and saved_filename.startswith("data:"):
        try:
            header, encoded = saved_filename.split(",", 1)
            file_bytes = base64.b64decode(encoded)
            temp_fd, temp_file_path = tempfile.mkstemp(suffix=".jpg")
            with os.fdopen(temp_fd, 'wb') as tmp:
                tmp.write(file_bytes)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to decode Base64 image: {str(e)}")
    else:
        file_path = scan.get("file_path")
        if not file_path or not os.path.exists(file_path):
            raise HTTPException(status_code=500, detail="Image file missing")
        temp_file_path = file_path
        
    try:
        result = await identify_plant(temp_file_path)
    finally:
        if saved_filename and saved_filename.startswith("data:") and temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as e:
                print("Failed to remove temp file:", e)
    
    await database["scans"].update_one(
        {"_id": ObjectId(upload_id)},
        {
            "$set": {
                "scan_type": "plant_identify",
                "plant_result": result,
                "status": "identified",
                "analyzed_at": datetime.now(timezone.utc)
            }
        }
    )
    
    response = {
        "upload_id": upload_id,
        "scan_type": "plant_identify",
        **result
    }
    return response

@router.post("/land-analyze")
async def land_analyze(
    payload: ExtraScanRequest,
    current_user: dict = Depends(get_current_user)
):
    upload_id = payload.upload_id
    if not ObjectId.is_valid(upload_id):
        raise HTTPException(status_code=400, detail="Invalid upload_id")
        
    scan = await database["scans"].find_one({"_id": ObjectId(upload_id)})
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    user_id = current_user.get("user_id")
    if scan.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    saved_filename = scan.get("saved_filename")
    temp_file_path = None
    
    if saved_filename and saved_filename.startswith("data:"):
        try:
            header, encoded = saved_filename.split(",", 1)
            file_bytes = base64.b64decode(encoded)
            temp_fd, temp_file_path = tempfile.mkstemp(suffix=".jpg")
            with os.fdopen(temp_fd, 'wb') as tmp:
                tmp.write(file_bytes)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to decode Base64 image: {str(e)}")
    else:
        file_path = scan.get("file_path")
        if not file_path or not os.path.exists(file_path):
            raise HTTPException(status_code=500, detail="Image file missing")
        temp_file_path = file_path
        
    try:
        result = await analyze_land(temp_file_path)
    finally:
        if saved_filename and saved_filename.startswith("data:") and temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as e:
                print("Failed to remove temp file:", e)
    
    await database["scans"].update_one(
        {"_id": ObjectId(upload_id)},
        {
            "$set": {
                "scan_type": "land_analysis",
                "land_result": result,
                "status": "land_analyzed",
                "analyzed_at": datetime.now(timezone.utc)
            }
        }
    )
    
    response = {
        "upload_id": upload_id,
        "scan_type": "land_analysis",
        **result
    }
    return response

