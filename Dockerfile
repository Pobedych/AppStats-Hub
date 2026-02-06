############################
# BASE (python + uv)
############################
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS python-base

WORKDIR /project

# deps
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# code
COPY . .

############################
# BACKEND (8000)
############################
FROM python-base AS backend

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "apps.backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

############################
# AI SERVICE (8001)
############################
FROM python-base AS ai

EXPOSE 8001
CMD ["uv", "run", "uvicorn", "apps.ai_service.main:app", "--host", "0.0.0.0", "--port", "8001"]

############################
# FRONTEND (8888)
############################
FROM node:20-alpine AS frontend

WORKDIR /project

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 8888
CMD ["sh", "-c", "cd apps/frontend && npx vite --host 0.0.0.0 --port 8888"]


