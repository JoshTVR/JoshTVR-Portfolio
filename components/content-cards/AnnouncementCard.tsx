'use client'

import React from 'react'
import { THEMES, type ThemeName } from './themes'

export interface AnnouncementCardProps {
  headline: string
  description: string
  cta?: string
  username?: string
  theme?: ThemeName
}

export function AnnouncementCard({
  headline,
  description,
  cta,
  username = '@joshtvr',
  theme = 'midnight',
}: AnnouncementCardProps) {
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
      {/* Background gradient mesh */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 20% 80%, rgba(${t.accentRgb},0.25) 0%, transparent 50%),
                     radial-gradient(ellipse at 80% 20%, rgba(${t.accentRgb},0.15) 0%, transparent 50%)`,
      }} />

      {/* Top bar */}
      <div style={{ height: '8px', background: `linear-gradient(90deg, ${t.accent}, rgba(${t.accentRgb},0.4))`, position: 'relative', zIndex: 1 }} />

      <div style={{ padding: '60px 80px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div style={{ marginBottom: '48px' }}>
          <span style={{
            padding: '10px 24px', borderRadius: '999px',
            background: `rgba(${t.accentRgb},0.2)`,
            border: `1px solid rgba(${t.accentRgb},0.4)`,
            color: t.accent, fontSize: '22px', fontWeight: 700, letterSpacing: '0.1em',
          }}>
            📣 ANNOUNCEMENT
          </span>
        </div>

        {/* Headline */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '76px', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '36px' }}>
            {headline}
          </div>
          <div style={{ fontSize: '36px', color: t.textMuted, lineHeight: 1.5, marginBottom: '48px' }}>
            {description}
          </div>
          {cta && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              padding: '16px 36px', borderRadius: '12px',
              background: t.accent, color: '#fff',
              fontSize: '26px', fontWeight: 700,
              alignSelf: 'flex-start',
            }}>
              {cta} →
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: '30px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: t.textMuted, fontSize: '22px' }}>joshtvr.com</span>
          <span style={{ color: t.accent, fontSize: '22px', fontWeight: 700 }}>{username}</span>
        </div>
      </div>
    </div>
  )
}
