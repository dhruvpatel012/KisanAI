from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt import verify_token
from app.config import settings
from app.database import database
import os
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

    # Convert file content to Base64
    import base64
    try:
        file_bytes = await file.read()
        base64_str = base64.b64encode(file_bytes).decode("utf-8")
        image_url = f"data:{file.content_type};base64,{base64_str}"
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process file upload: {str(e)}"
        )

    # MongoDB record
    scans = database["scans"]
    scan_doc = {
        "user_id": current_user["user_id"],
        "original_filename": filename,
        "saved_filename": image_url,  # Store the Base64 URL here
        "file_path": "",              # No path on disk
        "file_size": file_size,
        "status": "uploaded",
        "created_at": datetime.now(timezone.utc)
    }
    
    result = await scans.insert_one(scan_doc)

    return {
        "upload_id": str(result.inserted_id),
        "image_url": image_url,
        "status": "uploaded",
        "message": "success"
    }
