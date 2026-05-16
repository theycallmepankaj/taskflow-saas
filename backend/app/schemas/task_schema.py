import re
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

TaskStatus = Literal["todo", "inProgress", "completed"]
TaskPriority = Literal["High", "Medium", "Low"]

ISO_DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def _parse_due_date(value: date | str | None) -> date | None:
    if value is None or value == "":
        return None
    if isinstance(value, date):
        return value
    if isinstance(value, str):
        stripped = value.strip()
        if not stripped:
            return None
        if ISO_DATE_PATTERN.match(stripped):
            return date.fromisoformat(stripped)
        raise ValueError("Due date must be in YYYY-MM-DD format")
    raise ValueError("Invalid due date value")


class CreateTask(BaseModel):
    """Payload for creating a new task."""

    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(..., min_length=1, max_length=200, examples=["Build kanban board UI"])
    description: str | None = Field(
        default=None,
        max_length=2000,
        description="Optional task details.",
    )
    status: TaskStatus = Field(default="todo", description="Kanban column status.")
    priority: TaskPriority = Field(default="Medium", description="Task priority level.")
    due_date: date | None = Field(
        default=None,
        description="Optional due date (YYYY-MM-DD).",
        examples=["2026-05-20"],
    )

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Title cannot be empty or whitespace only")
        return value.strip()

    @field_validator("description")
    @classmethod
    def normalize_description(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        return stripped or None

    @field_validator("due_date", mode="before")
    @classmethod
    def validate_due_date(cls, value: date | str | None) -> date | None:
        return _parse_due_date(value)


class UpdateTask(BaseModel):
    """Payload for updating an existing task (partial)."""

    model_config = ConfigDict(str_strip_whitespace=True)

    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    due_date: date | None = Field(
        default=None,
        description="Optional due date (YYYY-MM-DD).",
    )

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str | None) -> str | None:
        if value is not None and not value.strip():
            raise ValueError("Title cannot be empty or whitespace only")
        return value.strip() if value else value

    @field_validator("description")
    @classmethod
    def normalize_description(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        return stripped or None

    @field_validator("due_date", mode="before")
    @classmethod
    def validate_due_date(cls, value: date | str | None) -> date | None:
        if value is None:
            return None
        return _parse_due_date(value)


class TaskResponse(BaseModel):
    """Task data returned from the API."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    title: str
    description: str | None = None
    status: TaskStatus
    priority: TaskPriority
    due_date: date | None = None
    created_at: datetime
    updated_at: datetime


# Backward-compatible aliases
TaskCreate = CreateTask
TaskUpdate = UpdateTask
