'use client'

import React from 'react'
import { THEMES, type ThemeName } from './themes'

export interface CodeTipCardProps {
  slide: 1 | 2 | 3
  title: string
  code: string
  language: string
  tip: string
  tags?: string[]
  username?: string
  theme?: ThemeName
}

export function CodeTipCard({
  slide,
  title,
  code,
  language,
  tip,
  tags = [],
  username = '@joshtvr',
  theme = 'midnight',
}: CodeTipCardProps) {
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

  // Decorative glow circle
  const glow: React.CSSProperties = {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: `radial-gradient(circle, rgba(${t.accentRgb},0.15) 0%, transparent 70%)`,
    top: '-100px',
    right: '-100px',
    pointerEvents: 'none',
  }

  const accentLine: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '6px',
    background: t.accent,
  }

  if (slide === 1) {
    return (
      <div style={base}>
        <div style={glow} />
        <div style={accentLine} />
        <div style={{ padding: '80px 80px 60px 90px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '22px', color: t.accent, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '32px' }}>
            💡 Dev Tip
          </div>
          <div style={{ fontSize: '72px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '40px' }}>
            {title}
          </div>
          <div style={{ fontSize: '28px', color: t.textMuted, marginBottom: '60px' }}>
            Swipe to see the code →
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[language, ...tags.slice(0, 2)].map(tag => (
              <span key={tag} style={{ padding: '8px 18px', borderRadius: '999px', background: `rgba(${t.accentRgb},0.15)`, color: t.accent, fontSize: '20px', fontWeight: 600 }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div style={{ padding: '40px 90px', borderTop: `1px solid rgba(${t.accentRgb},0.2)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: t.textMuted, fontSize: '22px' }}>1 / 3</span>
          <span style={{ color: t.accent, fontSize: '22px', fontWeight: 700 }}>{username}</span>
        </div>
      </div>
    )
  }

  if (slide === 2) {
    const lines = code.split('\n')
    return (
      <div style={base}>
        <div style={accentLine} />
        <div style={{ padding: '60px 70px 30px 80px' }}>
          <div style={{ fontSize: '20px', color: t.accent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '24px' }}>
            📋 {language}
          </div>
        </div>
        <div style={{ flex: 1, margin: '0 70px', background: t.codeBg, borderRadius: '16px', border: `1px solid rgba(${t.accentRgb},0.2)`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Terminal header */}
          <div style={{ background: `rgba(${t.accentRgb},0.1)`, padding: '16px 24px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            {['#ef4444','#f59e0b','#10b981'].map(c => (
              <div key={c} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c }} />
            ))}
            <span style={{ marginLeft: '12px', color: t.textMuted, fontSize: '18px', fontFamily: 'monospace' }}>{language}.snippet</span>
          </div>
          {/* Code */}
          <div style={{ flex: 1, padding: '32px', fontFamily: '"Courier New", Consolas, monospace', fontSize: '28px', lineHeight: 1.7, overflowY: 'hidden' }}>
            {lines.map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px' }}>
                <span style={{ color: t.textMuted, minWidth: '32px', userSelect: 'none', fontSize: '22px', paddingTop: '3px' }}>{i + 1}</span>
                <span style={{ color: t.text }}>{line || '\u00a0'}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '30px 90px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: t.textMuted, fontSize: '22px' }}>2 / 3</span>
          <span style={{ color: t.accent, fontSize: '22px', fontWeight: 700 }}>{username}</span>
        </div>
      </div>
    )
  }

  // Slide 3: explanation
  return (
    <div style={base}>
      <div style={glow} />
      <div style={accentLine} />
      <div style={{ padding: '80px 80px 40px 90px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '22px', color: t.accent, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '32px' }}>
          🎯 Key Takeaway
        </div>
        <div style={{ fontSize: '42px', lineHeight: 1.5, marginBottom: '48px' }}>{tip}</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <span key={tag} style={{ padding: '8px 18px', borderRadius: '999px', background: `rgba(${t.accentRgb},0.15)`, color: t.accent, fontSize: '20px' }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div style={{ padding: '40px 90px', borderTop: `1px solid rgba(${t.accentRgb},0.2)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: t.textMuted, fontSize: '22px' }}>3 / 3</span>
        <span style={{ color: t.accent, fontSize: '22px', fontWeight: 700 }}>{username}</span>
      </div>
    </div>
  )
}
