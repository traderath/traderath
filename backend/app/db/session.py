from collections.abc import Iterator

from fastapi import HTTPException, Request
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker


class Database:
    def __init__(self, url: str):
        self.engine = create_engine(
            url, pool_pre_ping=True, pool_size=5, max_overflow=5, pool_timeout=5,
            hide_parameters=True,
            connect_args={"connect_timeout": 3, "options": "-c timezone=UTC -c statement_timeout=5000"},
        )
        self.sessions = sessionmaker(self.engine, expire_on_commit=False)

    def close(self) -> None:
        self.engine.dispose()


def get_session(request: Request) -> Iterator[Session]:
    database = request.app.state.database
    if database is None:
        raise HTTPException(503)
    # Services explicitly commit using `with session.begin()`; closing rolls back
    # any unfinished transaction, including when a request raises an exception.
    with database.sessions() as session:
        yield session
