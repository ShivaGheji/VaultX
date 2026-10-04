from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import User, Vault
from app.schemas.vault import VaultCreate, VaultUpdate


def create_vault(
    db: Session,
    user: User,
    data: VaultCreate,
) -> Vault:
    existing_vault = db.scalar(
        select(Vault).where(Vault.user_id == user.id)
    )

    if existing_vault:
        raise ValueError("Vault already exists.")

    vault = Vault(
        user_id=user.id,
        encrypted_data=data.encrypted_data,
        kdf_salt=data.kdf_salt,
        kdf_algorithm=data.kdf_algorithm,
        kdf_params=data.kdf_params,
    )

    db.add(vault)
    db.commit()
    db.refresh(vault)

    return vault


def get_vault(
    db: Session,
    user: User,
) -> Vault | None:
    return db.scalar(
        select(Vault).where(Vault.user_id == user.id)
    )


def update_vault(
    db: Session,
    user: User,
    data: VaultUpdate,
) -> Vault:
    vault = get_vault(db, user)

    if vault is None:
        raise ValueError("Vault not found.")

    vault.encrypted_data = data.encrypted_data
    vault.kdf_salt = data.kdf_salt
    vault.kdf_algorithm = data.kdf_algorithm
    vault.kdf_params = data.kdf_params
    vault.version += 1

    db.commit()
    db.refresh(vault)

    return vault