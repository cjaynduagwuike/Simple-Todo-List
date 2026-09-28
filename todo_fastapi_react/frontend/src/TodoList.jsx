import React, { useState, useEffect } from "react";
import { api } from "./api";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [draggedIdx, setDraggedIdx] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    const data = await api.getTodos();
    setTodos(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await api.createTodo(text.trim());
    setText("");
    loadTodos();
  };

  const handleToggle = async (todo) => {
    await api.updateTodo(todo.id, { completed: !todo.completed });
    loadTodos();
  };

  const handleDoubleClick = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = async (id) => {
    if (editText.trim()) {
      await api.updateTodo(id, { text: editText.trim() });
    }
    setEditingId(null);
    loadTodos();
  };

  const handleDelete = async (id) => {
    await api.deleteTodo(id);
    loadTodos();
  };

  const handleClearCompleted = async () => {
    await api.clearCompleted();
    loadTodos();
  };

  // Drag and drop handlers
  const handleDragStart = (idx) => setDraggedIdx(idx);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = async (dropIdx) => {
    if (draggedIdx === null || draggedIdx === dropIdx) return;
    const reordered = [...todos];
    const [moved] = reordered.splice(draggedIdx, 1);
    reordered.splice(dropIdx, 0, moved);
    setTodos(reordered);
    setDraggedIdx(null);
    await api.reorderTodos(reordered.map((t) => t.id));
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="todo-box">
      <h2 className="title">Todo List</h2>

      <form onSubmit={handleAdd} className="todo-input-row">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="todo-input"
        />
        <button type="submit" className="btn-primary">
          Add
        </button>
      </form>

      <ul className="todo-list">
        {filtered.map((todo, idx) => (
          <li
            key={todo.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(idx)}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo)}
            />
            {editingId === todo.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => handleSaveEdit(todo.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(todo.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                autoFocus
                className="edit-input"
              />
            ) : (
              <span
                onDoubleClick={() => handleDoubleClick(todo)}
                className="todo-text"
              >
                {todo.text}
              </span>
            )}
            <button
              onClick={() => handleDelete(todo.id)}
              className="delete-btn"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <footer className="todo-footer">
        <span>
          {activeCount} {activeCount === 1 ? "item" : "items"} left
        </span>
        <div className="filters">
          <button
            className={filter === "all" ? "selected" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "active" ? "selected" : ""}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={filter === "completed" ? "selected" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>
        {todos.some((t) => t.completed) && (
          <button onClick={handleClearCompleted} className="clear-btn">
            Clear completed
          </button>
        )}
      </footer>
      <p className="hint">Drag to reorder · double-click to edit</p>
    </div>
  );
}
