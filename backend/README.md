# TradeRath Backend

The primary backend is a FastAPI application. The `pocketbase/` directory is a
temporary compatibility layer for the existing frontend data model; do not add
new product functionality there. New API code belongs in `app/` and tests belong
in `tests/`.

## Setup

```bash
python -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000
```

## Test

```bash
pytest
```

## Legacy PocketBase development

Install the version recorded in `pocketbase/.pocketbase-version` separately and
place the executable on `PATH`; its executable and local `pb_data` directory must
not be committed. The demo-data migration requires the
`TRADERATH_DEMO_USER_PASSWORD` environment variable. Never use a production
credential for local seed data.
