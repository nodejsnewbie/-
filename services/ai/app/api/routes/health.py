"""健康检查端点：`GET /api/v1/health`。"""

import httpx
from fastapi import APIRouter

from app.core.config import settings
from app.schemas.agent import HealthResult
from app.schemas.common import ApiResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=ApiResponse[HealthResult])
async def health() -> ApiResponse[HealthResult]:
    """存活探针 + 依赖状态（LLM 是否配置、平台后端是否可达）。"""
    reachable = False
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            res = await client.get(f"{settings.platform_api_base_url.rstrip('/')}/api/health")
        reachable = res.is_success
    except httpx.HTTPError:
        reachable = False

    return ApiResponse(
        data=HealthResult(
            status="ok" if reachable else "degraded",
            service=settings.service_name,
            version=settings.service_version,
            llm_configured=settings.llm_configured,
            llm_model=settings.llm_model,
            platform_api_reachable=reachable,
        )
    )
