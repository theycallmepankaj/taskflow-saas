from pydantic import BaseModel, Field


class ChartPoint(BaseModel):
    label: str
    value: float = Field(..., description="Metric value (count or percentage).")


class TaskSummary(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    todo_tasks: int
    in_progress_tasks: int


class ProductivityStats(BaseModel):
    completion_rate: float = Field(..., description="Completed tasks as % of total.")
    completed_this_week: int
    completed_this_month: int
    overdue_tasks: int
    high_priority_pending: int


class WeeklyAnalytics(BaseModel):
    completion_trend: list[ChartPoint]
    tasks_created: list[ChartPoint]


class MonthlyAnalytics(BaseModel):
    completion_trend: list[ChartPoint]
    tasks_by_week: list[ChartPoint]


class StatusBreakdownItem(BaseModel):
    name: str
    value: int
    status: str


class AnalyticsResponse(BaseModel):
    summary: TaskSummary
    productivity: ProductivityStats
    weekly: WeeklyAnalytics
    monthly: MonthlyAnalytics
    status_breakdown: list[StatusBreakdownItem]
