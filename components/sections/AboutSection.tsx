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
        {/* Section label */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{
            fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}>
            01 /
          </span>
        </div>

        <h2
          className="section-title reveal"
          style={{ marginBottom: '56px' }}
        >
          {title}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            gap: '64px',
            alignItems: 'start',
          }}
        >
          {/* Left: Bio */}
          <div>
            <p className="reveal" style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '1rem', lineHeight: 1.85 }}>
              {bio1}
            </p>
            <p className="reveal" style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '1rem', lineHeight: 1.85 }}>
              {bio2}
            </p>
            <p className="reveal" style={{ color: 'var(--text-muted)', marginBottom: 0, fontSize: '1rem', lineHeight: 1.85 }}>
              {bio3}
            </p>
          </div>

          {/* Right: Flat stat grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {stats.map((stat, i) => {
              const match = stat.value.match(/^(\d+)([^\d]*)$/)
              const num = match ? match[1] : stat.value
              const suffix = match ? match[2] : ''
              const isRight = i % 2 === 1
              const isBottom = i >= stats.length - 2

              return (
                <div
                  key={i}
                  style={{
                    padding: '32px 28px',
                    borderRight: !isRight ? '1px solid var(--border-glass)' : 'none',
                    borderBottom: !isBottom ? '1px solid var(--border-glass)' : 'none',
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                    fontWeight: 700,
                    lineHeight: 1,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                  }}>
                    {num}<span style={{ color: 'var(--accent)' }}>{suffix}</span>
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 500,
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
