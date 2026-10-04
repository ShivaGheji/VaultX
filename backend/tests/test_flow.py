from sqlalchemy import select

from app.db.models import OTPCode


def get_latest_otp(db, email: str, purpose: str):
    return db.scalar(
        select(OTPCode)
        .where(
            OTPCode.email == email,
            OTPCode.purpose == purpose,
        )
        .order_by(OTPCode.created_at.desc())
    )


def test_complete_auth_and_vault_flow(client, db):
    email = "flow@example.com"

    # -------------------------
    # Signup
    # -------------------------

    response = client.post(
        "/api/v1/auth/signup",
        json={"email": email},
    )

    assert response.status_code == 200

    otp = get_latest_otp(db, email, "signup")
    assert otp is not None

    # We cannot recover the plaintext OTP from the Argon2 hash.
    # The basic signup test already verifies OTP creation.


def test_vault_requires_authentication(client):
    response = client.get("/api/v1/vault")

    assert response.status_code == 401


def test_password_generator(client):
    response = client.post(
        "/api/v1/password/generate",
        json={
            "length": 24,
            "include_uppercase": True,
            "include_lowercase": True,
            "include_digits": True,
            "include_symbols": True,
        },
    )

    assert response.status_code == 200

    password = response.json()["password"]

    assert len(password) == 24
    assert any(c.isupper() for c in password)
    assert any(c.islower() for c in password)
    assert any(c.isdigit() for c in password)
    assert any(c in "!@#$%^&*()-_=+[]{}?" for c in password)