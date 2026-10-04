"""智能代理工厂：LangChain create_agent + 平台 REST 工具。

代理的职责边界（AGENTS.md 口径）：
- 只做「查与约」：商品咨询、溯源验真、气象决策、服务预约；
- 不做诊断结论、不承诺疗效、不代替持证农艺师开方（合规红线 R5）；
- 数据一律来自平台工具，查不到就如实说，不编造。
"""

from langchain.agents import create_agent
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from langchain_openai import ChatOpenAI

from app.core.config import settings
from app.schemas.agent import ChatMessage
from app.tools.platform import PLATFORM_TOOLS

SYSTEM_PROMPT = """你是"华农智服"农资自营商城的智能农技助手，服务对象是农户、合作社与种植大户。

你的能力（必须通过工具完成，不得凭空编造数据）：
1. 商品咨询：帮用户按作物/病虫害找农资，说明用法用量与安全间隔期；
2. 溯源验真：用户提供包装上的农药电子溯源码时，调用验真工具给出正品/假劣判定；
3. 施药窗口：结合气象与飞防指数，判断当天是否适合喷施作业；
4. 服务预约：在信息齐全并与用户确认后，创建飞防/施用上门服务预约。

行为准则：
- 用简体中文口语化回答，结论先说、依据后说；
- 数据（价格、批次、登记证号）只能来自工具返回结果，查不到就明说"我查不到"；
- 涉及具体病虫害诊断与开方，必须提示"最终请以持证农艺师现场处方为准"；
- 可疑溯源码（疑似假劣）要明确警告用户不要使用，并提示保留凭证。
"""


def _to_messages(message: str, history: list[ChatMessage]) -> list[BaseMessage]:
    converted: list[BaseMessage] = []
    for item in history[-12:]:
        if item.role == "user":
            converted.append(HumanMessage(content=item.content))
        elif item.role == "assistant":
            converted.append(AIMessage(content=item.content))
    converted.append(HumanMessage(content=message))
    return converted


def build_llm() -> ChatOpenAI:
    """按配置构建 OpenAI 兼容模型客户端（可指向豆包方舟 / 智谱 / 通义网关）。"""
    return ChatOpenAI(
        api_key=settings.llm_api_key,
        base_url=settings.llm_base_url,
        model=settings.llm_model,
        temperature=settings.llm_temperature,
    )


def build_agent():
    """构建带平台工具的智能代理。要求已配置 LLM_API_KEY（调用方负责校验）。"""
    return create_agent(
        model=build_llm(),
        tools=list(PLATFORM_TOOLS),
        system_prompt=SYSTEM_PROMPT,
    )


async def run_chat(agent, message: str, history: list[ChatMessage]) -> tuple[str, list[str]]:
    """执行一轮代理对话，返回 (最终回复, 实际调用的工具名列表)。"""
    result = await agent.ainvoke({"messages": _to_messages(message, history)})
    messages = result.get("messages", [])

    reply = ""
    tools_used: list[str] = []
    for msg in reversed(messages):
        if isinstance(msg, AIMessage) and msg.content:
            reply = msg.content if isinstance(msg.content, str) else str(msg.content)
            break
    for msg in messages:
        calls = getattr(msg, "tool_calls", None) or []
        tools_used.extend(call.get("name", "") for call in calls)

    return reply, tools_used
