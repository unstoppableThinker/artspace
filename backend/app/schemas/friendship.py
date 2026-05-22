import uuid
from datetime import datetime
from pydantic import BaseModel
from app.schemas.user import UserPublic
from app.models.friendship import RequestStatus


class FriendRequestOut(BaseModel):
    id: uuid.UUID
    sender: UserPublic
    receiver: UserPublic
    status: RequestStatus
    created_at: datetime

    model_config = {"from_attributes": True}


class FriendOut(BaseModel):
    user: UserPublic
    since: datetime

    model_config = {"from_attributes": True}
