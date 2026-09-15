"""Migration connections come from DATABASE_URL, never committed credentials."""
from alembic import context

from app.core.config import Settings
from app.db.models import Base
from app.db.session import Database


def run(connection):
    context.configure(connection=connection, target_metadata=Base.metadata, compare_type=True)
    with context.begin_transaction():
        context.run_migrations()


provided = context.config.attributes.get("connection")
if provided is not None:
    run(provided)
else:
    settings = Settings.from_environment()
    if settings.database_url is None:
        raise RuntimeError("Set DATABASE_URL before running migrations")
    url = settings.database_url.get_secret_value()
    if context.is_offline_mode():
        context.configure(url=url, target_metadata=Base.metadata, literal_binds=True)
        with context.begin_transaction():
            context.run_migrations()
    else:
        database = Database(url)
        try:
            with database.engine.connect() as connection:
                run(connection)
        finally:
            database.close()
