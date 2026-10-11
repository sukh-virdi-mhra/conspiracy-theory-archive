import { useState, useEffect } from "react";
import defaultTheories from "./theories";
import {
  subscribeTheories,
  addTheoryToDb,
  updateTheoryInDb,
  deleteTheoryFromDb,
  seedDefaults,
} from "./firebase";
import "./App.css";

const PIN_COLORS = ["red", "green", "yellow", "blue", "white"];
const PAPER_STYLES = [
  "sticky-yellow",
  "sticky-pink",
  "sticky-blue",
  "index-card",
  "scrap",
  "torn",
  "sticky-green",
  "manila",
];
const ROTATIONS = [-3, 1.5, -1, 2.5, -2, 0.5, -1.5, 3, -0.5, 2];
const STRING_CONFIGS = [
  { top: "-6px", right: "18%", width: "55px", rotate: "22deg" },
  { bottom: "-5px", left: "12%", width: "40px", rotate: "-18deg" },
  { top: "30%", right: "-12px", width: "30px", rotate: "70deg" },
  null,
  { top: "-5px", left: "20%", width: "50px", rotate: "-25deg" },
  null,
];
const CATEGORIES = [
  "all",
  "government",
  "space",
  "technology",
  "history",
  "science",
  "religion",
  "sea",
  "zionist",
  "mafia",
  "deaths",
  "other",
];
const STATUSES = ["unproven", "debunked", "plausible", "confirmed"];

function getCategories(theory) {
  if (Array.isArray(theory.categories)) return theory.categories;
  return theory.category ? [theory.category] : [];
}

function PushPin({ index }) {
  return <div className={`pin ${PIN_COLORS[index % PIN_COLORS.length]}`} />;
}

function RedString({ index }) {
  const config = STRING_CONFIGS[index % STRING_CONFIGS.length];
  if (!config) return null;
  const { rotate, ...pos } = config;
  return (
    <div
      className="string"
      style={{ ...pos, transform: `rotate(${rotate})` }}
    />
  );
}

function NoteCard({ theory, index, onClick, onDelete }) {
  const paperStyle = PAPER_STYLES[index % PAPER_STYLES.length];
  const rotation = ROTATIONS[index % ROTATIONS.length];

  return (
    <div className="note" style={{ transform: `rotate(${rotation}deg)` }}>
      <PushPin index={index} />
      <RedString index={index} />
      <div className={`note-paper ${paperStyle}`} onClick={onClick}>
        <span className={`note-badge ${theory.status}`}>{theory.status}</span>
        <div className="note-category">{getCategories(theory).join(", ")}</div>
        <div className="note-title">{theory.title}</div>
        <div className="note-summary">{theory.summary}</div>
        <div className="note-date">{theory.dateAdded}</div>
      </div>
      <button
        className="delete-btn"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(theory.firebaseId);
        }}
        title="Unpin from board"
      >
        &times;
      </button>
    </div>
  );
}

function Modal({ theory, onClose, onEdit }) {
  if (!theory) return null;
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <div className="modal-stamp">Classified</div>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>{theory.title}</h2>
        <div className="note-category">{getCategories(theory).join(", ")}</div>
        <div style={{ margin: "6px 0 12px" }}>
          <span
            className={`note-badge ${theory.status}`}
            style={{ position: "static" }}
          >
            {theory.status}
          </span>
        </div>
        <div className="modal-summary">{theory.summary}</div>
        {theory.details && theory.details !== theory.summary && (
          <>
            <h3>Full Details</h3>
            <div className="details">{theory.details}</div>
          </>
        )}
        {theory.evidence?.length > 0 && (
          <>
            <h3>Key Evidence</h3>
            <ul className="evidence-list">
              {theory.evidence.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </>
        )}
        <div className="modal-meta">
          <span>Filed {theory.dateAdded}</span>
          <button className="btn-edit" onClick={() => onEdit(theory)}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function TheoryForm({ initial, onSubmit, onCancel }) {
  const editing = !!initial;
  const [title, setTitle] = useState(initial?.title || "");
  const [categories, setCategories] = useState(
    initial ? getCategories(initial) : ["government"],
  );
  const [summary, setSummary] = useState(initial?.summary || "");
  const [details, setDetails] = useState(initial?.details || "");
  const [evidence, setEvidence] = useState(
    initial?.evidence ? initial.evidence.join("\n") : "",
  );
  const [status, setStatus] = useState(initial?.status || "unproven");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !categories.length || submitting)
      return;
    setSubmitting(true);
    await onSubmit({
      title: title.trim(),
      categories,
      summary: summary.trim(),
      details: details.trim() || summary.trim(),
      evidence: evidence.trim()
        ? evidence
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
        : [],
      status,
      dateAdded: initial?.dateAdded || new Date().toISOString().split("T")[0],
    });
    setSubmitting(false);
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="modal-card add-form-card">
        <div className="modal-stamp">
          {editing ? "Edit Intel" : "New Intel"}
        </div>
        <button className="modal-close" onClick={onCancel}>
          &times;
        </button>
        <h2>{editing ? "Edit Note" : "Pin to the Board"}</h2>
        <form onSubmit={handleSubmit}>
          <label className="form-label">
            Title *
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's the theory?"
            />
          </label>
          <div className="form-row">
            <fieldset className="form-label category-options">
              <legend>Categories *</legend>
              <div className="category-checkboxes">
                {CATEGORIES.filter((c) => c !== "all").map((categoryOption) => (
                  <label key={categoryOption} className="category-option">
                    <input
                      type="checkbox"
                      checked={categories.includes(categoryOption)}
                      onChange={(e) =>
                        setCategories((current) =>
                          e.target.checked
                            ? [...current, categoryOption]
                            : current.filter(
                                (category) => category !== categoryOption,
                              ),
                        )
                      }
                    />
                    {categoryOption.charAt(0).toUpperCase() +
                      categoryOption.slice(1)}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="form-label">
              Status
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="form-label">
            Summary *
            <textarea
              className="form-textarea"
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="One-liner about the theory"
            />
          </label>
          <label className="form-label">
            Full Details
            <textarea
              className="form-textarea"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="The full write-up (optional)"
            />
          </label>
          <label className="form-label">
            Evidence (one per line)
            <textarea
              className="form-textarea"
              rows={3}
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder={"First piece of evidence\nSecond piece\nThird piece"}
            />
          </label>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting || !categories.length}
            >
              {submitting ? "Saving..." : editing ? "Save Changes" : "Pin It"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    seedDefaults(defaultTheories);
    const unsub = subscribeTheories((list) => {
      setTheories(list);
      setLoading(false);
    });
    return unsub;
  }, []);

  const query = search.toLowerCase().trim();
  const filtered = theories.filter((t) => {
    const matchFilter = filter === "all" || getCategories(t).includes(filter);
    const matchSearch =
      !query ||
      t.title.toLowerCase().includes(query) ||
      t.summary.toLowerCase().includes(query) ||
      (t.details || "").toLowerCase().includes(query);
    return matchFilter && matchSearch;
  });

  async function addTheory(data) {
    await addTheoryToDb(data);
    setShowAdd(false);
  }

  async function updateTheory(data) {
    await updateTheoryInDb(editing.firebaseId, data);
    setEditing(null);
    setSelected(null);
  }

  async function deleteTheory(firebaseId) {
    await deleteTheoryFromDb(firebaseId);
  }

  function startEdit(theory) {
    setSelected(null);
    setEditing(theory);
  }

  return (
    <>
      <header className="header">
        <h1>The Conspiracy Board</h1>
        <p className="subtitle">Connect the dots. Question everything.</p>
        <div className="yarn-divider" />
      </header>

      <div className="controls-area">
        <input
          className="search-input"
          type="text"
          placeholder="Search the board..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn${filter === cat ? " active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat === "all"
                ? "All"
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="board-count">
          {loading
            ? "Loading the board..."
            : `${filtered.length} pinned to the board`}
        </div>
        <button className="add-btn" onClick={() => setShowAdd(true)}>
          + Pin New Note
        </button>
      </div>

      <div className="board">
        {loading ? null : filtered.length === 0 ? (
          <div className="empty-state">Nothing here... or is there?</div>
        ) : (
          filtered.map((t, i) => (
            <NoteCard
              key={t.firebaseId}
              theory={t}
              index={i}
              onClick={() => setSelected(t)}
              onDelete={deleteTheory}
            />
          ))
        )}
      </div>

      {selected && (
        <Modal
          theory={selected}
          onClose={() => setSelected(null)}
          onEdit={startEdit}
        />
      )}
      {showAdd && (
        <TheoryForm onSubmit={addTheory} onCancel={() => setShowAdd(false)} />
      )}
      {editing && (
        <TheoryForm
          initial={editing}
          onSubmit={updateTheory}
          onCancel={() => setEditing(null)}
        />
      )}

      <footer className="footer">
        pinned to the board — don't let them take it down.
      </footer>
    </>
  );
}
