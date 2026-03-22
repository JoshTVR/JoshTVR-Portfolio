'use client'

import { useState, FormEvent } from 'react'

interface ContactSectionProps {
  title: string
  subtitle: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactSection({ title, subtitle }: ContactSectionProps) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

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
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.93rem',
    outline: 'none',
    transition: 'border-color var(--transition-fast)',
  }

  return (
    <section id="contact" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Section label */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{
            fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}>
            04 /
          </span>
        </div>

        {/* Big CTA heading */}
        <div style={{ marginBottom: '56px' }}>
          <h2
            className="reveal"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.4rem, 6vw, 5rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: 'var(--text-primary)',
              marginBottom: '16px',
            }}
          >
            {title}
          </h2>
          <p className="reveal" style={{
            color: 'var(--text-muted)',
            fontSize: '1rem',
            lineHeight: 1.7,
            maxWidth: '540px',
          }}>
            {subtitle}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '48px',
            alignItems: 'start',
          }}
        >
          {/* Left: Contact info */}
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Email — big and prominent */}
            <div>
              <div style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: '"Fira Code", Consolas, monospace',
                marginBottom: '8px',
              }}>
                Email
              </div>
              <a
                href="mailto:joshtvr4@gmail.com"
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  transition: 'color var(--transition-mid)',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
              >
                joshtvr4@gmail.com
              </a>
            </div>

            {/* Socials */}
            <div>
              <div style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: '"Fira Code", Consolas, monospace',
                marginBottom: '12px',
              }}>
                Find me
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { href: 'https://github.com/JoshTVR', label: 'GitHub', display: 'github.com/JoshTVR' },
                  { href: 'https://www.linkedin.com/in/joshtvr', label: 'LinkedIn', display: 'linkedin.com/in/joshtvr' },
                ].map(({ href, label, display }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'color var(--transition-mid)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    <span style={{
                      fontSize: '0.65rem',
                      color: 'var(--accent)',
                      fontFamily: '"Fira Code", Consolas, monospace',
                    }}>→</span>
                    {display}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact form */}
          <div
            className="reveal"
            style={{
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '32px 28px',
              background: 'var(--bg-secondary)',
            }}
          >
            {status === 'success' ? (
              <div style={{
                textAlign: 'center',
                color: '#22c55e',
                padding: '32px 0',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"
                  style={{ margin: '0 auto 12px', display: 'block' }}>
                  <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>
                  Message sent! I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                noValidate
              >
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your name"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(250,204,21,0.4)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your email"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(250,204,21,0.4)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                />
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Your message"
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(250,204,21,0.4)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                />

                {status === 'error' && (
                  <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn btn-primary"
                  style={{
                    opacity: status === 'submitting' ? 0.7 : 1,
                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                  }}
                >
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
