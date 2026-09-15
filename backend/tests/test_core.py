import json
import logging

import pytest
from fastapi.testclient import TestClient

from app.main import create_app
from app.core.config import Settings


@pytest.mark.parametrize("values", [
    {"environment": "invalid"},
    {"cors_origins": ["*"]},
    {"cors_origins": ["https://example.test/path"]},
    {"environment": "production", "cors_origins": ["http://example.test"]},
])
def test_invalid_settings(values):
    with pytest.raises(ValueError):
        Settings(**values)


def test_versioned_health(client):
    assert client.get("/api/v1/health").json() == {"status": "ok"}


def test_error_and_request_id(client):
    response = client.get("/missing", headers={"X-Request-ID": "untrusted"})
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "NOT_FOUND"
    assert response.json()["error"]["request_id"] == response.headers["x-request-id"]
    assert response.headers["x-request-id"] != "untrusted"


def test_validation_does_not_echo_input(app):
    @app.get("/number")
    def number(value: int):
        return value

    with TestClient(app) as client:
        response = client.get("/number?value=private-token")
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "VALIDATION_ERROR"
    assert "private-token" not in response.text


def test_internal_error_has_cors_and_safe_log(app, caplog):
    @app.get("/broken/{secret}")
    def broken(secret: str):
        raise RuntimeError("private-exception")

    with caplog.at_level(logging.INFO, logger="traderath.access"):
        with TestClient(app, raise_server_exceptions=False) as client:
            response = client.get("/broken/private-path?token=private-query", headers={
                "Origin": "http://localhost:3000", "Authorization": "Bearer private-auth",
            })
    assert response.status_code == 500
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
    assert response.json()["error"]["request_id"] == response.headers["x-request-id"]
    records = [json.loads(r.message) for r in caplog.records if r.name == "traderath.access"]
    assert records[-1]["status"] == 500
    assert records[-1]["route"] == "/broken/{secret}"
    assert "private-" not in response.text + caplog.text


def test_explicit_settings_override_environment(monkeypatch):
    monkeypatch.setenv("CORS_ORIGINS", "https://other.test")
    with TestClient(create_app(Settings(cors_origins=["https://chosen.test"]))) as client:
        response = client.get("/health", headers={"Origin": "https://chosen.test"})
    assert response.headers["access-control-allow-origin"] == "https://chosen.test"


def test_logging_configuration_excludes_raw_access_logs():
    from pathlib import Path

    config = json.loads((Path(__file__).parents[1] / "logging.json").read_text())
    assert config["loggers"]["uvicorn.access"]["handlers"] == []
    assert config["loggers"]["traderath.access"]["level"] == "INFO"


def test_error_preserves_authentication_challenge(app):
    from fastapi import HTTPException

    @app.get("/auth-required")
    def auth_required():
        raise HTTPException(401, detail="private-detail", headers={"WWW-Authenticate": "Bearer"})

    with TestClient(app) as client:
        response = client.get("/auth-required")
    assert response.status_code == 401
    assert response.headers["www-authenticate"] == "Bearer"
    assert response.json()["error"]["code"] == "UNAUTHENTICATED"
    assert "private-detail" not in response.text
