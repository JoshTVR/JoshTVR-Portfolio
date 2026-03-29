'use client'

import React from 'react'
import { THEMES, type ThemeName } from './themes'

export interface DevlogCardProps {
  project: 'Apheeleon' | 'Portfolio' | string
  update: string
  milestone?: string
  techTags?: string[]
  screenshotUrl?: string
  username?: string
  theme?: ThemeName
}

export function DevlogCard({
  project,
  update,
  milestone,
  techTags = [],
  screenshotUrl,
  username = '@joshtvr',
  theme = 'midnight',
}: DevlogCardProps) {
  const t = THEMES[theme]
  const isApheeleon = project === 'Apheeleon'

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
      {/* Background screenshot with overlay */}
      {screenshotUrl && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${screenshotUrl})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.3,
        }} />
      )}
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to top, ${t.bg} 40%, transparent 100%)`,
      }} />

      {/* Top bar */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '50px 70px 30px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{
          padding: '10px 24px', borderRadius: '999px',
          background: `rgba(${t.accentRgb},0.2)`,
          border: `1px solid rgba(${t.accentRgb},0.4)`,
          fontSize: '22px', fontWeight: 700, color: t.accent,
          letterSpacing: '0.05em',
        }}>
          {isApheeleon ? '🎮 DEVLOG' : '🛠️ DEV UPDATE'}
        </div>
        {milestone && (
          <div style={{
            padding: '10px 24px', borderRadius: '999px',
            background: t.surface,
            fontSize: '20px', color: t.textMuted,
          }}>
            {milestone}
          </div>
        )}
      </div>

      {/* Main content — pushed to bottom */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '0 70px 60px' }}>
        {/* Project name */}
        <div style={{
          fontSize: '28px', fontWeight: 800, color: t.accent,
          letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px',
        }}>
          {project}
        </div>

        {/* Update text */}
        <div style={{ fontSize: '52px', fontWeight: 700, lineHeight: 1.2, marginBottom: '40px' }}>
          {update}
        </div>

        {/* Tech tags */}
        {techTags.length > 0 && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {techTags.map(tag => (
              <span key={tag} style={{
                padding: '8px 18px', borderRadius: '8px',
                background: `rgba(${t.accentRgb},0.12)`,
                color: t.textMuted, fontSize: '20px', fontFamily: 'monospace',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{
          paddingTop: '30px',
          borderTop: `1px solid rgba(255,255,255,0.1)`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: t.textMuted, fontSize: '22px' }}>joshtvr.com</span>
          <span style={{ color: t.accent, fontSize: '22px', fontWeight: 700 }}>{username}</span>
        </div>
      </div>
    </div>
  )
}
