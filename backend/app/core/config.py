from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "VaultX API"
    debug: bool = True
    database_url: str = "sqlite:///./vaultx.db"

    jwt_secret_key: str = "CHANGE_THIS_IN_ENV"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()