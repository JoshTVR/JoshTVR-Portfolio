interface ExperienceItem {
  id: string
  role_en: string
  role_es: string
  company: string
  description_en: string
  description_es: string
  tags: string[]
  start_date: string
  end_date: string | null
}

interface ExperienceSectionProps {
  items: ExperienceItem[]
  title: string
  locale?: string
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

export default function ExperienceSection({
  items,
  title,
  locale = 'en',
}: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      className="section"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="container">
        <span className="section-eyebrow reveal">Timeline</span>
        <h2 className="section-title reveal">{title}</h2>

        {/* Timeline wrapper */}
        <div style={{ position: 'relative', paddingLeft: '32px' }}>
          {/* Vertical line */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '11px',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'linear-gradient(to bottom, var(--accent), transparent)',
              borderRadius: '2px',
            }}
          />

          {items.map((item) => {
            const role = locale === 'es' ? item.role_es : item.role_en
            const description = locale === 'es' ? item.description_es : item.description_en
            const start = formatDate(item.start_date)
            const end = item.end_date ? formatDate(item.end_date) : 'Present'
            const dateRange = `${start} – ${end}`

            return (
              <div
                key={item.id}
                className="reveal"
                style={{
                  position: 'relative',
                  marginBottom: '36px',
                }}
              >
                {/* Dot */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '-26px',
                    top: '24px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow:
                      '0 0 0 3px var(--bg-secondary), 0 0 0 5px var(--accent), 0 0 16px var(--accent-glow)',
                    flexShrink: 0,
                  }}
                />

                {/* Glass card */}
                <div
                  className="glass"
                  style={{
                    padding: '28px 28px 24px',
                  }}
                >
                  {/* Date badge */}
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    {dateRange}
                  </span>

                  {/* Role */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {role}
                  </h3>

                  {/* Company */}
                  <span
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-muted)',
                      fontStyle: 'italic',
                      marginBottom: '12px',
                      display: 'block',
                    }}
                  >
                    {item.company}
                  </span>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.93rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.75,
                      marginBottom: '14px',
                    }}
                  >
                    {description}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <ul
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {item.tags.map((tag) => (
                        <li
                          key={tag}
                          style={{
                            padding: '3px 10px',
                            borderRadius: '16px',
                            fontSize: '0.76rem',
                            fontWeight: 500,
                            background: 'rgba(59,130,246,0.08)',
                            border: '1px solid rgba(59,130,246,0.18)',
                            color: 'var(--accent-light)',
                          }}
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
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
