# services/ai · AI 智能代理层（Python）

平台三端之外的**第四个服务**：基于 **LangChain** 的智能代理，以 **FastAPI** 提供
标准化 REST 接口（`/api/v1` + OpenAPI 3 自动文档 + Pydantic 契约 + 统一响应包
`{success, data, error}`）。

代理的能力来自**平台统一后端（NestJS）的既有 REST 接口**——它们被包装成 LangChain
工具：商品检索、商品详情、溯源码验真、施药气象、预约查询、预约创建（写操作）。
代理不做诊断结论、不代替持证农艺师开方（合规红线 R5）。

## 运行

```bash
cd services/ai
python -m venv .venv
.venv/Scripts/pip install -e ".[dev]"      # Windows；POSIX 用 .venv/bin/pip
copy .env.example .env                     # 填 LLM_API_KEY（可指向豆包/智谱/通义网关）
.venv/Scripts/python -m uvicorn app.main:app --port 8100 --reload
```

仓库根目录也可用 `npm run dev:ai`（跨平台查找 .venv 的启动脚本）。

- OpenAPI 文档：http://127.0.0.1:8100/docs
- 健康检查：http://127.0.0.1:8100/api/v1/health
- 工具清单：http://127.0.0.1:8100/api/v1/agent/tools
- 对话：`POST /api/v1/agent/chat {"message": "...", "history": []}`

**未配置 `LLM_API_KEY` 时，chat 返回 503 并明确提示**——本服务不做"无模型的假回答"
（红线 R4：不伪造能力）。

## 测试

```bash
.venv/Scripts/python -m pytest
```

测试不依赖真实密钥，只验证 REST 契约：健康检查、OpenAPI 声明、工具注册、
无密钥 503、空消息 422。
