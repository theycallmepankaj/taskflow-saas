from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.database import close_db, connect_db
from app.core.config import settings
from app.routes.analytics_routes import router as analytics_router
from app.routes.auth_routes import router as auth_router
from app.routes.task_routes import router as task_router
from app.routes.admin_routes import router as admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown hooks (DB clients, caches, etc.)."""
    await connect_db()
    yield
    await close_db()


def create_app() -> FastAPI:
    application = FastAPI(
        title=settings.APP_NAME,
        version=settings.VERSION,
        debug=settings.DEBUG,
        lifespan=lifespan,
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(
        auth_router,
        prefix=f"{settings.API_PREFIX}/auth",
        tags=["auth"],
    )
    application.include_router(
        task_router,
        prefix=f"{settings.API_PREFIX}/tasks",
        tags=["tasks"],
    )
    application.include_router(
        analytics_router,
        prefix=f"{settings.API_PREFIX}/analytics",
        tags=["analytics"],
    )
    application.include_router(
        admin_router,
        prefix=f"{settings.API_PREFIX}/admin",
        tags=["admin"],
    )

    @application.get("/", tags=["health"])
    async def root():
        return {
            "status": "ok",
            "message": "TaskFlow API is running",
            "version": settings.VERSION,
            "docs": "/docs",
        }

    return application


app = create_app()
