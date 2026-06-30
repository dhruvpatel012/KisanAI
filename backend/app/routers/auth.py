from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database import database
from app.schemas.auth import (
    RegisterRequest, LoginRequest,
    TokenResponse, UserResponse,
    ProfileUpdateRequest, PasswordChangeRequest
)
from app.utils.password import hash_password, verify_password
from app.utils.jwt import create_token, verify_token
from datetime import datetime, timezone

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

@router.post("/register", response_model=TokenResponse)
async def register(request: RegisterRequest):
    users = database["users"]

    existing = await users.find_one(
        {"email": request.email}
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed = hash_password(request.password)
    user_doc = {
        "email": request.email,
        "password_hash": hashed,
        "full_name": request.full_name,
        "is_active": True,
        "created_at": datetime.now(timezone.utc)
    }

    result = await users.insert_one(user_doc)
    token = create_token({
        "user_id": str(result.inserted_id),
        "email": request.email
    })
    return TokenResponse(access_token=token)

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    users = database["users"]

    user = await users.find_one(
        {"email": request.email}
    )
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        request.password,
        user["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_token({
        "user_id": str(user["_id"]),
        "email": user["email"]
    })
    return TokenResponse(access_token=token)

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    payload = verify_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    users = database["users"]
    user = await users.find_one(
        {"email": payload["email"]}
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        full_name=user.get("full_name"),
        is_active=user["is_active"],
        preferred_language=user.get("preferred_language", "en"),
        farm_location=user.get("farm_location", "")
    )

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    request: ProfileUpdateRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
        
    users = database["users"]
    user = await users.find_one({"email": payload["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    await users.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "full_name": request.full_name,
            "preferred_language": request.preferred_language,
            "farm_location": request.farm_location
        }}
    )
    
    updated_user = await users.find_one({"_id": user["_id"]})
    return UserResponse(
        id=str(updated_user["_id"]),
        email=updated_user["email"],
        full_name=updated_user.get("full_name"),
        is_active=updated_user["is_active"],
        preferred_language=updated_user.get("preferred_language", "en"),
        farm_location=updated_user.get("farm_location", "")
    )

@router.put("/change-password")
async def change_password(
    request: PasswordChangeRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
        
    users = database["users"]
    user = await users.find_one({"email": payload["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if not verify_password(request.old_password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect old password")
        
    new_hashed = hash_password(request.new_password)
    await users.update_one(
        {"_id": user["_id"]},
        {"$set": {"password_hash": new_hashed}}
    )
    return {"message": "Password changed successfully"}
