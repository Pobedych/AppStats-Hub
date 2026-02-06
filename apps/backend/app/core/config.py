from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    ai_url: str = "http://ai:8001"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
