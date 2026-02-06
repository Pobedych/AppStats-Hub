from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    ai_url: str = "http://ai:8001"

    secret_key: str = "CHANGE_ME"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 дней

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
