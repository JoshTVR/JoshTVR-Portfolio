'use client'

import { useEffect, useRef } from 'react'

const WORDS = ['VR experiences', 'AI solutions', '3D worlds', 'full-stack apps']

const TECH_PILLS = ['Next.js', 'Python', 'Blender', 'Unity', 'Three.js', 'TensorFlow']

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
      let delay = deleting ? 40 : 85
      if (!deleting && ci === w.length) { delay = 2400; deleting = true }
      else if (deleting && ci === 0) { deleting = false; wi++; delay = 500 }
      tid = setTimeout(tick, delay)
    }
    tid = setTimeout(tick, 900)
    return () => clearTimeout(tid)
  }, [])

  return (
    <section
      id="hero"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '96px',
        paddingBottom: '64px',
      }}
    >
      {/* Gradient orbs */}
      <div className="hero-orb-1" aria-hidden="true" />
      <div className="hero-orb-2" aria-hidden="true" />

      {/* Subtle dot pattern */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(148,163,184,0.07) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      <div className="container-site" style={{ position: 'relative', zIndex: 1 }}>
        {/* Availability badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '100px',
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.2)',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
              boxShadow: '0 0 8px #22c55e',
            }} />
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#86efac',
              letterSpacing: '0.08em',
            }}>
              Available for work
            </span>
          </div>
        </div>

        {/* Name — giant gradient text */}
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(3.2rem, 10vw, 8rem)',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
          marginBottom: '24px',
          background: 'var(--hero-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Joshua<br />Hernandez
        </h1>

        {/* Typewriter subtitle */}
        <div style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
          color: 'var(--text-muted)',
          marginBottom: '40px',
          minHeight: '2em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}>
          <span>Building</span>
          <span style={{
            color: 'var(--accent-light)',
            fontWeight: 600,
          }}>
            <span ref={typewriterRef} />
            <span style={{
              display: 'inline-block',
              width: '2px',
              height: '1.1em',
              background: 'var(--accent)',
              marginLeft: '2px',
              verticalAlign: 'text-bottom',
              animation: 'blink 1s step-end infinite',
            }} />
          </span>
        </div>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '56px',
        }}>
          <a href="#projects" className="btn btn-primary">View Projects</a>
          <a href="#contact" className="btn btn-ghost">Get in touch</a>
        </div>

        {/* Tech pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {TECH_PILLS.map((tech) => (
            <span key={tech} style={{
              padding: '5px 14px',
              borderRadius: '100px',
              fontSize: '0.78rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
              background: 'rgba(148,163,184,0.06)',
              border: '1px solid rgba(148,163,184,0.1)',
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <a href="#about" aria-label="Scroll down" style={{
        position: 'absolute',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'var(--text-dim)',
        animation: 'bounce 2.2s ease-in-out infinite',
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
