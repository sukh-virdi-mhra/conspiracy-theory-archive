import { useState } from 'react'
import theories from './theories'
import './App.css'

const PIN_COLORS = ['red', 'green', 'yellow', 'blue', 'white']
const PAPER_STYLES = [
  'sticky-yellow',
  'sticky-pink',
  'sticky-blue',
  'index-card',
  'scrap',
  'torn',
  'sticky-green',
  'manila',
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

function PushPin({ index }) {
  const color = PIN_COLORS[index % PIN_COLORS.length]
  return <div className={`pin ${color}`} />
}

function RedString({ index }) {
  const config = STRING_CONFIGS[index % STRING_CONFIGS.length]
  if (!config) return null
  const { rotate, ...pos } = config
  return (
    <div
      className="string"
      style={{ ...pos, transform: `rotate(${rotate})` }}
    />
  )
}

function NoteCard({ theory, index, onClick }) {
  const paperStyle = PAPER_STYLES[index % PAPER_STYLES.length]
  const rotation = ROTATIONS[index % ROTATIONS.length]

  return (
    <div
      className="note"
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={onClick}
    >
      <PushPin index={index} />
      <RedString index={index} />
      <div className={`note-paper ${paperStyle}`}>
        <span className={`note-badge ${theory.status}`}>
          {theory.status}
        </span>
        <div className="note-category">{theory.category}</div>
        <div className="note-title">{theory.title}</div>
        <div className="note-summary">{theory.summary}</div>
        <div className="note-date">{theory.dateAdded}</div>
      </div>
    </div>
  )
}

function Modal({ theory, onClose }) {
  if (!theory) return null

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose()
    }}>
      <div className="modal-card">
        <div className="modal-stamp">Classified</div>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>{theory.title}</h2>
        <div className="note-category">{theory.category}</div>
        <div style={{ margin: '6px 0 12px' }}>
          <span className={`note-badge ${theory.status}`} style={{ position: 'static' }}>
            {theory.status}
          </span>
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

export default function App() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const query = search.toLowerCase().trim()
  const filtered = theories.filter((t) => {
    const matchFilter = filter === 'all' || t.category === filter
    const matchSearch = !query
      || t.title.toLowerCase().includes(query)
      || t.summary.toLowerCase().includes(query)
      || t.details.toLowerCase().includes(query)
    return matchFilter && matchSearch
  })

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
            />
          ))
        )}
      </div>

      {selected && <Modal theory={selected} onClose={() => setSelected(null)} />}

      <footer className="footer">
        pinned to the board — don't let them take it down.
      </footer>
    </>
  )
}
