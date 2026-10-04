from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

bearer_scheme = HTTPBearer()

from app.db.database import get_db
from app.db.models import User
from app.schemas.auth import (
    AuthResponse,
    MessageResponse,
    SignupRequest,
    VerifyOTPRequest,
)
from app.services.otp import create_otp, verify_otp

from app.core.config import settings
from app.core.security import create_access_token, hash_token
from app.db.models import Session as DBSession

from app.api.v1.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=MessageResponse)
def signup(
    data: SignupRequest,
    db: Session = Depends(get_db),
):
    email = str(data.email).lower()

    existing_user = db.scalar(
        select(User).where(User.email == email)
    )

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists.",
        )

    create_otp(
        db=db,
        email=email,
        purpose="signup",
    )

    return {
        "message": "Verification code sent."
    }


@router.post("/signup/verify", response_model=AuthResponse)
def verify_signup(
    data: VerifyOTPRequest,
    db: Session = Depends(get_db),
):
    email = str(data.email).lower()

    otp = verify_otp(
        db=db,
        email=email,
        purpose="signup",
        code=data.code,
    )

    if otp is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired verification code.",
        )

    existing_user = db.scalar(
        select(User).where(User.email == email)
    )

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists.",
        )

    user = User(
        email=email,
        is_verified=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)

    session = DBSession(
        user_id=user.id,
        token_hash=hash_token(token),
        expires_at=datetime.now(timezone.utc)
        + timedelta(
            minutes=settings.access_token_expire_minutes
        ),
    )

    db.add(session)
    db.commit()

    return {
        "message": "Account created successfully.",
        "access_token": token,
        "token_type": "bearer",
    }

@router.post("/login", response_model=MessageResponse)
def login(
    data: SignupRequest,
    db: Session = Depends(get_db),
):
    email = str(data.email).lower()

    user = db.scalar(
        select(User).where(
            User.email == email,
            User.is_verified.is_(True),
        )
    )

    if user is None:
        return {
            "message": "If the account exists, a verification code has been sent."
        }

    create_otp(
        db=db,
        email=email,
        purpose="login",
        user_id=user.id,
    )

    return {
        "message": "Verification code sent."
    }

@router.post("/login/verify", response_model=AuthResponse)
def verify_login(
    data: VerifyOTPRequest,
    db: Session = Depends(get_db),
):
    email = str(data.email).lower()

    otp = verify_otp(
        db=db,
        email=email,
        purpose="login",
        code=data.code,
    )

    if otp is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired verification code.",
        )

    user = db.scalar(
        select(User).where(User.email == email)
    )

    if user is None or not user.is_verified:
        raise HTTPException(
            status_code=401,
            detail="Invalid account.",
        )

    token = create_access_token(user.id)

    session = DBSession(
        user_id=user.id,
        token_hash=hash_token(token),
        expires_at=datetime.now(timezone.utc)
        + timedelta(
            minutes=settings.access_token_expire_minutes
        ),
    )

    db.add(session)
    db.commit()

    return {
        "message": "Email verified successfully",
        "access_token": token,
        "token_type": "bearer",
    }

@router.post("/logout", response_model=MessageResponse)
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    session = db.scalar(
        select(DBSession).where(
            DBSession.token_hash == hash_token(token),
            DBSession.revoked.is_(False),
        )
    )

    if session:
        session.revoked = True
        db.commit()

    return {
        "message": "Logged out successfully."
    }

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "is_verified": current_user.is_verified,
    }