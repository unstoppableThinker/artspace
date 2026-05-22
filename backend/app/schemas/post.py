import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from app.schemas.user import UserPublic
from app.schemas.tag import TagOut
from app.models.post import MediaType


class PostMediaOut(BaseModel):
    id: uuid.UUID
    media_url: str
    media_type: MediaType
    order_index: int

    model_config = {"from_attributes": True}


class PostOut(BaseModel):
    id: uuid.UUID
    caption: Optional[str] = None
    created_at: datetime
    author: UserPublic
    media: List[PostMediaOut] = []
    tags: List[TagOut] = []
    comment_count: int = 0

    model_config = {"from_attributes": True}


class PostCreate(BaseModel):
    caption: Optional[str] = None
    tag_names: List[str] = []
