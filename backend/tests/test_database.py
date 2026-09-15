"""Database API contracts; integration tests live in test_database_integration."""
import pytest
from pydantic import ValidationError
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app


@pytest.mark.parametrize("url", ["sqlite:///test.db", "postgresql://user@localhost/db", "garbage"])
def test_database_url_requires_explicit_psycopg_driver(url):
    with pytest.raises(ValidationError):
        Settings(database_url=url)


def test_database_url_is_redacted():
    settings = Settings(database_url="postgresql+psycopg://user:private-password@localhost/db")
    assert "private-password" not in repr(settings)
    assert "private-password" not in settings.model_dump_json()


def test_invalid_database_url_is_redacted_in_validation_message():
    with pytest.raises(ValidationError) as error:
        Settings(database_url="sqlite://user:private-password@localhost/db")
    assert "private-password" not in str(error.value)


def test_readiness_without_database(client):
    assert client.get("/health").status_code == 200
    response = client.get("/health/ready")
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "DATABASE_UNAVAILABLE"


def test_readiness_handles_unreachable_database():
    settings = Settings(database_url="postgresql+psycopg://user:private-password@127.0.0.1:1/db")
    with TestClient(create_app(settings)) as client:
        response = client.get("/health/ready")
    assert response.status_code == 503
    assert "private-password" not in response.text
