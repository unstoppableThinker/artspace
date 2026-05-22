import uuid
from datetime import datetime
from pydantic import BaseModel
from app.schemas.user import UserPublic


class CommentOut(BaseModel):
    id: uuid.UUID
    content: str
    created_at: datetime
    author: UserPublic

    model_config = {"from_attributes": True}


class CommentCreate(BaseModel):
    content: str
