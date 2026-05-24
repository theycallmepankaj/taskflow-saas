from datetime import date, datetime, timezone
from typing import Any, Literal, Self

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.task_schema import _parse_due_date

TASKS_COLLECTION = "tasks"

TaskStatus = Literal["todo", "inProgress", "completed"]
TaskPriority = Literal["High", "Medium", "Low"]


class TaskModel(BaseModel):
    """MongoDB task document model for the `tasks` collection."""

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        str_strip_whitespace=True,
    )

    id: ObjectId | None = Field(default=None, alias="_id")
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    status: TaskStatus = "todo"
    priority: TaskPriority = "Medium"
    due_date: date | None = None
    user_id: ObjectId
    assigned_to: ObjectId | None = None
    created_at: datetime
    updated_at: datetime

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Title cannot be empty or whitespace only")
        return stripped

    @classmethod
    def collection_name(cls) -> str:
        return TASKS_COLLECTION

    @classmethod
    def new(
        cls,
        *,
        user_id: ObjectId,
        title: str,
        description: str | None = None,
        status: TaskStatus = "todo",
        priority: TaskPriority = "Medium",
        due_date: date | None = None,
        assigned_to: ObjectId | None = None,
    ) -> Self:
        """Build a new task document with UTC timestamps."""
        now = datetime.now(timezone.utc)
        return cls(
            user_id=user_id,
            title=title,
            description=description,
            status=status,
            priority=priority,
            due_date=due_date,
            assigned_to=assigned_to,
            created_at=now,
            updated_at=now,
        )

    @classmethod
    def from_mongo(cls, document: dict[str, Any]) -> Self:
        """Create a model instance from a MongoDB document."""
        data = dict(document)
        raw_due = data.get("due_date", data.get("due"))
        data["due_date"] = cls._read_due_date(raw_due)
        raw_assigned = data.get("assigned_to")
        if raw_assigned:
            data["assigned_to"] = ObjectId(raw_assigned) if isinstance(raw_assigned, (str, ObjectId)) else None
        return cls.model_validate(data)

    @staticmethod
    def _read_due_date(raw: Any) -> date | None:
        if raw is None:
            return None
        if isinstance(raw, datetime):
            return raw.date()
        if isinstance(raw, date):
            return raw
        if isinstance(raw, str):
            try:
                return _parse_due_date(raw)
            except ValueError:
                return None
        return None

    @staticmethod
    def _serialize_due_date(value: date | None) -> str | None:
        return value.isoformat() if value else None

    def to_mongo(self, *, include_id: bool = False) -> dict[str, Any]:
        """Serialize to a MongoDB-compatible dictionary."""
        payload = self.model_dump(by_alias=True, exclude_none=True)
        if not include_id:
            payload.pop("_id", None)
        serialized_due = self._serialize_due_date(self.due_date)
        if serialized_due is not None:
            payload["due_date"] = serialized_due
        else:
            payload.pop("due_date", None)
            
        # Ensure user_id and assigned_to are stored as ObjectIds
        if "user_id" in payload and isinstance(payload["user_id"], str):
            payload["user_id"] = ObjectId(payload["user_id"])
        if "assigned_to" in payload and isinstance(payload["assigned_to"], str):
            payload["assigned_to"] = ObjectId(payload["assigned_to"])
        return payload

    def touch(self) -> Self:
        """Return a copy with `updated_at` set to the current UTC time."""
        return self.model_copy(update={"updated_at": datetime.now(timezone.utc)})

    def with_updates(self, **fields: Any) -> Self:
        """Return a copy with updated fields and a fresh `updated_at`."""
        if "due_date" in fields and fields["due_date"] is not None:
            fields["due_date"] = self._read_due_date(fields["due_date"])
        if "assigned_to" in fields:
            raw_assigned = fields["assigned_to"]
            if raw_assigned is not None:
                fields["assigned_to"] = ObjectId(raw_assigned) if isinstance(raw_assigned, (str, ObjectId)) else None
            else:
                fields["assigned_to"] = None
        data = {**fields, "updated_at": datetime.now(timezone.utc)}
        return self.model_copy(update=data)

    @classmethod
    def prepare_update_fields(cls, updates: dict[str, Any]) -> dict[str, Any]:
        """Normalize partial update payloads for MongoDB `$set` operations."""
        prepared = dict(updates)
        if "due_date" in prepared:
            raw = prepared["due_date"]
            prepared["due_date"] = cls._serialize_due_date(
                cls._read_due_date(raw) if raw is not None else None
            )
        if "assigned_to" in prepared:
            raw_assigned = prepared["assigned_to"]
            if raw_assigned is not None:
                prepared["assigned_to"] = ObjectId(raw_assigned) if isinstance(raw_assigned, (str, ObjectId)) else None
            else:
                prepared["assigned_to"] = None
        prepared["updated_at"] = datetime.now(timezone.utc)
        return prepared
