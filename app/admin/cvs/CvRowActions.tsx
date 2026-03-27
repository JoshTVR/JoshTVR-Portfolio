'use client'

import { useTransition } from 'react'
import { deleteCv, toggleCvFeatured, toggleCvActive } from './actions'

export function ToggleCvActiveButton({ id, active }: { id: string; active: boolean }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() => startTransition(async () => { await toggleCvActive(id, !active); window.location.reload() })}
      disabled={isPending}
      style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', border: 'none', textTransform: 'uppercase', background: active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)', color: active ? '#10b981' : 'var(--text-muted)' }}
    >
      {isPending ? '…' : active ? 'Active' : 'Hidden'}
    </button>
  )
}

export function ToggleCvFeaturedButton({ id, locale, featured }: { id: string; locale: string; featured: boolean }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() => startTransition(async () => { await toggleCvFeatured(id, locale, !featured); window.location.reload() })}
      disabled={isPending}
      title={featured ? 'Unset as featured' : 'Set as featured (used in Footer)'}
      style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', border: 'none', textTransform: 'uppercase', background: featured ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.06)', color: featured ? 'var(--accent-light)' : 'var(--text-muted)' }}
    >
      {isPending ? '…' : featured ? '★ Featured' : '☆ Feature'}
    </button>
  )
}

export function DeleteCvButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() => { if (!confirm(`Delete "${title}"?`)) return; startTransition(async () => { await deleteCv(id); window.location.reload() }) }}
      disabled={isPending}
      style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}
    >
      {isPending ? '…' : 'Delete'}
    </button>
  )
}
