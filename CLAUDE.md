# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Artspace is a social media platform for artists. It has a FastAPI backend (Python 3.12), a React + TypeScript frontend (Vite), and PostgreSQL — all orchestrated with Docker Compose.

## Commands

### Full stack (recommended)
```bash
docker compose up --build       # Start all services (postgres, backend, frontend)
docker compose exec backend python seed.py  # Seed demo data
```

- Frontend: http://localhost:3000
- Backend API + Swagger docs: http://localhost:8000/api/docs

### Frontend only
```bash
cd frontend
npm run dev      # Dev server (port 3000, proxies /api to backend)
npm run build    # TypeScript check + Vite build
npm run preview  # Preview production build
```

### Backend only
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload   # Port 8000
```

### Database migrations
```bash
# After editing app/models/*.py:
docker compose exec backend alembic revision --autogenerate -m "description"
docker compose exec backend alembic upgrade head
docker compose exec backend alembic downgrade -1
```

## Architecture

### Backend (`backend/app/`)

Three-layer architecture: **routes → services → models**.

- `api/routes/` — FastAPI routers (auth, users, friends, posts, comments, tags, timeline). Thin — delegate to services.
- `services/` — Business logic. All non-trivial logic lives here.
- `models/` — SQLAlchemy ORM models (user, post, comment, friendship, tag).
- `schemas/` — Pydantic v2 request/response models.
- `core/config.py` — Pydantic-settings; all env vars parsed here.
- `core/security.py` — JWT creation and `get_current_user` dependency.
- `core/storage.py` — boto3 wrapper for S3-compatible media uploads.
- `db/session.py` — SQLAlchemy engine + `SessionLocal`.

### Frontend (`frontend/src/`)

- `App.tsx` — React Router v6 setup with `PrivateRoute` and `PublicOnlyRoute` guards.
- `context/AuthContext.tsx` — Global auth state; JWT stored and refreshed here.
- `api/client.ts` — Axios instance with JWT interceptor; auto-redirects to `/login` on 401.
- `api/*.ts` — One file per resource (auth, users, posts, comments, tags, timeline, friends).
- `pages/` — Route-level components: LandingPage, LoginPage, RegisterPage, HomePage, ProfilePage, FriendsPage, TagsPage.
- `components/` — Shared UI in `ui/`, post-specific in `post/`, layout in `layout/`.
- `types/index.ts` — All shared TypeScript interfaces.

### Key domain behaviors

**Timeline algorithm** (`services/timeline_service.py`): Two-tier feed. Tier 1 = posts with ≥1 tag the user follows (priority 1). Tier 2 = everything else (priority 0). Within tiers, newest first. Implemented with a SQL `CASE` expression.

**Comment gate** (`services/comment_service.py`): Users can only comment on a post if they follow at least one of its tags. Posts with no tags allow anyone to comment.

**Friendship model** (`models/friendship.py`): `FriendRequest` tracks lifecycle (pending → accepted/rejected). Accepted connections are denormalized into a `Friendship` table for O(1) lookup.

**Media uploads** (`core/storage.py`): S3-compatible via boto3. In dev without S3 configured, returns placeholder URLs.

### Environment

Copy `.env.example` to `.env` and fill in: `DATABASE_URL`, `JWT_SECRET_KEY`, S3 bucket credentials, `CORS_ORIGINS`, `VITE_API_URL`.

The backend validates CORS origins from env as either a JSON array or comma-separated string.
