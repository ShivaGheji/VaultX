from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.v1.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import User
from app.schemas.vault import VaultCreate, VaultResponse, VaultUpdate
from app.services.vault import (
    create_vault,
    get_vault,
    update_vault,
)

router = APIRouter(prefix="/vault", tags=["Vault"])


@router.post("", response_model=VaultResponse)
def create_user_vault(
    data: VaultCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return create_vault(db, current_user, data)
    except ValueError as exc:
        raise HTTPException(
            status_code=409,
            detail=str(exc),
        )


@router.get("", response_model=VaultResponse)
def get_user_vault(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    vault = get_vault(db, current_user)

    if vault is None:
        raise HTTPException(
            status_code=404,
            detail="Vault not found.",
        )

    return vault


@router.put("", response_model=VaultResponse)
def update_user_vault(
    data: VaultUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return update_vault(db, current_user, data)
    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )