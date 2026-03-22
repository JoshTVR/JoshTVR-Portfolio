'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useState } from 'react'

interface ProjectData {
  id: string
  slug: string
  title_en: string
  title_es: string
  description_en: string
  description_es: string
  category: string
  tech_tags: string[]
  github_url: string | null
  demo_url: string | null
  cover_image: string | null
  is_featured: boolean
}

interface ProjectsSectionProps {
  projects: ProjectData[]
  filterLabels: Record<string, string>
  title?: string
}

const FILTER_KEYS = ['all', 'vr', 'ar', 'data', 'backend', 'design', '3d', 'video'] as const

const CATEGORY_COLORS: Record<string, string> = {
  vr: '#3b82f6', ar: '#8b5cf6', data: '#06b6d4',
  backend: '#10b981', design: '#ec4899', '3d': '#f59e0b', video: '#ef4444',
}

function PlaceholderSVG({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category.toLowerCase()] ?? '#3b82f6'
  return (
    <svg width="100%" height="100%" viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.6)' }}>
      <circle cx="320" cy="180" r="64" fill={color} opacity="0.12" />
      <circle cx="320" cy="180" r="36" fill={color} opacity="0.2" />
      <text x="320" y="186" textAnchor="middle" fill={color} fontSize="20"
        fontFamily="system-ui" fontWeight="700" opacity="0.7">
        {category.toUpperCase()}
      </text>
    </svg>
  )
}

function ProjectCard({ project, locale, filterLabels }: {
  project: ProjectData
  locale: string
  filterLabels: Record<string, string>
}) {
  const title = locale === 'es' ? project.title_es : project.title_en
  const description = locale === 'es' ? project.description_es : project.description_en
  const color = CATEGORY_COLORS[project.category.toLowerCase()] ?? '#3b82f6'
  const catLabel = filterLabels[project.category.toLowerCase()] ?? project.category

  return (
    <article style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRadius: '14px',
      border: '1px solid var(--border-glass)',
      background: 'var(--bg-card)',
      transition: 'border-color var(--transition-mid), transform var(--transition-mid)',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}40`
        e.currentTarget.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-glass)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Cover image */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
          />
        ) : (
          <PlaceholderSVG category={project.category} />
        )}
        {/* Category chip */}
        <span style={{
          position: 'absolute',
          top: 12, left: 12,
          padding: '3px 10px',
          borderRadius: '6px',
          fontSize: '0.7rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          background: `${color}22`,
          border: `1px solid ${color}40`,
          color,
          backdropFilter: 'blur(8px)',
        }}>
          {catLabel}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.05rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.3,
        }}>
          {title}
        </h3>

        <p style={{
          fontSize: '0.87rem',
          color: 'var(--text-muted)',
          lineHeight: 1.7,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {description}
        </p>

        {project.tech_tags && project.tech_tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {project.tech_tags.slice(0, 4).map((tag) => (
              <span key={tag} style={{
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.71rem',
                fontWeight: 500,
                background: 'rgba(148,163,184,0.07)',
                border: '1px solid rgba(148,163,184,0.1)',
                color: 'var(--text-muted)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
              style={{
                padding: '6px 14px', borderRadius: '7px', fontSize: '0.79rem', fontWeight: 600,
                background: 'var(--grad-accent)', color: '#fff', textDecoration: 'none',
              }}>
              Demo
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              style={{
                padding: '6px 14px', borderRadius: '7px', fontSize: '0.79rem', fontWeight: 600,
                border: '1px solid var(--border-glass)', color: 'var(--text-muted)', textDecoration: 'none',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--accent-light)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              GitHub
            </a>
          )}
          <Link href={`/${locale}/projects/${project.slug}`}
            style={{
              marginLeft: 'auto',
              fontSize: '0.79rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-light)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            View →
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function ProjectsSection({ projects, filterLabels, title = 'Projects' }: ProjectsSectionProps) {
  const locale = useLocale()
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.category.toLowerCase() === activeFilter)

  return (
    <section id="projects" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <span className="section-eyebrow reveal">Selected work</span>

        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '40px',
        }}>
          <h2 className="section-title reveal" style={{ marginBottom: 0 }}>{title}</h2>

          {/* Filter */}
          <div className="reveal" style={{
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
            background: 'rgba(15,23,42,0.5)',
            border: '1px solid var(--border-glass)',
            borderRadius: '10px',
            padding: '4px',
          }}>
            {FILTER_KEYS.map((key) => {
              const label = filterLabels[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
              const active = activeFilter === key
              return (
                <button key={key} onClick={() => setActiveFilter(key)} style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all var(--transition-fast)',
                  background: active ? 'var(--grad-accent)' : 'transparent',
                  color: active ? '#fff' : 'var(--text-muted)',
                }}>
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} filterLabels={filterLabels} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '48px', fontSize: '0.95rem' }}>
            No projects found.
          </p>
        )}
      </div>
    </section>
  )
}
