'use client'

import { useTransition } from 'react'
import { deleteTestimonial, toggleTestimonialVisible } from './actions'

export function ToggleVisibleButton({ id, visible }: { id: string; visible: boolean }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() => startTransition(async () => { await toggleTestimonialVisible(id, !visible); window.location.reload() })}
      disabled={isPending}
      style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', border: 'none', textTransform: 'uppercase', background: visible ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)', color: visible ? '#10b981' : 'var(--text-muted)' }}
    >
      {isPending ? '…' : visible ? 'Visible' : 'Hidden'}
    </button>
  )
}

export function DeleteTestimonialButton({ id, author }: { id: string; author: string }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() => { if (!confirm(`Delete testimonial from "${author}"?`)) return; startTransition(async () => { await deleteTestimonial(id); window.location.reload() }) }}
      disabled={isPending}
      style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}
    >
      {isPending ? '…' : 'Delete'}
    </button>
  )
}
