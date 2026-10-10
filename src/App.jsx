import { useState, useEffect } from 'react'
import defaultTheories from './theories'
import './App.css'

const PIN_COLORS = ['red', 'green', 'yellow', 'blue', 'white']
const PAPER_STYLES = [
  'sticky-yellow', 'sticky-pink', 'sticky-blue', 'index-card',
  'scrap', 'torn', 'sticky-green', 'manila',
]
const ROTATIONS = [-3, 1.5, -1, 2.5, -2, 0.5, -1.5, 3, -0.5, 2]
const STRING_CONFIGS = [
  { top: '-6px', right: '18%', width: '55px', rotate: '22deg' },
  { bottom: '-5px', left: '12%', width: '40px', rotate: '-18deg' },
  { top: '30%', right: '-12px', width: '30px', rotate: '70deg' },
  null,
  { top: '-5px', left: '20%', width: '50px', rotate: '-25deg' },
  null,
]
const CATEGORIES = ['all', 'government', 'space', 'technology', 'history', 'science', 'other']
const STATUSES = ['unproven', 'debunked', 'plausible', 'confirmed']

function loadTheories() {
  try {
    const saved = localStorage.getItem('conspiracy-theories')
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return defaultTheories
}

function saveTheories(list) {
  try { localStorage.setItem('conspiracy-theories', JSON.stringify(list)) } catch { /* ignore */ }
}

function PushPin({ index }) {
  return <div className={`pin ${PIN_COLORS[index % PIN_COLORS.length]}`} />
}

function RedString({ index }) {
  const config = STRING_CONFIGS[index % STRING_CONFIGS.length]
  if (!config) return null
  const { rotate, ...pos } = config
  return <div className="string" style={{ ...pos, transform: `rotate(${rotate})` }} />
}

function NoteCard({ theory, index, onClick, onDelete }) {
  const paperStyle = PAPER_STYLES[index % PAPER_STYLES.length]
  const rotation = ROTATIONS[index % ROTATIONS.length]

  return (
    <div className="note" style={{ transform: `rotate(${rotation}deg)` }}>
      <PushPin index={index} />
      <RedString index={index} />
      <div className={`note-paper ${paperStyle}`} onClick={onClick}>
        <span className={`note-badge ${theory.status}`}>{theory.status}</span>
        <div className="note-category">{theory.category}</div>
        <div className="note-title">{theory.title}</div>
        <div className="note-summary">{theory.summary}</div>
        <div className="note-date">{theory.dateAdded}</div>
      </div>
      <button
        className="delete-btn"
        onClick={(e) => { e.stopPropagation(); onDelete(theory.id) }}
        title="Unpin from board"
      >
        &times;
      </button>
    </div>
  )
}

function Modal({ theory, onClose }) {
  if (!theory) return null
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-card">
        <div className="modal-stamp">Classified</div>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>{theory.title}</h2>
        <div className="note-category">{theory.category}</div>
        <div style={{ margin: '6px 0 12px' }}>
          <span className={`note-badge ${theory.status}`} style={{ position: 'static' }}>{theory.status}</span>
        </div>
        <div className="details">{theory.details}</div>
        {theory.evidence?.length > 0 && (
          <>
            <h3>Key Evidence</h3>
            <ul className="evidence-list">
              {theory.evidence.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </>
        )}
        <div className="modal-meta">Filed {theory.dateAdded}</div>
      </div>
    </div>
  )
}

function AddForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('government')
  const [summary, setSummary] = useState('')
  const [details, setDetails] = useState('')
  const [evidence, setEvidence] = useState('')
  const [status, setStatus] = useState('unproven')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !summary.trim()) return
    onAdd({
      id: Date.now(),
      title: title.trim(),
      category,
      summary: summary.trim(),
      details: details.trim() || summary.trim(),
      evidence: evidence.trim() ? evidence.split('\n').map(l => l.trim()).filter(Boolean) : [],
      status,
      dateAdded: new Date().toISOString().split('T')[0],
    })
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="modal-card add-form-card">
        <div className="modal-stamp">New Intel</div>
        <button className="modal-close" onClick={onCancel}>&times;</button>
        <h2>Pin to the Board</h2>
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
            <label className="form-label">
              Category
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.filter(c => c !== 'all').map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </label>
            <label className="form-label">
              Status
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
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
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-submit">Pin It</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function App() {
  const [theories, setTheories] = useState(loadTheories)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => { saveTheories(theories) }, [theories])

  const query = search.toLowerCase().trim()
  const filtered = theories.filter((t) => {
    const matchFilter = filter === 'all' || t.category === filter
    const matchSearch = !query
      || t.title.toLowerCase().includes(query)
      || t.summary.toLowerCase().includes(query)
      || t.details.toLowerCase().includes(query)
    return matchFilter && matchSearch
  })

  function addTheory(theory) {
    setTheories(prev => [...prev, theory])
    setShowAdd(false)
  }

  function deleteTheory(id) {
    setTheories(prev => prev.filter(t => t.id !== id))
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
              className={`filter-btn${filter === cat ? ' active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="board-count">{filtered.length} pinned to the board</div>
        <button className="add-btn" onClick={() => setShowAdd(true)}>
          + Pin New Note
        </button>
      </div>

      <div className="board">
        {filtered.length === 0 ? (
          <div className="empty-state">Nothing here... or is there?</div>
        ) : (
          filtered.map((t, i) => (
            <NoteCard
              key={t.id}
              theory={t}
              index={i}
              onClick={() => setSelected(t)}
              onDelete={deleteTheory}
            />
          ))
        )}
      </div>

      {selected && <Modal theory={selected} onClose={() => setSelected(null)} />}
      {showAdd && <AddForm onAdd={addTheory} onCancel={() => setShowAdd(false)} />}

      <footer className="footer">
        pinned to the board — don't let them take it down.
      </footer>
    </>
  )
}
