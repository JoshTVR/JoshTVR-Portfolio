'use client'

import React, { useState, useTransition } from 'react'
import { importContentPlan, type ImportedPost } from './actions'

type ParsedPreview = ImportedPost & { _key: number }

export function PlanImporter() {
  const [raw,         setRaw]         = useState('')
  const [preview,     setPreview]     = useState<ParsedPreview[] | null>(null)
  const [parseError,  setParseError]  = useState('')
  const [importMsg,   setImportMsg]   = useState('')
  const [isPending,   startTransition] = useTransition()

  function handleParse() {
    setParseError('')
    setImportMsg('')
    setPreview(null)
    try {
      const parsed = JSON.parse(raw.trim())
      if (!Array.isArray(parsed)) throw new Error('Expected a JSON array at the top level')
      if (parsed.length === 0) throw new Error('Array is empty')

      // Light validation
      for (let i = 0; i < parsed.length; i++) {
        if (!parsed[i].title_en) throw new Error(`Post at index ${i} is missing "title_en"`)
      }

      setPreview(parsed.map((p, i) => ({ ...p, _key: i })))
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'Invalid JSON')
    }
  }

  function handleImport() {
    if (!preview || preview.length === 0) return
    startTransition(async () => {
      const res = await importContentPlan(preview.map(({ _key, ...p }) => p))
      if (res.error) setImportMsg(`Error: ${res.error}`)
      else {
        setImportMsg(`✅ Imported ${res.imported} posts successfully!`)
        setPreview(null)
        setRaw('')
      }
    })
  }

  const byType: Record<string, number> = {}
  if (preview) {
    for (const p of preview) {
      const t = p.card_type ?? p.type ?? 'post'
      byType[t] = (byType[t] ?? 0) + 1
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '720px' }}>
      <section className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
        <h3 style={sectionHead}>Paste Claude Response (JSON Array)</h3>
        <textarea
          value={raw}
          onChange={e => { setRaw(e.target.value); setPreview(null); setParseError(''); setImportMsg('') }}
          placeholder='[{"title_en": "...", "card_type": "code_tip", ...}, ...]'
          rows={14}
          style={{
            width: '100%', fontFamily: 'monospace', fontSize: '0.78rem',
            background: 'rgba(0,0,0,0.3)', border: `1px solid ${parseError ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '8px', padding: '12px', color: 'var(--text-muted)',
            resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box',
          }}
        />
        {parseError && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '6px' }}>{parseError}</p>}
        <div style={{ display: 'flex', gap: '10px', marginTop: '12px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleParse}
            disabled={!raw.trim()}
            style={{ padding: '9px 20px', borderRadius: '8px', background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.4)', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
          >
            Parse & Preview
          </button>
          {importMsg && <span style={{ fontSize: '0.85rem', color: importMsg.startsWith('✅') ? '#34d399' : '#f87171' }}>{importMsg}</span>}
        </div>
      </section>

      {preview && (
        <section className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ ...sectionHead, margin: 0 }}>Preview — {preview.length} posts</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                {Object.entries(byType).map(([type, count]) => (
                  <span key={type} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '20px', background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>
                    {type}: {count}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleImport}
              disabled={isPending}
              style={{ padding: '10px 22px', borderRadius: '8px', background: '#7c3aed', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
            >
              {isPending ? 'Importing…' : `Create ${preview.length} posts`}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '400px', overflowY: 'auto' }}>
            {preview.map((p, i) => (
              <div key={p._key} style={{ display: 'grid', gridTemplateColumns: '28px 100px 1fr 120px', gap: '10px', alignItems: 'center', padding: '8px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>#{i + 1}</span>
                <span style={{ color: '#a78bfa', fontSize: '0.72rem', fontWeight: 600 }}>{p.card_type ?? p.type}</span>
                <span style={{ color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title_en}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textAlign: 'right' }}>
                  {p.scheduled_at ? new Date(p.scheduled_at).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No date'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

const sectionHead: React.CSSProperties = {
  fontFamily: 'var(--font-heading)', fontSize: '0.88rem', fontWeight: 700,
  color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px',
}
