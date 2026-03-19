'use client'

import { useState, type ReactNode } from 'react'

interface BilingualTabsProps {
  en: ReactNode
  es: ReactNode
  label?: string
}

export function BilingualTabs({ en, es, label }: BilingualTabsProps) {
  const [tab, setTab] = useState<'en' | 'es'>('en')

  return (
    <div>
      {label && (
        <p
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            marginBottom: '8px',
          }}
        >
          {label}
        </p>
      )}

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
        {(['en', 'es'] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setTab(lang)}
            style={{
              padding: '5px 16px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 150ms ease',
              background: tab === lang ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
              color: tab === lang ? '#fff' : 'var(--text-muted)',
              boxShadow: tab === lang ? '0 0 12px var(--accent-glow)' : 'none',
            }}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>{tab === 'en' ? en : es}</div>
    </div>
  )
}
