'use client'

import React from 'react'
import { THEMES, type ThemeName } from './themes'

export interface QACardProps {
  slide: 1 | 2
  question: string
  answer: string
  language?: string
  username?: string
  theme?: ThemeName
}

export function QACard({
  slide,
  question,
  answer,
  language,
  username = '@joshtvr',
  theme = 'midnight',
}: QACardProps) {
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

  const glow: React.CSSProperties = {
    position: 'absolute',
    width: '500px', height: '500px', borderRadius: '50%',
    background: `radial-gradient(circle, rgba(${t.accentRgb},0.12) 0%, transparent 70%)`,
    bottom: '-100px', left: '-100px', pointerEvents: 'none',
  }

  if (slide === 1) {
    return (
      <div style={base}>
        <div style={glow} />
        <div style={{ padding: '70px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '24px', color: t.accent, fontWeight: 700, letterSpacing: '0.15em', marginBottom: '40px' }}>
            ❓ QUESTION
          </div>
          {/* Speech bubble */}
          <div style={{
            background: t.surface,
            border: `2px solid rgba(${t.accentRgb},0.3)`,
            borderRadius: '24px',
            padding: '50px',
            position: 'relative',
            marginBottom: '40px',
          }}>
            <div style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1.3 }}>{question}</div>
          </div>
          <div style={{ fontSize: '28px', color: t.textMuted }}>
            💬 Swipe for the answer →
          </div>
        </div>
        <div style={{
          padding: '40px 70px',
          borderTop: `1px solid rgba(${t.accentRgb},0.15)`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: t.textMuted, fontSize: '22px' }}>1 / 2</span>
          <span style={{ color: t.accent, fontSize: '22px', fontWeight: 700 }}>{username}</span>
        </div>
      </div>
    )
  }

  // Slide 2: answer
  const isCode = language && language !== 'text'
  return (
    <div style={base}>
      <div style={glow} />
      <div style={{ padding: '70px 70px 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '24px', color: t.accent, fontWeight: 700, letterSpacing: '0.15em', marginBottom: '32px' }}>
          ✅ ANSWER
        </div>
        {isCode ? (
          <div style={{
            flex: 1, background: t.codeBg,
            borderRadius: '16px', border: `1px solid rgba(${t.accentRgb},0.2)`,
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ background: `rgba(${t.accentRgb},0.1)`, padding: '14px 24px', fontSize: '18px', color: t.textMuted, fontFamily: 'monospace' }}>
              {language}
            </div>
            <div style={{ padding: '32px', fontFamily: '"Courier New", monospace', fontSize: '30px', lineHeight: 1.65, flex: 1, overflow: 'hidden' }}>
              {answer.split('\n').map((line, i) => (
                <div key={i} style={{ color: t.text }}>{line || '\u00a0'}</div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: '46px', lineHeight: 1.4 }}>{answer}</div>
          </div>
        )}
      </div>
      <div style={{
        padding: '40px 70px',
        borderTop: `1px solid rgba(${t.accentRgb},0.15)`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ color: t.textMuted, fontSize: '22px' }}>2 / 2</span>
        <span style={{ color: t.accent, fontSize: '22px', fontWeight: 700 }}>{username}</span>
      </div>
    </div>
  )
}
