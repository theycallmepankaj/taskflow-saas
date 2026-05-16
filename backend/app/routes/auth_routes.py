from fastapi import APIRouter, status, Depends

from app.schemas.auth import TokenResponse
from app.schemas.user_schema import UserCreate, UserLogin
from app.services import auth_service
from app.schemas.user_schema import UserResponse, UpdateUser
from app.core.deps import get_current_user_id

router = APIRouter()


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    responses={
        201: {"description": "User created and JWT returned"},
        400: {"description": "Email already registered or validation error"},
    },
)
async def register(payload: UserCreate) -> TokenResponse:
    return await auth_service.register_user(payload)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login with email and password",
    responses={
        200: {"description": "Authenticated; JWT returned"},
        401: {"description": "Invalid email or password"},
    },
)
async def login(payload: UserLogin) -> TokenResponse:
    return await auth_service.login_user(payload)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user profile",
)
async def get_me(user_id: str = Depends(get_current_user_id)) -> UserResponse:
    return await auth_service.get_user_by_id(user_id)


@router.patch(
    "/me",
    response_model=UserResponse,
    summary="Update current user profile",
)
async def patch_me(payload: UpdateUser, user_id: str = Depends(get_current_user_id)) -> UserResponse:
    return await auth_service.update_user(user_id, payload.model_dump(exclude_none=True))
