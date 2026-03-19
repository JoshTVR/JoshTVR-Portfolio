'use client'

import { useState, useTransition } from 'react'
import { createProduct, updateProduct, type ProductFormData } from './actions'

const PRODUCT_TYPES = ['physical', 'digital', 'commission'] as const

interface ProductFormProps {
  initial?: Partial<ProductFormData> & { id?: string }
}

export function ProductForm({ initial }: ProductFormProps) {
  const isEdit = Boolean(initial?.id)
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  const [nameEn,      setNameEn]      = useState(initial?.name_en      ?? '')
  const [nameEs,      setNameEs]      = useState(initial?.name_es      ?? '')
  const [descEn,      setDescEn]      = useState(initial?.description_en ?? '')
  const [descEs,      setDescEs]      = useState(initial?.description_es ?? '')
  const [type,        setType]        = useState(initial?.type          ?? 'digital')
  const [priceDollars,setPriceDollars]= useState(initial?.price != null ? (initial.price / 100).toFixed(2) : '')
  const [currency,    setCurrency]    = useState(initial?.currency      ?? 'usd')
  const [stripePriceId, setStripePriceId] = useState(initial?.stripe_price_id ?? '')
  const [stock,       setStock]       = useState<string>(initial?.stock != null ? String(initial.stock) : '')
  const [isActive,    setIsActive]    = useState(initial?.is_active     ?? false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)
    const data: ProductFormData = {
      name_en:        nameEn,
      name_es:        nameEs,
      description_en: descEn,
      description_es: descEs,
      type,
      price:          Math.round(parseFloat(priceDollars || '0') * 100),
      currency,
      stripe_price_id: stripePriceId,
      stock:          stock !== '' ? parseInt(stock, 10) : null,
      is_active:      isActive,
    }
    startTransition(async () => {
      const result = isEdit && initial?.id
        ? await updateProduct(initial.id, data)
        : await createProduct(data)
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
      {serverError && <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.3)' }}>{serverError}</div>}

      <section className="glass" style={{ padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>Names</h3>
        {field('Name (EN)', <input className="admin-input" value={nameEn} onChange={e => setNameEn(e.target.value)} required placeholder="Product name" />)}
        {field('Name (ES)', <input className="admin-input" value={nameEs} onChange={e => setNameEs(e.target.value)} required placeholder="Nombre del producto" />)}
        {field('Description (EN)', <textarea className="admin-input" value={descEn} onChange={e => setDescEn(e.target.value)} required rows={3} style={{ resize: 'vertical' }} />)}
        {field('Description (ES)', <textarea className="admin-input" value={descEs} onChange={e => setDescEs(e.target.value)} required rows={3} style={{ resize: 'vertical' }} />)}
      </section>

      <section className="glass" style={{ padding: '24px', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em', gridColumn: '1 / -1', marginBottom: '4px' }}>Pricing & Type</h3>
        {field('Type', <select className="admin-input" value={type} onChange={e => setType(e.target.value)}>{PRODUCT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select>)}
        {field('Price (USD)', <input type="number" className="admin-input" value={priceDollars} onChange={e => setPriceDollars(e.target.value)} step="0.01" min="0" placeholder="19.99" required />)}
        {field('Currency', <input className="admin-input" value={currency} onChange={e => setCurrency(e.target.value)} placeholder="usd" />)}
        {field('Stock (blank = unlimited)', <input type="number" className="admin-input" value={stock} onChange={e => setStock(e.target.value)} min="0" placeholder="Unlimited" />)}
        {field('Stripe Price ID (optional)', <input className="admin-input" value={stripePriceId} onChange={e => setStripePriceId(e.target.value)} placeholder="price_..." style={{ gridColumn: '1 / -1' }} />)}
      </section>

      <section className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
          Active (visible in store)
        </label>
      </section>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" disabled={isPending} className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '12px 28px' }}>
          {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
        <a href="/admin/store" className="btn btn-ghost" style={{ fontSize: '0.9rem', padding: '12px 28px' }}>Cancel</a>
      </div>
    </form>
  )
}
