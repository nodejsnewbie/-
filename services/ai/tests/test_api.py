"""pytest 契约测试：不依赖真实 LLM 密钥，验证标准化 REST 层本身。

运行方式（services/ai 目录下）：
    .venv/Scripts/python -m pytest
"""

import importlib

from fastapi.testclient import TestClient


def make_client(monkeypatch, llm_key: str = ""):
    import app.core.config as config_module

    monkeypatch.setattr(config_module.settings, "llm_api_key", llm_key)
    from app.main import create_app

    return TestClient(create_app())


def test_health_reports_dependencies(monkeypatch):
    client = make_client(monkeypatch, llm_key="")
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    data = body["data"]
    assert data["llm_configured"] is False
    # 平台后端未起时也应如实报告，而不是谎报可达（R4）
    assert data["platform_api_reachable"] in (True, False)
    assert data["status"] in ("ok", "degraded")


def test_openapi_declares_standard_rest_contract():
    client = TestClient(importlib.import_module("app.main").create_app())
    schema = client.get("/openapi.json").json()
    paths = schema["paths"]
    assert "/api/v1/health" in paths
    assert "/api/v1/agent/tools" in paths
    assert "/api/v1/agent/chat" in paths
    chat_post = paths["/api/v1/agent/chat"]["post"]
    assert chat_post["requestBody"] is not None


def test_tools_endpoint_lists_platform_tools():
    client = TestClient(importlib.import_module("app.main").create_app())
    res = client.get("/api/v1/agent/tools")
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    names = [t["name"] for t in body["data"]]
    for expected in (
        "search_products",
        "get_product_detail",
        "verify_trace_code",
        "get_weather",
        "list_bookings",
        "create_booking",
    ):
        assert expected in names
    assert all(t["description"] for t in body["data"])


def test_chat_without_llm_key_is_honest_503(monkeypatch):
    client = make_client(monkeypatch, llm_key="")
    res = client.post(
        "/api/v1/agent/chat", json={"message": "帮我找治稻飞虱的药"}
    )
    assert res.status_code == 503
    assert "LLM_API_KEY" in res.json()["detail"]


def test_chat_rejects_empty_message():
    client = TestClient(importlib.import_module("app.main").create_app())
    res = client.post("/api/v1/agent/chat", json={"message": ""})
    assert res.status_code == 422  # Pydantic 契约校验
