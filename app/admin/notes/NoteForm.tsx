import type { CSSProperties } from 'react'

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: 'var(--text-muted)',
  marginBottom: '8px',
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  background: 'var(--bg-secondary)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  outline: 'none',
}

export function NoteForm({ defaults }: { defaults?: { title?: string; body?: string; status?: string; tags?: string[] } }) {
  return (
    <>
      <div>
        <label style={labelStyle}>Title</label>
        <input name="title" defaultValue={defaults?.title ?? ''} required placeholder="e.g. Estrategia de cursos online"
          style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>Status</label>
        <select name="status" defaultValue={defaults?.status ?? 'idea'} style={inputStyle}>
          <option value="idea">💡 Idea</option>
          <option value="planning">📋 Planning</option>
          <option value="in-progress">🚀 In Progress</option>
          <option value="done">✅ Done</option>
        </select>
      </div>

      <div>
        <label style={labelStyle}>Tags <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(comma-separated)</span></label>
        <input name="tags" defaultValue={defaults?.tags?.join(', ') ?? ''} placeholder="marca personal, cursos, youtube"
          style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>Content</label>
        <textarea name="body" defaultValue={defaults?.body ?? ''} rows={14} placeholder="Desarrolla tu idea aquí..."
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, fontFamily: 'var(--font-body)' }} />
      </div>
    </>
  )
}
