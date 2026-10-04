"""服务配置（环境变量注入；不提交真实密钥——红线 R10）。"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # ---- 服务 ----
    service_name: str = "华农智服 · AI 智能代理层"
    service_version: str = "0.1.0"
    host: str = "0.0.0.0"
    port: int = 8100

    # ---- LLM（OpenAI 兼容协议；可指向豆包/智谱/通义等国内网关）----
    llm_api_key: str = ""  # 未配置时智能代理端点返回 503，不做任何"假装成功"的降级
    llm_base_url: str = "https://api.openai.com/v1"
    llm_model: str = "gpt-4o-mini"
    llm_temperature: float = 0.3

    # ---- 平台统一后端（NestJS，智能代理的工具数据源）----
    platform_api_base_url: str = "http://127.0.0.1:3000"
    platform_timeout_seconds: float = 10.0

    @property
    def llm_configured(self) -> bool:
        return bool(self.llm_api_key.strip())


settings = Settings()
