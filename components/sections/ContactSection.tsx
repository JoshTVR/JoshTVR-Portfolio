'use client'

import { useState, FormEvent } from 'react'

interface ContactSectionProps {
  title: string
  subtitle: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactSection({ title, subtitle }: ContactSectionProps) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      service_id: null as null,
    }
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`)
      }
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(15,23,42,0.6)',
    border: '1px solid var(--border-glass)',
    borderRadius: '9px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.93rem',
    outline: 'none',
    transition: 'border-color var(--transition-fast)',
  }

  return (
    <section id="contact" className="section" style={{ background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle orb */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)',
        bottom: '-200px',
        right: '-100px',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <span className="section-eyebrow reveal">Get in touch</span>

        {/* Big gradient heading */}
        <h2 className="reveal" style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.4rem, 6vw, 5rem)',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1.05,
          marginBottom: '16px',
          background: 'var(--hero-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          maxWidth: '700px',
        }}>
          {title}
        </h2>

        <p className="reveal" style={{
          color: 'var(--text-muted)',
          fontSize: '1rem',
          lineHeight: 1.75,
          maxWidth: '520px',
          marginBottom: '56px',
        }}>
          {subtitle}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '48px',
          alignItems: 'start',
        }}>
          {/* Left: info */}
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: '8px' }}>
                Email
              </div>
              <a href="mailto:joshtvr4@gmail.com" style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-light)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
              >
                joshtvr4@gmail.com
              </a>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: '12px' }}>
                Socials
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { href: 'https://github.com/JoshTVR', label: 'github.com/JoshTVR' },
                  { href: 'https://www.linkedin.com/in/joshtvr', label: 'linkedin.com/in/joshtvr' },
                ].map(({ href, label }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: '0.92rem',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'color var(--transition-fast)',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-light)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="reveal" style={{
            borderRadius: '16px',
            border: '1px solid var(--border-glass)',
            background: 'var(--bg-card)',
            padding: '32px 28px',
          }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', color: '#34d399', padding: '32px 0' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"
                  style={{ margin: '0 auto 12px', display: 'block' }}>
                  <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>
                  Message sent! I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} noValidate>
                <input type="text" name="name" required placeholder="Your name" style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-glass)' }} />
                <input type="email" name="email" required placeholder="Your email" style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-glass)' }} />
                <textarea name="message" required rows={5} placeholder="Your message"
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-glass)' }} />

                {status === 'error' && (
                  <p style={{ color: '#f87171', fontSize: '0.85rem', margin: 0 }}>{errorMessage}</p>
                )}

                <button type="submit" disabled={status === 'submitting'} className="btn btn-primary"
                  style={{ opacity: status === 'submitting' ? 0.7 : 1, cursor: status === 'submitting' ? 'not-allowed' : 'pointer' }}>
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
