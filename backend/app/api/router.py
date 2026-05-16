from fastapi import APIRouter

from app.routes.auth_routes import router as auth_router
from app.routes.task_routes import router as task_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(task_router, prefix="/tasks", tags=["tasks"])
