# Todo & Notes App

A simple full-stack application built with FastAPI, SQLite, and React.

## Features

- Todo list with add, complete, delete, filter, and drag-to-reorder
- Notes with multi-line text and edit/delete support
- Persistent tab selection between Todo and Notes
- Local SQLite database for data persistence

## Project structure

```text
todo_fastapi_react/
├── backend/
│   ├── database.py
│   └── main.py
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── TodoList.jsx
│       ├── Notes.jsx
│       ├── api.js
│       └── index.css
└── README.md
```

## Backend setup

```bash
cd todo_fastapi_react/backend
python -m pip install fastapi uvicorn sqlalchemy
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Frontend setup

```bash
cd todo_fastapi_react/frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

## Open app

Visit:

```text
http://localhost:5173
```

## Notes

- The backend uses SQLite and creates the tables automatically on startup.
- The frontend uses Vite for local development.
- The app stores the selected tab in browser localStorage.
