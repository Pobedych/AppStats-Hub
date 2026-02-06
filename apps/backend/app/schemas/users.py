from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timezone

class CreateUser(BaseModel):
    email: EmailStr
    username: str | None = Field(default=None, max_length=50)
    password: str = Field(min_length=8, max_length=72)

class ReadUser(BaseModel):
    id: int
    email: EmailStr
    username: str | None
    is_active: bool
    is_premium: bool
    created_at: datetime

    class Config:
        from_attributes = True