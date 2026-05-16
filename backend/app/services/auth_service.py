from typing import Any

from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

from app.config.database import get_db
from app.models.user_model import USERS_COLLECTION, UserModel
from app.schemas.auth import TokenResponse
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse
from app.utils.security import create_access_token, hash_password, verify_password


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def _user_to_response(user: dict[str, Any] | UserModel) -> UserResponse:
    model = user if isinstance(user, UserModel) else UserModel.from_mongo(user)
    return UserResponse(
        id=str(model.id),
        name=model.name,
        email=model.email,
        created_at=model.created_at,
        role=getattr(model, 'role', None),
        location=getattr(model, 'location', None),
        bio=getattr(model, 'bio', None),
        profile_image=getattr(model, 'profile_image', None),
    )


async def get_user_by_id(user_id: str) -> UserResponse:
    db = get_db()
    from bson import ObjectId

    doc = await db[USERS_COLLECTION].find_one({"_id": ObjectId(user_id)})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return _user_to_response(doc)


async def update_user(user_id: str, payload: dict[str, Any]) -> UserResponse:
    db = get_db()
    from bson import ObjectId
    from pymongo import ReturnDocument
    from datetime import datetime, timezone

    # Only allow updating public profile fields
    allowed = {k: v for k, v in payload.items() if k in {"name", "role", "location", "bio", "profile_image"} and v is not None}
    if not allowed:
        # nothing to update; return current
        return await get_user_by_id(user_id)

    allowed["updated_at"] = datetime.now(timezone.utc)
    result = await db[USERS_COLLECTION].find_one_and_update(
        {"_id": ObjectId(user_id)}, {"$set": allowed}, return_document=ReturnDocument.AFTER
    )
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return _user_to_response(result)


def _build_token_response(user: dict[str, Any] | UserModel) -> TokenResponse:
    model = user if isinstance(user, UserModel) else UserModel.from_mongo(user)
    token = create_access_token(subject=str(model.id), email=str(model.email))
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=_user_to_response(model),
    )


async def register_user(payload: UserCreate) -> TokenResponse:
    db = get_db()
    email = _normalize_email(payload.email)

    existing = await db[USERS_COLLECTION].find_one({"email": email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )

    user = UserModel.new(
        name=payload.name,
        email=email,
        hashed_password=hash_password(payload.password),
    )

    try:
        result = await db[USERS_COLLECTION].insert_one(user.to_mongo())
        saved = user.model_copy(update={"id": result.inserted_id})
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        ) from None

    return _build_token_response(saved)


async def login_user(payload: UserLogin) -> TokenResponse:
    db = get_db()
    email = _normalize_email(payload.email)

    document = await db[USERS_COLLECTION].find_one({"email": email})
    if not document or not verify_password(payload.password, document["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return _build_token_response(document)


async def ensure_user_indexes() -> None:
    db = get_db()
    await db[USERS_COLLECTION].create_index("email", unique=True)
