from datetime import datetime, timezone, timedelta
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status, Response
from bson import ObjectId
from bson.errors import InvalidId
from pydantic import BaseModel, EmailStr, Field
from pymongo import ReturnDocument

from app.config.database import get_db
from app.core.deps import require_admin
from app.models.user_model import UserModel, USERS_COLLECTION
from app.models.task_model import TaskModel, TASKS_COLLECTION
from app.schemas.user_schema import UserResponse, UserCreate
from app.schemas.task_schema import TaskResponse, CreateTask, UpdateTask
from app.services.task_service import task_to_response
from app.services.auth_service import _user_to_response
from app.utils.security import hash_password

router = APIRouter()


class AdminUserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    role: Literal["admin", "tasker"] | None = None
    password: str | None = None


class AdminStatsResponse(BaseModel):
    total_users: int
    total_taskers: int
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    status_breakdown: list[dict]
    task_activity: list[dict]


@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_stats(admin_id: str = Depends(require_admin)):
    db = get_db()
    
    total_users = await db[USERS_COLLECTION].count_documents({})
    total_taskers = await db[USERS_COLLECTION].count_documents({"role": "tasker"})
    total_tasks = await db[TASKS_COLLECTION].count_documents({})
    completed_tasks = await db[TASKS_COLLECTION].count_documents({"status": "completed"})
    pending_tasks = total_tasks - completed_tasks

    # status breakdown
    status_pipeline = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    status_rows = await db[TASKS_COLLECTION].aggregate(status_pipeline).to_list(length=None)
    status_counts = {row["_id"]: row["count"] for row in status_rows}
    status_breakdown = [
        {"name": "To Do", "value": status_counts.get("todo", 0), "status": "todo"},
        {"name": "In Progress", "value": status_counts.get("inProgress", 0), "status": "inProgress"},
        {"name": "Completed", "value": status_counts.get("completed", 0), "status": "completed"},
    ]

    # task activity trend (last 7 days created vs completed)
    now = datetime.now(timezone.utc)
    seven_days_ago = now - timedelta(days=6)
    seven_days_ago_start = seven_days_ago.replace(hour=0, minute=0, second=0, microsecond=0)

    created_pipeline = [
        {"$match": {"created_at": {"$gte": seven_days_ago_start}}},
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
            "count": {"$sum": 1}
        }}
    ]
    created_rows = await db[TASKS_COLLECTION].aggregate(created_pipeline).to_list(length=None)
    created_map = {row["_id"]: row["count"] for row in created_rows}

    completed_pipeline = [
        {"$match": {"status": "completed", "updated_at": {"$gte": seven_days_ago_start}}},
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$updated_at"}},
            "count": {"$sum": 1}
        }}
    ]
    completed_rows = await db[TASKS_COLLECTION].aggregate(completed_pipeline).to_list(length=None)
    completed_map = {row["_id"]: row["count"] for row in completed_rows}

    task_activity = []
    for offset in range(6, -1, -1):
        day = (now - timedelta(days=offset)).date()
        day_str = day.isoformat()
        day_label = day.strftime("%a")
        task_activity.append({
            "label": day_label,
            "created": created_map.get(day_str, 0),
            "completed": completed_map.get(day_str, 0)
        })

    return AdminStatsResponse(
        total_users=total_users,
        total_taskers=total_taskers,
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        pending_tasks=pending_tasks,
        status_breakdown=status_breakdown,
        task_activity=task_activity
    )


@router.get("/users", response_model=list[UserResponse])
async def list_users(admin_id: str = Depends(require_admin)):
    db = get_db()
    cursor = db[USERS_COLLECTION].find({}).sort("created_at", -1)
    users = await cursor.to_list(length=None)
    return [_user_to_response(UserModel.from_mongo(user)) for user in users]


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(payload: UserCreate, admin_id: str = Depends(require_admin)):
    db = get_db()
    email = payload.email.strip().lower()
    existing = await db[USERS_COLLECTION].find_one({"email": email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    user = UserModel.new(
        name=payload.name,
        email=email,
        hashed_password=hash_password(payload.password),
        role=payload.role
    )
    result = await db[USERS_COLLECTION].insert_one(user.to_mongo())
    saved = user.model_copy(update={"id": result.inserted_id})
    return _user_to_response(saved)


@router.patch("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, payload: AdminUserUpdate, admin_id: str = Depends(require_admin)):
    db = get_db()
    try:
        oid = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")
        
    existing = await db[USERS_COLLECTION].find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")
        
    updates = {}
    if payload.name is not None:
        updates["name"] = payload.name.strip()
    if payload.email is not None:
        email = payload.email.strip().lower()
        dup = await db[USERS_COLLECTION].find_one({"email": email, "_id": {"$ne": oid}})
        if dup:
            raise HTTPException(status_code=400, detail="Email already registered")
        updates["email"] = email
    if payload.role is not None:
        updates["role"] = payload.role
    if payload.password is not None and payload.password != "":
        updates["hashed_password"] = hash_password(payload.password)
        
    if not updates:
        return _user_to_response(UserModel.from_mongo(existing))
        
    updates["updated_at"] = datetime.now(timezone.utc)
    result = await db[USERS_COLLECTION].find_one_and_update(
        {"_id": oid},
        {"$set": updates},
        return_document=ReturnDocument.AFTER
    )
    return _user_to_response(UserModel.from_mongo(result))


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str, admin_id: str = Depends(require_admin)):
    db = get_db()
    try:
        oid = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")
        
    user = await db[USERS_COLLECTION].find_one({"_id": oid})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    await db[USERS_COLLECTION].delete_one({"_id": oid})
    await db[TASKS_COLLECTION].delete_many({"user_id": oid})
    await db[TASKS_COLLECTION].update_many({"assigned_to": oid}, {"$set": {"assigned_to": None}})
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/tasks", response_model=list[TaskResponse])
async def list_all_tasks(admin_id: str = Depends(require_admin)):
    db = get_db()
    cursor = db[TASKS_COLLECTION].find({}).sort("created_at", -1)
    tasks = await cursor.to_list(length=None)
    return [task_to_response(TaskModel.from_mongo(t)) for t in tasks]


@router.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def admin_create_task(payload: CreateTask, admin_id: str = Depends(require_admin)):
    db = get_db()
    assigned_to_oid = None
    if payload.assigned_to:
        try:
            assigned_to_oid = ObjectId(payload.assigned_to)
        except InvalidId:
            raise HTTPException(status_code=400, detail="Invalid assignee ID")
            
    task = TaskModel.new(
        user_id=ObjectId(admin_id),
        title=payload.title,
        description=payload.description,
        status=payload.status,
        priority=payload.priority,
        due_date=payload.due_date,
        assigned_to=assigned_to_oid
    )
    result = await db[TASKS_COLLECTION].insert_one(task.to_mongo())
    saved = task.model_copy(update={"id": result.inserted_id})
    return task_to_response(saved)


@router.patch("/tasks/{task_id}", response_model=TaskResponse)
async def admin_update_task(task_id: str, payload: UpdateTask, admin_id: str = Depends(require_admin)):
    db = get_db()
    try:
        t_oid = ObjectId(task_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid task ID")
        
    existing = await db[TASKS_COLLECTION].find_one({"_id": t_oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Task not found")
        
    updates = TaskModel.prepare_update_fields(payload.model_dump(exclude_unset=True))
    if len(updates) == 1 and "updated_at" in updates:
        raise HTTPException(status_code=400, detail="No fields to update")
        
    result = await db[TASKS_COLLECTION].find_one_and_update(
        {"_id": t_oid},
        {"$set": updates},
        return_document=ReturnDocument.AFTER
    )
    return task_to_response(TaskModel.from_mongo(result))


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_task(task_id: str, admin_id: str = Depends(require_admin)):
    db = get_db()
    try:
        t_oid = ObjectId(task_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid task ID")
        
    result = await db[TASKS_COLLECTION].delete_one({"_id": t_oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
        
    return Response(status_code=status.HTTP_204_NO_CONTENT)
