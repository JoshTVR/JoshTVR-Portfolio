'use client'

import React from 'react'
import { THEMES, type ThemeName } from './themes'

export interface LogicCardProps {
  slide: 1 | 2
  challenge: string
  solution: string
  difficulty?: 'easy' | 'medium' | 'hard'
  username?: string
  theme?: ThemeName
}

const difficultyColors = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' }
const difficultyLabels = { easy: '⚡ Easy', medium: '🔥 Medium', hard: '💀 Hard' }

export function LogicCard({
  slide,
  challenge,
  solution,
  difficulty = 'medium',
  username = '@joshtvr',
  theme = 'midnight',
}: LogicCardProps) {
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

  const diffColor = difficultyColors[difficulty]

  if (slide === 1) {
    return (
      <div style={base}>
        {/* Top accent bar */}
        <div style={{ height: '6px', background: `linear-gradient(90deg, ${t.accent}, ${diffColor})` }} />

        <div style={{ padding: '60px 70px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '24px', color: t.accent, fontWeight: 700, letterSpacing: '0.15em' }}>
              🧩 LOGIC CHALLENGE
            </div>
            <div style={{ padding: '8px 20px', borderRadius: '999px', background: `${diffColor}22`, color: diffColor, fontSize: '20px', fontWeight: 700 }}>
              {difficultyLabels[difficulty]}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '28px', color: t.textMuted, marginBottom: '24px' }}>Can you solve this? 🤔</div>
            <div style={{
              background: t.surface, borderRadius: '20px',
              border: `1px solid rgba(${t.accentRgb},0.2)`,
              padding: '48px', fontSize: '44px', fontWeight: 600, lineHeight: 1.4,
            }}>
              {challenge}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '40px', borderTop: `1px solid rgba(255,255,255,0.08)` }}>
            <span style={{ color: t.textMuted, fontSize: '24px' }}>👉 Swipe for solution</span>
            <span style={{ color: t.accent, fontSize: '22px', fontWeight: 700 }}>1 / 2 · {username}</span>
          </div>
        </div>
      </div>
    )
  }

  // Slide 2: solution
  return (
    <div style={base}>
      <div style={{ height: '6px', background: `linear-gradient(90deg, ${t.accent}, ${diffColor})` }} />

      <div style={{ padding: '60px 70px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '24px', color: '#10b981', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '40px' }}>
          ✅ SOLUTION
        </div>

        <div style={{
          flex: 1, background: t.codeBg, borderRadius: '16px',
          border: `1px solid rgba(${t.accentRgb},0.2)`, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ background: `rgba(${t.accentRgb},0.1)`, padding: '14px 24px', fontSize: '18px', color: t.textMuted, fontFamily: 'monospace' }}>
            solution
          </div>
          <div style={{ padding: '32px', fontFamily: '"Courier New", monospace', fontSize: '28px', lineHeight: 1.65, flex: 1, overflow: 'hidden' }}>
            {solution.split('\n').map((line, i) => (
              <div key={i} style={{ color: t.text }}>{line || '\u00a0'}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '30px', borderTop: `1px solid rgba(255,255,255,0.08)` }}>
          <span style={{ color: t.textMuted, fontSize: '22px' }}>2 / 2</span>
          <span style={{ color: t.accent, fontSize: '22px', fontWeight: 700 }}>{username}</span>
        </div>
      </div>
    </div>
  )
}
