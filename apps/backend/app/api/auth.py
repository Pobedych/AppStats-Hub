from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from apps.backend.app.db.session import get_db
from apps.backend.app.core.config import settings
from apps.backend.app.core.security import verify_password, create_access_token
from apps.backend.app.schemas.users import CreateUser, ReadUser
from apps.backend.app.schemas.auth import Token
from apps.backend.app.crud.users import get_user_by_email, create_user

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


@router.post("/register", response_model=ReadUser, status_code=status.HTTP_201_CREATED)
def register(payload: CreateUser, db: Session = Depends(get_db)):
    if get_user_by_email(db, payload.email):
        raise HTTPException(status_code=409, detail="User with this email already exists")
    return create_user(db, payload)


@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_email(db, form.username)
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(
        subject=str(user.id),
        secret_key=settings.secret_key,
        algorithm=settings.algorithm,
        minutes=settings.access_token_expire_minutes,
    )
    return Token(access_token=token)


def get_current_user(db: Session, token: str) -> "User":
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id: str | None = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        user_id_int = int(user_id)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token")

    from sqlalchemy import select
    from apps.backend.app.models.user import User
    user = db.scalar(select(User).where(User.id == user_id_int))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.get("/me", response_model=ReadUser)
def me(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user = get_current_user(db, token)
    return user
