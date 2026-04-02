interface DevlogItem {
  id: string
  title_en: string
  card_data: { project?: string; update?: string } | null
  published_at: string | null
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return '1d ago'
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks === 1) return '1w ago'
  if (weeks < 4) return `${weeks}w ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

interface Props {
  items: DevlogItem[]
  locale: string
}

export function DevlogSection({ items, locale }: Props) {
  if (items.length === 0) return null

  return (
    <section style={{ padding: '80px 0', background: 'var(--bg-primary)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <span style={{ fontSize: '1.2rem' }}>🛠️</span>
          <div>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '4px' }}>
              Work in Progress
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Dev Activity
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {items.map((item, i) => {
            const project = item.card_data?.project ?? item.title_en.replace(/^Devlog — /, '').split(':')[0]
            const update  = item.card_data?.update?.split('\n')[0] ?? ''

            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px 0',
                  borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  alignItems: 'flex-start',
                }}
              >
                {/* Timeline dot */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px', flexShrink: 0 }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  {i < items.length - 1 && (
                    <div style={{ width: '1px', flex: 1, background: 'rgba(124,58,237,0.2)', marginTop: '6px', minHeight: '24px' }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: 'rgba(124,58,237,0.12)', color: '#a78bfa' }}>
                      {project}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {timeAgo(item.published_at)}
                    </span>
                  </div>
                  {update && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {update}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
