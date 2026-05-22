# Artspace

A minimalist social network for artists. Share work, follow tags, connect with peers.

---

## Overview

Artspace is a full-stack social media platform built for artists. The design philosophy is editorial minimalism — white space, black typography, and clean grid layouts inspired by contemporary art publications. Users share work through image/video posts, build connections via a mutual-request friendship system, and personalise their feed by following art practice tags.

---

## Architecture

```
artspace/
├── backend/                    # Python / FastAPI
│   ├── app/
│   │   ├── api/                # Route handlers
│   │   │   └── routes/         # auth, users, friends, posts, comments, tags, timeline
│   │   ├── core/               # Config, security (JWT), storage adapter
│   │   ├── db/                 # SQLAlchemy engine + session
│   │   ├── models/             # ORM models (User, Post, Tag, Comment, Friendship…)
│   │   ├── schemas/            # Pydantic request/response models
│   │   └── services/           # Business logic layer
│   ├── alembic/                # Database migrations
│   └── seed.py                 # Demo data
│
├── frontend/                   # React / TypeScript
│   └── src/
│       ├── api/                # Axios API wrappers per resource
│       ├── components/         # Reusable UI (layout, post, tag, user, ui primitives)
│       ├── context/            # Auth context + provider
│       ├── pages/              # Route-level page components
│       └── types/              # Shared TypeScript types
│
├── docker-compose.yml
└── .env.example
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend API | Python 3.12, FastAPI 0.109 |
| ORM | SQLAlchemy 2.0 |
| Migrations | Alembic |
| Database | PostgreSQL 16 |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Validation | Pydantic v2 |
| Object Storage | boto3 (S3-compatible, configurable) |
| Frontend | React 18, TypeScript 5 |
| Routing | React Router v6 |
| HTTP | Axios |
| State | React Context API |
| Container | Docker + Docker Compose |

---

## Quick Start (Docker)

### 1. Clone and configure environment

```bash
git clone <repo-url> artspace
cd artspace
cp .env.example .env
# Edit .env — at minimum set JWT_SECRET_KEY to a long random string
```

### 2. Start all services

```bash
docker compose up --build
```

This starts:
- **postgres** on port `5432`
- **backend** on port `8000` (runs Alembic migrations on startup)
- **frontend** on port `3000`

### 3. Seed demo data (optional)

```bash
docker compose exec backend python seed.py
```

### 4. Open the app

- Frontend: http://localhost:3000
- API docs: http://localhost:8000/api/docs

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

| Variable | Description | Required |
|---|---|---|
| `POSTGRES_DB` | PostgreSQL database name | yes |
| `POSTGRES_USER` | PostgreSQL username | yes |
| `POSTGRES_PASSWORD` | PostgreSQL password | yes |
| `DATABASE_URL` | Full connection string | yes |
| `JWT_SECRET_KEY` | Secret for signing JWTs (≥32 chars) | yes |
| `JWT_ALGORITHM` | JWT algorithm (default: HS256) | no |
| `JWT_EXPIRE_MINUTES` | Token lifetime in minutes (default: 10080 = 7 days) | no |
| `STORAGE_BUCKET_URL` | S3 endpoint URL | yes (for uploads) |
| `STORAGE_BUCKET_NAME` | Bucket name | yes |
| `STORAGE_ACCESS_KEY` | Bucket access key | yes |
| `STORAGE_SECRET_KEY` | Bucket secret key | yes |
| `STORAGE_REGION` | Bucket region | yes |
| `STORAGE_PUBLIC_URL` | Base URL for public media access | yes |
| `BACKEND_CORS_ORIGINS` | JSON array of allowed CORS origins | yes |
| `REACT_APP_API_URL` | Backend URL from frontend's perspective | yes |

---

## Database Migrations

Migrations run automatically on container start. To run them manually:

```bash
# Inside the backend container
docker compose exec backend alembic upgrade head

# Create a new migration after model changes
docker compose exec backend alembic revision --autogenerate -m "describe change"

# Roll back one step
docker compose exec backend alembic downgrade -1
```

---

## Media Uploads

Media (images and videos) are stored in an S3-compatible object storage bucket.

The storage layer is in `backend/app/core/storage.py`. It uses `boto3` with configuration injected entirely from environment variables:

```
STORAGE_BUCKET_URL  → endpoint_url (set to https://s3.amazonaws.com for AWS)
STORAGE_BUCKET_NAME → bucket name
STORAGE_ACCESS_KEY  → AWS / provider access key
STORAGE_SECRET_KEY  → AWS / provider secret key
STORAGE_REGION      → region
STORAGE_PUBLIC_URL  → base URL prepended to stored object keys
```

To swap providers (e.g. from AWS S3 to Cloudflare R2 or MinIO), change these env vars — no code changes required.

**Dev mode without a bucket:** If `STORAGE_ACCESS_KEY` is empty, uploads return a placeholder URL so the application still runs locally.

---

## API Overview

Base path: `/api`

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Create account |
| `POST` | `/auth/login` | Log in, receive JWT |
| `GET` | `/auth/me` | Current user profile |
| `GET` | `/users/{username}` | Public user profile |
| `PUT` | `/users/me/profile` | Edit username / bio |
| `POST` | `/users/me/avatar` | Upload profile picture |
| `GET` | `/friends` | List accepted friends |
| `GET` | `/friends/requests/incoming` | Pending incoming requests |
| `GET` | `/friends/requests/outgoing` | Pending outgoing requests |
| `POST` | `/friends/requests/{user_id}` | Send friend request |
| `PUT` | `/friends/requests/{id}/accept` | Accept request |
| `PUT` | `/friends/requests/{id}/reject` | Reject request |
| `DELETE` | `/friends/{friend_id}` | Remove friend |
| `GET` | `/posts/user/{username}` | Posts by user |
| `POST` | `/posts` | Create post (multipart) |
| `GET` | `/posts/{id}` | Get single post |
| `DELETE` | `/posts/{id}` | Delete own post |
| `GET` | `/posts/{id}/comments` | List comments on a post |
| `POST` | `/posts/{id}/comments` | Add comment (tag-follow check) |
| `DELETE` | `/posts/comments/{id}` | Delete own comment |
| `GET` | `/tags` | All tags with follow status |
| `GET` | `/tags/followed` | Tags the user follows |
| `POST` | `/tags/{id}/follow` | Follow a tag |
| `DELETE` | `/tags/{id}/follow` | Unfollow a tag |
| `GET` | `/timeline` | Personalised feed (paginated) |
| `GET` | `/api/health` | Health check |

Full interactive docs at `/api/docs` (Swagger UI).

---

## Key Features

### Timeline algorithm
Posts containing at least one tag the user follows are ranked first (tier 1), then all other posts (tier 2). Within each tier, newest first. Implemented with a SQL `CASE` expression for minimal overhead.

### Comment gate
A user may only comment on a post if they follow at least one of the post's tags. Posts with no tags can be commented on by anyone. Validated server-side in `comment_service.py`.

### Friendship model
Friendships are bidirectional but stored as two directed rows for O(1) lookup queries. A `FriendRequest` row with `status=pending/accepted/rejected` tracks the request lifecycle.

---

## Running Locally Without Docker

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Set env vars (or copy .env.example to .env and edit)
export DATABASE_URL="postgresql://artspace:artspace_secret@localhost:5432/artspace"
export JWT_SECRET_KEY="your-secret-key"

alembic upgrade head
python seed.py
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

---

## Future Improvements

- **Likes** — `post_likes` table already scaffolded in schema (`like_count` placeholder in `PostOut`); add the endpoint and toggle UI.
- **Search** — full-text search over post captions and usernames using PostgreSQL `tsvector`.
- **Notifications** — WebSocket or SSE channel for real-time friend request and comment alerts.
- **Infinite scroll** — replace the "Load more" button with an `IntersectionObserver` trigger.
- **Post editing** — allow caption and tag edits within a grace period after publishing.
- **Async background tasks** — move media upload/processing to Celery + Redis for non-blocking responses.
- **Image optimisation** — generate multiple sizes (thumbnail, preview, full) via Pillow on upload.
- **Rate limiting** — add `slowapi` middleware to protect auth and upload endpoints.
- **Test suite** — pytest for backend service-layer unit tests; React Testing Library for frontend.
- **CI/CD** — GitHub Actions workflow for lint, test, and Docker image build/push.
- **Kubernetes** — Helm chart for production deployment with horizontal pod autoscaling.
