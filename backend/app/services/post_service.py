import uuid
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.models.post import Post, PostMedia, PostTag, MediaType
from app.models.user import User
from app.models.tag import Tag, UserFollowedTag
from app.schemas.post import PostCreate, PostOut
from app.schemas.tag import TagOut
from app.services.tag_service import get_or_create_tag
from app.core import storage


def _media_type_from_mime(content_type: Optional[str]) -> MediaType:
    if content_type and content_type.startswith("video"):
        return MediaType.video
    return MediaType.image


def _enrich_post(db: Session, post: Post) -> PostOut:
    comment_count = len(post.comments)
    tag_outs = [
        TagOut(
            id=pt.tag.id,
            name=pt.tag.name,
            created_at=pt.tag.created_at,
        )
        for pt in post.tags
    ]
    from app.schemas.post import PostMediaOut, PostOut
    from app.schemas.user import UserPublic

    return PostOut(
        id=post.id,
        caption=post.caption,
        created_at=post.created_at,
        author=UserPublic.model_validate(post.author),
        media=[
            PostMediaOut(
                id=m.id,
                media_url=m.media_url,
                media_type=m.media_type,
                order_index=m.order_index,
            )
            for m in post.media
        ],
        tags=tag_outs,
        comment_count=comment_count,
    )


def create_post(
    db: Session,
    author: User,
    payload: PostCreate,
    media_files: List[Tuple[bytes, str, Optional[str]]],
) -> PostOut:
    post = Post(author_id=author.id, caption=payload.caption or "")
    db.add(post)
    db.flush()

    for idx, (file_bytes, filename, content_type) in enumerate(media_files):
        url = storage.upload_file(file_bytes, filename, content_type)
        media = PostMedia(
            post_id=post.id,
            media_url=url,
            media_type=_media_type_from_mime(content_type),
            order_index=idx,
        )
        db.add(media)

    for tag_name in payload.tag_names:
        tag = get_or_create_tag(db, tag_name)
        db.add(PostTag(post_id=post.id, tag_id=tag.id))

    db.commit()
    db.refresh(post)

    # Eagerly load relationships
    post = (
        db.query(Post)
        .options(
            joinedload(Post.author),
            joinedload(Post.media),
            joinedload(Post.tags).joinedload(PostTag.tag),
            joinedload(Post.comments),
        )
        .filter(Post.id == post.id)
        .first()
    )
    return _enrich_post(db, post)


def get_post(db: Session, post_id: uuid.UUID) -> Optional[PostOut]:
    post = (
        db.query(Post)
        .options(
            joinedload(Post.author),
            joinedload(Post.media),
            joinedload(Post.tags).joinedload(PostTag.tag),
            joinedload(Post.comments),
        )
        .filter(Post.id == post_id)
        .first()
    )
    if not post:
        return None
    return _enrich_post(db, post)


def delete_post(db: Session, post_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    post = db.query(Post).filter(Post.id == post_id, Post.author_id == user_id).first()
    if not post:
        return False
    db.delete(post)
    db.commit()
    return True


def get_user_posts(db: Session, username: str, skip: int, limit: int) -> List[PostOut]:
    posts = (
        db.query(Post)
        .join(User, Post.author_id == User.id)
        .options(
            joinedload(Post.author),
            joinedload(Post.media),
            joinedload(Post.tags).joinedload(PostTag.tag),
            joinedload(Post.comments),
        )
        .filter(User.username == username)
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [_enrich_post(db, p) for p in posts]
