import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { DeleteNoteButton } from './NoteRowActions'

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, string> = {
  idea:        'rgba(148,163,184,0.15)',
  planning:    'rgba(59,130,246,0.15)',
  'in-progress':'rgba(139,92,246,0.15)',
  done:        'rgba(16,185,129,0.15)',
}
const STATUS_TEXT: Record<string, string> = {
  idea:        '#94a3b8',
  planning:    '#60a5fa',
  'in-progress':'#a78bfa',
  done:        '#34d399',
}
const STATUS_LABELS: Record<string, string> = {
  idea:        'Idea',
  planning:    'Planning',
  'in-progress':'In Progress',
  done:        'Done',
}

async function getNotes() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('notes').select('*').order('created_at', { ascending: false })
    return data ?? []
  } catch { return [] }
}

export default async function AdminNotesPage() {
  const notes = await getNotes()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Notes & Plans
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>
        </div>
        <Link href="/admin/notes/new" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '10px 20px' }}>
          + New Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="glass" style={{ padding: '48px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1rem', marginBottom: '16px' }}>No notes yet. Start planning something.</p>
          <Link href="/admin/notes/new" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '10px 20px' }}>
            Create first note
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notes.map((note: NoteRow) => (
            <div
              key={note.id}
              className="glass"
              style={{ borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: '20px' }}
            >
              {/* Status pill */}
              <span style={{
                flexShrink: 0,
                marginTop: '2px',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: STATUS_COLORS[note.status] ?? STATUS_COLORS.idea,
                color: STATUS_TEXT[note.status] ?? STATUS_TEXT.idea,
                whiteSpace: 'nowrap',
              }}>
                {STATUS_LABELS[note.status] ?? note.status}
              </span>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '4px' }}>
                  {note.title}
                </p>
                {note.body && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: note.tags?.length ? '10px' : 0,
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {note.body}
                  </p>
                )}
                {note.tags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {note.tags.map((tag: string) => (
                      <span key={tag} className="skill-tag" style={{ fontSize: '0.72rem', padding: '2px 10px' }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Date */}
              <span style={{ flexShrink: 0, fontSize: '0.75rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                {new Date(note.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>

              {/* Actions */}
              <div style={{ flexShrink: 0, display: 'flex', gap: '8px' }}>
                <Link
                  href={`/admin/notes/${note.id}/edit`}
                  style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
                    background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Edit
                </Link>
                <DeleteNoteButton id={note.id} title={note.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface NoteRow {
  id: string
  title: string
  body: string | null
  status: string
  tags: string[]
  created_at: string
}
