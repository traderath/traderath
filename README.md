## Repository Structure

TradeRath uses a monorepo structure. Frontend and backend code must remain separated into their respective directories.

```text
traderath/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── docs/
│
├── .gitignore
├── LICENSE
└── README.md
```

### Repository Organization Rules

When adding or modifying code, follow these rules:

1. All frontend application code must remain inside `frontend/`.
2. All FastAPI backend code must remain inside `backend/`.
3. Do not place frontend or backend dependency files in the repository root.
4. Frontend dependencies such as `package.json` and `package-lock.json` belong inside `frontend/`.
5. Python dependencies and backend configuration belong inside `backend/`.
6. Backend application source code belongs inside `backend/app/`.
7. Backend tests belong inside `backend/tests/`.
8. Project-wide technical documentation belongs inside `docs/`.
9. Never commit `.env`, API keys, passwords, credentials, tokens, certificates, or other secrets.
10. Keep `.env.example` updated with required environment variable names, but never include real secret values.
11. Frontend and backend must be independently runnable and deployable.
12. Do not introduce additional root-level application folders unless the architecture explicitly requires them.

### Current Technology Direction

**Frontend**
- Existing TradeRath web application
- Independently deployable to the frontend hosting environment

**Backend**
- Python
- FastAPI
- Pydantic
- SQLAlchemy
- PostgreSQL
- Alembic

Additional infrastructure such as Redis, background workers, object storage, and AI services should only be introduced when required.

### Development Principle

Keep the architecture simple during the initial development stage.

Do not introduce microservices, Kubernetes, Kafka, multiple databases, or unnecessary infrastructure unless there is a clear product requirement.

The current architecture should remain:

```text
Frontend
    │
    │ HTTPS / REST
    ▼
FastAPI Backend
    │
    ▼
PostgreSQL
```
