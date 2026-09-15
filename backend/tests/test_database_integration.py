import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from uuid import uuid4

import pytest
from alembic import command
from alembic.config import Config
from alembic.autogenerate import compare_metadata
from alembic.migration import MigrationContext
from sqlalchemy import inspect, select, text
from sqlalchemy.engine import make_url
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.models import Base, User, Organization, Membership, AuthSession
from app.db.session import Database

pytestmark = pytest.mark.integration


@pytest.fixture
def database():
    url = os.getenv("TEST_DATABASE_URL")
    if not url:
        if os.getenv("CI"):
            pytest.fail("CI requires TEST_DATABASE_URL")
        pytest.skip("Set TEST_DATABASE_URL to a dedicated PostgreSQL database ending in _test")
    parsed = make_url(url)
    if parsed.drivername != "postgresql+psycopg" or not (parsed.database or "").endswith("_test"):
        pytest.fail("Integration database must use psycopg and its name must end in _test")
    # Each test owns a random schema. Never delete existing application tables.
    db = Database(url)
    schema = "test_" + uuid4().hex
    with db.engine.connect() as connection:
        connection.execute(text(f'CREATE SCHEMA "{schema}"'))
        connection.execute(text(f'SET search_path TO "{schema}"'))
        connection.commit()
        config = Config(str(Path(__file__).parents[1] / "alembic.ini"))
        config.attributes["connection"] = connection
        try:
            command.upgrade(config, "head")
            connection.commit()
            yield connection, config
        finally:
            connection.rollback()
            connection.execute(text("SET search_path TO public"))
            connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
            connection.commit()
    db.close()


def test_migration_roundtrip_and_schema_matches_models(database):
    connection, config = database
    assert set(inspect(connection).get_table_names()) == {
        "users", "organizations", "memberships", "sessions", "alembic_version"}
    assert compare_metadata(MigrationContext.configure(connection), Base.metadata) == []
    connection.commit()
    command.downgrade(config, "base")
    assert inspect(connection).get_table_names() == ["alembic_version"]
    connection.commit()
    command.upgrade(config, "head")
    assert "users" in inspect(connection).get_table_names()


def test_case_insensitive_email_and_rollback(database):
    connection, _ = database
    with Session(connection) as session:
        with session.begin():
            session.add(User(email="User@example.test", password_hash="test-hash"))
        with pytest.raises(IntegrityError), session.begin():
            session.add(User(email="user@example.test", password_hash="test-hash"))
        assert len(session.scalars(select(User)).all()) == 1


def test_membership_foreign_keys_roles_and_uniqueness(database):
    connection, _ = database
    with Session(connection, expire_on_commit=False) as session:
        with session.begin():
            user = User(email="member@example.test", password_hash="test-hash")
            org = Organization(name="Test")
            session.add_all([user, org])
        for user_id, role in [(uuid4(), "viewer"), (user.id, "superuser")]:
            with pytest.raises(IntegrityError), session.begin():
                session.add(Membership(organization_id=org.id, user_id=user_id, role=role))
        with session.begin():
            session.add(Membership(organization_id=org.id, user_id=user.id, role="owner"))
        with pytest.raises(IntegrityError), session.begin():
            session.add(Membership(organization_id=org.id, user_id=user.id, role="viewer"))


def test_session_token_uniqueness_and_expiry(database):
    connection, _ = database
    with Session(connection, expire_on_commit=False) as session:
        with session.begin():
            user = User(email="session@example.test", password_hash="test-hash")
            session.add(user)
        future = datetime.now(timezone.utc) + timedelta(days=1)
        with session.begin():
            session.add(AuthSession(user_id=user.id, token_hash="a" * 64, expires_at=future))
        for token, expiry in [("a" * 64, future), ("b" * 64, future - timedelta(days=2))]:
            with pytest.raises(IntegrityError), session.begin():
                session.add(AuthSession(user_id=user.id, token_hash=token, expires_at=expiry))


def test_failed_request_rolls_back_uncommitted_write(database):
    from types import SimpleNamespace
    from fastapi import Depends
    from fastapi.testclient import TestClient
    from sqlalchemy.orm import sessionmaker
    from app.core.config import Settings
    from app.db.session import get_session
    from app.main import create_app

    connection, _ = database
    application = create_app(Settings())

    @application.post("/test-rollback")
    def write_then_fail(session: Session = Depends(get_session)):
        session.add(User(email="rollback@example.test", password_hash="test-hash"))
        session.flush()
        raise RuntimeError("simulate downstream failure")

    with TestClient(application) as client:
        application.state.database = SimpleNamespace(sessions=sessionmaker(connection))
        assert client.post("/test-rollback").status_code == 500
    assert connection.scalar(select(User.id).where(User.email == "rollback@example.test")) is None


def test_ready_with_database_and_engine_disposed():
    from fastapi.testclient import TestClient
    from app.core.config import Settings
    from app.main import create_app

    url = os.getenv("TEST_DATABASE_URL")
    if not url:
        pytest.skip("Requires TEST_DATABASE_URL")
    application = create_app(Settings(database_url=url))
    with TestClient(application) as client:
        db = application.state.database
        pool = db.engine.pool
        assert client.get("/health/ready").status_code == 200
    assert db.engine.pool is not pool
