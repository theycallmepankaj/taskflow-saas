from fastapi import APIRouter, Depends, Response, status

from app.core.deps import get_current_user_id
from app.schemas.task_schema import CreateTask, TaskResponse, UpdateTask
from app.services import task_service

router = APIRouter()


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task",
    responses={
        201: {"description": "Task created"},
        401: {"description": "Not authenticated"},
        422: {"description": "Validation error"},
    },
)
async def create_task(
    payload: CreateTask,
    user_id: str = Depends(get_current_user_id),
) -> TaskResponse:
    return await task_service.create_task(user_id, payload)


@router.get(
    "",
    response_model=list[TaskResponse],
    summary="Get all tasks for the current user",
    responses={
        200: {"description": "List of tasks"},
        401: {"description": "Not authenticated"},
    },
)
async def list_tasks(
    user_id: str = Depends(get_current_user_id),
) -> list[TaskResponse]:
    return await task_service.get_tasks(user_id)


@router.patch(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Update a task",
    responses={
        200: {"description": "Task updated"},
        400: {"description": "No fields to update"},
        401: {"description": "Not authenticated"},
        404: {"description": "Task not found"},
        422: {"description": "Validation error"},
    },
)
async def update_task(
    task_id: str,
    payload: UpdateTask,
    user_id: str = Depends(get_current_user_id),
) -> TaskResponse:
    return await task_service.update_task(user_id, task_id, payload)


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a task",
    responses={
        204: {"description": "Task deleted"},
        401: {"description": "Not authenticated"},
        404: {"description": "Task not found"},
    },
)
async def delete_task(
    task_id: str,
    user_id: str = Depends(get_current_user_id),
) -> Response:
    await task_service.delete_task(user_id, task_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
