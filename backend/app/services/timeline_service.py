import uuid
from typing import List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import case, func
from app.models.post import Post, PostTag
from app.models.tag import UserFollowedTag
from app.services.post_service import _enrich_post
from app.schemas.post import PostOut


def get_timeline(
    db: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 20
) -> List[PostOut]:
    """
    Tiered timeline:
    - Tier 1 (priority=1): Posts that include at least one tag the user follows
    - Tier 2 (priority=0): All other posts
    Within each tier, sorted by created_at DESC.
    """
    # Subquery: post IDs that have a followed tag
    followed_tag_ids = (
        db.query(UserFollowedTag.tag_id)
        .filter(UserFollowedTag.user_id == user_id)
        .subquery()
    )

    prioritized_post_ids = (
        db.query(PostTag.post_id)
        .filter(PostTag.tag_id.in_(followed_tag_ids))
        .distinct()
        .subquery()
    )

    priority_case = case(
        (Post.id.in_(prioritized_post_ids), 1),
        else_=0,
    )

    posts = (
        db.query(Post)
        .options(
            joinedload(Post.author),
            joinedload(Post.media),
            joinedload(Post.tags).joinedload(PostTag.tag),
            joinedload(Post.comments),
        )
        .order_by(priority_case.desc(), Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [_enrich_post(db, p) for p in posts]
