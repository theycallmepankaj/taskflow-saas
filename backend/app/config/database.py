from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import BASE_DIR, settings

load_dotenv(BASE_DIR / ".env")


class MongoDB:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None


mongodb = MongoDB()


async def connect_db() -> None:
    """Create the Motor client, bind the database, and verify connectivity."""
    mongodb.client = AsyncIOMotorClient(settings.MONGO_URI)
    mongodb.db = mongodb.client[settings.DATABASE_NAME]
    await mongodb.client.admin.command("ping")

    from app.services.auth_service import ensure_user_indexes
    from app.services.task_service import ensure_task_indexes

    await ensure_user_indexes()
    await ensure_task_indexes()


async def close_db() -> None:
    """Close the Motor client and reset the connection."""
    if mongodb.client is not None:
        mongodb.client.close()

    mongodb.client = None
    mongodb.db = None


def get_db() -> AsyncIOMotorDatabase:
    """Return the active database instance (for FastAPI dependencies)."""
    if mongodb.db is None:
        raise RuntimeError("Database is not connected. Call connect_db() during app startup.")
    return mongodb.db


def __getattr__(name: str):
    """Lazy exports: `db` and `client` resolve after connect_db() runs."""
    if name == "db":
        return get_db()
    if name == "client":
        if mongodb.client is None:
            raise RuntimeError("Database is not connected. Call connect_db() during app startup.")
        return mongodb.client
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
