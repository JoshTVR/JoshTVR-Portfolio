import type { CSSProperties } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateNote } from '../../actions'

interface PageProps { params: Promise<{ id: string }> }

export const dynamic = 'force-dynamic'

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

export default async function EditNotePage({ params }: PageProps) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: note } = await supabase.from('notes').select('*').eq('id', id).single()
  if (!note) notFound()

  const action = updateNote.bind(null, id)

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/notes" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.88rem' }}>
          ← Notes
        </Link>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Edit Note
        </h1>
      </div>

      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={labelStyle}>Title</label>
          <input name="title" defaultValue={note.title} required style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Status</label>
          <select name="status" defaultValue={note.status} style={inputStyle}>
            <option value="idea">💡 Idea</option>
            <option value="planning">📋 Planning</option>
            <option value="in-progress">🚀 In Progress</option>
            <option value="done">✅ Done</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Tags <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(comma-separated)</span></label>
          <input name="tags" defaultValue={note.tags?.join(', ') ?? ''} placeholder="marca personal, cursos, youtube" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Content</label>
          <textarea name="body" defaultValue={note.body ?? ''} rows={14}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, fontFamily: 'var(--font-body)' }} />
        </div>

        <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
          <button type="submit" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '10px 24px' }}>
            Save Changes
          </button>
          <Link href="/admin/notes" className="btn btn-ghost" style={{ fontSize: '0.88rem', padding: '10px 24px' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
