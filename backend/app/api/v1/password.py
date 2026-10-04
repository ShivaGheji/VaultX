from fastapi import APIRouter, HTTPException

from app.schemas.password import (
    PasswordGenerateRequest,
    PasswordGenerateResponse,
)
from app.services.password import generate_password


router = APIRouter(
    prefix="/password",
    tags=["Password Generator"],
)


@router.post(
    "/generate",
    response_model=PasswordGenerateResponse,
)
def generate_password_endpoint(
    data: PasswordGenerateRequest,
):
    try:
        password = generate_password(
            length=data.length,
            include_uppercase=data.include_uppercase,
            include_lowercase=data.include_lowercase,
            include_digits=data.include_digits,
            include_symbols=data.include_symbols,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    return {
        "password": password,
    }