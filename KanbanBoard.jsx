import { useState, useRef } from "react";

// ─── Styles ────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');

  .kb-root {
    min-height: 100vh;
    background: #0f0f11;
    color: #e8e4dc;
    font-family: 'DM Sans', sans-serif;
    padding: 32px;
    box-sizing: border-box;
  }

  .kb-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 36px;
    border-bottom: 1px solid #2a2a2e;
    padding-bottom: 20px;
  }

  .kb-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem;
    color: #e8e4dc;
    letter-spacing: -0.5px;
    margin: 0;
  }

  .kb-title span {
    color: #e8b84b;
  }

  .kb-subtitle {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    color: #555;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-top: 4px;
  }

  .kb-add-btn {
    background: #e8b84b;
    color: #0f0f11;
    border: none;
    padding: 9px 20px;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: opacity 0.15s;
    letter-spacing: 0.02em;
  }
  .kb-add-btn:hover { opacity: 0.85; }

  .kb-board {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    align-items: start;
  }

  @media (max-width: 900px) {
    .kb-board { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 540px) {
    .kb-board { grid-template-columns: 1fr; }
    .kb-root { padding: 16px; }
  }

  .kb-col {
    background: #16161a;
    border: 1px solid #222226;
    border-radius: 10px;
    padding: 16px;
    min-height: 200px;
    transition: border-color 0.15s, background 0.15s;
  }
  .kb-col.drag-over {
    border-color: #e8b84b;
    background: #1a1a10;
  }

  .kb-col-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .kb-col-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #888;
  }

  .kb-col-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .kb-col-count {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    color: #444;
    background: #1e1e22;
    border-radius: 20px;
    padding: 1px 8px;
  }

  .kb-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .kb-card {
    background: #1e1e24;
    border: 1px solid #2a2a30;
    border-radius: 8px;
    padding: 12px 14px;
    cursor: grab;
    transition: border-color 0.15s, transform 0.1s, box-shadow 0.15s;
    position: relative;
    user-select: none;
  }
  .kb-card:hover {
    border-color: #3a3a44;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    transform: translateY(-1px);
  }
  .kb-card.dragging {
    opacity: 0.4;
    cursor: grabbing;
  }

  .kb-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }

  .kb-card-title {
    font-size: 0.88rem;
    font-weight: 500;
    color: #ddd;
    line-height: 1.4;
    flex: 1;
  }

  .kb-card-delete {
    background: none;
    border: none;
    color: #444;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    padding: 0;
    transition: color 0.12s;
    flex-shrink: 0;
    margin-top: -1px;
  }
  .kb-card-delete:hover { color: #e05a5a; }

  .kb-card-desc {
    font-size: 0.77rem;
    color: #666;
    line-height: 1.5;
    margin-bottom: 10px;
  }

  .kb-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    flex-wrap: wrap;
  }

  .kb-priority {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 2px 7px;
    border-radius: 4px;
  }
  .kb-priority-high   { background: #3d1a1a; color: #e05a5a; }
  .kb-priority-medium { background: #2e2610; color: #e8b84b; }
  .kb-priority-low    { background: #112918; color: #4caf7d; }

  .kb-card-date {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    color: #444;
  }

  .kb-col-add {
    margin-top: 10px;
    width: 100%;
    background: none;
    border: 1px dashed #2a2a30;
    border-radius: 6px;
    color: #444;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    padding: 8px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
    letter-spacing: 0.02em;
  }
  .kb-col-add:hover { border-color: #e8b84b; color: #e8b84b; }

  /* Modal */
  .kb-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 16px;
  }

  .kb-modal {
    background: #16161a;
    border: 1px solid #2a2a30;
    border-radius: 12px;
    padding: 28px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.6);
  }

  .kb-modal-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.3rem;
    margin: 0 0 20px 0;
    color: #e8e4dc;
  }

  .kb-field {
    margin-bottom: 14px;
  }

  .kb-label {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #666;
    margin-bottom: 6px;
  }

  .kb-input, .kb-textarea, .kb-select {
    width: 100%;
    background: #0f0f11;
    border: 1px solid #2a2a30;
    border-radius: 6px;
    color: #e8e4dc;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    padding: 9px 12px;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.15s;
  }
  .kb-input:focus, .kb-textarea:focus, .kb-select:focus {
    border-color: #e8b84b;
  }
  .kb-textarea { resize: vertical; min-height: 72px; }
  .kb-select option { background: #16161a; }

  .kb-modal-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .kb-modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 22px;
    justify-content: flex-end;
  }

  .kb-btn-cancel {
    background: none;
    border: 1px solid #2a2a30;
    color: #888;
    padding: 8px 18px;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .kb-btn-cancel:hover { border-color: #555; color: #bbb; }

  .kb-btn-submit {
    background: #e8b84b;
    color: #0f0f11;
    border: none;
    padding: 8px 20px;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .kb-btn-submit:hover { opacity: 0.85; }

  .kb-empty {
    text-align: center;
    color: #333;
    font-size: 0.78rem;
    padding: 24px 0;
    font-family: 'DM Mono', monospace;
  }
`;

// ─── Constants ──────────────────────────────────────────────────────────────
const COLUMNS = [
  { id: "todo",       label: "To Do",      color: "#5a7de8" },
  { id: "inprogress", label: "In Progress", color: "#e8b84b" },
  { id: "review",     label: "Review",      color: "#b05ae0" },
  { id: "done",       label: "Done",        color: "#4caf7d" },
];

const PRIORITIES = ["high", "medium", "low"];

const INITIAL_TASKS = [
  { id: "t1", title: "Set up project repo", description: "Initialize Git and configure GitHub Actions.", priority: "high",   colId: "done",       date: "Mar 10" },
  { id: "t2", title: "Design Kanban layout", description: "Wire up column structure and card UI.", priority: "medium", colId: "done",       date: "Mar 14" },
  { id: "t3", title: "Implement drag & drop", description: "HTML5 drag events across columns.", priority: "high",   colId: "inprogress", date: "Mar 22" },
  { id: "t4", title: "Add task modal", description: "Form for creating new cards with priority.", priority: "medium", colId: "inprogress", date: "Mar 24" },
  { id: "t5", title: "Academic status logic", description: "Map task states to academic deadlines.", priority: "low",    colId: "todo",       date: "Mar 30" },
  { id: "t6", title: "Visual progress bars", description: "Per-column completion metrics.", priority: "low",    colId: "todo",       date: "Apr 4"  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
let nextId = 100;
const uid = () => `t${++nextId}`;
const today = () => {
  const d = new Date();
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ─── KanbanBoard Component ──────────────────────────────────────────────────
export default function KanbanBoard() {
  const [tasks,       setTasks]       = useState(INITIAL_TASKS);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [defaultCol,  setDefaultCol]  = useState("todo");
  const [dragId,      setDragId]      = useState(null);
  const [overCol,     setOverCol]     = useState(null);

  // ── form state ──
  const emptyForm = { title: "", description: "", priority: "medium", colId: "todo", date: "" };
  const [form, setForm] = useState(emptyForm);

  const styleInjected = useRef(false);
  if (!styleInjected.current) {
    styleInjected.current = true;
    if (typeof document !== "undefined") {
      const tag = document.createElement("style");
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }

  // ── derived ──
  const tasksByCol = (colId) => tasks.filter((t) => t.colId === colId);

  // ── modal helpers ──
  const openModal = (colId = "todo") => {
    setDefaultCol(colId);
    setForm({ ...emptyForm, colId, date: today() });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    setTasks((prev) => [...prev, { ...form, id: uid(), title: form.title.trim() }]);
    closeModal();
  };

  // ── drag helpers ──
  const onDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e, colId) => {
    e.preventDefault();
    setOverCol(colId);
  };

  const onDrop = (e, colId) => {
    e.preventDefault();
    if (dragId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === dragId ? { ...t, colId } : t))
      );
    }
    setDragId(null);
    setOverCol(null);
  };

  const onDragEnd = () => {
    setDragId(null);
    setOverCol(null);
  };

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  // ── render ──
  return (
    <div className="kb-root">
      {/* Header */}
      <div className="kb-header">
        <div>
          <h1 className="kb-title">Task<span>LU</span> Board</h1>
          <p className="kb-subtitle">Kanban · {tasks.length} tasks</p>
        </div>
        <button className="kb-add-btn" onClick={() => openModal("todo")}>
          + New Task
        </button>
      </div>

      {/* Board */}
      <div className="kb-board">
        {COLUMNS.map((col) => {
          const colTasks = tasksByCol(col.id);
          return (
            <div
              key={col.id}
              className={`kb-col${overCol === col.id ? " drag-over" : ""}`}
              onDragOver={(e) => onDragOver(e, col.id)}
              onDrop={(e) => onDrop(e, col.id)}
            >
              {/* Column header */}
              <div className="kb-col-header">
                <span className="kb-col-label">
                  <span className="kb-col-dot" style={{ background: col.color }} />
                  {col.label}
                </span>
                <span className="kb-col-count">{colTasks.length}</span>
              </div>

              {/* Cards */}
              <div className="kb-cards">
                {colTasks.length === 0 && (
                  <div className="kb-empty">empty</div>
                )}
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`kb-card${dragId === task.id ? " dragging" : ""}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, task.id)}
                    onDragEnd={onDragEnd}
                  >
                    <div className="kb-card-top">
                      <span className="kb-card-title">{task.title}</span>
                      <button
                        className="kb-card-delete"
                        onClick={() => deleteTask(task.id)}
                        title="Delete task"
                      >
                        ×
                      </button>
                    </div>
                    {task.description && (
                      <p className="kb-card-desc">{task.description}</p>
                    )}
                    <div className="kb-card-footer">
                      <span className={`kb-priority kb-priority-${task.priority}`}>
                        {task.priority}
                      </span>
                      {task.date && (
                        <span className="kb-card-date">{task.date}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick add per column */}
              <button className="kb-col-add" onClick={() => openModal(col.id)}>
                + add task
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="kb-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="kb-modal">
            <h2 className="kb-modal-title">New Task</h2>

            <div className="kb-field">
              <label className="kb-label">Title *</label>
              <input
                className="kb-input"
                placeholder="What needs to be done?"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <div className="kb-field">
              <label className="kb-label">Description</label>
              <textarea
                className="kb-textarea"
                placeholder="Optional details..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="kb-modal-row">
              <div className="kb-field">
                <label className="kb-label">Column</label>
                <select
                  className="kb-select"
                  value={form.colId}
                  onChange={(e) => setForm({ ...form, colId: e.target.value })}
                >
                  {COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="kb-field">
                <label className="kb-label">Priority</label>
                <select
                  className="kb-select"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="kb-field">
              <label className="kb-label">Due Date</label>
              <input
                className="kb-input"
                placeholder="e.g. Apr 15"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="kb-modal-actions">
              <button className="kb-btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="kb-btn-submit" onClick={handleSubmit}>Create Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
