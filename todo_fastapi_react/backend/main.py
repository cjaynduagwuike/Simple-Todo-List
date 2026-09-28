import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

import database

database.init_db()
app = FastAPI(title="Todo & Notes App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Schemas
class TodoCreate(BaseModel):
    text: str

class TodoUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None

class TodoReorder(BaseModel):
    ids: List[int]

class TodoOut(BaseModel):
    id: int
    text: str
    completed: bool
    order_index: int
    created_at: datetime.datetime
    class Config:
        orm_mode = True

class NoteCreate(BaseModel):
    title: Optional[str] = ""
    body: Optional[str] = ""

class NoteUpdate(BaseModel):
    title: Optional[str] = ""
    body: Optional[str] = ""

class NoteOut(BaseModel):
    id: int
    title: Optional[str]
    body: Optional[str]
    created_at: datetime.datetime
    updated_at: datetime.datetime
    is_edited: bool
    class Config:
        orm_mode = True

# --- TODO ROUTES ---
@app.get("/api/todos", response_model=List[TodoOut])
def get_todos(db: Session = Depends(get_db)):
    return db.query(database.Todo).order_by(database.Todo.order_index.asc()).all()

@app.post("/api/todos", response_model=TodoOut)
def create_todo(payload: TodoCreate, db: Session = Depends(get_db)):
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    max_order = db.query(func.max(database.Todo.order_index)).scalar() or 0
    todo = database.Todo(text=payload.text.strip(), order_index=max_order + 1)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo

@app.put("/api/todos/reorder")
def reorder_todos(payload: TodoReorder, db: Session = Depends(get_db)):
    for index, todo_id in enumerate(payload.ids):
        db.query(database.Todo).filter(database.Todo.id == todo_id).update({"order_index": index})
    db.commit()
    return {"status": "ok"}

@app.put("/api/todos/{todo_id}", response_model=TodoOut)
def update_todo(todo_id: int, payload: TodoUpdate, db: Session = Depends(get_db)):
    todo = db.query(database.Todo).filter(database.Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    if payload.text is not None:
        todo.text = payload.text.strip()
    if payload.completed is not None:
        todo.completed = payload.completed
    db.commit()
    db.refresh(todo)
    return todo

@app.delete("/api/todos/completed")
def clear_completed_todos(db: Session = Depends(get_db)):
    db.query(database.Todo).filter(database.Todo.completed == True).delete()
    db.commit()
    return {"status": "ok"}

@app.delete("/api/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(database.Todo).filter(database.Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(todo)
    db.commit()
    return {"status": "ok"}

# --- NOTES ROUTES ---
@app.get("/api/notes", response_model=List[NoteOut])
def get_notes(db: Session = Depends(get_db)):
    return db.query(database.Note).order_by(database.Note.updated_at.desc()).all()

@app.post("/api/notes", response_model=NoteOut)
def create_note(payload: NoteCreate, db: Session = Depends(get_db)):
    title_clean = (payload.title or "").strip()
    body_clean = (payload.body or "").strip()
    if not title_clean and not body_clean:
        raise HTTPException(status_code=400, detail="Note must have a title or body")
    note = database.Note(title=title_clean, body=payload.body or "")
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@app.put("/api/notes/{note_id}", response_model=NoteOut)
def update_note(note_id: int, payload: NoteUpdate, db: Session = Depends(get_db)):
    note = db.query(database.Note).filter(database.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note.title = (payload.title or "").strip()
    note.body = payload.body or ""
    note.is_edited = True
    note.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(note)
    return note

@app.delete("/api/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(database.Note).filter(database.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"status": "ok"}
