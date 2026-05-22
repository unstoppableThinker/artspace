import uuid
from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from app.models.friendship import FriendRequest, Friendship, RequestStatus
from app.models.user import User
from app.schemas.friendship import FriendRequestOut
from app.schemas.user import UserPublic


def _enrich_request(req: FriendRequest) -> FriendRequestOut:
    return FriendRequestOut(
        id=req.id,
        sender=UserPublic.model_validate(req.sender),
        receiver=UserPublic.model_validate(req.receiver),
        status=req.status,
        created_at=req.created_at,
    )


def send_friend_request(
    db: Session, sender_id: uuid.UUID, receiver_id: uuid.UUID
) -> Optional[FriendRequestOut]:
    if sender_id == receiver_id:
        return None

    # Prevent duplicate/reverse requests
    existing = (
        db.query(FriendRequest)
        .filter(
            (
                (FriendRequest.sender_id == sender_id)
                & (FriendRequest.receiver_id == receiver_id)
            )
            | (
                (FriendRequest.sender_id == receiver_id)
                & (FriendRequest.receiver_id == sender_id)
            )
        )
        .first()
    )
    if existing:
        return None

    req = FriendRequest(sender_id=sender_id, receiver_id=receiver_id)
    db.add(req)
    db.flush()
    db.refresh(req)

    # Eagerly load sender/receiver
    req = (
        db.query(FriendRequest)
        .options(joinedload(FriendRequest.sender), joinedload(FriendRequest.receiver))
        .filter(FriendRequest.id == req.id)
        .first()
    )
    db.commit()
    return _enrich_request(req)


def accept_request(
    db: Session, request_id: uuid.UUID, receiver_id: uuid.UUID
) -> Optional[FriendRequestOut]:
    req = (
        db.query(FriendRequest)
        .options(joinedload(FriendRequest.sender), joinedload(FriendRequest.receiver))
        .filter(
            FriendRequest.id == request_id,
            FriendRequest.receiver_id == receiver_id,
            FriendRequest.status == RequestStatus.pending,
        )
        .first()
    )
    if not req:
        return None

    req.status = RequestStatus.accepted

    # Create bidirectional friendship rows
    db.add(Friendship(user_id=req.sender_id, friend_id=req.receiver_id))
    db.add(Friendship(user_id=req.receiver_id, friend_id=req.sender_id))
    db.commit()
    db.refresh(req)
    return _enrich_request(req)


def reject_request(
    db: Session, request_id: uuid.UUID, receiver_id: uuid.UUID
) -> Optional[FriendRequestOut]:
    req = (
        db.query(FriendRequest)
        .options(joinedload(FriendRequest.sender), joinedload(FriendRequest.receiver))
        .filter(
            FriendRequest.id == request_id,
            FriendRequest.receiver_id == receiver_id,
            FriendRequest.status == RequestStatus.pending,
        )
        .first()
    )
    if not req:
        return None
    req.status = RequestStatus.rejected
    db.commit()
    db.refresh(req)
    return _enrich_request(req)


def remove_friend(db: Session, user_id: uuid.UUID, friend_id: uuid.UUID) -> None:
    db.query(Friendship).filter(
        (
            (Friendship.user_id == user_id) & (Friendship.friend_id == friend_id)
        )
        | (
            (Friendship.user_id == friend_id) & (Friendship.friend_id == user_id)
        )
    ).delete()
    db.commit()


def get_friends(db: Session, user_id: uuid.UUID) -> List[UserPublic]:
    rows = db.query(Friendship).filter(Friendship.user_id == user_id).all()
    friend_ids = [r.friend_id for r in rows]
    if not friend_ids:
        return []
    users = db.query(User).filter(User.id.in_(friend_ids)).all()
    return [UserPublic.model_validate(u) for u in users]


def get_incoming_requests(db: Session, user_id: uuid.UUID) -> List[FriendRequestOut]:
    reqs = (
        db.query(FriendRequest)
        .options(joinedload(FriendRequest.sender), joinedload(FriendRequest.receiver))
        .filter(
            FriendRequest.receiver_id == user_id,
            FriendRequest.status == RequestStatus.pending,
        )
        .all()
    )
    return [_enrich_request(r) for r in reqs]


def get_outgoing_requests(db: Session, user_id: uuid.UUID) -> List[FriendRequestOut]:
    reqs = (
        db.query(FriendRequest)
        .options(joinedload(FriendRequest.sender), joinedload(FriendRequest.receiver))
        .filter(
            FriendRequest.sender_id == user_id,
            FriendRequest.status == RequestStatus.pending,
        )
        .all()
    )
    return [_enrich_request(r) for r in reqs]
