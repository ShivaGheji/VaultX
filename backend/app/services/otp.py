from datetime import datetime, timedelta, timezone
from fastapi import HTTPException

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import generate_otp, hash_value, verify_value
from app.db.models import OTPCode

OTP_EXPIRY_MINUTES = 5
MAX_OTP_ATTEMPTS = 5
OTP_RESEND_COOLDOWN_SECONDS = 60


def create_otp(
    db: Session,
    email: str,
    purpose: str,
    user_id: int | None = None,
) -> str:

    latest_otp = db.scalar(
        select(OTPCode)
        .where(
            OTPCode.email == email,
            OTPCode.purpose == purpose,
        )
        .order_by(OTPCode.created_at.desc())
    )

    if latest_otp:
        now = datetime.now(timezone.utc)
        created_at = latest_otp.created_at

        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)

        elapsed = (now - created_at).total_seconds()

        if elapsed < OTP_RESEND_COOLDOWN_SECONDS:
            raise HTTPException(
                status_code=429,
                detail="Please wait before requesting another code.",
            )

    # Invalidate previous unused OTPs
    existing_codes = db.scalars(
        select(OTPCode).where(
            OTPCode.email == email,
            OTPCode.purpose == purpose,
            OTPCode.used.is_(False),
        )
    ).all()

    for otp in existing_codes:
        otp.used = True

    code = generate_otp()

    otp_record = OTPCode(
        user_id=user_id,
        email=email,
        code_hash=hash_value(code),
        purpose=purpose,
        expires_at=datetime.now(timezone.utc)
        + timedelta(minutes=OTP_EXPIRY_MINUTES),
    )

    db.add(otp_record)
    db.commit()

    # Development only.
    print(f"[DEV OTP] {purpose.upper()} | {email} | {code}")

    return code


def verify_otp(
    db: Session,
    email: str,
    purpose: str,
    code: str,
) -> OTPCode | None:
    otp = db.scalar(
        select(OTPCode)
        .where(
            OTPCode.email == email,
            OTPCode.purpose == purpose,
            OTPCode.used.is_(False),
        )
        .order_by(OTPCode.created_at.desc())
    )

    if otp is None:
        return None

    now = datetime.now(timezone.utc)

    if otp.expires_at.replace(tzinfo=timezone.utc) < now:
        otp.used = True
        db.commit()
        return None

    if otp.attempts >= MAX_OTP_ATTEMPTS:
        otp.used = True
        db.commit()
        return None

    otp.attempts += 1

    if not verify_value(code, otp.code_hash):
        db.commit()
        return None

    otp.used = True
    db.commit()

    return otp