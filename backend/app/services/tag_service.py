import uuid
from typing import Optional, List
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models.tag import Tag, UserFollowedTag
from app.schemas.tag import TagOut


def get_or_create_tag(db: Session, name: str) -> Tag:
    name = name.strip().lower()
    tag = db.query(Tag).filter(Tag.name == name).first()
    if not tag:
        tag = Tag(name=name)
        db.add(tag)
        db.flush()
    return tag


def list_tags(db: Session, user_id: uuid.UUID) -> List[TagOut]:
    followed_ids = {
        r.tag_id
        for r in db.query(UserFollowedTag).filter(UserFollowedTag.user_id == user_id).all()
    }
    tags = db.query(Tag).order_by(Tag.name).all()
    result = []
    for tag in tags:
        follower_count = db.query(UserFollowedTag).filter(UserFollowedTag.tag_id == tag.id).count()
        result.append(
            TagOut(
                id=tag.id,
                name=tag.name,
                created_at=tag.created_at,
                follower_count=follower_count,
                is_followed=tag.id in followed_ids,
            )
        )
    return result


def get_followed_tags(db: Session, user_id: uuid.UUID) -> List[TagOut]:
    rows = (
        db.query(UserFollowedTag)
        .filter(UserFollowedTag.user_id == user_id)
        .all()
    )
    result = []
    for row in rows:
        follower_count = (
            db.query(UserFollowedTag).filter(UserFollowedTag.tag_id == row.tag_id).count()
        )
        result.append(
            TagOut(
                id=row.tag.id,
                name=row.tag.name,
                created_at=row.tag.created_at,
                follower_count=follower_count,
                is_followed=True,
            )
        )
    return result


def follow_tag(db: Session, user_id: uuid.UUID, tag_id: uuid.UUID) -> bool:
    tag = db.get(Tag, tag_id)
    if not tag:
        return False
    existing = (
        db.query(UserFollowedTag)
        .filter(UserFollowedTag.user_id == user_id, UserFollowedTag.tag_id == tag_id)
        .first()
    )
    if not existing:
        db.add(UserFollowedTag(user_id=user_id, tag_id=tag_id))
        db.commit()
    return True


def unfollow_tag(db: Session, user_id: uuid.UUID, tag_id: uuid.UUID) -> None:
    db.query(UserFollowedTag).filter(
        UserFollowedTag.user_id == user_id, UserFollowedTag.tag_id == tag_id
    ).delete()
    db.commit()
