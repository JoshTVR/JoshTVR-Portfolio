import Link from 'next/link'
import { createNote } from '../actions'
import { NoteForm } from '../NoteForm'

export default function NewNotePage() {
  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/notes" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.88rem' }}>
          ← Notes
        </Link>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          New Note
        </h1>
      </div>

      <form action={createNote} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <NoteForm />
        <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
          <button type="submit" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '10px 24px' }}>
            Save Note
          </button>
          <Link href="/admin/notes" className="btn btn-ghost" style={{ fontSize: '0.88rem', padding: '10px 24px' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
