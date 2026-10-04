"""标准化响应封装（与平台既有接口口径一致：success / data / error）。"""

from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """所有 /api/v1 端点的统一响应包。"""

    success: bool = True
    data: T | None = None
    error: str | None = None


class ErrorBody(BaseModel):
    success: bool = False
    data: None = None
    error: str
