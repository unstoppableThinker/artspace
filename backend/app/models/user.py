import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    profile_picture_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # ── relationships ────────────────────────────────────────────────────────
    posts: Mapped[list["Post"]] = relationship(  # noqa: F821
        "Post", back_populates="author", cascade="all, delete-orphan"
    )
    comments: Mapped[list["Comment"]] = relationship(  # noqa: F821
        "Comment", back_populates="author", cascade="all, delete-orphan"
    )
    sent_requests: Mapped[list["FriendRequest"]] = relationship(  # noqa: F821
        "FriendRequest", foreign_keys="FriendRequest.sender_id", back_populates="sender",
        cascade="all, delete-orphan",
    )
    received_requests: Mapped[list["FriendRequest"]] = relationship(  # noqa: F821
        "FriendRequest", foreign_keys="FriendRequest.receiver_id", back_populates="receiver",
        cascade="all, delete-orphan",
    )
    followed_tags: Mapped[list["UserFollowedTag"]] = relationship(  # noqa: F821
        "UserFollowedTag", back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User {self.username}>"
