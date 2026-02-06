from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from apps.backend.app.api.auth import router as auth_router

app = FastAPI(title="Backend")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "backend"}


app.include_router(auth_router)