from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=6, max_length=6)


class MessageResponse(BaseModel):
    message: str

class AuthResponse(BaseModel):
    message: str
    access_token: str
    token_type: str