from fastapi import APIRouter, Depends, status

from app.core.deps import get_current_user_id
from app.schemas.analytics_schema import (
    AnalyticsResponse,
    MonthlyAnalytics,
    ProductivityStats,
    TaskSummary,
    WeeklyAnalytics,
)
from app.services import analytics_service

router = APIRouter()


@router.get(
    "",
    response_model=AnalyticsResponse,
    summary="Full analytics dashboard",
    responses={
        200: {"description": "Aggregated task analytics for the current user"},
        401: {"description": "Not authenticated"},
    },
)
async def get_analytics(
    user_id: str = Depends(get_current_user_id),
) -> AnalyticsResponse:
    return await analytics_service.get_analytics(user_id)


@router.get(
    "/summary",
    response_model=TaskSummary,
    summary="Task counts by status",
)
async def get_task_summary(
    user_id: str = Depends(get_current_user_id),
) -> TaskSummary:
    data = await analytics_service.get_analytics(user_id)
    return data.summary


@router.get(
    "/productivity",
    response_model=ProductivityStats,
    summary="Productivity metrics",
)
async def get_productivity_stats(
    user_id: str = Depends(get_current_user_id),
) -> ProductivityStats:
    data = await analytics_service.get_analytics(user_id)
    return data.productivity


@router.get(
    "/weekly",
    response_model=WeeklyAnalytics,
    summary="Last 7 days analytics",
)
async def get_weekly_analytics(
    user_id: str = Depends(get_current_user_id),
) -> WeeklyAnalytics:
    data = await analytics_service.get_analytics(user_id)
    return data.weekly


@router.get(
    "/monthly",
    response_model=MonthlyAnalytics,
    summary="Last 12 months and current-month weekly breakdown",
)
async def get_monthly_analytics(
    user_id: str = Depends(get_current_user_id),
) -> MonthlyAnalytics:
    data = await analytics_service.get_analytics(user_id)
    return data.monthly
