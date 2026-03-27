import type { GitHubRepo } from '@/lib/github/api'

interface LinkedProject {
  slug:     string
  title_en: string
  title_es: string
}

interface Props {
  repos:          GitHubRepo[]
  locale:         string
  linkedProjects?: Record<string, LinkedProject>
}

function timeAgo(isoDate: string, locale: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return locale === 'es' ? 'hoy' : 'today'
  if (days < 30) return locale === 'es' ? `hace ${days}d` : `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return locale === 'es' ? `hace ${months}m` : `${months}mo ago`
  const years = Math.floor(months / 12)
  return locale === 'es' ? `hace ${years}a` : `${years}y ago`
}

export default function GitHubReposSection({ repos, locale, linkedProjects = {} }: Props) {
  if (repos.length === 0) return null
  const isEs = locale === 'es'

  return (
    <section id="open-source" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '48px' }}>
          <div>
            <h2 className="section-title" style={{ marginBottom: '8px' }}>
              {isEs ? 'Código Abierto' : 'Open Source'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {isEs
                ? `${repos.length} repositorios públicos — sincronizado con GitHub`
                : `${repos.length} public repositories — synced from GitHub`}
            </p>
          </div>
          <a
            href="https://github.com/JoshTVR"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem',
              fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            {isEs ? 'Ver perfil' : 'View profile'}
          </a>
        </div>

        <div
          className="reveal"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {repos.map((repo) => {
            const linked = linkedProjects[repo.name]
            return (
            <div
              key={repo.name}
              className="glass"
              style={{
                display: 'flex', flexDirection: 'column', gap: '12px',
                padding: '20px', borderRadius: '12px',
                border: linked
                  ? '1px solid rgba(124,58,237,0.3)'
                  : '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {/* Linked project badge */}
              {linked && (
                <a
                  href={`#projects`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px', alignSelf: 'flex-start',
                    fontSize: '0.7rem', fontWeight: 700, padding: '3px 9px', borderRadius: '20px',
                    background: 'rgba(124,58,237,0.15)', color: 'var(--accent-light)',
                    border: '1px solid rgba(124,58,237,0.3)', textDecoration: 'none',
                    letterSpacing: '0.02em',
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M7 7h10v10"/>
                  </svg>
                  {isEs ? `Ver proyecto: ${linked.title_es}` : `See project: ${linked.title_en}`}
                </a>
              )}

              {/* Name + stars */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-light)', wordBreak: 'break-word', textDecoration: 'none' }}
                >
                  {repo.name}
                </a>
                {repo.stars > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {repo.stars}
                  </span>
                )}
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1 }}>
                {repo.description ?? (isEs ? 'Sin descripción' : 'No description')}
              </p>

              {/* Topics */}
              {repo.topics.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {repo.topics.slice(0, 4).map(t => (
                    <span key={t} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '20px', background: 'rgba(124,58,237,0.12)', color: 'var(--accent-light)', border: '1px solid rgba(124,58,237,0.2)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer: language + time + links */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {repo.language && (
                    <>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: repo.languageColor ?? '#7c3aed', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{repo.language}</span>
                    </>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{timeAgo(repo.pushedAt, locale)}</span>
                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.78rem', color: 'var(--accent-light)', fontWeight: 600, textDecoration: 'none' }}
                    >
                      Demo ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </section>
  )
}
