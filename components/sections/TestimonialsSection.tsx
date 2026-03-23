'use client'

interface TestimonialItem {
  id: string
  quote_en: string
  quote_es: string
  author_name: string
  author_role_en: string
  author_role_es: string
}

interface TestimonialsSectionProps {
  items: TestimonialItem[]
  title: string
  locale?: string
}

function QuoteIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ color: 'var(--accent)', opacity: 0.5 }}
    >
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
  )
}

export default function TestimonialsSection({
  items,
  title,
  locale = 'en',
}: TestimonialsSectionProps) {
  return (
    <section
      id="testimonials"
      className="section"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="container">
        <span className="section-eyebrow reveal">What people say</span>
        <h2 className="section-title reveal">{title}</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '24px',
          }}
        >
          {items.map((item) => {
            const quote = locale === 'es' ? item.quote_es : item.quote_en
            const role = locale === 'es' ? item.author_role_es : item.author_role_en

            return (
              <blockquote
                key={item.id}
                className="glass reveal-stagger"
                style={{
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  transition: 'transform var(--transition-mid)',
                  margin: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Quote icon */}
                <div aria-hidden="true">
                  <QuoteIcon />
                </div>

                {/* Quote text */}
                <p
                  style={{
                    fontSize: '0.97rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.8,
                    fontStyle: 'italic',
                    flex: 1,
                    margin: 0,
                  }}
                >
                  {quote}
                </p>

                {/* Author footer */}
                <footer
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                  }}
                >
                  <strong
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                    }}
                  >
                    {item.author_name}
                  </strong>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {role}
                  </span>
                </footer>
              </blockquote>
            )
          })}
        </div>
      </div>
    </section>
  )
}
