'use client'

import { useState, useRef, useTransition } from 'react'
import Image from 'next/image'
import { TipTapEditor } from './TipTapEditor'
import { BilingualTabs } from './BilingualTabs'
import { createProject, updateProject, type ProjectFormData } from '@/app/admin/projects/actions'

const CATEGORIES = ['vr', 'ar', 'data', 'backend', 'design', '3d', 'video'] as const

interface ProjectFormProps {
  initial?: Partial<ProjectFormData> & { id?: string }
}

export function ProjectForm({ initial }: ProjectFormProps) {
  const isEdit     = Boolean(initial?.id)
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [titleEn,       setTitleEn]       = useState(initial?.title_en       ?? '')
  const [titleEs,       setTitleEs]       = useState(initial?.title_es       ?? '')
  const [descEn,        setDescEn]        = useState(initial?.description_en ?? '')
  const [descEs,        setDescEs]        = useState(initial?.description_es ?? '')
  const [contentEn,     setContentEn]     = useState(initial?.content_en     ?? '')
  const [contentEs,     setContentEs]     = useState(initial?.content_es     ?? '')
  const [category,      setCategory]      = useState(initial?.category       ?? 'vr')
  const [techTags,      setTechTags]      = useState(
    Array.isArray(initial?.tech_tags) ? (initial.tech_tags as unknown as string[]).join(', ') : (initial?.tech_tags ?? '')
  )
  const [githubUrl,     setGithubUrl]     = useState(initial?.github_url     ?? '')
  const [demoUrl,       setDemoUrl]       = useState(initial?.demo_url       ?? '')
  const [coverImage,    setCoverImage]    = useState(initial?.cover_image    ?? '')
  const [isPublished,   setIsPublished]   = useState(initial?.is_published   ?? false)
  const [isFeatured,    setIsFeatured]    = useState(initial?.is_featured    ?? false)
  const [sortOrder,     setSortOrder]     = useState(initial?.sort_order     ?? 0)
  const [uploading,     setUploading]     = useState(false)
  const [uploadError,   setUploadError]   = useState<string | null>(null)

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)

    const form = new FormData()
    form.append('file', file)
    form.append('bucket', 'project-images')

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const json = await res.json() as { url?: string; error?: string }
      if (!res.ok || !json.url) throw new Error(json.error ?? 'Upload failed')
      setCoverImage(json.url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)

    const data: ProjectFormData = {
      title_en:       titleEn,
      title_es:       titleEs,
      description_en: descEn,
      description_es: descEs,
      content_en:     contentEn,
      content_es:     contentEs,
      category,
      tech_tags:      techTags,
      github_url:     githubUrl,
      demo_url:       demoUrl,
      cover_image:    coverImage,
      is_published:   isPublished,
      is_featured:    isFeatured,
      sort_order:     sortOrder,
    }

    startTransition(async () => {
      let result: { error?: string } | undefined
      if (isEdit && initial?.id) {
        result = await updateProject(initial.id, data)
      } else {
        result = await createProject(data)
      }
      if (result?.error) setServerError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '860px' }}>

      {serverError && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.9rem' }}>
          {serverError}
        </div>
      )}

      {/* Titles */}
      <section className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h3 style={sectionHeading}>Titles</h3>
        <BilingualTabs
          label="Title"
          en={<input className="admin-input" value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="Project title (English)" required />}
          es={<input className="admin-input" value={titleEs} onChange={e => setTitleEs(e.target.value)} placeholder="Título del proyecto (Español)" required />}
        />
        <div style={{ marginTop: '20px' }}>
          <BilingualTabs
            label="Short description"
            en={<textarea className="admin-input" value={descEn} onChange={e => setDescEn(e.target.value)} placeholder="Short description (English)" rows={3} required style={{ resize: 'vertical' }} />}
            es={<textarea className="admin-input" value={descEs} onChange={e => setDescEs(e.target.value)} placeholder="Descripción corta (Español)" rows={3} required style={{ resize: 'vertical' }} />}
          />
        </div>
      </section>

      {/* Rich content */}
      <section className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h3 style={sectionHeading}>Rich Content</h3>
        <BilingualTabs
          label="Detailed content"
          en={
            <TipTapEditor
              content={contentEn}
              onChange={setContentEn}
              placeholder="Write the full project description in English…"
            />
          }
          es={
            <TipTapEditor
              content={contentEs}
              onChange={setContentEs}
              placeholder="Escribe la descripción completa del proyecto en Español…"
            />
          }
        />
      </section>

      {/* Cover image */}
      <section className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h3 style={sectionHeading}>Cover Image</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {coverImage && (
            <div style={{ position: 'relative', width: '180px', height: '101px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
              <Image src={coverImage} alt="cover" fill style={{ objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <input className="admin-input" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="Image URL (or upload below)" style={{ marginBottom: '10px' }} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn btn-ghost"
              style={{ fontSize: '0.85rem', padding: '8px 18px' }}
            >
              {uploading ? 'Uploading…' : 'Upload Image'}
            </button>
            {uploadError && <p style={{ color: '#f87171', fontSize: '0.82rem', marginTop: '8px' }}>{uploadError}</p>}
          </div>
        </div>
      </section>

      {/* Metadata */}
      <section className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h3 style={sectionHeading}>Metadata</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={fieldLabel}>Category</label>
            <select
              className="admin-input"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={fieldLabel}>Sort Order</label>
            <input
              type="number"
              className="admin-input"
              value={sortOrder}
              onChange={e => setSortOrder(Number(e.target.value))}
              min={0}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={fieldLabel}>Tech Tags (comma-separated)</label>
            <input
              className="admin-input"
              value={techTags}
              onChange={e => setTechTags(e.target.value)}
              placeholder="Unity, C#, Blender, etc."
            />
          </div>

          <div>
            <label style={fieldLabel}>GitHub URL</label>
            <input
              type="url"
              className="admin-input"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              placeholder="https://github.com/…"
            />
          </div>

          <div>
            <label style={fieldLabel}>Demo URL</label>
            <input
              type="url"
              className="admin-input"
              value={demoUrl}
              onChange={e => setDemoUrl(e.target.value)}
              placeholder="https://demo.example.com"
            />
          </div>
        </div>
      </section>

      {/* Toggles */}
      <section className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h3 style={sectionHeading}>Visibility</h3>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={isPublished}
              onChange={e => setIsPublished(e.target.checked)}
              style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }}
            />
            Published
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={e => setIsFeatured(e.target.checked)}
              style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }}
            />
            Featured
          </label>
        </div>
      </section>

      {/* Submit */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary"
          style={{ fontSize: '0.9rem', padding: '12px 28px' }}
        >
          {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Project'}
        </button>
        <a href="/admin/projects" className="btn btn-ghost" style={{ fontSize: '0.9rem', padding: '12px 28px' }}>
          Cancel
        </a>
      </div>
    </form>
  )
}

const sectionHeading: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '16px',
}

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '6px',
}
