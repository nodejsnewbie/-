"""智能代理端点的请求 / 响应契约。"""

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(..., description="消息角色：user / assistant")
    content: str = Field(..., min_length=1)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000, description="用户输入（本轮）")
    history: list[ChatMessage] = Field(default_factory=list, description="可选的多轮历史")


class ToolInfo(BaseModel):
    name: str
    description: str


class ChatResult(BaseModel):
    reply: str = Field(..., description="代理的最终中文回复")
    tools_used: list[str] = Field(default_factory=list, description="本轮实际调用的工具名")


class HealthResult(BaseModel):
    status: str
    service: str
    version: str
    llm_configured: bool
    llm_model: str
    platform_api_reachable: bool
