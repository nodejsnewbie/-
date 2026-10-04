"""平台 REST 工具集：把统一后端（NestJS）的既有接口包装成 LangChain 工具。

设计约定：
- 工具是智能代理唯一的数据来源（R4：代理不得编造平台数据，查不到就如实说查不到）；
- 全部走 `platform_api_base_url` 指向的统一后端，工具自身不直连数据库；
- 除 `create_booking` 外均为只读工具；写操作在 docstring 里显式声明。
"""

import httpx
from langchain.tools import tool

from app.core.config import settings

TIMEOUT = settings.platform_timeout_seconds


def _base() -> str:
    return settings.platform_api_base_url.rstrip("/")


@tool
async def search_products(category: str = "全部", keyword: str = "") -> str:
    """按品类与关键词检索自营商城在售农资（名称/登记证号/防治对象模糊匹配）。
    品类可传：全部 / 水稻杀菌剂 / 稻飞虱杀虫剂 / 果树除草剂 / 增产叶面肥 / 农机维保耗材。"""
    params: dict[str, str] = {}
    if category and category != "全部":
        params["category"] = category
    if keyword:
        params["q"] = keyword
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        res = await client.get(f"{_base()}/api/products", params=params)
    if not res.is_success:
        return f"商品检索失败（HTTP {res.status_code}）"
    body = res.json()
    items = body.get("data", [])
    if not items:
        return "没有匹配的商品。可尝试更换品类或关键词（如登记证号 PD20210892）。"
    lines = [
        f"- {p['name']} | {p['spec']} | ¥{p['price']}(原价¥{p.get('originalPrice', '—')}) | "
        f"登记证 {p['licenseNo']} | 批次 {p['batchNo']} | 防治: {p['targetDisease']}"
        for p in items
    ]
    return "共 {} 款匹配商品：\n".format(len(items)) + "\n".join(lines)


@tool
async def get_product_detail(product_id: str) -> str:
    """按商品 ID 查询农资详情（用量、安全间隔期、厂家等）。ID 形如 prod-1。"""
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        res = await client.get(f"{_base()}/api/products/{product_id}")
    if res.status_code == 404:
        return "没有这个商品编号，请先用 search_products 查到 ID 再试。"
    if not res.is_success:
        return f"商品详情查询失败（HTTP {res.status_code}）"
    p = res.json()["data"]
    return (
        f"{p['name']} ({p['spec']})\n"
        f"有效成分: {p['activeIngredient']} | 毒性: {p['toxicity']} | 剂型: {p['formulation']}\n"
        f"防治对象: {p['targetDisease']}\n"
        f"亩用量: {p['dosagePerMu']} | 亩用水: {p['waterPerMu']}\n"
        f"安全间隔期: {p['safeInterval']} | 厂家: {p['manufacturer']}"
    )


@tool
async def verify_trace_code(code: str) -> str:
    """验真国家农药电子溯源码（一物一码），返回正品/疑似假劣判定与溯源链条摘要。"""
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        res = await client.post(f"{_base()}/api/trace/verify", json={"code": code.strip()})
    if res.status_code == 400:
        return "溯源码无效：请输入有效的农药电子溯源码。"
    if not res.is_success:
        return f"溯源验真服务异常（HTTP {res.status_code}）"
    data = res.json()["data"]
    head = (
        f"验真结果: {'✅ 正品' if data['isValid'] else '⛔ 疑似假劣/异常'}\n"
        f"商品: {data['productName']} | 登记证: {data['licenseNo']} | 批次: {data['batchNo']}"
    )
    if data.get("warnings"):
        return head + "\n" + "\n".join(data["warnings"])
    chain = " → ".join(step["title"] for step in data.get("chain", []))
    return head + f"\n溯源链条: {chain}"


@tool
async def get_weather() -> str:
    """查询当前监测站的农业气象与飞防适宜指数（用于判断今天适不适合打药）。"""
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        res = await client.get(f"{_base()}/api/weather")
    if not res.is_success:
        return f"气象查询失败（HTTP {res.status_code}）"
    w = res.json()["data"]
    return (
        f"{w['station']}: 气温 {w['temperature']}°C，湿度 {w['humidity']}%，"
        f"风速 {w['windSpeed']}m/s（{w['windDirection']}），降水概率 {w['precipitationChance']}%。"
        f"飞防指数: {w['droneSprayIndex']} —— {w['reason']}"
    )


@tool
async def list_bookings() -> str:
    """查询当前农户的上门服务预约列表（飞防/施用/检测等）。"""
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        res = await client.get(f"{_base()}/api/bookings")
    if not res.is_success:
        return f"预约查询失败（HTTP {res.status_code}）"
    items = res.json()["data"]
    if not items:
        return "当前没有服务预约记录。"
    lines = [
        f"- {b['id']}: {b['serviceType']} | {b['cropType']} {b['acreage']}亩 | "
        f"期望 {b['preferredDate']} {b['timeSlot']} | 状态 {b['status']}"
        for b in items
    ]
    return "共 {} 条预约：\n".format(len(items)) + "\n".join(lines)


@tool
async def create_booking(
    service_type: str,
    crop_type: str,
    acreage: float,
    preferred_date: str,
    contact_name: str,
    contact_phone: str,
    plot_address: str,
) -> str:
    """【写操作】为农户创建一条上门服务预约（飞防作业/田间诊断等）。
    service_type 可选：field_diagnosis / drone_spraying / soil_formulation / followup_inspection。
    preferred_date 格式 YYYY-MM-DD。调用前必须与用户确认关键信息。"""
    payload = {
        "serviceType": service_type,
        "cropType": crop_type,
        "acreage": acreage,
        "preferredDate": preferred_date,
        "contactName": contact_name,
        "contactPhone": contact_phone,
        "plotAddress": plot_address,
    }
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        res = await client.post(f"{_base()}/api/bookings", json=payload)
    if not res.is_success:
        return f"预约创建失败（HTTP {res.status_code}）"
    b = res.json()["data"]
    return (
        f"预约已提交（单号 {b['id']}）：{b['serviceType']} {b['cropType']} {b['acreage']}亩，"
        f"期望 {b['preferredDate']}，状态 {b['status']}。站点会尽快指派持证农艺师联系。"
    )


PLATFORM_TOOLS = [
    search_products,
    get_product_detail,
    verify_trace_code,
    get_weather,
    list_bookings,
    create_booking,
]
