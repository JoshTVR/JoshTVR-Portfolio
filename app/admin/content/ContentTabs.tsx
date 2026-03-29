'use client'

import { useState } from 'react'
import type { ThemeRotationState } from '@/lib/theme-engine'
import type { ContentPost } from './actions'
import { ContentCalendar } from './ContentCalendar'
import { AIQueue } from './AIQueue'
import { PlanGenerator } from './PlanGenerator'
import { PlanImporter } from './PlanImporter'
import { ThemeManager } from './ThemeManager'

const TABS = [
  { id: 'calendar',   label: '📅 Calendar' },
  { id: 'ai-queue',   label: '🤖 AI Queue' },
  { id: 'plan',       label: '✨ Plan with AI' },
  { id: 'import',     label: '📥 Import JSON' },
  { id: 'themes',     label: '🎨 Themes & Seasons' },
]

export function ContentTabs({
  themeState,
  posts,
}: {
  themeState: ThemeRotationState
  posts: ContentPost[]
}) {
  const [tab, setTab] = useState<string>('calendar')

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: tab === t.id ? 700 : 500,
              cursor: 'pointer',
              border: 'none',
              background: tab === t.id ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)',
              color: tab === t.id ? '#a78bfa' : 'var(--text-muted)',
              borderBottom: tab === t.id ? '2px solid #7c3aed' : '2px solid transparent',
              transition: 'all 150ms ease',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'calendar'  && <ContentCalendar posts={posts} themeState={themeState} />}
      {tab === 'ai-queue'  && <AIQueue posts={posts} />}
      {tab === 'plan'      && <PlanGenerator themeState={themeState} />}
      {tab === 'import'    && <PlanImporter />}
      {tab === 'themes'    && <ThemeManager themeState={themeState} />}
    </div>
  )
}
