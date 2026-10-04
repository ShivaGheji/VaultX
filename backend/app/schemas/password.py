from pydantic import BaseModel, Field


class PasswordGenerateRequest(BaseModel):
    length: int = Field(default=20, ge=8, le=128)
    include_uppercase: bool = True
    include_lowercase: bool = True
    include_digits: bool = True
    include_symbols: bool = True


class PasswordGenerateResponse(BaseModel):
    password: str