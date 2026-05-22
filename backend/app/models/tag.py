import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    followers: Mapped[list["UserFollowedTag"]] = relationship(
        "UserFollowedTag", back_populates="tag", cascade="all, delete-orphan"
    )
    post_tags: Mapped[list["PostTag"]] = relationship(  # noqa: F821
        "PostTag", back_populates="tag", cascade="all, delete-orphan"
    )


class UserFollowedTag(Base):
    __tablename__ = "user_followed_tags"
    __table_args__ = (
        UniqueConstraint("user_id", "tag_id", name="uq_user_followed_tag"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    tag_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tags.id", ondelete="CASCADE"), nullable=False, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship("User", back_populates="followed_tags")  # noqa: F821
    tag: Mapped["Tag"] = relationship("Tag", back_populates="followers")
