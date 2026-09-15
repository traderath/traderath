"""FastAPI application entry point."""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def health_check() -> dict[str, str]:
    """Report whether the API process is available."""
    return {"status": "ok"}


def create_app() -> FastAPI:
    """Build an independent application, reading configuration at creation."""
    application = FastAPI(title="TradeRath API", version="0.1.0")
    allowed_origins = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
        if origin.strip()
    ]
    application.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    application.add_api_route("/health", health_check, tags=["system"])
    return application


app = create_app()
