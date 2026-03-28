import React from 'react'

const TYPE_LABELS: Record<string, { en: string; es: string; color: string }> = {
  devlog:       { en: 'Devlog',       es: 'Devlog',   color: '#a78bfa' },
  announcement: { en: 'Announcement', es: 'Anuncio',  color: '#fbbf24' },
  tutorial:     { en: 'Tutorial',     es: 'Tutorial', color: '#34d399' },
  post:         { en: 'Post',         es: 'Post',     color: '#94a3b8' },
}

interface PostPreview {
  id: string
  slug: string
  title_en: string
  title_es: string
  excerpt_en: string | null
  excerpt_es: string | null
  cover_image: string | null
  youtube_url: string | null
  type: string
  published_at: string | null
}

interface Props {
  posts: PostPreview[]
  locale: string
}

export function PostsFeedSection({ posts, locale }: Props) {
  if (posts.length === 0) return null
  const isEs = locale === 'es'

  return (
    <section style={{ padding: '80px 0', background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>
              {isEs ? 'Blog & Devlogs' : 'Blog & Devlogs'}
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {isEs ? 'Últimas publicaciones' : 'Latest Posts'}
            </h2>
          </div>
          <a
            href={`/${locale}/posts`}
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--accent-light)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(124,58,237,0.3)',
              transition: 'background 150ms ease',
            }}
          >
            {isEs ? 'Ver todas →' : 'View all →'}
          </a>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {posts.map((post) => {
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
                <article
                  className="glass"
                  style={{
                    borderRadius: '14px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: 'border-color 0.2s, transform 0.2s',
                  }}
                >
                  {/* Cover */}
                  {post.cover_image ? (
                    <div style={{ height: '160px', overflow: 'hidden', flexShrink: 0 }}>
                      <img
                        src={post.cover_image}
                        alt={title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ) : post.youtube_url ? (
                    <div style={{ height: '160px', background: 'rgba(255,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="#ff4444">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </div>
                  ) : (
                    <div style={{ height: '80px', background: `${tl.color}10`, display: 'flex', alignItems: 'center', paddingLeft: '16px', flexShrink: 0 }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {post.type === 'devlog' ? '🛠️' : post.type === 'announcement' ? '📢' : post.type === 'tutorial' ? '📚' : '✍️'}
                      </span>
                    </div>
                  )}

                  {/* Body */}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.68rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 700,
                        background: `${tl.color}18`, color: tl.color, border: `1px solid ${tl.color}30`,
                      }}>
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
                      <p style={{
                        fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {excerpt}
                      </p>
                    )}

                    <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: '0', marginTop: 'auto', paddingTop: '8px' }}>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString(isEs ? 'es-MX' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        : ''}
                    </p>
                  </div>
                </article>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
