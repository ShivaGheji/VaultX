from datetime import datetime, timezone
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import decode_access_token, hash_token
from app.db.database import get_db
from app.db.models import Session as DBSession, User


bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials

    try:
        user_id = decode_access_token(token)
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token.",
    )

    token_hash = hash_token(token)

    session = db.scalar(
        select(DBSession).where(
            DBSession.token_hash == token_hash,
            DBSession.user_id == user_id,
            DBSession.revoked.is_(False),
        )
    )

    if session is None:
        raise HTTPException(
            status_code=401,
            detail="Session is invalid or revoked.",
        )

    if session.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        session.revoked = True
        db.commit()

        raise HTTPException(
            status_code=401,
            detail="Session has expired.",
    )

    user = db.get(User, user_id)

    if user is None or not user.is_verified:
        raise HTTPException(
            status_code=401,
            detail="User not found.",
        )

    return user