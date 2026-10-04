"""AI 智能代理层入口：FastAPI 应用工厂。

标准化 REST 约定：
- 统一前缀 /api/v1，OpenAPI 3 文档自动生成（/docs · /openapi.json）；
- 统一响应包 {success, data, error}（与平台既有接口口径一致）；
- Pydantic 模型即契约，请求/响应全部显式建模。
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import agent, health
from app.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.service_name,
        version=settings.service_version,
        description=(
            "基于 LangChain 的智能代理层。代理通过平台统一后端（NestJS）的 REST 接口"
            "完成商品检索、溯源码验真、施药气象决策与上门服务预约。"
        ),
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # 开发期；生产按端收敛
        allow_methods=["*"],
        allow_headers=["*"],
    )

    api_v1 = [health.router, agent.router]
    for router in api_v1:
        app.include_router(router, prefix="/api/v1")

    return app


app = create_app()
