'use client'

import { useState, useTransition } from 'react'
import { setInquiryStatus, setResponseNote } from './actions'

const STATUSES = [
  { value: 'new',           label: 'New',           color: '#f59e0b' },
  { value: 'reviewing',     label: 'Reviewing',     color: '#60a5fa' },
  { value: 'proposal_sent', label: 'Proposal Sent', color: '#a78bfa' },
  { value: 'accepted',      label: 'Accepted',      color: '#10b981' },
  { value: 'rejected',      label: 'Rejected',      color: '#f87171' },
  { value: 'completed',     label: 'Completed',     color: '#10b981' },
]

interface InquiryActionsProps {
  id:           string
  currentStatus:string
  currentNote:  string
  trackingUrl:  string
}

export function InquiryActions({ id, currentStatus, currentNote, trackingUrl }: InquiryActionsProps) {
  const [isPending,    startTransition] = useTransition()
  const [showNote,     setShowNote]     = useState(false)
  const [note,         setNote]         = useState(currentNote)
  const [savedNote,    setSavedNote]    = useState(currentNote)
  const [noteSaving,   setNoteSaving]   = useState(false)

  function changeStatus(newStatus: string) {
    startTransition(async () => {
      await setInquiryStatus(id, newStatus)
      window.location.reload()
    })
  }

  async function saveNote() {
    setNoteSaving(true)
    await setResponseNote(id, note)
    setSavedNote(note)
    setNoteSaving(false)
    setShowNote(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
        {STATUSES.map(s => (
          <button
            key={s.value}
            onClick={() => changeStatus(s.value)}
            disabled={isPending || currentStatus === s.value}
            style={{
              padding: '5px 12px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', border: '1px solid',
              background: currentStatus === s.value ? `${s.color}22` : 'transparent',
              borderColor: currentStatus === s.value ? `${s.color}66` : 'rgba(255,255,255,0.1)',
              color: currentStatus === s.value ? s.color : 'var(--text-muted)',
              opacity: isPending ? 0.5 : 1,
              transition: 'all 150ms ease',
            }}
          >
            {s.label}
          </button>
        ))}

        <a href={trackingUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', padding: '5px 12px', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none' }}>
          View tracking ↗
        </a>
      </div>

      {/* Response note section */}
      {!showNote ? (
        <button
          onClick={() => setShowNote(true)}
          style={{ alignSelf: 'flex-start', padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--accent-light)', border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.08)', cursor: 'pointer' }}
        >
          {savedNote ? '✏ Edit response note' : '+ Add response note'}
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Response note (visible to client on tracking page)</p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={4}
            placeholder="Write a message for the client — this will appear on their tracking page..."
            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.88rem', outline: 'none', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={saveNote} disabled={noteSaving} style={{ padding: '8px 18px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer' }}>
              {noteSaving ? 'Saving…' : 'Save note'}
            </button>
            <button onClick={() => { setNote(savedNote); setShowNote(false) }} style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
