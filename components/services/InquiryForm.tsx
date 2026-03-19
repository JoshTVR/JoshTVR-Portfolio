'use client'

import { useState, type FormEvent } from 'react'

interface ServiceOption {
  id:    string
  title: string
}

interface InquiryFormProps {
  services:      ServiceOption[]
  preselectedId?: string
  t: {
    title:         string
    name:          string
    email:         string
    service:       string
    budget:        string
    message:       string
    send:          string
    success:       string
    selectService: string
  }
  onClose?: () => void
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function InquiryForm({ services, preselectedId, t, onClose }: InquiryFormProps) {
  const [status,  setStatus]  = useState<Status>('idle')
  const [errMsg,  setErrMsg]  = useState('')
  const [service, setService] = useState(preselectedId ?? '')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrMsg('')

    const form = e.currentTarget
    const get  = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)?.value ?? ''

    const body = {
      name:       get('name'),
      email:      get('email'),
      message:    get('message'),
      budget:     get('budget') || null,
      service_id: service || null,
    }

    try {
      const res  = await fetch('/api/inquiries', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      const json = await res.json() as { error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Failed to send')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>✓</div>
        <p style={{ color: '#10b981', fontWeight: 600, fontSize: '1rem', marginBottom: '8px' }}>
          {t.success}
        </p>
        {onClose && (
          <button onClick={onClose} className="btn btn-ghost" style={{ fontSize: '0.85rem', marginTop: '16px', padding: '10px 22px' }}>
            Close
          </button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize:   '1.2rem',
          fontWeight: 700,
          color:      'var(--text-primary)',
          marginBottom: '4px',
        }}
      >
        {t.title}
      </h3>

      {status === 'error' && (
        <p style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '0.85rem', border: '1px solid rgba(239,68,68,0.25)' }}>
          {errMsg}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <label style={labelStyle}>{t.name}</label>
          <input name="name" required className="admin-input" placeholder={t.name} />
        </div>
        <div>
          <label style={labelStyle}>{t.email}</label>
          <input name="email" type="email" required className="admin-input" placeholder={t.email} />
        </div>
      </div>

      {services.length > 0 && (
        <div>
          <label style={labelStyle}>{t.service}</label>
          <select
            className="admin-input"
            value={service}
            onChange={e => setService(e.target.value)}
          >
            <option value="">{t.selectService}</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label style={labelStyle}>{t.budget}</label>
        <input name="budget" className="admin-input" placeholder="e.g. $500–$1,000" />
      </div>

      <div>
        <label style={labelStyle}>{t.message}</label>
        <textarea name="message" required className="admin-input" placeholder={t.message} rows={5} style={{ resize: 'vertical' }} />
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn btn-primary"
          style={{ fontSize: '0.9rem', padding: '12px 28px' }}
        >
          {status === 'submitting' ? 'Sending…' : t.send}
        </button>
        {onClose && (
          <button type="button" onClick={onClose} className="btn btn-ghost" style={{ fontSize: '0.9rem', padding: '12px 28px' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

const labelStyle: React.CSSProperties = {
  display:       'block',
  fontSize:      '0.78rem',
  fontWeight:    600,
  color:         'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom:  '6px',
}
