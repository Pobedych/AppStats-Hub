# Statistics

Multi-service playground with auth backend, AI stub, Telegram bot, and a React UI.

## Services

- backend: FastAPI + SQLAlchemy + JWT auth (`apps/backend`)
- ai-service: FastAPI stub for text generation (`apps/ai_service`)
- telegram-bot: aiogram bot that calls AI service (`apps/telegram_bot`)
- frontend: Vite + React UI (`apps/frontend`)

## Requirements

- Docker + Docker Compose (recommended)
- Python 3.12 + uv (for local Python services)
- Node.js 20+ (for local frontend)
- Postgres 16 (if running locally without Docker)

## Quick start (Docker)

1. Ensure `.env` exists in the repo root (see "Environment" below).
2. Run services:
   - `docker compose up --build`
3. Open:
   - frontend: `http://localhost:8888`
   - backend: `http://localhost:8000`
   - ai-service: `http://localhost:8001`

## Local run (no Docker)

1. Start Postgres (or use Docker only for DB):
   - `docker compose up -d db`
2. Update `.env` if needed:
   - `DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/appdb`
3. Backend:
   - `uv run uvicorn apps.backend.main:app --reload --port 8000`
4. AI service:
   - `uv run uvicorn apps.ai_service.main:app --reload --port 8001`
5. Frontend:
   - `cd apps/frontend`
   - `npm install`
   - `npm run dev -- --host 0.0.0.0 --port 8888`
6. Telegram bot (needs `BOT_TOKEN`):
   - `uv run python apps/telegram_bot/bot.py`

## Environment

Backend (`.env` in repo root):
- `DATABASE_URL` (default docker value: `postgresql+psycopg://postgres:postgres@db:5432/appdb`)
- `AI_URL` (default: `http://ai:8001`)
- `SECRET_KEY` (JWT signing secret)
- `ALGORITHM` (default: `HS256`)
- `ACCESS_TOKEN_EXPIRE_MINUTES` (default: `10080`)

Telegram bot:
- `BOT_TOKEN` (required)
- `AI_SERVICE_URL` (default: `http://localhost:8001`)

Frontend:
- API base is currently hardcoded to `http://localhost:8000` in `apps/frontend/src/api/client.ts`

## Auth API (backend)

- `POST /auth/register` (JSON): `{ "email": "...", "password": "...", "username": "..." }`
- `POST /auth/login` (x-www-form-urlencoded): `username`, `password`
- `GET /auth/me` (Bearer token)
