'use client'

import { useState, useTransition } from 'react'
import { createService, updateService, type ServiceFormData } from './actions'

interface ServiceFormProps {
  initial?: Partial<ServiceFormData> & { id?: string }
}

export function ServiceForm({ initial }: ServiceFormProps) {
  const isEdit = Boolean(initial?.id)
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  const [titleEn,     setTitleEn]     = useState(initial?.title_en       ?? '')
  const [titleEs,     setTitleEs]     = useState(initial?.title_es       ?? '')
  const [descEn,      setDescEn]      = useState(initial?.description_en ?? '')
  const [descEs,      setDescEs]      = useState(initial?.description_es ?? '')
  const [category,    setCategory]    = useState(initial?.category        ?? '')
  const [priceDollars,setPriceDollars]= useState(initial?.price_from != null ? (initial.price_from / 100).toFixed(2) : '')
  const [currency,    setCurrency]    = useState(initial?.currency        ?? 'usd')
  const [sortOrder,   setSortOrder]   = useState(String(initial?.sort_order ?? 0))
  const [isActive,    setIsActive]    = useState(initial?.is_active       ?? true)

  // Features as a textarea — one per line
  const [featuresText, setFeaturesText] = useState(
    (initial?.features ?? []).join('\n')
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)
    const data: ServiceFormData = {
      title_en:       titleEn,
      title_es:       titleEs,
      description_en: descEn,
      description_es: descEs,
      features:       featuresText.split('\n').map(f => f.trim()).filter(Boolean),
      price_from:     priceDollars !== '' ? Math.round(parseFloat(priceDollars) * 100) : null,
      currency,
      category,
      is_active:      isActive,
      sort_order:     parseInt(sortOrder, 10) || 0,
    }
    startTransition(async () => {
      const result = isEdit && initial?.id
        ? await updateService(initial.id, data)
        : await createService(data)
      if (result?.error) setServerError(result.error)
    })
  }

  const field = (label: string, children: React.ReactNode) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{label}</label>
      {children}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '640px' }}>
      {serverError && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.3)' }}>
          {serverError}
        </div>
      )}

      <section className="glass" style={{ padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>Title & Description</h3>
        {field('Title (EN)', <input className="admin-input" value={titleEn} onChange={e => setTitleEn(e.target.value)} required placeholder="Service title" />)}
        {field('Title (ES)', <input className="admin-input" value={titleEs} onChange={e => setTitleEs(e.target.value)} required placeholder="Título del servicio" />)}
        {field('Description (EN)', <textarea className="admin-input" value={descEn} onChange={e => setDescEn(e.target.value)} required rows={3} style={{ resize: 'vertical' }} />)}
        {field('Description (ES)', <textarea className="admin-input" value={descEs} onChange={e => setDescEs(e.target.value)} required rows={3} style={{ resize: 'vertical' }} />)}
      </section>

      <section className="glass" style={{ padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>Features</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>One feature per line. These appear as bullet points on the service card.</p>
        {field('Features (one per line)', (
          <textarea
            className="admin-input"
            value={featuresText}
            onChange={e => setFeaturesText(e.target.value)}
            rows={6}
            style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem' }}
            placeholder={"3D modeling & rigging\nAnimation & VFX\nRendering & post-processing"}
          />
        ))}
      </section>

      <section className="glass" style={{ padding: '24px', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em', gridColumn: '1 / -1', marginBottom: '4px' }}>Pricing & Meta</h3>
        {field('Category', <input className="admin-input" value={category} onChange={e => setCategory(e.target.value)} required placeholder="e.g. 3d, backend, vr" />)}
        {field('Starting Price (blank = contact for price)', <input type="number" className="admin-input" value={priceDollars} onChange={e => setPriceDollars(e.target.value)} step="0.01" min="0" placeholder="99.00" />)}
        {field('Currency', <input className="admin-input" value={currency} onChange={e => setCurrency(e.target.value)} placeholder="usd" />)}
        {field('Sort Order', <input type="number" className="admin-input" value={sortOrder} onChange={e => setSortOrder(e.target.value)} min="0" />)}
      </section>

      <section className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
          Active (visible on public services page)
        </label>
      </section>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" disabled={isPending} className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '12px 28px' }}>
          {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Service'}
        </button>
        <a href="/admin/services" className="btn btn-ghost" style={{ fontSize: '0.9rem', padding: '12px 28px' }}>Cancel</a>
      </div>
    </form>
  )
}
