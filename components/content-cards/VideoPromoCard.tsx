'use client'

import React from 'react'
import { THEMES, type ThemeName } from './themes'

export interface VideoPromoCardProps {
  title: string
  thumbnailUrl?: string
  channelName?: string
  duration?: string
  username?: string
  theme?: ThemeName
}

export function VideoPromoCard({
  title,
  thumbnailUrl,
  channelName = 'JoshTVR',
  duration,
  username = '@joshtvr',
  theme = 'midnight',
}: VideoPromoCardProps) {
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
      {/* Thumbnail background */}
      {thumbnailUrl ? (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${thumbnailUrl})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${t.surface}, ${t.bg})`,
        }} />
      )}

      {/* Dark gradient overlay (stronger at bottom) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 45%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.1) 100%)',
      }} />

      {/* Top: NEW VIDEO badge */}
      <div style={{ position: 'relative', zIndex: 1, padding: '50px 70px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          padding: '10px 22px', borderRadius: '999px',
          background: t.accent, color: '#fff',
          fontSize: '22px', fontWeight: 800, letterSpacing: '0.1em',
        }}>
          ▶ NEW VIDEO
        </div>
      </div>

      {/* Center: play button */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '120px', height: '120px', borderRadius: '50%',
          background: `rgba(${t.accentRgb},0.9)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '48px',
        }}>
          ▶
        </div>
      </div>

      {/* Duration badge */}
      {duration && (
        <div style={{
          position: 'absolute', top: '50px', right: '70px', zIndex: 2,
          padding: '8px 16px', borderRadius: '6px',
          background: 'rgba(0,0,0,0.8)',
          fontSize: '22px', fontWeight: 700, color: '#fff',
        }}>
          {duration}
        </div>
      )}

      {/* Bottom: title + channel */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 1, padding: '0 70px 60px' }}>
        <div style={{ fontSize: '22px', color: t.textMuted, marginBottom: '16px', letterSpacing: '0.1em' }}>
          {channelName}
        </div>
        <div style={{ fontSize: '54px', fontWeight: 800, lineHeight: 1.15, marginBottom: '40px' }}>
          {title}
        </div>
        <div style={{
          paddingTop: '30px',
          borderTop: `1px solid rgba(255,255,255,0.15)`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: t.textMuted, fontSize: '22px' }}>Watch on YouTube →</span>
          <span style={{ color: t.accent, fontSize: '22px', fontWeight: 700 }}>{username}</span>
        </div>
      </div>
    </div>
  )
}
