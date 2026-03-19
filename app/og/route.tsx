import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title       = searchParams.get('title')       ?? 'JoshTVR'
  const description = searchParams.get('description') ?? 'VR & Digital Business Developer'

  return new ImageResponse(
    (
      <div
        style={{
          width:      '100%',
          height:     '100%',
          display:    'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #1a0a2e 100%)',
          padding:    '64px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Grid lines */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', opacity: 0.1 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#7c3aed" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Accent glow */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />

        {/* Tag */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: '20px', padding: '6px 16px', color: '#9d5cf6', fontSize: '16px', fontWeight: 700 }}>
            joshtvr.com
          </div>
        </div>

        {/* Title */}
        <div style={{ fontSize: '64px', fontWeight: 800, color: '#f0f0f0', lineHeight: 1.1, marginBottom: '20px', maxWidth: '900px', letterSpacing: '-2px' }}>
          {title}
        </div>

        {/* Description */}
        <div style={{ fontSize: '24px', color: '#888899', maxWidth: '800px', lineHeight: 1.5 }}>
          {description}
        </div>

        {/* Bottom bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #7c3aed, #9d5cf6, #7c3aed)' }} />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
