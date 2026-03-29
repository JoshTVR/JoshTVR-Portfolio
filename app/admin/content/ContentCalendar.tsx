'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { resolveThemeForDate } from '@/lib/theme-engine'
import type { ThemeRotationState } from '@/lib/theme-engine'
import { THEMES as COLOR_THEMES } from '@/components/content-cards/themes'
import type { ContentPost } from './actions'

const TYPE_COLORS: Record<string, string> = {
  devlog:           '#a78bfa',
  announcement:     '#fbbf24',
  tutorial:         '#34d399',
  post:             '#94a3b8',
  code_tip:         '#38bdf8',
  qa:               '#f472b6',
  logic_challenge:  '#fb923c',
  study:            '#a3e635',
  video_promo:      '#c084fc',
}

function pad(n: number) { return String(n).padStart(2, '0') }

export function ContentCalendar({
  posts,
  themeState,
}: {
  posts: ContentPost[]
  themeState: ThemeRotationState
}) {
  const today = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const monthKey   = `${viewYear}-${pad(viewMonth + 1)}`
  const monthTheme = resolveThemeForDate(`${monthKey}-01`, themeState)
  const themeColor = COLOR_THEMES[monthTheme]?.accent ?? '#7c3aed'
  const themeLabel = COLOR_THEMES[monthTheme]?.label ?? monthTheme

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay()

  // Index posts by date
  const postsByDate: Record<string, ContentPost[]> = {}
  for (const p of posts) {
    const dateStr = (p.scheduled_at ?? p.published_at ?? p.created_at).slice(0, 10)
    if (!dateStr.startsWith(monthKey)) continue
    if (!postsByDate[dateStr]) postsByDate[dateStr] = []
    postsByDate[dateStr].push(p)
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const monthName  = new Date(viewYear, viewMonth, 1).toLocaleString('en', { month: 'long' })
  const todayStr   = today.toISOString().slice(0, 10)
  const totalPosts = Object.values(postsByDate).reduce((s, a) => s + a.length, 0)

  // Build grid cells: nulls for blank leading days, then day numbers
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div>
      {/* Month navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button onClick={prevMonth} style={navBtn}>←</button>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {monthName} {viewYear}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginTop: '4px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: themeColor, display: 'inline-block' }} />
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Theme: <strong style={{ color: themeColor }}>{themeLabel}</strong> · {totalPosts} posts
            </span>
          </div>
        </div>
        <button onClick={nextMonth} style={navBtn}>→</button>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.07em', padding: '4px' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {cells.map((day, i) => {
          if (day === null) return <div key={`blank-${i}`} style={{ minHeight: '72px' }} />
          const dateStr    = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`
          const dayPosts   = postsByDate[dateStr] ?? []
          const isToday    = dateStr === todayStr
          const newPostUrl = `/admin/posts/new?scheduled_at=${encodeURIComponent(new Date(`${dateStr}T09:00:00`).toISOString())}`

          return (
            <div key={day} style={{
              minHeight: '72px', padding: '5px',
              borderRadius: '8px',
              background: isToday ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)',
              border: isToday ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column', gap: '3px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: isToday ? 700 : 400, color: isToday ? '#a78bfa' : 'var(--text-muted)' }}>
                  {day}
                </span>
                <Link href={newPostUrl} title="Add post on this day"
                  style={{ fontSize: '0.7rem', color: 'rgba(124,58,237,0.5)', textDecoration: 'none', lineHeight: 1 }}>+</Link>
              </div>
              {dayPosts.slice(0, 3).map(p => {
                const color = TYPE_COLORS[p.card_type ?? p.type] ?? '#94a3b8'
                return (
                  <Link key={p.id} href={`/admin/posts/${p.id}/edit`} title={p.title_en}
                    style={{
                      fontSize: '0.58rem', padding: '2px 4px', borderRadius: '3px',
                      background: `${color}22`, color,
                      textDecoration: 'none', overflow: 'hidden',
                      whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'block',
                    }}>
                    {p.is_ai_generated ? '🤖' : ''} {p.title_en}
                  </Link>
                )
              })}
              {dayPosts.length > 3 && (
                <span style={{ fontSize: '0.56rem', color: 'var(--text-muted)' }}>+{dayPosts.length - 3}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: color, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const navBtn: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)', border: 'none',
  color: 'var(--text-muted)', padding: '8px 14px',
  borderRadius: '8px', cursor: 'pointer', fontSize: '1rem',
}
