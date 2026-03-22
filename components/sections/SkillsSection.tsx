'use client'

import type { ReactNode } from 'react'

interface SkillCategory {
  icon: ReactNode
  title: string
  skills: string[]
  color: string
}

interface SkillsSectionProps {
  title?: string
  categories?: SkillCategory[]
}

const defaultCategories: SkillCategory[] = [
  {
    color: '#3b82f6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.5 6H3.5C2.12 6 1 7.12 1 8.5v7C1 16.88 2.12 18 3.5 18h3.69c.73 0 1.42-.32 1.89-.87l1.5-1.74c.27-.31.65-.39 1.02-.4.37.01.75.09 1.02.4l1.5 1.74c.47.55 1.16.87 1.89.87H20.5c1.38 0 2.5-1.12 2.5-2.5v-7C23 7.12 21.88 6 20.5 6zM7.5 14C6.12 14 5 12.88 5 11.5S6.12 9 7.5 9 10 10.12 10 11.5 8.88 14 7.5 14zm9 0c-1.38 0-2.5-1.12-2.5-2.5S15.12 9 16.5 9 19 10.12 19 11.5 17.88 14 16.5 14z" />
      </svg>
    ),
    title: 'VR / 3D Development',
    skills: ['Unity', 'Blender', 'Maya', 'C#', 'XR Toolkit', 'Oculus SDK'],
  },
  {
    color: '#8b5cf6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
      </svg>
    ),
    title: 'Data Science / AI',
    skills: ['Python', 'TensorFlow', 'Pandas', 'Scikit-Learn', 'Jupyter', 'NumPy'],
  },
  {
    color: '#06b6d4',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.59 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm0 14c-3.87 0-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V17c0 .5-2.13 2-6 2zm0-4c-3.87 0-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V13c0 .5-2.13 2-6 2z" />
      </svg>
    ),
    title: 'Backend / Databases',
    skills: ['SQL', 'SQL Server', 'Java', 'REST APIs', 'Supabase', 'PostgreSQL'],
  },
  {
    color: '#ec4899',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    ),
    title: 'Design / Multimedia',
    skills: ['Adobe Photoshop', 'Premiere Pro', 'Illustrator', 'After Effects', 'Figma'],
  },
]

const TICKER_ITEMS = [
  'Next.js', 'React', 'TypeScript', 'Python', 'Blender', 'Unity',
  'TensorFlow', 'Supabase', 'PostgreSQL', 'Three.js', 'Figma',
  'MagicaVoxel', 'C#', 'Tailwind CSS', 'Node.js', 'REST APIs',
  'Pandas', 'NumPy', 'After Effects', 'Premiere Pro',
]

export default function SkillsSection({
  title = 'Skills & Tools',
  categories = defaultCategories,
}: SkillsSectionProps) {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <section id="skills" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <span className="section-eyebrow reveal">What I work with</span>
        <h2 className="section-title reveal">{title}</h2>

        {/* Ticker */}
        <div style={{
          overflow: 'hidden',
          marginBottom: '64px',
          borderTop: '1px solid var(--border-glass)',
          borderBottom: '1px solid var(--border-glass)',
          padding: '16px 0',
        }} aria-hidden="true">
          <div className="tech-ticker">
            {items.map((tech, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '20px', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
                  {tech}
                </span>
                <span style={{ color: 'var(--accent)', opacity: 0.3, fontSize: '0.55rem' }}>◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* Category cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: '16px',
        }}>
          {categories.map((cat, i) => (
            <div
              key={i}
              className="reveal-stagger"
              style={{
                padding: '28px 24px',
                borderRadius: '14px',
                border: '1px solid var(--border-glass)',
                background: 'var(--bg-card)',
                transition: 'border-color var(--transition-mid), background var(--transition-mid), transform var(--transition-mid)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${cat.color}40`
                e.currentTarget.style.background = 'var(--bg-card-hover)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-glass)'
                e.currentTarget.style.background = 'var(--bg-card)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                background: `${cat.color}18`,
                border: `1px solid ${cat.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: cat.color,
                marginBottom: '16px',
              }}>
                {cat.icon}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '14px',
              }}>
                {cat.title}
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {cat.skills.map((skill) => (
                  <span key={skill} style={{
                    padding: '3px 9px',
                    borderRadius: '5px',
                    fontSize: '0.73rem',
                    fontWeight: 500,
                    background: `${cat.color}10`,
                    border: `1px solid ${cat.color}22`,
                    color: 'var(--text-muted)',
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
