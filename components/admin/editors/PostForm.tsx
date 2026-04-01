'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { BilingualTabs } from './BilingualTabs'
import { TipTapEditor } from './TipTapEditor'
import { createPost, updatePost, type PostFormData } from '@/app/admin/posts/actions'
import { THEMES, BASE_THEMES, type ThemeName } from '@/components/content-cards/themes'
import { CardExporter } from '@/components/content-cards/CardExporter'
import { CodeTipCard } from '@/components/content-cards/CodeTipCard'
import { DevlogCard } from '@/components/content-cards/DevlogCard'
import { VideoPromoCard } from '@/components/content-cards/VideoPromoCard'
import { QACard } from '@/components/content-cards/QACard'
import { LogicCard } from '@/components/content-cards/LogicCard'
import { StudyCard } from '@/components/content-cards/StudyCard'
import { AnnouncementCard } from '@/components/content-cards/AnnouncementCard'
import { getYouTubeMeta, extractYouTubeId, getYouTubeThumbnail } from '@/lib/youtube'
import { SocialPreview } from './SocialPreview'

const POST_TYPES = ['post', 'devlog', 'announcement', 'tutorial'] as const
const CARD_TYPES = [
  { value: '', label: '— None —' },
  { value: 'code_tip', label: '💡 Code Tip (3 slides)' },
  { value: 'devlog', label: '🛠️ Devlog (single)' },
  { value: 'video_promo', label: '▶ Video Promo (single)' },
  { value: 'qa', label: '❓ Q&A (2 slides)' },
  { value: 'logic_challenge', label: '🧩 Logic Challenge (2 slides)' },
  { value: 'study', label: '📚 Study Finding (single)' },
  { value: 'announcement', label: '📣 Announcement (single)' },
]

interface Project { id: string; title_en: string }

interface PostFormProps {
  initial?: Partial<PostFormData> & {
    id?: string
    slug?: string
    card_data?: Record<string, unknown>
    card_images?: string[]
    color_theme?: string
    scheduled_at?: string
    is_ai_generated?: boolean
    card_type?: string
    shared_linkedin?: boolean
    shared_instagram?: boolean
    shared_facebook?: boolean
  }
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

  // Core fields
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

  // Automation fields
  const [cardType,    setCardType]    = useState(initial?.card_type    ?? '')
  const [colorTheme,  setColorTheme]  = useState<ThemeName>((initial?.color_theme as ThemeName) ?? 'midnight')
  const [scheduledAt, setScheduledAt] = useState(
    initial?.scheduled_at ? initial.scheduled_at.slice(0, 16) : ''
  )
  const [cardImages,  setCardImages]  = useState<string[]>(initial?.card_images ?? [])
  const [cardData,    setCardData]    = useState<Record<string, string>>(
    (initial?.card_data as Record<string, string>) ?? {}
  )
  const [ytMeta,      setYtMeta]      = useState<{ thumbnailUrl: string; title: string } | null>(null)
  const [fetchingYt,  setFetchingYt]  = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewIdx,  setPreviewIdx]  = useState(0)

  // Auto-fetch YouTube metadata when youtubeUrl or card type changes
  useEffect(() => {
    if (cardType !== 'video_promo' || !youtubeUrl) return
    const id = extractYouTubeId(youtubeUrl)
    if (id) setYtMeta({ thumbnailUrl: getYouTubeThumbnail(id), title: cardData.title || titleEn })
  }, [cardType, youtubeUrl])

  async function fetchYouTubeMeta() {
    if (!youtubeUrl) return
    setFetchingYt(true)
    const meta = await getYouTubeMeta(youtubeUrl)
    if (meta) {
      setYtMeta({ thumbnailUrl: meta.thumbnailUrl, title: meta.title })
      if (!cardData.title) setCardData(prev => ({ ...prev, title: meta.title }))
    }
    setFetchingYt(false)
  }

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
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      card_type: cardType || null,
      card_data: Object.keys(cardData).length ? cardData : null,
      card_images: cardImages,
      color_theme: colorTheme,
    }
    startTransition(async () => {
      const result = isEdit && initial?.id
        ? await updatePost(initial.id, data)
        : await createPost(data)
      if (result?.error) setServerError(result.error)
    })
  }

  // Build card slides for preview and export
  function buildSlides(): React.ReactElement[] {
    const cd = cardData
    const theme = colorTheme
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)

    if (cardType === 'code_tip') {
      return [1, 2, 3].map(s => (
        <CodeTipCard key={s} slide={s as 1|2|3}
          title={titleEn || 'Your tip title'}
          code={cd.code || '// your code here'}
          language={cd.language || 'javascript'}
          tip={cd.tip || 'Key takeaway goes here'}
          tags={tagList}
          theme={theme}
        />
      ))
    }
    if (cardType === 'devlog') {
      return [<DevlogCard key="1"
        project={cd.project || 'Apheeleon'}
        update={cd.update || titleEn}
        milestone={cd.milestone}
        techTags={tagList}
        screenshotUrl={cd.screenshotUrl || coverImage || undefined}
        theme={theme}
      />]
    }
    if (cardType === 'video_promo') {
      return [<VideoPromoCard key="1"
        title={cd.title || titleEn}
        thumbnailUrl={ytMeta?.thumbnailUrl || cd.thumbnailUrl}
        channelName={cd.channelName || 'JoshTVR'}
        duration={cd.duration}
        theme={theme}
      />]
    }
    if (cardType === 'qa') {
      return [1, 2].map(s => (
        <QACard key={s} slide={s as 1|2}
          question={cd.question || titleEn}
          answer={cd.answer || ''}
          language={cd.language}
          theme={theme}
        />
      ))
    }
    if (cardType === 'logic_challenge') {
      return [1, 2].map(s => (
        <LogicCard key={s} slide={s as 1|2}
          challenge={cd.challenge || titleEn}
          solution={cd.solution || ''}
          difficulty={(cd.difficulty as 'easy'|'medium'|'hard') || 'medium'}
          theme={theme}
        />
      ))
    }
    if (cardType === 'study') {
      return [<StudyCard key="1"
        finding={cd.finding || titleEn}
        source={cd.source || ''}
        topic={cd.topic || (tagList[0] || 'Research')}
        theme={theme}
      />]
    }
    if (cardType === 'announcement') {
      return [<AnnouncementCard key="1"
        headline={cd.headline || titleEn}
        description={cd.description || excerptEn}
        cta={cd.cta}
        theme={theme}
      />]
    }
    return []
  }

  const slides = buildSlides()
  const hasCard = cardType && slides.length > 0

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

      {/* Card Generator */}
      <section className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h3 style={heading}>Social Card</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <span style={label('Card Type')}>Card Type</span>
            <select className="admin-input" value={cardType} onChange={e => setCardType(e.target.value)}>
              {CARD_TYPES.map(ct => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
            </select>
          </div>
          <div>
            <span style={label('Color Theme')}>Color Theme</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              {BASE_THEMES.map(th => {
                const theme = THEMES[th]
                return (
                  <button key={th} type="button" title={theme.label}
                    onClick={() => setColorTheme(th)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: theme.accent,
                      border: colorTheme === th ? '3px solid white' : '3px solid transparent',
                      cursor: 'pointer', transition: 'border 150ms',
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Dynamic card fields */}
        {cardType === 'code_tip' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>
                <span style={label('Language')}>Language</span>
                <input className="admin-input" value={cardData.language || ''} onChange={e => setCardData(p => ({ ...p, language: e.target.value }))} placeholder="javascript" />
              </div>
            </div>
            <div>
              <span style={label('Code Snippet')}>Code Snippet</span>
              <textarea className="admin-input" value={cardData.code || ''} onChange={e => setCardData(p => ({ ...p, code: e.target.value }))} placeholder="const fn = () => {}" rows={5} style={{ fontFamily: 'monospace', resize: 'vertical' }} />
            </div>
            <div>
              <span style={label('Key Takeaway (slide 3)')}>Key Takeaway (slide 3)</span>
              <textarea className="admin-input" value={cardData.tip || ''} onChange={e => setCardData(p => ({ ...p, tip: e.target.value }))} placeholder="Arrow functions don't have their own 'this'…" rows={3} style={{ resize: 'vertical' }} />
            </div>
          </div>
        )}

        {cardType === 'devlog' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={label('Project')}>Project</span>
                <select className="admin-input" value={cardData.project || 'Apheeleon'} onChange={e => setCardData(p => ({ ...p, project: e.target.value }))}>
                  <option value="Apheeleon">Apheeleon</option>
                  <option value="Portfolio">JoshTVR Portfolio</option>
                </select>
              </div>
              <div>
                <span style={label('Milestone')}>Milestone (optional)</span>
                <input className="admin-input" value={cardData.milestone || ''} onChange={e => setCardData(p => ({ ...p, milestone: e.target.value }))} placeholder="v0.4 — AI Module" />
              </div>
            </div>
            <div>
              <span style={label('Update Text')}>Update Text</span>
              <textarea className="admin-input" value={cardData.update || ''} onChange={e => setCardData(p => ({ ...p, update: e.target.value }))} placeholder="What progress was made?" rows={3} style={{ resize: 'vertical' }} />
            </div>
            <div>
              <span style={label('Screenshot URL (optional background)')}>Screenshot URL (optional)</span>
              <input className="admin-input" value={cardData.screenshotUrl || ''} onChange={e => setCardData(p => ({ ...p, screenshotUrl: e.target.value }))} placeholder="https://..." />
            </div>
          </div>
        )}

        {cardType === 'video_promo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div>
              <span style={label('YouTube URL (auto-fetches thumbnail)')}>YouTube URL</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input className="admin-input" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." style={{ flex: 1 }} />
                <button type="button" onClick={fetchYouTubeMeta} disabled={fetchingYt} className="btn btn-ghost" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                  {fetchingYt ? 'Fetching…' : 'Fetch Meta'}
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={label('Video Title (auto-filled)')}>Video Title</span>
                <input className="admin-input" value={cardData.title || ytMeta?.title || ''} onChange={e => setCardData(p => ({ ...p, title: e.target.value }))} placeholder="Auto-filled from YouTube" />
              </div>
              <div>
                <span style={label('Duration (optional)')}>Duration</span>
                <input className="admin-input" value={cardData.duration || ''} onChange={e => setCardData(p => ({ ...p, duration: e.target.value }))} placeholder="12:34" />
              </div>
            </div>
          </div>
        )}

        {cardType === 'qa' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div>
              <span style={label('Question (slide 1)')}>Question (slide 1)</span>
              <textarea className="admin-input" value={cardData.question || ''} onChange={e => setCardData(p => ({ ...p, question: e.target.value }))} placeholder="What is the difference between…?" rows={3} style={{ resize: 'vertical' }} />
            </div>
            <div>
              <span style={label('Answer (slide 2)')}>Answer (slide 2)</span>
              <textarea className="admin-input" value={cardData.answer || ''} onChange={e => setCardData(p => ({ ...p, answer: e.target.value }))} placeholder="Code or text answer" rows={5} style={{ fontFamily: 'monospace', resize: 'vertical' }} />
            </div>
            <div>
              <span style={label('Language (if code)')}>Language (if code)</span>
              <input className="admin-input" value={cardData.language || ''} onChange={e => setCardData(p => ({ ...p, language: e.target.value }))} placeholder="javascript" />
            </div>
          </div>
        )}

        {cardType === 'logic_challenge' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div>
              <span style={label('Challenge (slide 1)')}>Challenge (slide 1)</span>
              <textarea className="admin-input" value={cardData.challenge || ''} onChange={e => setCardData(p => ({ ...p, challenge: e.target.value }))} placeholder="Write a function that…" rows={4} style={{ resize: 'vertical' }} />
            </div>
            <div>
              <span style={label('Solution (slide 2)')}>Solution (slide 2)</span>
              <textarea className="admin-input" value={cardData.solution || ''} onChange={e => setCardData(p => ({ ...p, solution: e.target.value }))} placeholder="Solution code or explanation" rows={5} style={{ fontFamily: 'monospace', resize: 'vertical' }} />
            </div>
            <div>
              <span style={label('Difficulty')}>Difficulty</span>
              <select className="admin-input" value={cardData.difficulty || 'medium'} onChange={e => setCardData(p => ({ ...p, difficulty: e.target.value }))}>
                <option value="easy">⚡ Easy</option>
                <option value="medium">🔥 Medium</option>
                <option value="hard">💀 Hard</option>
              </select>
            </div>
          </div>
        )}

        {cardType === 'study' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div>
              <span style={label('Key Finding (pull quote)')}>Key Finding</span>
              <textarea className="admin-input" value={cardData.finding || ''} onChange={e => setCardData(p => ({ ...p, finding: e.target.value }))} placeholder="The research shows that…" rows={4} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={label('Source')}>Source</span>
                <input className="admin-input" value={cardData.source || ''} onChange={e => setCardData(p => ({ ...p, source: e.target.value }))} placeholder="Stack Overflow 2025 Survey" />
              </div>
              <div>
                <span style={label('Topic Tag')}>Topic Tag</span>
                <input className="admin-input" value={cardData.topic || ''} onChange={e => setCardData(p => ({ ...p, topic: e.target.value }))} placeholder="AI / JavaScript / Web" />
              </div>
            </div>
          </div>
        )}

        {cardType === 'announcement' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div>
              <span style={label('Headline')}>Headline</span>
              <input className="admin-input" value={cardData.headline || ''} onChange={e => setCardData(p => ({ ...p, headline: e.target.value }))} placeholder="Big news!" />
            </div>
            <div>
              <span style={label('Description')}>Description</span>
              <textarea className="admin-input" value={cardData.description || ''} onChange={e => setCardData(p => ({ ...p, description: e.target.value }))} placeholder="Short description…" rows={3} style={{ resize: 'vertical' }} />
            </div>
            <div>
              <span style={label('CTA Button Text (optional)')}>CTA (optional)</span>
              <input className="admin-input" value={cardData.cta || ''} onChange={e => setCardData(p => ({ ...p, cta: e.target.value }))} placeholder="Available now" />
            </div>
          </div>
        )}

        {/* Preview + Export */}
        {hasCard && (
          <div style={{ marginTop: '8px' }}>
            {/* Slide thumbnails row */}
            <div style={{ marginBottom: '12px' }}>
              <span style={label('Preview — click to enlarge')}>Preview — click to enlarge</span>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
                {slides.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => { setPreviewIdx(i); setPreviewOpen(true) }}
                    style={{
                      width: '120px', height: '120px', overflow: 'hidden',
                      borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)',
                      cursor: 'pointer', position: 'relative', flexShrink: 0,
                      transition: 'border-color 150ms',
                    }}
                    title={`Slide ${i + 1} — click to preview`}
                  >
                    <div style={{ transform: 'scale(0.111)', transformOrigin: 'top left', width: '1080px', height: '1080px', pointerEvents: 'none' }}>
                      {slides[i]}
                    </div>
                    <div style={{
                      position: 'absolute', bottom: '4px', right: '6px',
                      fontSize: '0.6rem', background: 'rgba(0,0,0,0.6)',
                      color: '#fff', padding: '1px 5px', borderRadius: '4px',
                    }}>
                      {i + 1}/{slides.length}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <CardExporter
                slides={slides}
                label={`Generate ${slides.length > 1 ? slides.length + ' slides' : 'image'} & set as cover`}
                onExport={(urls) => {
                  setCardImages(urls)
                  if (urls[0]) setCoverImage(urls[0])
                }}
              />
              {cardImages.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#10b981' }}>
                    ✓ {cardImages.length} image{cardImages.length > 1 ? 's' : ''} saved
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {cardImages.map((url, i) => (
                      <img key={i} src={url} alt={`Card ${i + 1}`} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.4)' }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fullscreen preview modal */}
        {previewOpen && hasCard && (
          <div
            onClick={() => setPreviewOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {/* Card preview scaled to fit screen */}
            <div onClick={e => e.stopPropagation()} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '540px',
                height: '540px',
                overflow: 'hidden',
                borderRadius: '16px',
                flexShrink: 0,
              }}>
                <div style={{
                  transform: 'scale(0.5)',
                  transformOrigin: 'top left',
                  width: '1080px',
                  height: '1080px',
                }}>
                  {slides[previewIdx]}
                </div>
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={() => setPreviewIdx(i => Math.max(0, i - 1))}
                  disabled={previewIdx === 0}
                  style={{ padding: '8px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: previewIdx === 0 ? 'not-allowed' : 'pointer', opacity: previewIdx === 0 ? 0.3 : 1, fontSize: '1rem' }}
                >
                  ←
                </button>
                <span style={{ color: '#fff', fontSize: '0.9rem', minWidth: '60px', textAlign: 'center' }}>
                  {previewIdx + 1} / {slides.length}
                </span>
                <button
                  onClick={() => setPreviewIdx(i => Math.min(slides.length - 1, i + 1))}
                  disabled={previewIdx === slides.length - 1}
                  style={{ padding: '8px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: previewIdx === slides.length - 1 ? 'not-allowed' : 'pointer', opacity: previewIdx === slides.length - 1 ? 0.3 : 1, fontSize: '1rem' }}
                >
                  →
                </button>
                <button
                  onClick={() => setPreviewOpen(false)}
                  style={{ padding: '8px 20px', borderRadius: '8px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem', marginLeft: '8px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Media */}
      <section className="glass" style={{ padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={heading}>Cover Image</h3>
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {coverImage && (
              <img src={coverImage} alt="" style={{ width: 120, height: 68, objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <input className="admin-input" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="Image URL (or upload / generate card above)" style={{ marginBottom: '8px' }} />
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
        </div>
      </section>

      {/* Scheduling */}
      <section className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h3 style={heading}>Scheduling</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <span style={label('Schedule for (auto-publish)')}>Schedule for (auto-publish)</span>
            <input
              className="admin-input"
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Leave empty to publish manually. Cron runs every 15 min.
            </p>
          </div>
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
        {scheduledAt && !isPublished && (
          <p style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '8px' }}>
            ⏰ Scheduled — will auto-publish at {new Date(scheduledAt).toLocaleString()}
          </p>
        )}
      </section>

      {/* Social Preview */}
      <section className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h3 style={heading}>Social Preview</h3>
        <SocialPreview
          titleEn={titleEn}
          titleEs={titleEs}
          excerptEn={excerptEn}
          excerptEs={excerptEs}
          coverImage={cardImages[0] || coverImage}
          slug={initial?.slug as string ?? ''}
          tags={tags}
          type={type}
          postId={isEdit ? initial?.id : undefined}
          sharedLinkedin={initial?.shared_linkedin}
          sharedInstagram={initial?.shared_instagram}
          sharedFacebook={initial?.shared_facebook}
        />
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
