'use client'

import { useTransition } from 'react'
import { deleteService, toggleServiceActive } from './actions'

export function ToggleServiceButton({ id, active }: { id: string; active: boolean }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() => startTransition(async () => { await toggleServiceActive(id, !active); window.location.reload() })}
      disabled={isPending}
      style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', border: 'none', textTransform: 'uppercase', background: active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)', color: active ? '#10b981' : 'var(--text-muted)' }}
    >
      {isPending ? '…' : active ? 'Active' : 'Hidden'}
    </button>
  )
}

export function DeleteServiceButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() => { if (!confirm(`Delete "${title}"?`)) return; startTransition(async () => { await deleteService(id); window.location.reload() }) }}
      disabled={isPending}
      style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}
    >
      {isPending ? '…' : 'Delete'}
    </button>
  )
}
