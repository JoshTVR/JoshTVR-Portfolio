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
        <span className="section-eyebrow reveal">About me</span>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: '72px',
          alignItems: 'start',
        }}>
          {/* Left: bio + title */}
          <div>
            <h2 className="section-title reveal" style={{ marginBottom: '32px' }}>{title}</h2>

            <p className="reveal" style={{ color: 'var(--text-muted)', marginBottom: '18px', fontSize: '1rem', lineHeight: 1.85 }}>
              {bio1}
            </p>
            <p className="reveal" style={{ color: 'var(--text-muted)', marginBottom: '18px', fontSize: '1rem', lineHeight: 1.85 }}>
              {bio2}
            </p>
            <p className="reveal" style={{ color: 'var(--text-muted)', marginBottom: 0, fontSize: '1rem', lineHeight: 1.85 }}>
              {bio3}
            </p>
          </div>

          {/* Right: stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1px',
            background: 'var(--border-glass)',
            border: '1px solid var(--border-glass)',
            borderRadius: '16px',
            overflow: 'hidden',
            alignSelf: 'start',
            marginTop: '72px',
          }}>
            {stats.map((stat, i) => {
              const match = stat.value.match(/^(\d+)([^\d]*)$/)
              const num = match ? match[1] : stat.value
              const suffix = match ? match[2] : ''
              return (
                <div
                  key={i}
                  className="reveal-stagger"
                  style={{
                    padding: '36px 28px',
                    background: 'var(--bg-secondary)',
                    transition: 'background var(--transition-mid)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card-hover)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)' }}
                >
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                    fontWeight: 700,
                    lineHeight: 1,
                    marginBottom: '8px',
                    background: 'var(--grad-accent)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {num}{suffix}
                  </div>
                  <div style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
