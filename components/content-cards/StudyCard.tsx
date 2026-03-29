'use client'

import React from 'react'
import { THEMES, type ThemeName } from './themes'

export interface StudyCardProps {
  finding: string
  source: string
  topic: string
  username?: string
  theme?: ThemeName
}

export function StudyCard({
  finding,
  source,
  topic,
  username = '@joshtvr',
  theme = 'midnight',
}: StudyCardProps) {
  const t = THEMES[theme]

  const base: React.CSSProperties = {
    width: '1080px',
    height: '1080px',
    background: t.bg,
    color: t.text,
    fontFamily: '"Segoe UI", system-ui, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
  }

  return (
    <div style={base}>
      {/* Decorative large quote mark */}
      <div style={{
        position: 'absolute', top: '40px', right: '60px',
        fontSize: '320px', color: `rgba(${t.accentRgb},0.06)`,
        fontFamily: 'Georgia, serif', lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }}>
        "
      </div>

      {/* Left accent bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', background: t.accent }} />

      <div style={{ padding: '70px 80px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '24px', color: t.accent, fontWeight: 700, letterSpacing: '0.15em' }}>
            📚 RESEARCH FINDING
          </div>
          <div style={{
            padding: '8px 20px', borderRadius: '8px',
            background: `rgba(${t.accentRgb},0.15)`,
            color: t.accent, fontSize: '20px', fontWeight: 600,
          }}>
            {topic}
          </div>
        </div>

        {/* Finding — editorial pull quote */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: '54px', fontWeight: 700, lineHeight: 1.25, fontStyle: 'italic' }}>
            "{finding}"
          </div>
        </div>

        {/* Source + footer */}
        <div style={{ borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: '30px' }}>
          <div style={{ fontSize: '24px', color: t.textMuted, marginBottom: '16px' }}>
            📎 {source}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: t.textMuted, fontSize: '22px' }}>joshtvr.com</span>
            <span style={{ color: t.accent, fontSize: '22px', fontWeight: 700 }}>{username}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
