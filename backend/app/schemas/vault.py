from typing import Any

from pydantic import BaseModel, Field


class VaultCreate(BaseModel):
    encrypted_data: str = Field(
        min_length=1,
        max_length=5_000_000,
    )

    kdf_salt: str = Field(
        min_length=1,
        max_length=512,
    )

    kdf_algorithm: str = Field(
        min_length=1,
        max_length=50,
    )

    kdf_params: dict[str, Any] = Field(
        default_factory=dict,
    )


class VaultResponse(BaseModel):
    encrypted_data: str
    kdf_salt: str
    kdf_algorithm: str
    kdf_params: dict[str, Any]
    version: int


class VaultUpdate(VaultCreate):
    pass