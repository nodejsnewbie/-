"""智能代理端点：

- `GET  /api/v1/agent/tools`  列出代理可用的平台工具（自描述契约）；
- `POST /api/v1/agent/chat`   与智能代理对话（需配置 LLM_API_KEY，否则 503 诚实降级）。
"""

from fastapi import APIRouter, HTTPException, status

from app.agents.agronomist import build_agent, run_chat
from app.core.config import settings
from app.schemas.agent import ChatRequest, ChatResult, ToolInfo
from app.schemas.common import ApiResponse
from app.tools.platform import PLATFORM_TOOLS

router = APIRouter(prefix="/agent", tags=["agent"])

_NO_KEY = (
    "AI 智能代理未配置大模型密钥（环境变量 LLM_API_KEY）。"
    "请参照 services/ai/.env.example 配置后重启服务；本服务不做无模型的假回答。"
)


@router.get("/tools", response_model=ApiResponse[list[ToolInfo]])
async def tools() -> ApiResponse[list[ToolInfo]]:
    """代理当前接入的平台工具清单（与统一后端的 REST 接口一一对应）。"""
    return ApiResponse(
        data=[
            ToolInfo(name=t.name, description=t.description or "")
            for t in PLATFORM_TOOLS
        ]
    )


@router.post("/chat", response_model=ApiResponse[ChatResult])
async def chat(payload: ChatRequest) -> ApiResponse[ChatResult]:
    """与智能代理对话一轮。代理可自主调用平台 REST 工具后给出中文回答。"""
    if not settings.llm_configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=_NO_KEY,
        )

    agent = build_agent()
    try:
        reply, tools_used = await run_chat(agent, payload.message, payload.history)
    except Exception as error:  # noqa: BLE001 —— 统一转成 502 语义，向上抛原始异常只会泄露密钥上下文
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"智能代理调用失败：{error}",
        ) from error

    return ApiResponse(data=ChatResult(reply=reply, tools_used=tools_used))
