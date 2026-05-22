from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.schemas.user import UpdateProfileRequest
from app.core.security import hash_password
from app.core import storage


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, payload: RegisterRequest) -> User:
    user = User(
        username=payload.username,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user_profile(db: Session, user: User, payload: UpdateProfileRequest) -> User:
    if payload.username is not None:
        user.username = payload.username
    if payload.bio is not None:
        user.bio = payload.bio
    db.commit()
    db.refresh(user)
    return user


def update_avatar(
    db: Session,
    user: User,
    file_bytes: bytes,
    filename: str,
    content_type: Optional[str],
) -> User:
    url = storage.upload_file(file_bytes, filename, content_type)
    user.profile_picture_url = url
    db.commit()
    db.refresh(user)
    return user
