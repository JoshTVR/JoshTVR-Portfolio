import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface PageProps { params: Promise<{ locale: string; slug: string }> }

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?\s]{11})/)
  return match?.[1] ?? null
}

export default async function PostPage({ params }: PageProps) {
  const { locale, slug } = await params
  const isEs = locale === 'es'

  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  let relatedProject: { title_en: string; title_es: string; slug: string } | null = null
  if (post.project_id) {
    const { data } = await supabase
      .from('projects')
      .select('title_en,title_es,slug')
      .eq('id', post.project_id)
      .single()
    relatedProject = data
  }

  const title   = isEs ? post.title_es   : post.title_en
  const content = isEs ? post.content_es : post.content_en
  const youtubeId = post.youtube_url ? getYouTubeId(post.youtube_url) : null

  return (
    <main style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '760px' }}>

        {/* Back */}
        <a href={`/${locale}/posts`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '32px' }}>
          ← {isEs ? 'Todas las publicaciones' : 'All posts'}
        </a>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px', background: 'rgba(124,58,237,0.12)', color: 'var(--accent-light)', fontWeight: 700, border: '1px solid rgba(124,58,237,0.2)' }}>
              {post.type}
            </span>
            {post.published_at && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {new Date(post.published_at).toLocaleDateString(isEs ? 'es-MX' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '16px' }}>
            {title}
          </h1>
          {(post.tags ?? []).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {post.tags.map((t: string) => (
                <span key={t} style={{ fontSize: '0.72rem', padding: '2px 9px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cover image */}
        {post.cover_image && !youtubeId && (
          <img src={post.cover_image} alt={title} style={{ width: '100%', borderRadius: '12px', marginBottom: '32px', objectFit: 'cover', maxHeight: '400px' }} />
        )}

        {/* YouTube embed */}
        {youtubeId && (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: '32px', borderRadius: '12px', overflow: 'hidden' }}>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        )}

        {/* Rich content */}
        {content && (
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: content }}
            style={{ color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '1rem' }}
          />
        )}

        {/* Related project */}
        {relatedProject && (
          <div className="glass" style={{ marginTop: '40px', padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                {isEs ? 'Proyecto relacionado' : 'Related project'}
              </p>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                {isEs ? relatedProject.title_es : relatedProject.title_en}
              </p>
            </div>
            <a
              href={`/${locale}#projects`}
              style={{ fontSize: '0.82rem', color: 'var(--accent-light)', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              {isEs ? 'Ver proyecto →' : 'View project →'}
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
