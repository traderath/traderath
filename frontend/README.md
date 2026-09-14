# TradeRath Frontend

The frontend is a React application built with Vite.

## Setup

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The development server listens on <http://localhost:3000>. Configure
`VITE_POCKETBASE_URL` for the legacy data service while those endpoints are
migrated to the FastAPI backend.

## Checks

```bash
npm run lint
npm run build
```
