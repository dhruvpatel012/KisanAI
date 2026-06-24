from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserInDB(BaseModel):
    id: Optional[str] = None
    email: str
    password_hash: str
    full_name: Optional[str] = None
    is_active: bool = True
    created_at: datetime = None

    class Config:
        from_attributes = True
