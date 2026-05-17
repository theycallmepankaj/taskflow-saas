from fastapi import APIRouter, status

from app.schemas.auth import TokenResponse
from app.schemas.user_schema import UserCreate, UserLogin
from app.services import auth_service

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
