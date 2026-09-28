const BASE = "https://simple-todo-list-ztoa.onrender.com/api";

export const api = {
  // Todos
  getTodos: () => fetch(`${BASE}/todos`).then((r) => r.json()),
  createTodo: (text) =>
    fetch(`${BASE}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).then((r) => r.json()),
  updateTodo: (id, updates) =>
    fetch(`${BASE}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).then((r) => r.json()),
  deleteTodo: (id) => fetch(`${BASE}/todos/${id}`, { method: "DELETE" }),
  reorderTodos: (ids) =>
    fetch(`${BASE}/todos/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    }),
  clearCompleted: () => fetch(`${BASE}/todos/completed`, { method: "DELETE" }),

  // Notes
  getNotes: () => fetch(`${BASE}/notes`).then((r) => r.json()),
  createNote: (note) =>
    fetch(`${BASE}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    }).then((r) => r.json()),
  updateNote: (id, updates) =>
    fetch(`${BASE}/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).then((r) => r.json()),
  deleteNote: (id) => fetch(`${BASE}/notes/${id}`, { method: "DELETE" }),
};
