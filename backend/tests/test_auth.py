from app.core import security

from sqlalchemy import select

from app.db.models import OTPCode


def test_signup(client):
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "email": "test@example.com",
        },
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Verification code sent."


def test_signup_verify(client, db):
    email = "verify@example.com"

    response = client.post(
        "/api/v1/auth/signup",
        json={"email": email},
    )

    assert response.status_code == 200

    otp = db.scalar(
        select(OTPCode)
        .where(OTPCode.email == email)
        .order_by(OTPCode.created_at.desc())
    )

    assert otp is not None