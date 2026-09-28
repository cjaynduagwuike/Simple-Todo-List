import React, { useState, useEffect } from "react";
import TodoList from "./TodoList";
import Notes from "./Notes";

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("active_tab") || "todos";
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("active_tab", tab);
  };

  return (
    <div className="app-container">
      <header className="tabs-header">
        <button
          className={`tab-btn ${activeTab === "todos" ? "active" : ""}`}
          onClick={() => handleTabChange("todos")}
        >
          Todo List
        </button>
        <button
          className={`tab-btn ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => handleTabChange("notes")}
        >
          Notes
        </button>
      </header>

      <main className="tab-content">
        {activeTab === "todos" ? <TodoList /> : <Notes />}
      </main>
    </div>
  );
}
