from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt import verify_token
from app.config import settings
from app.database import database
import os
import uuid
from datetime import datetime, timezone

router = APIRouter(tags=["Upload"])
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

@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    filename = file.filename
    if not filename:
        raise HTTPException(
            status_code=400,
            detail="Invalid filename"
        )
        
    ext = os.path.splitext(filename)[1].lower().lstrip(".")
    if ext not in settings.allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File extension .{ext} is not allowed. Allowed types: {', '.join(settings.allowed_extensions)}"
        )

    # Read file size to check limit
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > settings.max_file_size:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds the limit of {settings.max_file_size / (1024 * 1024):.1f}MB."
        )

    # Save file with unique name
    unique_id = str(uuid.uuid4())
    saved_filename = f"{unique_id}.{ext}"
    os.makedirs(settings.upload_dir, exist_ok=True)
    file_path = os.path.join(settings.upload_dir, saved_filename)

    try:
        with open(file_path, "wb") as f:
            while content := await file.read(1024 * 1024):
                f.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save file: {str(e)}"
        )

    # MongoDB record
    scans = database["scans"]
    scan_doc = {
        "user_id": current_user["user_id"],
        "original_filename": filename,
        "saved_filename": saved_filename,
        "file_path": file_path,
        "file_size": file_size,
        "status": "uploaded",
        "created_at": datetime.now(timezone.utc)
    }
    
    result = await scans.insert_one(scan_doc)
    image_url = f"/uploads/{saved_filename}"

    return {
        "upload_id": str(result.inserted_id),
        "image_url": image_url,
        "status": "uploaded",
        "message": "success"
    }
