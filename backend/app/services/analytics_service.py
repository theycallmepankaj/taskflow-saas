from calendar import month_abbr
from datetime import date, datetime, timedelta, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status

from app.config.database import get_db
from app.models.task_model import TASKS_COLLECTION
from app.schemas.analytics_schema import (
    AnalyticsResponse,
    ChartPoint,
    MonthlyAnalytics,
    ProductivityStats,
    StatusBreakdownItem,
    TaskSummary,
    WeeklyAnalytics,
)

STATUS_LABELS = {
    "todo": "To do",
    "inProgress": "In progress",
    "completed": "Completed",
}


def _parse_user_id(user_id: str) -> ObjectId:
    try:
        return ObjectId(user_id)
    except InvalidId as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user",
        ) from exc


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _start_of_day(dt: datetime) -> datetime:
    return dt.replace(hour=0, minute=0, second=0, microsecond=0)


def _start_of_week(dt: datetime) -> datetime:
    return _start_of_day(dt - timedelta(days=dt.weekday()))


def _start_of_month(dt: datetime) -> datetime:
    return dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0)


def _last_n_day_keys(n: int = 7) -> list[tuple[str, str]]:
    today = _utc_now().date()
    keys: list[tuple[str, str]] = []
    for offset in range(n - 1, -1, -1):
        day = today - timedelta(days=offset)
        keys.append((day.isoformat(), day.strftime("%a")))
    return keys


def _last_n_month_keys(n: int = 12) -> list[tuple[str, str]]:
    today = _utc_now().date().replace(day=1)
    keys: list[tuple[str, str]] = []
    year, month = today.year, today.month
    for _ in range(n):
        keys.append((f"{year:04d}-{month:02d}", month_abbr[month]))
        month -= 1
        if month == 0:
            month = 12
            year -= 1
    return list(reversed(keys))


def _map_aggregation_counts(rows: list[dict], key_field: str = "_id") -> dict[str, int]:
    mapped: dict[str, int] = {}
    for row in rows:
        key = row.get(key_field)
        if key is None:
            continue
        mapped[str(key)] = int(row.get("count", 0))
    return mapped


def _to_percentage_series(
    keys: list[tuple[str, str]],
    counts: dict[str, int],
) -> list[ChartPoint]:
    values = [counts.get(key, 0) for key, _ in keys]
    peak = max(values) if values else 0
    peak = peak if peak > 0 else 1
    return [
        ChartPoint(label=label, value=round((counts.get(key, 0) / peak) * 100, 1))
        for key, label in keys
    ]


def _to_count_series(keys: list[tuple[str, str]], counts: dict[str, int]) -> list[ChartPoint]:
    return [ChartPoint(label=label, value=float(counts.get(key, 0))) for key, label in keys]


async def _status_counts(db, user_oid: ObjectId) -> dict[str, int]:
    pipeline = [
        {"$match": {"user_id": user_oid}},
        {"$group": {"_id": "$status", "count": {"$sum": 1}}},
    ]
    rows = await db[TASKS_COLLECTION].aggregate(pipeline).to_list(length=None)
    return {row["_id"]: int(row["count"]) for row in rows}


async def _count_completed_since(db, user_oid: ObjectId, since: datetime) -> int:
    pipeline = [
        {
            "$match": {
                "user_id": user_oid,
                "status": "completed",
                "updated_at": {"$gte": since},
            }
        },
        {"$count": "count"},
    ]
    rows = await db[TASKS_COLLECTION].aggregate(pipeline).to_list(length=1)
    return int(rows[0]["count"]) if rows else 0


async def _count_overdue(db, user_oid: ObjectId, today: date) -> int:
    pipeline = [
        {
            "$match": {
                "user_id": user_oid,
                "status": {"$ne": "completed"},
                "due_date": {"$lt": today.isoformat()},
            }
        },
        {"$count": "count"},
    ]
    rows = await db[TASKS_COLLECTION].aggregate(pipeline).to_list(length=1)
    return int(rows[0]["count"]) if rows else 0


async def _daily_created_counts(db, user_oid: ObjectId, since: datetime) -> dict[str, int]:
    pipeline = [
        {"$match": {"user_id": user_oid, "created_at": {"$gte": since}}},
        {
            "$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
                "count": {"$sum": 1},
            }
        },
    ]
    rows = await db[TASKS_COLLECTION].aggregate(pipeline).to_list(length=None)
    return _map_aggregation_counts(rows)


async def _daily_completed_counts(db, user_oid: ObjectId, since: datetime) -> dict[str, int]:
    pipeline = [
        {
            "$match": {
                "user_id": user_oid,
                "status": "completed",
                "updated_at": {"$gte": since},
            }
        },
        {
            "$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$updated_at"}},
                "count": {"$sum": 1},
            }
        },
    ]
    rows = await db[TASKS_COLLECTION].aggregate(pipeline).to_list(length=None)
    return _map_aggregation_counts(rows)


async def _monthly_completed_counts(db, user_oid: ObjectId, since: datetime) -> dict[str, int]:
    pipeline = [
        {
            "$match": {
                "user_id": user_oid,
                "status": "completed",
                "updated_at": {"$gte": since},
            }
        },
        {
            "$group": {
                "_id": {"$dateToString": {"format": "%Y-%m", "date": "$updated_at"}},
                "count": {"$sum": 1},
            }
        },
    ]
    rows = await db[TASKS_COLLECTION].aggregate(pipeline).to_list(length=None)
    return _map_aggregation_counts(rows)


async def _weekly_tasks_in_month(db, user_oid: ObjectId, month_start: datetime) -> dict[str, int]:
    next_month = (month_start.replace(day=28) + timedelta(days=4)).replace(day=1)
    pipeline = [
        {
            "$match": {
                "user_id": user_oid,
                "created_at": {"$gte": month_start, "$lt": next_month},
            }
        },
        {
            "$group": {
                "_id": {
                    "$concat": [
                        "W",
                        {
                            "$toString": {
                                "$ceil": {
                                    "$divide": [
                                        {"$dayOfMonth": "$created_at"},
                                        7,
                                    ]
                                }
                            }
                        },
                    ]
                },
                "count": {"$sum": 1},
            }
        },
        {"$sort": {"_id": 1}},
    ]
    rows = await db[TASKS_COLLECTION].aggregate(pipeline).to_list(length=None)
    return _map_aggregation_counts(rows)


async def get_analytics(user_id: str) -> AnalyticsResponse:
    db = get_db()
    user_oid = _parse_user_id(user_id)
    now = _utc_now()
    week_start = _start_of_week(now)
    month_start = _start_of_month(now)
    seven_days_ago = _start_of_day(now - timedelta(days=6))
    day_keys = _last_n_day_keys(7)
    month_keys = _last_n_month_keys(12)
    first_year, first_month = map(int, month_keys[0][0].split("-"))
    twelve_months_ago = datetime(first_year, first_month, 1, tzinfo=timezone.utc)

    status_map = await _status_counts(db, user_oid)
    todo = status_map.get("todo", 0)
    in_progress = status_map.get("inProgress", 0)
    completed = status_map.get("completed", 0)
    total = todo + in_progress + completed
    pending = todo + in_progress

    completion_rate = round((completed / total) * 100, 1) if total else 0.0

    created_by_day = await _daily_created_counts(db, user_oid, seven_days_ago)
    completed_by_day = await _daily_completed_counts(db, user_oid, seven_days_ago)
    completed_by_month = await _monthly_completed_counts(db, user_oid, twelve_months_ago)
    weekly_in_month = await _weekly_tasks_in_month(db, user_oid, month_start)

    week_keys_ordered = sorted(weekly_in_month.keys())
    if not week_keys_ordered:
        week_keys_ordered = ["W1", "W2", "W3", "W4"]

    summary = TaskSummary(
        total_tasks=total,
        completed_tasks=completed,
        pending_tasks=pending,
        todo_tasks=todo,
        in_progress_tasks=in_progress,
    )

    productivity = ProductivityStats(
        completion_rate=completion_rate,
        completed_this_week=await _count_completed_since(db, user_oid, week_start),
        completed_this_month=await _count_completed_since(db, user_oid, month_start),
        overdue_tasks=await _count_overdue(db, user_oid, now.date()),
        high_priority_pending=await _count_high_priority_pending(db, user_oid),
    )

    weekly = WeeklyAnalytics(
        completion_trend=_to_percentage_series(day_keys, completed_by_day),
        tasks_created=_to_count_series(day_keys, created_by_day),
    )

    monthly = MonthlyAnalytics(
        completion_trend=_to_percentage_series(month_keys, completed_by_month),
        tasks_by_week=[
            ChartPoint(label=label, value=float(weekly_in_month.get(label, 0)))
            for label in week_keys_ordered
        ],
    )

    status_breakdown = [
        StatusBreakdownItem(
            name=STATUS_LABELS.get(status, status),
            value=count,
            status=status,
        )
        for status, count in status_map.items()
        if count > 0
    ]

    return AnalyticsResponse(
        summary=summary,
        productivity=productivity,
        weekly=weekly,
        monthly=monthly,
        status_breakdown=status_breakdown,
    )


async def _count_high_priority_pending(db, user_oid: ObjectId) -> int:
    pipeline = [
        {
            "$match": {
                "user_id": user_oid,
                "status": {"$ne": "completed"},
                "priority": "High",
            }
        },
        {"$count": "count"},
    ]
    rows = await db[TASKS_COLLECTION].aggregate(pipeline).to_list(length=1)
    return int(rows[0]["count"]) if rows else 0
