"""
Seed script — populates the database with demo data.

Usage:
    cd backend
    python seed.py
"""

import os
import sys

# Ensure the app module is importable
sys.path.insert(0, os.path.dirname(__file__))

from app.db.session import SessionLocal
from app.services.user_service import create_user, get_user_by_email
from app.services.tag_service import get_or_create_tag, follow_tag
from app.services.friendship_service import send_friend_request, accept_request
from app.services.post_service import create_post
from app.schemas.auth import RegisterRequest
from app.schemas.post import PostCreate


def seed():
    db = SessionLocal()
    try:
        print("Seeding database…")

        # ── Tags ─────────────────────────────────────────────────────────────
        tag_names = [
            "painting", "sculpture", "photography", "digital-art",
            "illustration", "printmaking", "ceramics", "street-art",
            "abstract", "portrait", "landscape", "contemporary",
        ]
        tags = {name: get_or_create_tag(db, name) for name in tag_names}
        db.commit()
        print(f"  {len(tags)} tags created.")

        # ── Users ─────────────────────────────────────────────────────────────
        users_data = [
            {"username": "elena_vasquez", "email": "elena@artspace.dev", "password": "demo1234"},
            {"username": "marcus_lee",    "email": "marcus@artspace.dev", "password": "demo1234"},
            {"username": "aria_chen",     "email": "aria@artspace.dev",   "password": "demo1234"},
            {"username": "theo_okafor",   "email": "theo@artspace.dev",   "password": "demo1234"},
        ]

        created_users = []
        for u in users_data:
            existing = get_user_by_email(db, u["email"])
            if existing:
                created_users.append(existing)
                print(f"  User {u['username']} already exists, skipping.")
                continue
            user = create_user(
                db, RegisterRequest(username=u["username"], email=u["email"], password=u["password"])
            )
            user.bio = f"Artist and creator. Based in New York."
            db.commit()
            db.refresh(user)
            created_users.append(user)
            print(f"  Created user: {user.username}")

        elena, marcus, aria, theo = created_users

        # ── Tag follows ───────────────────────────────────────────────────────
        follow_tag(db, elena.id, tags["painting"].id)
        follow_tag(db, elena.id, tags["abstract"].id)
        follow_tag(db, elena.id, tags["contemporary"].id)

        follow_tag(db, marcus.id, tags["photography"].id)
        follow_tag(db, marcus.id, tags["portrait"].id)
        follow_tag(db, marcus.id, tags["landscape"].id)

        follow_tag(db, aria.id, tags["digital-art"].id)
        follow_tag(db, aria.id, tags["illustration"].id)

        follow_tag(db, theo.id, tags["sculpture"].id)
        follow_tag(db, theo.id, tags["ceramics"].id)
        follow_tag(db, theo.id, tags["street-art"].id)
        print("  Tag follows created.")

        # ── Friend relationships ───────────────────────────────────────────────
        req1 = send_friend_request(db, elena.id, marcus.id)
        if req1:
            accept_request(db, req1.id, marcus.id)

        req2 = send_friend_request(db, aria.id, elena.id)
        if req2:
            accept_request(db, req2.id, elena.id)

        # Pending request
        send_friend_request(db, theo.id, marcus.id)
        print("  Friend relationships created.")

        # ── Posts ─────────────────────────────────────────────────────────────
        posts_data = [
            {
                "author": elena,
                "caption": "Exploring the relationship between colour and emotion in this new series. Oil on canvas, 120×90cm.",
                "tag_names": ["painting", "abstract", "contemporary"],
            },
            {
                "author": elena,
                "caption": "Studio work in progress — the underpainting stage always feels the most honest.",
                "tag_names": ["painting"],
            },
            {
                "author": marcus,
                "caption": "Golden hour portraits from last Saturday's shoot. Available light only.",
                "tag_names": ["photography", "portrait"],
            },
            {
                "author": marcus,
                "caption": "The coast at dawn. Minimal gear, maximum patience.",
                "tag_names": ["photography", "landscape"],
            },
            {
                "author": aria,
                "caption": "New character design for an upcoming illustrated novel. Ink + Procreate.",
                "tag_names": ["digital-art", "illustration"],
            },
            {
                "author": theo,
                "caption": "Hand-built stoneware series. Each piece fired at cone 10.",
                "tag_names": ["ceramics", "sculpture"],
            },
        ]

        for p in posts_data:
            # Use placeholder URLs since no real bucket is configured in seed
            placeholder_media = [
                (b"placeholder", "placeholder.jpg", "image/jpeg"),
            ]
            post_payload = PostCreate(caption=p["caption"], tag_names=p["tag_names"])
            create_post(db, p["author"], post_payload, placeholder_media)

        print(f"  {len(posts_data)} posts created.")
        print("\nSeed complete.")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
