import type { GitHubStats } from '@/lib/github/api'
import { StatBadge } from '@/components/github/StatBadge'
import { LanguageBar } from '@/components/github/LanguageBar'
import { ContributionHeatmap } from '@/components/github/ContributionHeatmap'

interface GitHubStatsSectionProps {
  stats:         GitHubStats | null
  title:         string
  reposLabel:    string
  starsLabel:    string
  contsLabel:    string
  langsLabel:    string
  heatmapLabel:  string
}

export default function GitHubStatsSection({
  stats,
  title,
  reposLabel,
  starsLabel,
  contsLabel,
  heatmapLabel,
}: GitHubStatsSectionProps) {
  return (
    <section id="github" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <h2 className="section-title reveal">{title}</h2>

        {stats ? (
          <>
            {/* Stat badges */}
            <div
              style={{
                display:               'grid',
                gridTemplateColumns:   'repeat(auto-fit, minmax(140px, 1fr))',
                gap:                   '16px',
                marginBottom:          '32px',
              }}
            >
              <StatBadge value={stats.repos}                    label={reposLabel}  />
              <StatBadge value={stats.stars}                    label={starsLabel}  />
              <StatBadge value={stats.contributions.toLocaleString()} label={contsLabel} accent />
              <StatBadge value={stats.followers}                label="Followers"   />
            </div>

            {/* Language bar */}
            {stats.languages.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <LanguageBar languages={stats.languages} />
              </div>
            )}

            {/* Contribution heatmap */}
            {stats.weeks.length > 0 && (
              <ContributionHeatmap
                weeks={stats.weeks}
                total={stats.contributions}
                label={heatmapLabel}
              />
            )}
          </>
        ) : (
          <div
            className="glass"
            style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}
          >
            <p style={{ fontSize: '0.95rem' }}>
              GitHub stats will appear here once{' '}
              <code style={{ color: 'var(--accent-light)', background: 'rgba(124,58,237,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                GITHUB_TOKEN
              </code>{' '}
              is configured in <code style={{ color: 'var(--accent-light)', background: 'rgba(124,58,237,0.1)', padding: '2px 6px', borderRadius: '4px' }}>.env.local</code>.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
