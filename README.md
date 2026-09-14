# Traderath

Traderath is organized as two independent application areas so the user interface
and server-side code can evolve, run, and deploy separately.

## Repository structure

```text
traderath/
├── frontend/     # Browser or client-side application
├── backend/      # API, business logic, and data access
├── LICENSE
└── README.md
```

- [`frontend/`](frontend/README.md) contains the user-facing application.
- [`backend/`](backend/README.md) contains APIs and server-side services.

Each area has its own README for framework-specific setup and commands. Add its
dependency manifest, source code, tests, and local configuration within that
folder rather than mixing frontend and backend concerns at the repository root.

## Getting started

The technology stack has intentionally not been selected yet. Choose the desired
frontend and backend frameworks, then document their installation and startup
commands in the corresponding README files.
