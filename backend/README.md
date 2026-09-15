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
python -m pip install -r requirements-dev.txt
python -m pytest
```

Use Python 3.12, matching backend CI. In Windows Git Bash, activate a virtual
environment with `source .venv/Scripts/activate` (or `.trade_env/Scripts/activate`
if that is your existing environment).

Tests get a fresh application through `create_app()` and a function-scoped
`client` fixture. The client context runs application startup/shutdown, following
the [FastAPI lifespan testing guidance](https://fastapi.tiangolo.com/advanced/testing-events/).
Tests set their own CORS configuration and do not call a running backend,
PocketBase, or external providers. Add provider fakes when integrations arrive.

For each behavior, add a failing test, run it to confirm the expected failure,
implement the change, and run the complete suite before committing. Database
fixtures and configuration validation belong to the subsequent database/core
tasks; there is no PostgreSQL dependency in this foundation yet.

The `Backend tests` GitHub Actions workflow runs on PRs, pushes to `main`, and
manual dispatch. It installs dependencies, checks their compatibility, and runs
pytest on Python 3.12 using [GitHub's Python setup approach](https://docs.github.com/en/actions/tutorials/build-and-test-code/python).
The workflow is repository automation; backend code and dependencies remain here.

## Legacy PocketBase development

Install the version recorded in `pocketbase/.pocketbase-version` separately and
place the executable on `PATH`; its executable and local `pb_data` directory must
not be committed. The demo-data migration requires the
`TRADERATH_DEMO_USER_PASSWORD` environment variable. Never use a production
credential for local seed data.
