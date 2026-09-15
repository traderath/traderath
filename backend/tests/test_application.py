"""App isolation and browser configuration regression tests."""
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.main import app as production_app, create_app


def test_apps_do_not_share_state(app: FastAPI) -> None:
    def identity() -> str:
        return "original"

    app.dependency_overrides[identity] = lambda: "override"

    @app.get("/test-only")
    def test_only() -> dict[str, bool]:
        return {"test": True}

    other = create_app()
    assert identity not in other.dependency_overrides
    assert identity not in production_app.dependency_overrides
    with TestClient(app) as first, TestClient(other) as second:
        assert first.get("/test-only").status_code == 200
        assert second.get("/test-only").status_code == 404


def test_factory_reads_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("CORS_ORIGINS", " https://example.test, ,https://other.test ")
    with TestClient(create_app()) as client:
        response = client.get("/health", headers={"Origin": "https://other.test"})
    assert response.headers["access-control-allow-origin"] == "https://other.test"


@pytest.mark.parametrize("origin,allowed", [
    ("http://localhost:3000", True),
    ("https://untrusted.test", False),
])
def test_cors_preflight(client: TestClient, origin: str, allowed: bool) -> None:
    response = client.options("/health", headers={
        "Origin": origin,
        "Access-Control-Request-Method": "GET",
    })
    assert response.status_code == (200 if allowed else 400)
    if allowed:
        assert response.headers["access-control-allow-origin"] == origin
        assert response.headers["access-control-allow-credentials"] == "true"
    else:
        assert "access-control-allow-origin" not in response.headers


def test_uvicorn_entry_point() -> None:
    with TestClient(production_app) as client:
        assert client.get("/health").json() == {"status": "ok"}
