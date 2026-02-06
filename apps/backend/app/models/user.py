from sqlalchemy import String, Column, Integer, DateTime, Boolean
from datetime import datetime, timezone
from apps.backend.app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    fullname = Column(String(255), nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)

    role = Column(String(255), nullable=False, default="USER")
    is_active = Column(Boolean, nullable=False, default=True)
    is_premium = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc))