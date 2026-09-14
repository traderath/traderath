# TradeRath

TradeRath is an AI-powered trade operating platform designed to help exporters manage export operations from order to payment.

This repository contains the TradeRath web application and backend services in a single codebase.

## Repository Structure

traderath/
├── frontend/     # TradeRath web application
├── backend/      # FastAPI backend and business services
├── docs/         # Technical and product documentation
├── LICENSE
└── README.md

## Frontend

The `frontend/` directory contains the public TradeRath website and user-facing application.

The frontend is designed to be deployable independently from the backend.

See `frontend/README.md` for development and deployment instructions.

## Backend

The `backend/` directory contains the TradeRath API and server-side application.

Planned backend stack:

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- PostgreSQL
- Alembic

Additional infrastructure such as Redis, background workers, object storage, and AI services will be introduced as required.

See `backend/README.md` for backend setup instructions.

## Architecture

Frontend and backend are maintained in the same repository but can be developed and deployed independently.

Frontend
    |
    | HTTPS / REST API
    v
FastAPI Backend
    |
    v
PostgreSQL

Production deployments may use separate services and domains, for example:

traderath.com
api.traderath.com

## Development Status

TradeRath is currently under active development.

Current focus:

- Public website and frontend
- Backend API foundation
- Authentication and users
- Export order management
- Document management
- Trade compliance workflows
- Shipment tracking
- Payments and realization
- AI-assisted trade operations

## Security

Do not commit credentials, API keys, database passwords, private certificates, or production environment files to this repository.

Use `.env` files locally and keep only `.env.example` under version control.

## License

Copyright © TradeRath. All rights reserved.
