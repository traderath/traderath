import os
from typing import Literal
from urllib.parse import urlsplit

from pydantic import BaseModel, Field, model_validator


class Settings(BaseModel):
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
        return cls(environment=os.getenv("APP_ENV", "development"), cors_origins=[
            value.strip() for value in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
            if value.strip()])
