from sqlalchemy.orm import Session
from sqlalchemy import select

from apps.backend.app.models.user import User
from apps.backend.app.schemas.users import CreateUser
from apps.backend.app.core.security import hash_password


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))


def create_user(db: Session, data: CreateUser) -> User:
    user = User(
        email=data.email,
        username=data.username,
        hashed_password=hash_password(data.password),
        is_active=True,
        is_superuser=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
