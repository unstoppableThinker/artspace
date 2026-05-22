import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.tag import TagOut, TagCreate
from app.services.tag_service import (
    list_tags,
    get_followed_tags,
    follow_tag,
    unfollow_tag,
    get_or_create_tag,
)
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("", response_model=List[TagOut])
def all_tags(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_tags(db, current_user.id)


@router.get("/followed", response_model=List[TagOut])
def followed(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_followed_tags(db, current_user.id)


@router.post("/{tag_id}/follow", status_code=status.HTTP_204_NO_CONTENT)
def follow(
    tag_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not follow_tag(db, current_user.id, tag_id):
        raise HTTPException(status_code=404, detail="Tag not found.")


@router.delete("/{tag_id}/follow", status_code=status.HTTP_204_NO_CONTENT)
def unfollow(
    tag_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    unfollow_tag(db, current_user.id, tag_id)
