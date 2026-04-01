'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { PublishToggle, ShareButtons, DeletePostButton } from './PostRowActions'

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  devlog:        { bg: 'rgba(124,58,237,0.15)', color: '#a78bfa' },
  announcement:  { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  tutorial:      { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
  post:          { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' },
  code_tip:      { bg: 'rgba(56,189,248,0.15)', color: '#38bdf8' },
  qa:            { bg: 'rgba(251,113,133,0.15)', color: '#fb7185' },
  logic_challenge: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
  study:         { bg: 'rgba(52,211,153,0.15)', color: '#34d399' },
}

export interface PostRow {
  id: string; slug: string; title_en: string; title_es: string
  excerpt_es: string | null; type: string; tags: string[]
  is_published: boolean; shared_linkedin: boolean; shared_instagram: boolean; shared_facebook: boolean; shared_threads: boolean
  published_at: string | null; scheduled_at: string | null
  is_ai_generated: boolean; card_type: string | null
  created_at: string
}

interface Props {
  posts: PostRow[]
  siteUrl: string
}

const inputStyle: React.CSSProperties = {
  padding: '7px 12px', borderRadius: '8px', fontSize: '0.82rem',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text-primary)', outline: 'none', minWidth: '120px',
}

export default function PostsListClient({ posts, siteUrl }: Props) {
  const [search,     setSearch]     = useState('')
  const [status,     setStatus]     = useState('all')     // all | published | draft | scheduled
  const [typeFilter, setTypeFilter] = useState('all')
  const [aiFilter,   setAiFilter]   = useState('all')     // all | ai | manual
  const [dateFrom,   setDateFrom]   = useState('')
  const [dateTo,     setDateTo]     = useState('')

  const allTypes = useMemo(() => {
    const s = new Set(posts.map(p => p.type))
    return Array.from(s).sort()
  }, [posts])

  const filtered = useMemo(() => {
    return posts.filter(p => {
      if (search && !p.title_en.toLowerCase().includes(search.toLowerCase()) &&
          !p.title_es.toLowerCase().includes(search.toLowerCase())) return false
      if (status === 'published' && !p.is_published) return false
      if (status === 'draft'     && (p.is_published || p.scheduled_at)) return false
      if (status === 'scheduled' && (p.is_published || !p.scheduled_at)) return false
      if (typeFilter !== 'all'   && p.type !== typeFilter) return false
      if (aiFilter === 'ai'      && !p.is_ai_generated) return false
      if (aiFilter === 'manual'  && p.is_ai_generated)  return false
      if (dateFrom) {
        const from = new Date(dateFrom)
        const created = new Date(p.created_at)
        if (created < from) return false
      }
      if (dateTo) {
        const to = new Date(dateTo)
        to.setHours(23, 59, 59)
        const created = new Date(p.created_at)
        if (created > to) return false
      }
      return true
    })
  }, [posts, search, status, typeFilter, aiFilter, dateFrom, dateTo])

  const hasFilters = search || status !== 'all' || typeFilter !== 'all' || aiFilter !== 'all' || dateFrom || dateTo

  return (
    <>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, minWidth: '180px' }}
        />
        <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={inputStyle}>
          <option value="all">All types</option>
          {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={aiFilter} onChange={e => setAiFilter(e.target.value)} style={inputStyle}>
          <option value="all">AI + Manual</option>
          <option value="ai">🤖 AI only</option>
          <option value="manual">✍️ Manual only</option>
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} title="From date" />
        <input type="date" value={dateTo}   onChange={e => setDateTo(e.target.value)}   style={inputStyle} title="To date" />
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setStatus('all'); setTypeFilter('all'); setAiFilter('all'); setDateFrom(''); setDateTo('') }}
            style={{ ...inputStyle, cursor: 'pointer', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}
          >
            Clear
          </button>
        )}
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {filtered.length} / {posts.length}
        </span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass" style={{ padding: '32px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No posts match the current filters.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((post) => {
            const tc = TYPE_COLORS[post.type] ?? TYPE_COLORS.post
            return (
              <div key={post.id} className="glass" style={{ padding: '16px 20px', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', padding: '2px 9px', borderRadius: '20px', fontWeight: 700, background: tc.bg, color: tc.color }}>
                      {post.type}
                    </span>
                    {post.card_type && (
                      <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '20px', background: 'rgba(56,189,248,0.12)', color: '#38bdf8', fontWeight: 600 }}>
                        {post.card_type}
                      </span>
                    )}
                    {post.is_ai_generated && (
                      <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '20px', background: 'rgba(167,139,250,0.12)', color: '#a78bfa', fontWeight: 600 }}>
                        🤖 AI
                      </span>
                    )}
                    {!post.is_published && post.scheduled_at && (
                      <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '20px', background: 'rgba(251,191,36,0.12)', color: '#fbbf24', fontWeight: 600 }}>
                        ⏰ {new Date(post.scheduled_at).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', margin: 0 }}>
                      {post.title_en}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <PublishToggle id={post.id} published={post.is_published} />
                    <ShareButtons post={post} siteUrl={siteUrl} />
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <Link href={`/admin/posts/${post.id}/edit`} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                    Edit
                  </Link>
                  <DeletePostButton id={post.id} title={post.title_en} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
