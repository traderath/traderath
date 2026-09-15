"""FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI, Request
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException

from app.core.config import Settings
from app.core.http import RequestContextMiddleware, error_response
from app.db.session import Database

def health_check() -> dict[str, str]:
    """Report whether the API process is available."""
    return {"status": "ok"}


def create_app(settings: Settings | None = None) -> FastAPI:
    """Build an independent application, reading configuration at creation."""
    settings = settings or Settings.from_environment()
    @asynccontextmanager
    async def lifespan(application: FastAPI):
        database = Database(settings.database_url.get_secret_value()) if settings.database_url else None
        application.state.database = database
        try:
            yield
        finally:
            if database is not None:
                database.close()

    application = FastAPI(title="TradeRath API", version="0.1.0", lifespan=lifespan)
    application.state.settings = settings

    @application.exception_handler(HTTPException)
    async def http_error(request: Request, exc: HTTPException):
        codes = {400: "BAD_REQUEST", 401: "UNAUTHENTICATED", 403: "FORBIDDEN",
                 404: "NOT_FOUND", 405: "METHOD_NOT_ALLOWED", 409: "CONFLICT",
                 429: "RATE_LIMITED"}
        return error_response(request, exc.status_code,
                              codes.get(exc.status_code, "HTTP_ERROR"),
                              "Request could not be completed.", exc.headers)

    @application.exception_handler(RequestValidationError)
    async def validation_error(request: Request, exc: RequestValidationError):
        return error_response(request, 422, "VALIDATION_ERROR", "Invalid request input.")

    # CORS wraps error handling so failures remain readable by browser clients.
    application.add_middleware(RequestContextMiddleware)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID"],
    )
    application.add_api_route("/health", health_check, tags=["system"])

    @application.get("/health/ready", tags=["system"])
    def readiness(request: Request):
        database = request.app.state.database
        try:
            if database is None:
                raise RuntimeError("Database not configured")
            with database.engine.connect() as connection:
                connection.execute(text("SELECT 1"))
        except (SQLAlchemyError, RuntimeError):
            return error_response(request, 503, "DATABASE_UNAVAILABLE", "Database is unavailable.")
        return {"status": "ok"}
    router = APIRouter(prefix="/api/v1")
    router.add_api_route("/health", health_check, tags=["system"])
    application.include_router(router)
    return application


app = create_app()
