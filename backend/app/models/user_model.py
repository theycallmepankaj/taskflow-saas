from datetime import datetime, timezone
from typing import Any, Literal, Self

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, EmailStr, Field

USERS_COLLECTION = "users"


class UserModel(BaseModel):
    """MongoDB user document model for the `users` collection."""

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        str_strip_whitespace=True,
    )

    id: ObjectId | None = Field(default=None, alias="_id")
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    hashed_password: str = Field(..., min_length=1)
    role: Literal["admin", "tasker"] = "tasker"
    profile_image: str | None = Field(
        default=None,
        max_length=2048,
        description="URL or path to the user's profile image.",
    )
    created_at: datetime
    updated_at: datetime

    @classmethod
    def collection_name(cls) -> str:
        return USERS_COLLECTION

    @classmethod
    def new(
        cls,
        *,
        name: str,
        email: str,
        hashed_password: str,
        profile_image: str | None = None,
        role: Literal["admin", "tasker"] = "tasker",
    ) -> Self:
        """Build a new user document with UTC timestamps."""
        now = datetime.now(timezone.utc)
        return cls(
            name=name.strip(),
            email=email.strip().lower(),
            hashed_password=hashed_password,
            profile_image=profile_image,
            role=role,
            created_at=now,
            updated_at=now,
        )

    @classmethod
    def from_mongo(cls, document: dict[str, Any]) -> Self:
        """Create a model instance from a MongoDB document."""
        return cls.model_validate(document)

    def to_mongo(self, *, include_id: bool = False) -> dict[str, Any]:
        """Serialize to a MongoDB-compatible dictionary."""
        payload = self.model_dump(by_alias=True, exclude_none=True)
        if not include_id:
            payload.pop("_id", None)
        return payload

    def touch(self) -> Self:
        """Return a copy with `updated_at` set to the current UTC time."""
        return self.model_copy(update={"updated_at": datetime.now(timezone.utc)})

    def with_updates(self, **fields: Any) -> Self:
        """Return a copy with updated fields and a fresh `updated_at`."""
        data = {**fields, "updated_at": datetime.now(timezone.utc)}
        return self.model_copy(update=data)
