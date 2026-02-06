# Statistics - minimal setup

Minimal monorepo with 4 parts:
- backend: FastAPI (`apps/backend/main.py`)
- ai-service: FastAPI stub (`apps/ai_service/main.py`)
- telegram-bot: aiogram bot (`apps/telegram_bot/bot.py`)
- frontend: static page (`apps/frontend/index.html`)

## Quick start

1. Copy env file:
   - `cp .env.example .env`
   - put Telegram token into `BOT_TOKEN`

2. Run services:
   - `docker compose up --build`

3. Check health:
   - backend: `http://localhost:8000/health`
   - ai-service: `http://localhost:8001/health`

## Local run without Docker

- backend: `uv run uvicorn apps.backend.main:app --reload --port 8000`
- ai-service: `uv run uvicorn apps.ai_service.main:app --reload --port 8001`
- bot: `uv run python apps/telegram_bot/bot.py`

