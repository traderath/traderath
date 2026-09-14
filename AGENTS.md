# TradeRath Development Instructions

## Repository Structure

This repository is a monorepo containing the TradeRath frontend and backend.

- `frontend/` contains all frontend code.
- `backend/` contains all FastAPI/backend code.
- `docs/` contains project documentation.

Do not create application source code at the repository root.

## Frontend

Keep all frontend source code, assets, dependencies, build configuration,
and frontend-specific environment configuration inside `frontend/`.

Do not modify the frontend architecture unless required by the task.

## Backend

The backend uses Python and FastAPI.

Keep:

- application code in `backend/app/`
- tests in `backend/tests/`
- Python dependencies in `backend/`
- database migrations in `backend/`

Do not place Python application files at the repository root.

## Security

Never commit secrets, API keys, passwords, tokens, private certificates,
database credentials, or production `.env` files.

## Engineering Approach

Prefer simple, maintainable solutions.

Do not introduce microservices, Kubernetes, Kafka, Redis, Celery,
or additional infrastructure unless the task specifically requires it.

Before creating a new directory or major dependency, check whether the
functionality belongs in the existing frontend or backend structure.
