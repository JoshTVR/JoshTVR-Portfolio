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
  vr:      '#7c3aed',
  ar:      '#8b5cf6',
  data:    '#3b82f6',
  backend: '#10b981',
  design:  '#ec4899',
  '3d':    '#f59e0b',
  video:   '#ef4444',
}

function PlaceholderSVG({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category.toLowerCase()] ?? '#7c3aed'
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 640 360"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.03)' }}
    >
      <rect width="640" height="360" fill="rgba(0,0,0,0.2)" />
      <circle cx="320" cy="180" r="60" fill={color} opacity="0.15" />
      <circle cx="320" cy="180" r="35" fill={color} opacity="0.25" />
      <text x="320" y="186" textAnchor="middle" fill={color} fontSize="22"
        fontFamily="system-ui, sans-serif" fontWeight="600" opacity="0.8">
        {category.toUpperCase()}
      </text>
    </svg>
  )
}

function ProjectCard({ project, locale, filterLabels, featured = false }: {
  project: ProjectData
  locale: string
  filterLabels: Record<string, string>
  featured?: boolean
}) {
  const title = locale === 'es' ? project.title_es : project.title_en
  const description = locale === 'es' ? project.description_es : project.description_en
  const color = CATEGORY_COLORS[project.category.toLowerCase()] ?? '#7c3aed'
  const catLabel = filterLabels[project.category.toLowerCase()] ?? project.category

  return (
    <article
      style={{
        display: 'flex',
        flexDirection: featured ? 'row' : 'column',
        overflow: 'hidden',
        border: '1px solid var(--border-glass)',
        borderRadius: '12px',
        background: 'var(--bg-secondary)',
        transition: 'border-color var(--transition-mid), transform var(--transition-mid)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(250,204,21,0.3)'
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-glass)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: featured ? '16/9' : '16/9',
        flex: featured ? '0 0 50%' : undefined,
        maxWidth: featured ? '50%' : undefined,
      }}>
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={title}
            fill
            sizes={featured
              ? '(max-width: 768px) 100vw, 50vw'
              : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
            style={{ objectFit: 'cover', transition: 'transform var(--transition-slow)' }}
          />
        ) : (
          <PlaceholderSVG category={project.category} />
        )}
      </div>

      {/* Body */}
      <div style={{
        padding: featured ? '32px' : '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flex: 1,
      }}>
        {/* Category + featured badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
            fontSize: '0.7rem',
            fontWeight: 600,
            color,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            {catLabel}
          </span>
          {project.is_featured && (
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'var(--accent)',
              background: 'rgba(250,204,21,0.1)',
              border: '1px solid rgba(250,204,21,0.2)',
              borderRadius: '4px',
              padding: '1px 6px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              Featured
            </span>
          )}
        </div>

        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: featured ? '1.4rem' : '1.05rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.3,
        }}>
          {title}
        </h3>

        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          lineHeight: 1.7,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: featured ? 4 : 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {description}
        </p>

        {/* Tech tags */}
        {project.tech_tags && project.tech_tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {project.tech_tags.slice(0, featured ? 6 : 4).map((tag) => (
              <span key={tag} style={{
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 500,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'var(--text-muted)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
              style={{
                padding: '6px 16px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
                background: 'var(--accent)', color: '#0a0a0f', textDecoration: 'none',
                transition: 'opacity var(--transition-mid)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
            >
              Demo
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              style={{
                padding: '6px 16px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
                background: 'transparent', color: 'var(--text-muted)', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all var(--transition-mid)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(250,204,21,0.3)'
                e.currentTarget.style.color = 'var(--accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              GitHub
            </a>
          )}
          <Link
            href={`/${locale}/projects/${project.slug}`}
            style={{
              marginLeft: 'auto',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'color var(--transition-mid)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            View →
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function ProjectsSection({
  projects,
  filterLabels,
  title = 'Projects',
}: ProjectsSectionProps) {
  const locale = useLocale()
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.category.toLowerCase() === activeFilter)

  const featured = filtered.filter((p) => p.is_featured)
  const rest = filtered.filter((p) => !p.is_featured)

  return (
    <section id="projects" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Section label */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{
            fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}>
            03 /
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '36px',
        }}>
          <h2 className="section-title reveal" style={{ marginBottom: 0 }}>{title}</h2>

          {/* Filter bar */}
          <div
            className="reveal"
            style={{
              display: 'flex',
              gap: '4px',
              flexWrap: 'wrap',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              padding: '4px',
            }}
          >
            {FILTER_KEYS.map((key) => {
              const label = filterLabels[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
              const isActive = activeFilter === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all var(--transition-fast)',
                    background: isActive ? 'var(--accent)' : 'transparent',
                    color: isActive ? '#0a0a0f' : 'var(--text-muted)',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Featured projects — 2-col or single-col */}
        {featured.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: featured.length >= 2 ? '1fr 1fr' : '1fr',
            gap: '24px',
            marginBottom: '24px',
          }}>
            {featured.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                locale={locale}
                filterLabels={filterLabels}
                featured={false}
              />
            ))}
          </div>
        )}

        {/* Rest of projects — 3-col grid */}
        {rest.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}>
            {rest.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                locale={locale}
                filterLabels={filterLabels}
              />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <p style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            marginTop: '48px',
            fontSize: '0.95rem',
          }}>
            No projects found in this category.
          </p>
        )}
      </div>
    </section>
  )
}
