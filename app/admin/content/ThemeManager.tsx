'use client'

import React, { useState, useTransition } from 'react'
import type { ThemeRotationState, ManualOverride } from '@/lib/theme-engine'
import { resolveThemeForDate } from '@/lib/theme-engine'
import { THEMES, BASE_THEMES, SEASONAL_WINDOWS } from '@/components/content-cards/themes'
import { addManualOverride, removeManualOverride } from './actions'

function pad(n: number) { return String(n).padStart(2, '0') }

export function ThemeManager({ themeState }: { themeState: ThemeRotationState }) {
  const [isPending,   startTransition] = useTransition()
  const [msg,         setMsg]          = useState('')

  // Form for new override
  const [ovStart, setOvStart] = useState('')
  const [ovEnd,   setOvEnd]   = useState('')
  const [ovTheme, setOvTheme] = useState<string>('midnight')
  const [ovLabel, setOvLabel] = useState('')

  function handleAddOverride() {
    if (!ovStart || !ovEnd) return
    startTransition(async () => {
      const res = await addManualOverride({ start: ovStart, end: ovEnd, theme: ovTheme as ManualOverride['theme'], label: ovLabel || undefined })
      setMsg(res.error ?? 'Override added')
      if (!res.error) { setOvStart(''); setOvEnd(''); setOvLabel('') }
    })
  }

  function handleRemoveOverride(i: number) {
    startTransition(async () => {
      const res = await removeManualOverride(i)
      setMsg(res.error ?? 'Removed')
    })
  }

  // Year overview
  const year = themeState.year
  const months = Array.from({ length: 12 }, (_, i) => {
    const ym  = `${year}-${pad(i + 1)}`
    const d1  = `${ym}-01`
    const theme = resolveThemeForDate(d1, themeState)
    const t   = THEMES[theme]
    const name = new Date(year, i, 1).toLocaleString('en', { month: 'long' })
    return { ym, name, theme, accent: t?.accent ?? '#7c3aed', label: t?.label ?? theme }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '720px' }}>

      {/* Year overview */}
      <section className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
        <h3 style={sectionHead}>{year} Theme Rotation</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
          {months.map(m => (
            <div key={m.ym} style={{
              padding: '10px 12px', borderRadius: '8px',
              background: `${m.accent}15`,
              border: `1px solid ${m.accent}40`,
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{m.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.accent, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: m.accent }}>{m.label}</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '12px' }}>
          Cycle used so far: {themeState.used_this_cycle.join(' → ') || 'none'}
        </p>
      </section>

      {/* Seasonal windows */}
      <section className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
        <h3 style={sectionHead}>Seasonal Auto-Overrides</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          These override the rotation automatically — no action needed.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {SEASONAL_WINDOWS.map(sw => {
            const t = THEMES[sw.theme]
            return (
              <div key={sw.theme} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', background: `${t.accent}12`, border: `1px solid ${t.accent}30` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.accent, display: 'inline-block' }} />
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: t.accent }}>{t.label}</span>
                </div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  {sw.startMD.replace('-', '/')} – {sw.endMD.replace('-', '/')} (auto)
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Manual overrides */}
      <section className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
        <h3 style={sectionHead}>Manual Date-Range Overrides</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Force a specific theme for a date range (e.g., Python Week). Does not affect the rest of the year's rotation.
        </p>

        {/* Add override form */}
        <div style={{ display: 'grid', gridTemplateColumns: '130px 130px 160px 1fr auto', gap: '8px', marginBottom: '12px', alignItems: 'end' }}>
          <div>
            <label style={lbl}>Start</label>
            <input type="date" className="admin-input" value={ovStart} onChange={e => setOvStart(e.target.value)} style={{ fontSize: '0.82rem' }} />
          </div>
          <div>
            <label style={lbl}>End</label>
            <input type="date" className="admin-input" value={ovEnd} onChange={e => setOvEnd(e.target.value)} style={{ fontSize: '0.82rem' }} />
          </div>
          <div>
            <label style={lbl}>Theme</label>
            <select className="admin-input" value={ovTheme} onChange={e => setOvTheme(e.target.value)} style={{ fontSize: '0.82rem' }}>
              {BASE_THEMES.map(th => <option key={th} value={th}>{THEMES[th].label}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Label (optional)</label>
            <input className="admin-input" value={ovLabel} onChange={e => setOvLabel(e.target.value)} placeholder="Python Week" style={{ fontSize: '0.82rem' }} />
          </div>
          <button type="button" onClick={handleAddOverride} disabled={isPending || !ovStart || !ovEnd}
            style={{ padding: '0 14px', height: '40px', borderRadius: '7px', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
            Add
          </button>
        </div>

        {msg && <p style={{ fontSize: '0.78rem', color: '#34d399', marginBottom: '10px' }}>{msg}</p>}

        {themeState.manual_overrides.length === 0 ? (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No manual overrides set.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {themeState.manual_overrides.map((ov, i) => {
              const t = THEMES[ov.theme]
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '7px', background: `${t?.accent ?? '#7c3aed'}12`, border: `1px solid ${t?.accent ?? '#7c3aed'}25` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t?.accent ?? '#7c3aed', display: 'inline-block' }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {ov.start} → {ov.end}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: t?.accent ?? '#7c3aed' }}>{t?.label ?? ov.theme}</span>
                    {ov.label && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({ov.label})</span>}
                  </div>
                  <button
                    onClick={() => handleRemoveOverride(i)}
                    disabled={isPending}
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

const sectionHead: React.CSSProperties = {
  fontFamily: 'var(--font-heading)', fontSize: '0.88rem', fontWeight: 700,
  color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px',
}
const lbl: React.CSSProperties = {
  display: 'block', fontSize: '0.72rem', fontWeight: 600,
  color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px',
}
