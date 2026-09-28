import React, { useState, useEffect } from "react";
import { api } from "./api";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const data = await api.getNotes();
    setNotes(data);
  };

  const handleAddNote = async () => {
    if (!title.trim() && !body.trim()) return;
    await api.createNote({ title: title.trim(), body });
    setTitle("");
    setBody("");
    loadNotes();
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleAddNote();
    }
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title || "");
    setEditBody(note.body || "");
  };

  const handleSaveEdit = async (id) => {
    await api.updateNote(id, { title: editTitle, body: editBody });
    setEditingId(null);
    loadNotes();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await api.deleteNote(id);
      loadNotes();
    }
  };

  const formatTimestamp = (dateStr) => {
    const d = new Date(dateStr);
    const date = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date}, ${time}`;
  };

  return (
    <div className="notes-box">
      <div className="new-note-card">
        <input
          type="text"
          placeholder="Write a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="note-title-input"
        />
        <textarea
          placeholder="Write a note..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          className="note-body-textarea"
          rows={3}
        />
        <div className="note-actions">
          <button onClick={handleAddNote} className="btn-primary">
            Add note
          </button>
        </div>
      </div>

      <div className="notes-list">
        {notes.map((note) => (
          <div key={note.id} className="note-card">
            {editingId === note.id ? (
              <div className="edit-note-form">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="note-title-input"
                />
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="note-body-textarea"
                  rows={4}
                />
                <div className="edit-btn-row">
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(note.id)}
                    className="btn-primary"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                {note.title && <h3 className="note-title">{note.title}</h3>}
                {note.body && <p className="note-body">{note.body}</p>}

                <div className="note-meta-row">
                  <span className="note-time">
                    {formatTimestamp(note.created_at)}
                    {note.is_edited &&
                      ` · Edited ${new Date(note.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                  </span>
                  <div className="note-card-actions">
                    <button
                      onClick={() => startEdit(note)}
                      className="link-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="link-btn danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
