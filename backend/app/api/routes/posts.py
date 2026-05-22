import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.post import PostOut, PostCreate
from app.services.post_service import create_post, get_post, delete_post, get_user_posts
from app.api.deps import get_current_user
from app.models.user import User
import json

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("/user/{username}", response_model=List[PostOut])
def user_posts(
    username: str,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_posts(db, username, skip, limit)


@router.get("/{post_id}", response_model=PostOut)
def get_one(
    post_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    return post


@router.post("", response_model=PostOut, status_code=status.HTTP_201_CREATED)
async def create(
    caption: str = Form(""),
    tag_names: str = Form("[]"),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        tags = json.loads(tag_names)
    except Exception:
        tags = []

    media_files = []
    for f in files:
        content = await f.read()
        media_files.append((content, f.filename, f.content_type))

    payload = PostCreate(caption=caption, tag_names=tags)
    return create_post(db, current_user, payload, media_files)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove(
    post_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    success = delete_post(db, post_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found or not authorized.")
