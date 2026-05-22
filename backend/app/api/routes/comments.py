import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.comment import CommentOut, CommentCreate
from app.services.comment_service import add_comment, get_post_comments, delete_comment
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/posts", tags=["comments"])


@router.get("/{post_id}/comments", response_model=List[CommentOut])
def list_comments(
    post_id: uuid.UUID,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_post_comments(db, post_id, skip, limit)


@router.post("/{post_id}/comments", response_model=CommentOut, status_code=status.HTTP_201_CREATED)
def create_comment(
    post_id: uuid.UUID,
    payload: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = add_comment(db, post_id, current_user, payload)
    if comment is None:
        raise HTTPException(
            status_code=403,
            detail="You must follow at least one tag used in this post to comment.",
        )
    return comment


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_comment(
    comment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not delete_comment(db, comment_id, current_user.id):
        raise HTTPException(status_code=404, detail="Comment not found or not authorized.")
