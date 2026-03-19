'use client'

import { useState, FormEvent } from 'react'

interface ContactSectionProps {
  title: string
  subtitle: string
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ color: 'var(--accent)', flexShrink: 0 }}>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ color: 'var(--accent)', flexShrink: 0 }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ color: 'var(--accent)', flexShrink: 0 }}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
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
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.93rem',
    outline: 'none',
    transition: 'border-color var(--transition-fast)',
    resize: 'vertical' as const,
  }

  return (
    <section id="contact" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <h2 className="section-title reveal">{title}</h2>

        <p
          className="reveal"
          style={{
            color: 'var(--text-muted)',
            marginBottom: '48px',
            marginTop: '-16px',
            fontSize: '1rem',
          }}
        >
          {subtitle}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '48px',
            alignItems: 'start',
          }}
        >
          {/* Left: Contact links */}
          <div
            className="reveal"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <a
              href="mailto:joshtvr4@gmail.com"
              className="glass"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px 24px',
                color: 'var(--text-muted)',
                fontSize: '0.92rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all var(--transition-mid)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent)'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <EmailIcon />
              <span>joshtvr4@gmail.com</span>
            </a>

            <a
              href="https://www.linkedin.com/in/joshtvr"
              target="_blank"
              rel="noopener noreferrer"
              className="glass"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px 24px',
                color: 'var(--text-muted)',
                fontSize: '0.92rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all var(--transition-mid)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent)'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <LinkedInIcon />
              <span>linkedin.com/in/joshtvr</span>
            </a>

            <a
              href="https://github.com/JoshTVR"
              target="_blank"
              rel="noopener noreferrer"
              className="glass"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px 24px',
                color: 'var(--text-muted)',
                fontSize: '0.92rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all var(--transition-mid)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent)'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <GitHubIcon />
              <span>github.com/JoshTVR</span>
            </a>
          </div>

          {/* Right: Contact form */}
          <div className="glass reveal" style={{ padding: '32px 28px' }}>
            {status === 'success' ? (
              <div
                style={{
                  textAlign: 'center',
                  color: '#10b981',
                  fontSize: '1rem',
                  padding: '24px 0',
                  fontWeight: 500,
                }}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ margin: '0 auto 16px', display: 'block' }}
                >
                  <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <p style={{ margin: 0 }}>Message sent! I&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                noValidate
              >
                <div>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Your email"
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Your message"
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                  />
                </div>

                {status === 'error' && (
                  <p
                    style={{
                      color: '#ef4444',
                      fontSize: '0.88rem',
                      margin: 0,
                    }}
                  >
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
