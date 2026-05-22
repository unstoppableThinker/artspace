import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.friendship import FriendRequestOut, FriendOut
from app.schemas.user import UserPublic
from app.services.friendship_service import (
    send_friend_request,
    accept_request,
    reject_request,
    remove_friend,
    get_friends,
    get_incoming_requests,
    get_outgoing_requests,
)
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/friends", tags=["friends"])


@router.get("/requests/incoming", response_model=List[FriendRequestOut])
def incoming(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_incoming_requests(db, current_user.id)


@router.get("/requests/outgoing", response_model=List[FriendRequestOut])
def outgoing(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_outgoing_requests(db, current_user.id)


@router.post("/requests/{user_id}", status_code=status.HTTP_201_CREATED, response_model=FriendRequestOut)
def send_request(
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    req = send_friend_request(db, current_user.id, user_id)
    if req is None:
        raise HTTPException(status_code=400, detail="Cannot send friend request.")
    return req


@router.put("/requests/{request_id}/accept", response_model=FriendRequestOut)
def accept(
    request_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    req = accept_request(db, request_id, current_user.id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found or not authorized.")
    return req


@router.put("/requests/{request_id}/reject", response_model=FriendRequestOut)
def reject(
    request_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    req = reject_request(db, request_id, current_user.id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found or not authorized.")
    return req


@router.get("", response_model=List[UserPublic])
def list_friends(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_friends(db, current_user.id)


@router.delete("/{friend_id}", status_code=status.HTTP_204_NO_CONTENT)
def unfriend(
    friend_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    remove_friend(db, current_user.id, friend_id)
