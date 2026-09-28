# AGENTS.md

This project is a lightweight full-stack app combining:

- FastAPI backend
- SQLite database
- React frontend
- Vite build tooling

## Project overview

The backend exposes REST API endpoints for todo and note management.
The frontend consumes those endpoints and renders the UI.

## Run backend

```bash
cd todo_fastapi_react/backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Run frontend

```bash
cd todo_fastapi_react/frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

## Important notes

- Backend database file is created automatically as `app.db`.
- Frontend uses localStorage to persist the active tab.
- All API requests target `http://localhost:8000/api`.
- The app is intentionally simple and beginner-friendly.

## When editing this project

- Keep backend and frontend concerns separate.
- Maintain the API contract between frontend and backend.
- Prefer small, clear components and simple logic.
- If adding features, keep them consistent with the existing style.
