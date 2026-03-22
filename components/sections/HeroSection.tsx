'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const TerminalBlock = dynamic(() => import('@/components/ui/TerminalBlock'), { ssr: false })

const WORDS = ['immersive VR experiences', 'AI-powered solutions', '3D worlds', 'full-stack apps']

const STATS = [
  { value: '8+', label: 'Projects' },
  { value: '4+', label: 'Years exp' },
  { value: '5+', label: 'Tech stacks' },
  { value: '2+', label: 'Client work' },
]

const SOCIALS = [
  {
    href: 'https://github.com/JoshTVR',
    label: 'GitHub',
    d: 'M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z',
  },
  {
    href: 'https://www.linkedin.com/in/joshtvr',
    label: 'LinkedIn',
    d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    href: 'mailto:joshtvr4@gmail.com',
    label: 'Email',
    d: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z',
  },
]

export default function HeroSection() {
  const typewriterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let wi = 0, ci = 0, deleting = false
    let tid: ReturnType<typeof setTimeout>

    function tick() {
      const el = typewriterRef.current
      if (!el) return
      const w = WORDS[wi % WORDS.length]
      ci += deleting ? -1 : 1
      el.textContent = w.substring(0, ci)
      let delay = deleting ? 45 : 90
      if (!deleting && ci === w.length) { delay = 2200; deleting = true }
      else if (deleting && ci === 0) { deleting = false; wi++; delay = 400 }
      tid = setTimeout(tick, delay)
    }
    tid = setTimeout(tick, 800)
    return () => clearTimeout(tid)
  }, [])

  return (
    <section
      id="hero"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="hero-bg-grid" aria-hidden="true" />

      <div
        className="container-site"
        style={{
          width: '100%',
          paddingTop: '100px',
          paddingBottom: '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Section label + availability pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <span style={{
            fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}>
            00 /
          </span>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '100px',
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.25)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
              boxShadow: '0 0 6px #22c55e',
            }} />
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#22c55e',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Available for work
            </span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="hero-two-col" style={{ marginBottom: '48px' }}>
          {/* Left: name + typewriter + CTAs */}
          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.8rem, 7vw, 6rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              marginBottom: '28px',
              background: 'var(--hero-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Joshua<br />Hernandez
            </h1>

            {/* Monospace typewriter */}
            <div style={{
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
              fontSize: 'clamp(0.82rem, 1.4vw, 0.95rem)',
              color: 'var(--text-muted)',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              minHeight: '1.6em',
            }}>
              <span style={{ color: 'var(--accent)', marginRight: '8px', userSelect: 'none' }}>$</span>
              <span>building&nbsp;</span>
              <span ref={typewriterRef} style={{ color: 'var(--accent)', fontWeight: 500 }} />
              <span style={{
                display: 'inline-block',
                width: '2px',
                height: '1em',
                background: 'var(--accent)',
                marginLeft: '2px',
                verticalAlign: 'text-bottom',
                animation: 'blink 1s step-end infinite',
              }} />
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="#projects" className="btn btn-primary">View Projects</a>
              <a href="#contact" className="btn btn-ghost">Get in touch</a>
            </div>
          </div>

          {/* Right: Terminal with glow */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              inset: '-24px',
              background: 'radial-gradient(ellipse at center, rgba(250,204,21,0.07) 0%, transparent 70%)',
              pointerEvents: 'none',
              borderRadius: '24px',
            }} />
            <TerminalBlock />
          </div>
        </div>

        {/* Stats + socials row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          paddingTop: '28px',
          borderTop: '1px solid var(--border-glass)',
          flexWrap: 'wrap',
          gap: '12px 0',
        }}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                flex: '0 0 auto',
                padding: i === 0 ? '0 32px 0 0' : '0 32px',
                borderRight: i < STATS.length - 1 ? '1px solid var(--border-glass)' : 'none',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                marginTop: '4px',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
              }}>
                {s.label}
              </div>
            </div>
          ))}

          <div style={{ flex: 1 }} />

          {/* Socials */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {SOCIALS.map(({ href, label, d }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={label}
                style={{
                  color: 'var(--text-muted)',
                  transition: 'color var(--transition-mid), transform var(--transition-mid)',
                  display: 'inline-flex',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent)'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d={d} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <a href="#about" aria-label="Scroll down" style={{
        position: 'absolute',
        bottom: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'var(--text-muted)',
        animation: 'bounce 2s ease-in-out infinite',
        zIndex: 10,
        display: 'inline-flex',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        </svg>
      </a>
    </section>
  )
}
