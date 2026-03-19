'use client'

import { useState, useTransition } from 'react'
import { saveSettings } from './actions'

interface Props {
  storeVisible: boolean
  sectionsVisible: Record<string, boolean>
}

export function SettingsForm({ storeVisible, sectionsVisible }: Props) {
  const [store,       setStore]       = useState(storeVisible)
  const [ghStats,     setGhStats]     = useState(sectionsVisible.github_stats ?? true)
  const [testimonials,setTestimonials]= useState(sectionsVisible.testimonials ?? true)
  const [saved,       setSaved]       = useState(false)
  const [isPending,   startTransition]= useTransition()

  function handleSave() {
    setSaved(false)
    startTransition(async () => {
      await saveSettings({
        store_visible: store,
        sections_visible: {
          github_stats: ghStats,
          testimonials,
          store_nav: store,
        },
      })
      setSaved(true)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>

      {/* Store toggle */}
      <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h2 style={sectionTitle}>Store</h2>
        <Toggle
          label="Enable store"
          description="Show the /store route and navigation link. Disable to hide the store from visitors while keeping products in the database."
          checked={store}
          onChange={(v) => { setStore(v) }}
        />
      </div>

      {/* Section visibility */}
      <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h2 style={sectionTitle}>Sections</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Toggle
            label="GitHub Stats"
            description="Show the GitHub contribution heatmap and language stats section on the home page."
            checked={ghStats}
            onChange={setGhStats}
          />
          <Toggle
            label="Testimonials"
            description="Show the testimonials section on the home page."
            checked={testimonials}
            onChange={setTestimonials}
          />
        </div>
      </div>

      {/* Save */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="btn btn-primary"
          style={{ fontSize: '0.9rem', padding: '12px 28px' }}
        >
          {isPending ? 'Saving…' : 'Save Settings'}
        </button>
        {saved && (
          <span style={{ fontSize: '0.88rem', color: '#10b981', fontWeight: 500 }}>
            ✓ Saved
          </span>
        )}
      </div>
    </div>
  )
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
      <div>
        <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem', marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          flexShrink: 0,
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 200ms ease',
          background: checked ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
          boxShadow: checked ? '0 0 12px var(--accent-glow)' : 'none',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: checked ? '22px' : '3px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 200ms ease',
          }}
        />
      </button>
    </div>
  )
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '20px',
}
