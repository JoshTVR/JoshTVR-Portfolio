'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createCv } from './actions'

const SLUG_OPTIONS = [
  { slug: 'vr-developer',    label: 'VR/XR Developer',  locale: 'en' },
  { slug: 'vr-developer',    label: 'Desarrollador VR',  locale: 'es' },
  { slug: '3d-artist',       label: '3D Artist',         locale: 'en' },
  { slug: '3d-artist',       label: 'Artista 3D',        locale: 'es' },
  { slug: 'data-scientist',  label: 'Data Scientist',    locale: 'en' },
  { slug: 'data-scientist',  label: 'Científico de Datos', locale: 'es' },
  { slug: 'general',         label: 'General (EN)',      locale: 'en' },
  { slug: 'general',         label: 'General (ES)',      locale: 'es' },
]

export function CvUploadForm() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [slug, setSlug] = useState('')
  const [locale, setLocale] = useState('en')
  const [title, setTitle] = useState('')
  const [role, setRole] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  function handlePresetChange(val: string) {
    const [s, l] = val.split('|')
    const opt = SLUG_OPTIONS.find(o => o.slug === s && o.locale === l)
    if (!opt) return
    setSlug(s)
    setLocale(l)
    setTitle(opt.label)
    setRole(opt.label)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !slug || !locale || !title) { setError('All fields are required.'); return }
    setError('')
    setUploading(true)
    try {
      const supabase = createClient()
      const fileName = `${locale}-${slug}-${Date.now()}.pdf`
      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, file, { contentType: 'application/pdf', upsert: true })
      if (uploadError) { setError(uploadError.message); return }
      const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(fileName)
      const res = await createCv({
        title,
        role,
        locale,
        slug,
        file_url: urlData.publicUrl,
        is_featured: isFeatured,
        is_active: true,
        sort_order: 0,
      })
      if (res.error) { setError(res.error); return }
      window.location.reload()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary"
        style={{ fontSize: '0.88rem', padding: '10px 20px' }}
      >
        + Upload CV
      </button>
    )
  }

  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '12px', maxWidth: '480px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem' }}>Upload CV PDF</h3>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Quick select</label>
          <select
            onChange={e => handlePresetChange(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
          >
            <option value="">— choose preset —</option>
            {SLUG_OPTIONS.map(o => (
              <option key={`${o.slug}|${o.locale}`} value={`${o.slug}|${o.locale}`}>{o.label} ({o.locale.toUpperCase()})</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. VR/XR Developer" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.88rem' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Locale</label>
            <select value={locale} onChange={e => setLocale(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.88rem' }}>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
          </div>
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Slug (for public URL)</label>
          <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="e.g. vr-developer" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.88rem' }} />
          {slug && locale && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Public URL: /{locale}/cv/{slug}</p>}
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>PDF File</label>
          <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] ?? null)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.88rem' }} />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
          Set as featured (shown in Footer for this locale)
        </label>
        {error && <p style={{ color: '#f87171', fontSize: '0.82rem' }}>{error}</p>}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => setOpen(false)} style={{ padding: '8px 18px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.88rem', cursor: 'pointer' }}>Cancel</button>
          <button type="submit" disabled={uploading} className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '8px 20px' }}>
            {uploading ? 'Uploading…' : 'Upload & Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
