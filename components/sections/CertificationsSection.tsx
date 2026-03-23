'use client'

interface CertItem {
  id: string
  name_en: string
  name_es: string
  issuer: string
  year: number
}

interface CertificationsSectionProps {
  items: CertItem[]
  title: string
  locale?: string
}

function CertIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{
        color: 'var(--accent)',
        filter: 'drop-shadow(0 0 6px var(--accent-glow))',
      }}
    >
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l6 2.67V11c0 3.84-2.64 7.43-6 8.8C8.64 18.43 6 14.84 6 11V7.67L12 5zm-1 3v4h2V8h-2zm0 6v2h2v-2h-2z" />
    </svg>
  )
}

export default function CertificationsSection({
  items,
  title,
  locale = 'en',
}: CertificationsSectionProps) {
  return (
    <section
      id="certifications"
      className="section"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="container">
        <span className="section-eyebrow reveal">Credentials</span>
        <h2 className="section-title reveal">{title}</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          {items.map((cert) => {
            const name = locale === 'es' ? cert.name_es : cert.name_en

            return (
              <div
                key={cert.id}
                className="glass reveal-stagger"
                style={{
                  padding: '28px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '10px',
                  transition: 'transform var(--transition-mid), box-shadow var(--transition-mid)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow =
                    '0 16px 48px rgba(0,0,0,0.5), 0 0 22px var(--accent-glow)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    fontSize: '1.6rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CertIcon />
                </div>

                {/* Name */}
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.98rem',
                    fontWeight: 600,
                    lineHeight: 1.4,
                    color: 'var(--text-primary)',
                  }}
                >
                  {name}
                </h3>

                {/* Issuer */}
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    margin: 0,
                  }}
                >
                  {cert.issuer}
                </p>

                {/* Year badge */}
                <span
                  style={{
                    marginTop: 'auto',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    padding: '3px 10px',
                    borderRadius: '16px',
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.2)',
                  }}
                >
                  {cert.year}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
