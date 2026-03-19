'use client'

import { useTransition } from 'react'
import { deleteProject, togglePublish } from './actions'

export function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    startTransition(async () => {
      await deleteProject(id)
      // Page will re-render via revalidatePath
      window.location.reload()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      style={{
        padding: '6px 14px',
        borderRadius: '6px',
        fontSize: '0.8rem',
        fontWeight: 600,
        background: 'rgba(239,68,68,0.1)',
        color: '#f87171',
        border: '1px solid rgba(239,68,68,0.2)',
        cursor: 'pointer',
        transition: 'all 150ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
    >
      {isPending ? '…' : 'Delete'}
    </button>
  )
}

export function TogglePublishButton({ id, published }: { id: string; published: boolean }) {
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      await togglePublish(id, !published)
      window.location.reload()
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.74rem',
        fontWeight: 700,
        cursor: 'pointer',
        border: 'none',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        transition: 'all 150ms ease',
        background: published ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
        color: published ? '#10b981' : 'var(--text-muted)',
      }}
    >
      {isPending ? '…' : published ? 'Live' : 'Draft'}
    </button>
  )
}
