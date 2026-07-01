from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    is_active: bool
    preferred_language: Optional[str] = "en"
    farm_location: Optional[str] = ""
    avatar_url: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    full_name: str
    preferred_language: str
    farm_location: str
    avatar_url: Optional[str] = None

class PasswordChangeRequest(BaseModel):
    old_password: str
    new_password: str
