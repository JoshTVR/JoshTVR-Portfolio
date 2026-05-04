import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const TYPE_LABELS: Record<string, { en: string; es: string; color: string }> = {
  devlog:       { en: 'Devlog',       es: 'Devlog',      color: '#a78bfa' },
  announcement: { en: 'Announcement', es: 'Anuncio',     color: '#fbbf24' },
  tutorial:     { en: 'Tutorial',     es: 'Tutorial',    color: '#34d399' },
  post:         { en: 'Post',         es: 'Post',        color: '#94a3b8' },
}

interface PageProps { params: Promise<{ locale: string }> }

export default async function PostsFeedPage({ params }: PageProps) {
  const { locale } = await params
  const isEs = locale === 'es'

  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('id,slug,title_en,title_es,excerpt_en,excerpt_es,cover_image,youtube_url,type,tags,published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const items = posts ?? []

  return (
    <main style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', background: 'var(--bg-primary)' }}>
      <style>{`.post-card:hover { border-color: rgba(124,58,237,0.3) !important; }`}</style>
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {isEs ? 'Publicaciones' : 'Posts'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '48px' }}>
          {isEs ? 'Devlogs, anuncios y tutoriales' : 'Devlogs, announcements and tutorials'}
        </p>

        {items.length === 0 ? (
          <div className="glass" style={{ padding: '48px', borderRadius: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
            {isEs ? 'Aún no hay publicaciones.' : 'No posts yet.'}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {items.map((post: PostRow) => {
              const title   = isEs ? post.title_es   : post.title_en
              const excerpt = isEs ? post.excerpt_es : post.excerpt_en
              const tl      = TYPE_LABELS[post.type] ?? TYPE_LABELS.post
              const typeLabel = isEs ? tl.es : tl.en

              return (
                <a
                  key={post.id}
                  href={`/${locale}/posts/${post.slug}`}
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
                >
                  <article className="glass post-card" style={{ borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid rgba(255,255,255,0.07)', transition: 'border-color 0.2s' }}>
                    {/* Cover */}
                    {post.cover_image ? (
                      <div style={{ height: '160px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={post.cover_image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : post.youtube_url ? (
                      <div style={{ height: '160px', background: 'rgba(255,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="#ff4444">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                        </svg>
                      </div>
                    ) : null}

                    {/* Body */}
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 700, background: `${tl.color}18`, color: tl.color, border: `1px solid ${tl.color}30` }}>
                          {typeLabel}
                        </span>
                        {post.youtube_url && (
                          <span style={{ fontSize: '0.68rem', color: '#ff4444', fontWeight: 600 }}>▶ Video</span>
                        )}
                      </div>

                      <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.35 }}>
                        {title}
                      </p>

                      {excerpt && (
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {excerpt}
                        </p>
                      )}

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: 'auto', paddingTop: '8px' }}>
                        {(post.tags ?? []).slice(0, 3).map((t: string) => (
                          <span key={t} style={{ fontSize: '0.68rem', padding: '1px 7px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                            #{t}
                          </span>
                        ))}
                      </div>

                      <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0 }}>
                        {post.published_at ? new Date(post.published_at).toLocaleDateString(isEs ? 'es-MX' : 'en-US') : ''}
                      </p>
                    </div>
                  </article>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

interface PostRow {
  id: string; slug: string; title_en: string; title_es: string
  excerpt_en: string | null; excerpt_es: string | null
  cover_image: string | null; youtube_url: string | null
  type: string; tags: string[]; published_at: string | null
}
