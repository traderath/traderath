import os
from typing import Literal
from urllib.parse import urlsplit

from pydantic import BaseModel, ConfigDict, Field, SecretStr, field_validator, model_validator
from sqlalchemy.engine import make_url


class Settings(BaseModel):
    model_config = ConfigDict(hide_input_in_errors=True)
    database_url: SecretStr | None = None

    @field_validator("database_url")
    @classmethod
    def validate_database_url(cls, value):
        if value is not None:
            try:
                url = make_url(value.get_secret_value())
                if url.drivername != "postgresql+psycopg" or not url.database or not url.host:
                    raise ValueError
            except Exception:
                raise ValueError("DATABASE_URL must be a PostgreSQL psycopg URL with host and database") from None
        return value
    environment: Literal["development", "test", "production"] = "development"
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])

    @model_validator(mode="after")
    def validate_origins(self) -> "Settings":
        for origin in self.cors_origins:
            parsed = urlsplit(origin)
            if (parsed.scheme not in {"http", "https"} or not parsed.hostname
                    or parsed.username or parsed.password or parsed.path
                    or parsed.query or parsed.fragment or any(c.isspace() for c in origin)):
                raise ValueError("CORS origins must be explicit HTTP(S) origins without paths")
            parsed.port
            if self.environment == "production" and parsed.scheme != "https":
                raise ValueError("Production CORS origins must use HTTPS")
        return self

    @classmethod
    def from_environment(cls) -> "Settings":
        return cls(database_url=os.getenv("DATABASE_URL") or None,
                   environment=os.getenv("APP_ENV", "development"), cors_origins=[
            value.strip() for value in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
            if value.strip()])
