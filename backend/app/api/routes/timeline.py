from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.post import PostOut
from app.services.timeline_service import get_timeline
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/timeline", tags=["timeline"])


@router.get("", response_model=List[PostOut])
def timeline(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns the user's personalized timeline:
      - Posts tagged with tags the user follows come first
      - Then all other posts
      - Sorted newest first within each tier
      - Paginated
    """
    skip = (page - 1) * limit
    return get_timeline(db, current_user.id, skip=skip, limit=limit)
