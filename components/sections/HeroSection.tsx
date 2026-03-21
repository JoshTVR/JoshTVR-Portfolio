'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'

const HeroCanvas = dynamic(() => import('@/components/three/HeroCanvas'), { ssr: false })

export default function HeroSection() {
  const t = useTranslations('hero')
  const typewriterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    let words: string[] = []
    try {
      const raw = t.raw('typewriter')
      words = Array.isArray(raw) ? (raw as string[]) : []
    } catch {}
    if (!words.length) words = ['immersive VR experiences', 'AI-powered solutions', '3D worlds', 'full-stack apps']

    let wi = 0, ci = 0, deleting = false
    let tid: ReturnType<typeof setTimeout>

    function tick() {
      const el = typewriterRef.current
      if (!el) return
      const w = words[wi % words.length]
      ci += deleting ? -1 : 1
      el.textContent = w.substring(0, ci)
      let delay = deleting ? 55 : 100
      if (!deleting && ci === w.length) { delay = 2000; deleting = true }
      else if (deleting && ci === 0)    { deleting = false; wi++; delay = 350 }
      tid = setTimeout(tick, delay)
    }
    tid = setTimeout(tick, 600)
    return () => clearTimeout(tid)
  }, [t])

  return (
    <section
      id="hero"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="hero-bg-grid" aria-hidden="true" />

      {/* Ambient yellow glow behind blob */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        right: '5%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 'clamp(300px, 42vw, 560px)',
        height: 'clamp(300px, 42vw, 560px)',
        background: 'radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div
        className="hero-content container-site"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
          padding: '96px clamp(20px, 5vw, 56px) 0',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ── LEFT ── */}
        <div className="hero-text reveal" style={{ flex: 1, maxWidth: '600px' }}>

          {/* Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '100px',
            background: 'rgba(250,204,21,0.1)',
            border: '1px solid rgba(250,204,21,0.25)',
            marginBottom: '28px',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', boxShadow: '0 0 8px var(--accent)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {t('greeting')}
            </span>
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(3rem, 7vw, 5.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1.02,
            marginBottom: '22px',
            background: 'var(--hero-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Joshua<br />Hernandez
          </h1>

          {/* Typewriter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.05rem, 2.2vw, 1.4rem)',
            fontWeight: 500,
            color: 'var(--text-muted)',
            marginBottom: '20px',
            minHeight: '2.2em',
          }}>
            <span>Building&nbsp;</span>
            <span ref={typewriterRef} style={{ color: 'var(--accent)', fontWeight: 600 }} />
            <span aria-hidden="true" style={{ color: 'var(--accent)', animation: 'blink 1s step-end infinite', marginLeft: '2px' }}>|</span>
          </div>

          {/* Bio */}
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.85,
            marginBottom: '40px',
            maxWidth: '460px',
          }}>
            {t('subtitle')}
          </p>

          {/* 3 CTAs */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
            <a href="#projects" className="btn btn-primary">View Projects</a>
            <a href="/en/services" className="btn btn-ghost">Services</a>
            <a href="/en/store" className="btn btn-ghost">Shop</a>
          </div>

          {/* Socials */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {[
              { href: 'https://github.com/JoshTVR', label: 'GitHub',
                icon: <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /> },
              { href: 'https://www.linkedin.com/in/joshtvr', label: 'LinkedIn',
                icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /> },
              { href: 'mailto:joshtvr4@gmail.com', label: 'Email',
                icon: <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" /> },
            ].map(({ href, label, icon }) => (
              <a key={label} href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={label}
                style={{ color: 'var(--text-muted)', transition: 'color var(--transition-mid), transform var(--transition-mid)', display: 'inline-flex' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">{icon}</svg>
              </a>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Blob (no container, floats freely) ── */}
        <div
          className="hero-blob"
          aria-hidden="true"
          style={{
            flexShrink: 0,
            width: 'clamp(280px, 40vw, 520px)',
            height: 'clamp(280px, 40vw, 520px)',
          }}
        >
          <HeroCanvas />
        </div>
      </div>

      {/* Scroll hint */}
      <a href="#about" aria-label="Scroll down" style={{
        position: 'absolute', bottom: '28px', left: '50%',
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
