'use client'

import { useTransition } from 'react'
import { deleteNote } from './actions'

export function DeleteNoteButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Delete "${title}"?`)) return
    startTransition(() => deleteNote(id))
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      style={{
        padding: '6px 14px',
        borderRadius: '6px',
        fontSize: '0.8rem',
        fontWeight: 600,
        background: 'rgba(239,68,68,0.1)',
        color: '#f87171',
        border: '1px solid rgba(239,68,68,0.2)',
        cursor: pending ? 'not-allowed' : 'pointer',
        opacity: pending ? 0.5 : 1,
        transition: 'all 150ms ease',
      }}
    >
      {pending ? '…' : 'Delete'}
    </button>
  )
}
