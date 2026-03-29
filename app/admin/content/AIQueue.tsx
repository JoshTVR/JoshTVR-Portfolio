'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { bulkDeletePosts, type ContentPost } from './actions'

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
      </div>

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
