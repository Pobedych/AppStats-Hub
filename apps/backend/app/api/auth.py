from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from apps.backend.app.db.session import get_db
from apps.backend.app.schemas.users import CreateUser, ReadUser
from apps.backend.app.crud.users import get_user_by_email, create_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/", response_model=ReadUser, status_code=status.HTTP_201_CREATED)
def register(payload: CreateUser, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User with this email already exists")
    user = create_user(db, payload)
    return user