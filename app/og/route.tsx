import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title       = searchParams.get('title')       ?? 'Joshua Hernandez'
  const description = searchParams.get('description') ?? 'VR & Digital Business Developer'

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'flex-end',
        background: '#0f172a', padding: '64px', fontFamily: 'system-ui, sans-serif',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Blue orb */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-120px', display: 'flex',
          width: '520px', height: '520px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 65%)',
        }} />
        {/* Violet orb */}
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-80px', display: 'flex',
          width: '380px', height: '380px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%)',
        }} />

        {/* Domain badge */}
        <div style={{
          display: 'flex', alignItems: 'center', marginBottom: '28px',
          background: 'rgba(59,130,246,0.1)', borderRadius: '100px', padding: '6px 18px',
          border: '1px solid rgba(59,130,246,0.25)',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', marginRight: 10 }} />
          <span style={{ color: '#86efac', fontSize: 16, fontWeight: 700, letterSpacing: '0.06em' }}>
            joshtvr.com · Available for work
          </span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: 72, fontWeight: 800, lineHeight: 1.05, marginBottom: 20,
          maxWidth: 900, letterSpacing: '-2px', color: '#f1f5f9', display: 'flex',
        }}>
          {title}
        </div>

        {/* Description */}
        <div style={{ fontSize: 26, color: '#94a3b8', maxWidth: 820, lineHeight: 1.55, display: 'flex' }}>
          {description}
        </div>

        {/* Bottom gradient bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, display: 'flex',
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
        }} />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
