import uuid
from datetime import datetime
from pydantic import BaseModel, field_validator
import re


class TagOut(BaseModel):
    id: uuid.UUID
    name: str
    created_at: datetime
    follower_count: int = 0
    is_followed: bool = False

    model_config = {"from_attributes": True}


class TagCreate(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def normalize(cls, v: str) -> str:
        v = v.strip().lower()
        if not re.match(r"^[a-z0-9\-]{2,100}$", v):
            raise ValueError("Tag must be 2-100 chars: lowercase letters, numbers, hyphens.")
        return v
