from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import UserPublic, UserPrivate, UpdateProfileRequest
from app.services.user_service import get_user_by_username, update_user_profile, update_avatar
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/{username}", response_model=UserPublic)
def get_profile(username: str, db: Session = Depends(get_db)):
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


@router.put("/me/profile", response_model=UserPrivate)
def edit_profile(
    payload: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_user_profile(db, current_user, payload)


@router.post("/me/avatar", response_model=UserPrivate)
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    content = await file.read()
    return update_avatar(db, current_user, content, file.filename, file.content_type)
