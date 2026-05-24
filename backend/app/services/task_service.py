from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from pymongo import ReturnDocument

from app.config.database import get_db
from app.models.task_model import TASKS_COLLECTION, TaskModel
from app.schemas.task_schema import CreateTask, TaskResponse, UpdateTask

def _parse_object_id(value: str, *, not_found_detail: str = "Task not found") -> ObjectId:
    try:
        return ObjectId(value)
    except InvalidId as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=not_found_detail,
        ) from exc


def task_to_response(task: dict | TaskModel) -> TaskResponse:
    model = task if isinstance(task, TaskModel) else TaskModel.from_mongo(task)
    return TaskResponse(
        id=str(model.id),
        user_id=str(model.user_id),
        title=model.title,
        description=model.description,
        status=model.status,
        priority=model.priority,
        due_date=model.due_date,
        assigned_to=str(model.assigned_to) if model.assigned_to else None,
        created_at=model.created_at,
        updated_at=model.updated_at,
    )


async def create_task(user_id: str, payload: CreateTask) -> TaskResponse:
    db = get_db()
    assigned_to_oid = None
    if payload.assigned_to:
        assigned_to_oid = _parse_object_id(payload.assigned_to, not_found_detail="Invalid assignee")

    task = TaskModel.new(
        user_id=_parse_object_id(user_id, not_found_detail="Invalid user"),
        title=payload.title,
        description=payload.description,
        status=payload.status,
        priority=payload.priority,
        due_date=payload.due_date,
        assigned_to=assigned_to_oid,
    )

    result = await db[TASKS_COLLECTION].insert_one(task.to_mongo())
    saved = task.model_copy(update={"id": result.inserted_id})
    return task_to_response(saved)


async def get_tasks(user_id: str) -> list[TaskResponse]:
    db = get_db()
    user_oid = _parse_object_id(user_id, not_found_detail="Invalid user")

    cursor = db[TASKS_COLLECTION].find({
        "$or": [
            {"user_id": user_oid},
            {"assigned_to": user_oid}
        ]
    }).sort("created_at", -1)
    tasks = await cursor.to_list(length=None)
    return [task_to_response(TaskModel.from_mongo(task)) for task in tasks]


async def update_task(user_id: str, task_id: str, payload: UpdateTask) -> TaskResponse:
    db = get_db()
    updates = TaskModel.prepare_update_fields(payload.model_dump(exclude_unset=True))

    if len(updates) == 1 and "updated_at" in updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided to update",
        )

    user_oid = _parse_object_id(user_id, not_found_detail="Invalid user")
    result = await db[TASKS_COLLECTION].find_one_and_update(
        {
            "_id": _parse_object_id(task_id),
            "$or": [
                {"user_id": user_oid},
                {"assigned_to": user_oid}
            ]
        },
        {"$set": updates},
        return_document=ReturnDocument.AFTER,
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task_to_response(TaskModel.from_mongo(result))


async def delete_task(user_id: str, task_id: str) -> None:
    db = get_db()
    user_oid = _parse_object_id(user_id, not_found_detail="Invalid user")

    result = await db[TASKS_COLLECTION].delete_one(
        {
            "_id": _parse_object_id(task_id),
            "$or": [
                {"user_id": user_oid},
                {"assigned_to": user_oid}
            ]
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )


async def ensure_task_indexes() -> None:
    db = get_db()
    await db[TASKS_COLLECTION].create_index([("user_id", 1), ("created_at", -1)])
