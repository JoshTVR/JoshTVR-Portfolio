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

// Category → badge class
function getBadgeClass(category: string): string {
  const map: Record<string, string> = {
    vr: 'badge-vr',
    ar: 'badge-ar',
    data: 'badge-data',
    backend: 'badge-backend',
    design: 'badge-design',
    '3d': 'badge-3d',
    video: 'badge-video',
  }
  return map[category.toLowerCase()] ?? 'badge-vr'
}

// SVG placeholder per category
function PlaceholderSVG({ category }: { category: string }) {
  const colors: Record<string, string> = {
    vr: '#7c3aed',
    ar: '#8b5cf6',
    data: '#3b82f6',
    backend: '#10b981',
    design: '#ec4899',
    '3d': '#f59e0b',
    video: '#ef4444',
  }
  const color = colors[category.toLowerCase()] ?? '#7c3aed'

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
      <text
        x="320"
        y="186"
        textAnchor="middle"
        fill={color}
        fontSize="22"
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
        opacity="0.8"
      >
        {category.toUpperCase()}
      </text>
    </svg>
  )
}

export default function ProjectsSection({
  projects,
  filterLabels,
  title = 'Projects',
}: ProjectsSectionProps) {
  const locale = useLocale()
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category.toLowerCase() === activeFilter)

  return (
    <section id="projects" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <h2 className="section-title reveal">{title}</h2>

        {/* Filter bar */}
        <div
          className="reveal"
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}
        >
          {FILTER_KEYS.map((key) => {
            const label = filterLabels[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`filter-btn${activeFilter === key ? ' active' : ''}`}
                style={{
                  padding: '9px 22px',
                  borderRadius: '24px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-mid)',
                  ...(activeFilter === key
                    ? {
                        background: 'var(--accent)',
                        color: '#fff',
                        border: '1px solid var(--accent)',
                        boxShadow: '0 0 20px var(--accent-glow)',
                      }
                    : {
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }),
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Projects grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredProjects.map((project) => {
            const title = locale === 'es' ? project.title_es : project.title_en
            const description = locale === 'es' ? project.description_es : project.description_en
            const badgeClass = getBadgeClass(project.category)

            return (
              <article
                key={project.id}
                className="glass"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  transition: 'transform var(--transition-mid), box-shadow var(--transition-mid)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow =
                    '0 20px 56px rgba(0,0,0,0.55), 0 0 28px var(--accent-glow)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                {/* Image wrapper */}
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    aspectRatio: '16/9',
                  }}
                >
                  {project.cover_image ? (
                    <Image
                      src={project.cover_image}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover', transition: 'transform var(--transition-slow)' }}
                    />
                  ) : (
                    <PlaceholderSVG category={project.category} />
                  )}

                  {/* Category badge */}
                  <span
                    className={`project-badge ${badgeClass}`}
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {filterLabels[project.category.toLowerCase()] ?? project.category}
                  </span>
                </div>

                {/* Card body */}
                <div
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    flex: 1,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {title}
                  </h3>

                  {/* Meta */}
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {project.category}
                  </p>

                  {/* Description — 3-line clamp */}
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.7,
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {description}
                  </p>

                  {/* Tech tags */}
                  {project.tech_tags && project.tech_tags.length > 0 && (
                    <ul
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {project.tech_tags.map((tag) => (
                        <li
                          key={tag}
                          style={{
                            padding: '3px 10px',
                            borderRadius: '16px',
                            fontSize: '0.76rem',
                            fontWeight: 500,
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Links row */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-sm"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '7px 18px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          background: 'var(--accent)',
                          color: '#fff',
                          boxShadow: '0 0 14px var(--accent-glow)',
                          textDecoration: 'none',
                          transition: 'all var(--transition-mid)',
                        }}
                      >
                        Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 18px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          background: 'transparent',
                          color: 'var(--text-muted)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          textDecoration: 'none',
                          transition: 'all var(--transition-mid)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--accent)'
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
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--accent-light)',
                        textDecoration: 'none',
                        transition: 'color var(--transition-mid)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--accent)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--accent-light)'
                      }}
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {filteredProjects.length === 0 && (
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              marginTop: '48px',
              fontSize: '1rem',
            }}
          >
            No projects found in this category.
          </p>
        )}
      </div>
    </section>
  )
}
