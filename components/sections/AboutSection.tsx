interface StatItem {
  value: string
  label: string
}

interface AboutSectionProps {
  title: string
  bio1: string
  bio2: string
  bio3: string
  stats: StatItem[]
}

export default function AboutSection({ title, bio1, bio2, bio3, stats }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="section"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="container">
        <h2 className="section-title reveal">{title}</h2>

        <div
          className="about-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: '64px',
            alignItems: 'start',
          }}
        >
          {/* Left: Bio text */}
          <div className="about-text">
            <p className="reveal" style={{ color: 'var(--text-muted)', marginBottom: '18px', fontSize: '1rem', lineHeight: 1.8 }}>
              {bio1}
            </p>
            <p className="reveal" style={{ color: 'var(--text-muted)', marginBottom: '18px', fontSize: '1rem', lineHeight: 1.8 }}>
              {bio2}
            </p>
            <p className="reveal" style={{ color: 'var(--text-muted)', marginBottom: 0, fontSize: '1rem', lineHeight: 1.8 }}>
              {bio3}
            </p>
          </div>

          {/* Right: Stats grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            {stats.map((stat, index) => {
              // Split value into number part and suffix (last char if non-numeric)
              const match = stat.value.match(/^(\d+)([^\d]*)$/)
              const num = match ? match[1] : stat.value
              const suffix = match ? match[2] : ''

              return (
                <div
                  key={index}
                  className="stat-card glass reveal-stagger"
                  style={{
                    padding: '28px 20px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'transform var(--transition-mid), box-shadow var(--transition-mid)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '2.4rem',
                      fontWeight: 700,
                      lineHeight: 1,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {num}
                    <span style={{ color: 'var(--accent)' }}>{suffix}</span>
                  </span>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
