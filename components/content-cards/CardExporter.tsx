'use client'

import React, { useRef, useState } from 'react'

interface CardExporterProps {
  /** One React element per slide (single card = array of 1) */
  slides: React.ReactElement[]
  onExport: (urls: string[]) => void
  label?: string
}

export function CardExporter({ slides, onExport, label = 'Generate Images' }: CardExporterProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const refs = useRef<(HTMLDivElement | null)[]>([])

  async function handleExport() {
    setLoading(true)
    setError('')
    try {
      const { toPng } = await import('html-to-image')
      const urls: string[] = []

      for (let i = 0; i < slides.length; i++) {
        const el = refs.current[i]
        if (!el) continue

        const dataUrl = await toPng(el, {
          width: 1080,
          height: 1080,
          pixelRatio: 1,
          cacheBust: true,
        })

        // Convert data URL to blob and upload
        const blob = await (await fetch(dataUrl)).blob()
        const formData = new FormData()
        formData.append('file', blob, `card-slide-${i + 1}.png`)
        formData.append('bucket', 'post-covers')

        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        if (!res.ok) throw new Error(`Upload failed for slide ${i + 1}`)
        const json = await res.json()
        urls.push(json.url)
      }

      onExport(urls)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hidden render area — positioned off-screen */}
      <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', zIndex: -1 }}>
        {slides.map((slide, i) => (
          <div
            key={i}
            ref={el => { refs.current[i] = el }}
            style={{ width: '1080px', height: '1080px', overflow: 'hidden' }}
          >
            {slide}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleExport}
        disabled={loading}
        style={{
          padding: '10px 22px',
          borderRadius: '8px',
          background: loading ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.2)',
          color: loading ? '#94a3b8' : '#a78bfa',
          border: '1px solid rgba(124,58,237,0.3)',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 150ms ease',
        }}
      >
        {loading ? `Generating${slides.length > 1 ? ` (${slides.length} slides)` : ''}…` : `🎨 ${label}`}
      </button>

      {error && (
        <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '8px' }}>{error}</p>
      )}
    </div>
  )
}
