'use client'

import { useState } from 'react'
import { createTestimonial, updateTestimonial, type TestimonialFormData } from './actions'

interface Props {
  initial?: TestimonialFormData & { id: string }
}

export function TestimonialForm({ initial }: Props) {
  const isEdit = !!initial

  const [quoteEn,      setQuoteEn]      = useState(initial?.quote_en ?? '')
  const [quoteEs,      setQuoteEs]      = useState(initial?.quote_es ?? '')
  const [authorName,   setAuthorName]   = useState(initial?.author_name ?? '')
  const [roleEn,       setRoleEn]       = useState(initial?.author_role_en ?? '')
  const [roleEs,       setRoleEs]       = useState(initial?.author_role_es ?? '')
  const [isVisible,    setIsVisible]    = useState(initial?.is_visible ?? true)
  const [sortOrder,    setSortOrder]    = useState(initial?.sort_order ?? 0)
  const [error,        setError]        = useState('')
  const [submitting,   setSubmitting]   = useState(false)

  const fieldStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none',
  }
  const labelStyle = { fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' as const, marginBottom: '6px' }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!quoteEn || !quoteEs || !authorName || !roleEn || !roleEs) {
      setError('All fields are required.')
      return
    }
    setError('')
    setSubmitting(true)
    const data: TestimonialFormData = {
      quote_en: quoteEn, quote_es: quoteEs,
      author_name: authorName,
      author_role_en: roleEn, author_role_es: roleEs,
      is_visible: isVisible, sort_order: sortOrder,
    }
    const res = isEdit
      ? await updateTestimonial(initial.id, data)
      : await createTestimonial(data)
    if (res?.error) { setError(res.error); setSubmitting(false) }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '680px' }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Quote (EN) *</label>
          <textarea value={quoteEn} onChange={e => setQuoteEn(e.target.value)} rows={4} placeholder="&quot;Working with Joshua was…&quot;" style={{ ...fieldStyle, resize: 'vertical' }} />
        </div>
        <div>
          <label style={labelStyle}>Quote (ES) *</label>
          <textarea value={quoteEs} onChange={e => setQuoteEs(e.target.value)} rows={4} placeholder="&quot;Trabajar con Joshua fue…&quot;" style={{ ...fieldStyle, resize: 'vertical' }} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Author name *</label>
        <input value={authorName} onChange={e => setAuthorName(e.target.value)} placeholder="e.g. Carlos Ramírez" style={fieldStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Role / Title (EN) *</label>
          <input value={roleEn} onChange={e => setRoleEn(e.target.value)} placeholder="e.g. CEO at Roboarts Club" style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Role / Title (ES) *</label>
          <input value={roleEs} onChange={e => setRoleEs(e.target.value)} placeholder="e.g. CEO en Roboarts Club" style={fieldStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Sort order</label>
          <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} style={fieldStyle} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '22px' }}>
          <input type="checkbox" id="visible" checked={isVisible} onChange={e => setIsVisible(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
          <label htmlFor="visible" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>Visible on portfolio</label>
        </div>
      </div>

      {error && <p style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '10px 28px' }}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create testimonial'}
        </button>
        <a href="/admin/testimonials" style={{ padding: '10px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
          Cancel
        </a>
      </div>
    </form>
  )
}
