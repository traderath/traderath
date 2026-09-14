# TradeRath

TradeRath is organized as an independently runnable React frontend and FastAPI
backend.

```text
frontend/             React and Vite application
backend/app/           FastAPI application
backend/tests/         Backend tests
backend/pocketbase/    Temporary legacy data-service compatibility files
docs/                  Project documentation
```

## Frontend

```bash
cd frontend
npm ci
cp .env.example .env.local
npm run dev
```

## Backend

```bash
cd backend
python -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000
```

Run backend tests with `pytest` from `backend/`. See the component README files
for configuration details.

## Security

Never commit `.env` files, credentials, database files, application runtime
state, downloaded executables, or private certificates. Keep required variable
names and safe development defaults in `.env.example` files.
