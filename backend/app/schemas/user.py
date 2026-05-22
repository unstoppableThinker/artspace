import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserPublic(BaseModel):
    id: uuid.UUID
    username: str
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserPrivate(UserPublic):
    """Full user data returned to the authenticated user."""
    email: str


class UpdateProfileRequest(BaseModel):
    username: Optional[str] = None
    bio: Optional[str] = None
