import uuid
from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from app.models.comment import Comment
from app.models.post import Post, PostTag
from app.models.tag import UserFollowedTag
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentOut
from app.schemas.user import UserPublic


def _user_follows_any_post_tag(db: Session, user_id: uuid.UUID, post_id: uuid.UUID) -> bool:
    """Check if the user follows at least one tag associated with the post."""
    post_tag_ids = [
        row.tag_id
        for row in db.query(PostTag).filter(PostTag.post_id == post_id).all()
    ]
    if not post_tag_ids:
        # Posts with no tags: allow anyone to comment
        return True
    followed = (
        db.query(UserFollowedTag)
        .filter(
            UserFollowedTag.user_id == user_id,
            UserFollowedTag.tag_id.in_(post_tag_ids),
        )
        .first()
    )
    return followed is not None


def add_comment(
    db: Session,
    post_id: uuid.UUID,
    author: User,
    payload: CommentCreate,
) -> Optional[CommentOut]:
    # Validate tag-follow rule
    if not _user_follows_any_post_tag(db, author.id, post_id):
        return None

    comment = Comment(post_id=post_id, author_id=author.id, content=payload.content)
    db.add(comment)
    db.commit()
    db.refresh(comment)

    return CommentOut(
        id=comment.id,
        content=comment.content,
        created_at=comment.created_at,
        author=UserPublic.model_validate(author),
    )


def get_post_comments(
    db: Session, post_id: uuid.UUID, skip: int, limit: int
) -> List[CommentOut]:
    comments = (
        db.query(Comment)
        .options(joinedload(Comment.author))
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        CommentOut(
            id=c.id,
            content=c.content,
            created_at=c.created_at,
            author=UserPublic.model_validate(c.author),
        )
        for c in comments
    ]


def delete_comment(db: Session, comment_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    comment = (
        db.query(Comment)
        .filter(Comment.id == comment_id, Comment.author_id == user_id)
        .first()
    )
    if not comment:
        return False
    db.delete(comment)
    db.commit()
    return True
