import re
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    """Payload for registering a new user."""

    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(..., min_length=1, max_length=100, examples=["Alex Morgan"])
    email: EmailStr = Field(..., examples=["alex@taskflow.app"])
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="At least 8 characters with uppercase, lowercase, and a digit.",
    )
    role: Literal["admin", "tasker"] = Field(default="tasker", description="User role in the system.")

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Name cannot be empty or whitespace only")
        return value.strip()

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, value: str) -> str:
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", value):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", value):
            raise ValueError("Password must contain at least one digit")
        return value


class UserLogin(BaseModel):
    """Payload for authenticating an existing user."""

    model_config = ConfigDict(str_strip_whitespace=True)

    email: EmailStr = Field(..., examples=["alex@taskflow.app"])
    password: str = Field(..., min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class UserResponse(BaseModel):
    """Public user data returned from the API (no secrets)."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: EmailStr
    role: Literal["admin", "tasker"] = "tasker"
    created_at: datetime | None = None
