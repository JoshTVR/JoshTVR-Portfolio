'use client'

import { useState, useTransition, useRef } from 'react'
import { BilingualTabs } from './BilingualTabs'
import { TipTapEditor } from './TipTapEditor'
import { createPost, updatePost, type PostFormData } from '@/app/admin/posts/actions'

const POST_TYPES = ['post', 'devlog', 'announcement', 'tutorial'] as const

interface Project { id: string; title_en: string }

interface PostFormProps {
  initial?: Partial<PostFormData> & { id?: string }
  projects: Project[]
}

const label = (text: string): React.CSSProperties => ({
  display: 'block', fontSize: '0.78rem', fontWeight: 600,
  color: 'var(--text-muted)', textTransform: 'uppercase',
  letterSpacing: '0.06em', marginBottom: '6px',
})

const heading: React.CSSProperties = {
  fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700,
  color: 'var(--text-primary)', textTransform: 'uppercase',
  letterSpacing: '0.07em', marginBottom: '16px',
}

export function PostForm({ initial, projects }: PostFormProps) {
  const isEdit = Boolean(initial?.id)
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [titleEn,     setTitleEn]     = useState(initial?.title_en     ?? '')
  const [titleEs,     setTitleEs]     = useState(initial?.title_es     ?? '')
  const [excerptEn,   setExcerptEn]   = useState(initial?.excerpt_en   ?? '')
  const [excerptEs,   setExcerptEs]   = useState(initial?.excerpt_es   ?? '')
  const [contentEn,   setContentEn]   = useState(initial?.content_en   ?? '')
  const [contentEs,   setContentEs]   = useState(initial?.content_es   ?? '')
  const [coverImage,  setCoverImage]  = useState(initial?.cover_image  ?? '')
  const [youtubeUrl,  setYoutubeUrl]  = useState(initial?.youtube_url  ?? '')
  const [projectId,   setProjectId]   = useState(initial?.project_id   ?? '')
  const [type,        setType]        = useState(initial?.type         ?? 'post')
  const [tags,        setTags]        = useState(
    Array.isArray((initial as { tags?: string[] })?.tags)
      ? ((initial as { tags?: string[] }).tags ?? []).join(', ')
      : (initial?.tags ?? '')
  )
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false)

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    const form = new FormData()
    form.append('file', file)
    form.append('bucket', 'post-covers')
    try {
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: form })
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
    const data: PostFormData = {
      title_en: titleEn, title_es: titleEs,
      excerpt_en: excerptEn, excerpt_es: excerptEs,
      content_en: contentEn, content_es: contentEs,
      cover_image: coverImage, youtube_url: youtubeUrl,
      project_id: projectId, type, tags, is_published: isPublished,
    }
    startTransition(async () => {
      const result = isEdit && initial?.id
        ? await updatePost(initial.id, data)
        : await createPost(data)
      if (result?.error) setServerError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '860px' }}>

      {serverError && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.3)' }}>
          {serverError}
        </div>
      )}

      {/* Titles + Excerpts */}
      <section className="glass" style={{ padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={heading}>Titles & Excerpts</h3>
        <BilingualTabs
          label="Title"
          en={<input className="admin-input" value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="Post title (English)" required />}
          es={<input className="admin-input" value={titleEs} onChange={e => setTitleEs(e.target.value)} placeholder="Título del post (Español)" required />}
        />
        <BilingualTabs
          label="Excerpt (short description for cards)"
          en={<textarea className="admin-input" value={excerptEn} onChange={e => setExcerptEn(e.target.value)} placeholder="Short description shown in the feed (English)" rows={2} style={{ resize: 'vertical' }} />}
          es={<textarea className="admin-input" value={excerptEs} onChange={e => setExcerptEs(e.target.value)} placeholder="Descripción corta para el feed (Español)" rows={2} style={{ resize: 'vertical' }} />}
        />
      </section>

      {/* Rich content */}
      <section className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h3 style={heading}>Content</h3>
        <BilingualTabs
          label="Full content"
          en={<TipTapEditor content={contentEn} onChange={setContentEn} placeholder="Write the full post in English…" />}
          es={<TipTapEditor content={contentEs} onChange={setContentEs} placeholder="Escribe el post completo en Español…" />}
        />
      </section>

      {/* Media */}
      <section className="glass" style={{ padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={heading}>Media</h3>

        <div>
          <span style={label('Cover Image')}>Cover Image</span>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {coverImage && (
              <img src={coverImage} alt="" style={{ width: 120, height: 68, objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <input className="admin-input" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="Image URL (or upload)" style={{ marginBottom: '8px' }} />
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: 'none' }} />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn btn-ghost" style={{ fontSize: '0.82rem', padding: '7px 14px' }}>
                {uploading ? 'Uploading…' : 'Upload Image'}
              </button>
              {uploadError && <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '6px' }}>{uploadError}</p>}
            </div>
          </div>
        </div>

        <div>
          <span style={label('YouTube URL')}>YouTube URL</span>
          <input
            className="admin-input"
            value={youtubeUrl}
            onChange={e => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Se mostrará como embed en la página del post.
          </p>
        </div>
      </section>

      {/* Metadata */}
      <section className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h3 style={heading}>Metadata</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <span style={label('Type')}>Type</span>
            <select className="admin-input" value={type} onChange={e => setType(e.target.value)}>
              {POST_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>

          <div>
            <span style={label('Related Project')}>Related Project</span>
            <select className="admin-input" value={projectId} onChange={e => setProjectId(e.target.value)}>
              <option value="">— None —</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title_en}</option>)}
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <span style={label('Tags (comma-separated)')}>Tags</span>
            <input
              className="admin-input"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="gamedev, unity, devlog, blender"
            />
          </div>
        </div>
      </section>

      {/* Visibility */}
      <section className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
          Published (visible en el portfolio)
        </label>
      </section>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" disabled={isPending} className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '12px 28px' }}>
          {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Post'}
        </button>
        <a href="/admin/posts" className="btn btn-ghost" style={{ fontSize: '0.9rem', padding: '12px 28px' }}>Cancel</a>
      </div>
    </form>
  )
}
