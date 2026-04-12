'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  bulkDeletePosts,
  resetAIPosts,
  rescheduleQueue,
  type ContentPost,
  type RescheduleEntry,
  type RescheduleOptions,
} from './actions'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  published: { label: 'Published', color: '#34d399' },
  scheduled: { label: 'Scheduled', color: '#38bdf8' },
  draft:     { label: 'Draft',     color: '#94a3b8' },
}

function getStatus(post: ContentPost) {
  if (post.is_published) return 'published'
  if (post.scheduled_at) return 'scheduled'
  return 'draft'
}

export function AIQueue({ posts }: { posts: ContentPost[] }) {
  const aiPosts = posts.filter(p => p.is_ai_generated)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const [msg, setMsg] = useState('')

  // Reschedule state
  const [showReschedule, setShowReschedule] = useState(false)
  const [rsPostsPerDay, setRsPostsPerDay]   = useState<1 | 2>(2)
  const [rsStartDate,   setRsStartDate]     = useState<string>(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().slice(0, 10)
  })
  const [rsScope,       setRsScope]         = useState<'all' | 'ai' | 'overdue'>('all')
  const [rsPreview,     setRsPreview]       = useState<RescheduleEntry[] | null>(null)
  const [rsRunning,     setRsRunning]       = useState(false)
  const [rsMsg,         setRsMsg]           = useState('')

  async function runReschedule(apply: boolean) {
    setRsRunning(true)
    setRsMsg('')
    const opts: RescheduleOptions = {
      postsPerDay: rsPostsPerDay,
      startDate:   rsStartDate,
      scope:       rsScope,
      apply,
    }
    const res = await rescheduleQueue(opts)
    setRsRunning(false)
    if (res.error) {
      setRsMsg(`Error: ${res.error}`)
      return
    }
    setRsPreview(res.preview)
    if (apply) {
      setRsMsg(`✓ Rescheduled ${res.total} posts. Cron will pick them up automatically.`)
    } else {
      setRsMsg(`Preview only — ${res.total} posts will be rescheduled. Click Apply to confirm.`)
    }
  }

  const now = new Date()
  const scheduled  = aiPosts.filter(p => !p.is_published && p.scheduled_at && new Date(p.scheduled_at) > now)
  const published  = aiPosts.filter(p => p.is_published)
  const drafts     = aiPosts.filter(p => !p.is_published && !p.scheduled_at)
  const overdue    = aiPosts.filter(p => !p.is_published && p.scheduled_at && new Date(p.scheduled_at) <= now)

  // Days of content remaining (unique days with scheduled posts)
  const futureDays = new Set(
    scheduled.map(p => p.scheduled_at!.slice(0, 10))
  ).size

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function selectAll() {
    setSelected(new Set(aiPosts.map(p => p.id)))
  }

  function clearSelection() {
    setSelected(new Set())
  }

  function handleBulkDelete() {
    if (selected.size === 0) return
    if (!confirm(`Delete ${selected.size} post(s)? This cannot be undone.`)) return
    startTransition(async () => {
      const res = await bulkDeletePosts(Array.from(selected))
      if (res.error) setMsg(`Error: ${res.error}`)
      else { setMsg(`Deleted ${selected.size} posts`); clearSelection() }
    })
  }

  function handleResetAll() {
    if (!confirm(`Reset ALL AI posts to draft? This will un-publish them and clear shared flags. Continue?`)) return
    startTransition(async () => {
      const res = await resetAIPosts()
      if (res.error) setMsg(`Error: ${res.error}`)
      else setMsg(`Reset ${res.reset} AI posts to draft`)
    })
  }

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'Total AI Posts',   value: aiPosts.length,   color: '#a78bfa' },
          { label: 'Scheduled',        value: scheduled.length,  color: '#38bdf8' },
          { label: 'Published',        value: published.length,  color: '#34d399' },
          { label: 'Drafts',           value: drafts.length,     color: '#94a3b8' },
          { label: 'Overdue',          value: overdue.length,    color: '#f87171' },
          { label: 'Days of Content',  value: futureDays,        color: '#fbbf24' },
        ].map(stat => (
          <div key={stat.label} className="glass" style={{ padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={selectAll} style={ghostBtn}>Select All</button>
        {selected.size > 0 && (
          <>
            <button onClick={clearSelection} style={ghostBtn}>Clear ({selected.size})</button>
            <button onClick={handleBulkDelete} disabled={isPending} style={{ ...ghostBtn, color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}>
              {isPending ? 'Deleting…' : `Delete ${selected.size}`}
            </button>
          </>
        )}
        {msg && <span style={{ fontSize: '0.8rem', color: '#34d399', marginLeft: '8px' }}>{msg}</span>}
        <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {aiPosts.length} AI posts total
        </span>
        <button
          onClick={() => setShowReschedule(s => !s)}
          style={{ ...ghostBtn, color: '#a78bfa', borderColor: 'rgba(124,58,237,0.4)', marginLeft: '8px' }}
        >
          {showReschedule ? 'Hide Reschedule' : '📅 Reschedule Queue'}
        </button>
        <button onClick={handleResetAll} disabled={isPending} style={{ ...ghostBtn, color: '#f87171', borderColor: 'rgba(248,113,113,0.3)', marginLeft: '8px' }}>
          Reset All to Draft
        </button>
      </div>

      {/* Reschedule panel */}
      {showReschedule && (
        <div className="glass" style={{ padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(124,58,237,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#a78bfa' }}>📅 Reschedule Queue</span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Distributes unpublished posts at 1-2 per day so the cron picks them up steadily.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Posts per day</span>
              <select
                className="admin-input"
                value={rsPostsPerDay}
                onChange={e => setRsPostsPerDay(Number(e.target.value) as 1 | 2)}
              >
                <option value={1}>1 / day (8 AM CDMX)</option>
                <option value={2}>2 / day (8 AM + 5 PM CDMX)</option>
              </select>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Start date</span>
              <input
                type="date"
                className="admin-input"
                value={rsStartDate}
                onChange={e => setRsStartDate(e.target.value)}
              />
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Scope</span>
              <select
                className="admin-input"
                value={rsScope}
                onChange={e => setRsScope(e.target.value as 'all' | 'ai' | 'overdue')}
              >
                <option value="all">All unpublished</option>
                <option value="ai">AI-generated only</option>
                <option value="overdue">Overdue only (past scheduled_at)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => runReschedule(false)}
              disabled={rsRunning}
              style={{ ...ghostBtn, color: '#38bdf8', borderColor: 'rgba(56,189,248,0.3)' }}
            >
              {rsRunning ? 'Loading…' : '👁 Preview'}
            </button>
            <button
              onClick={() => {
                if (!confirm(`Apply reschedule to ${rsPreview?.length ?? 'all'} posts? You can re-run anytime.`)) return
                runReschedule(true)
              }}
              disabled={rsRunning || !rsPreview || rsPreview.length === 0}
              style={{ ...ghostBtn, color: '#34d399', borderColor: 'rgba(52,211,153,0.4)' }}
            >
              ✓ Apply
            </button>
            {rsMsg && (
              <span style={{ fontSize: '0.78rem', color: rsMsg.startsWith('Error') ? '#f87171' : '#a78bfa', marginLeft: '6px' }}>
                {rsMsg}
              </span>
            )}
          </div>

          {rsPreview && rsPreview.length > 0 && (
            <div style={{ marginTop: '14px', maxHeight: '320px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
              <table style={{ width: '100%', fontSize: '0.76rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', position: 'sticky', top: 0 }}>
                    <th style={{ textAlign: 'left',  padding: '8px 12px', color: 'var(--text-muted)' }}>Post</th>
                    <th style={{ textAlign: 'left',  padding: '8px 12px', color: 'var(--text-muted)' }}>Old</th>
                    <th style={{ textAlign: 'left',  padding: '8px 12px', color: 'var(--text-muted)' }}>New</th>
                  </tr>
                </thead>
                <tbody>
                  {rsPreview.slice(0, 200).map((entry) => (
                    <tr key={entry.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '6px 12px', color: 'var(--text-primary)', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.title}</td>
                      <td style={{ padding: '6px 12px', color: '#94a3b8' }}>{entry.old_scheduled ? new Date(entry.old_scheduled).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit' }) : '—'}</td>
                      <td style={{ padding: '6px 12px', color: '#34d399' }}>{new Date(entry.new_scheduled).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rsPreview.length > 200 && (
                <div style={{ padding: '8px 12px', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  …and {rsPreview.length - 200} more
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {aiPosts.length === 0 ? (
        <div className="glass" style={{ padding: '40px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No AI posts yet. Use "Plan with AI" to generate a content plan, then import it.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {aiPosts.map(p => {
            const status = getStatus(p)
            const sl = STATUS_LABEL[status]
            const isSelected = selected.has(p.id)

            return (
              <div
                key={p.id}
                className="glass"
                onClick={() => toggleSelect(p.id)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  display: 'grid',
                  gridTemplateColumns: '20px 1fr auto auto',
                  gap: '12px',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.06)',
                  background: isSelected ? 'rgba(124,58,237,0.07)' : undefined,
                  transition: 'all 150ms ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(p.id)}
                  onClick={e => e.stopPropagation()}
                  style={{ accentColor: '#7c3aed', width: '14px', height: '14px', cursor: 'pointer' }}
                />
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {p.title_en}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{p.card_type ?? p.type}</span>
                    {p.scheduled_at && (
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {new Date(p.scheduled_at).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    {p.burst_group_id && (
                      <span style={{ fontSize: '0.66rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                        burst
                      </span>
                    )}
                  </div>
                </div>

                <span style={{
                  fontSize: '0.68rem', padding: '3px 9px', borderRadius: '20px',
                  background: `${sl.color}22`, color: sl.color, fontWeight: 700,
                }}>
                  {sl.label}
                </span>

                <Link
                  href={`/admin/posts/${p.id}/edit`}
                  onClick={e => e.stopPropagation()}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                >
                  Edit
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const ghostBtn: React.CSSProperties = {
  padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text-muted)', cursor: 'pointer',
}
