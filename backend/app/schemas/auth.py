from pydantic import BaseModel, Field

from app.schemas.user_schema import UserCreate, UserLogin, UserResponse

__all__ = ["TokenResponse", "UserCreate", "UserLogin", "UserResponse"]


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = Field(default="bearer")
    user: UserResponse
