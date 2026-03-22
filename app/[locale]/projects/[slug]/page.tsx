import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProjectGallery from '@/components/projects/ProjectGallery'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('projects')
      .select('title_en,title_es,description_en,description_es,cover_image')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    if (!data) return { title: 'Project — JoshTVR' }
    const isEs = locale === 'es'
    const title = isEs ? data.title_es : data.title_en
    const description = isEs ? data.description_es : data.description_en
    return {
      title: `${title} — JoshTVR`,
      description,
      openGraph: {
        title,
        description,
        images: data.cover_image ? [{ url: data.cover_image }] : [],
        type: 'article',
      },
      twitter: { card: 'summary_large_image', title, description },
    }
  } catch {
    return { title: 'Project — JoshTVR' }
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  vr:     'VR',
  ar:     'AR',
  data:   'Data Science',
  backend:'Backend',
  design: 'Design',
  '3d':   '3D',
  video:  'Video',
  github: 'Open Source',
}

const CATEGORY_COLORS: Record<string, string> = {
  vr:      'rgba(139,92,246,0.85)',
  ar:      'rgba(59,130,246,0.85)',
  data:    'rgba(6,182,212,0.85)',
  backend: 'rgba(16,185,129,0.85)',
  design:  'rgba(236,72,153,0.85)',
  '3d':    'rgba(245,158,11,0.85)',
  video:   'rgba(239,68,68,0.85)',
  github:  'rgba(30,41,59,0.9)',
}

const CATEGORY_TEXT: Record<string, string> = {
  vr:      '#fff',
  ar:      '#fff',
  data:    '#fff',
  backend: '#fff',
  design:  '#fff',
  '3d':    '#fff',
  video:   '#fff',
  github:  '#94a3b8',
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params

  let project: ProjectDetail | null = null

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    project = data as ProjectDetail | null
  } catch {
    // Supabase not configured
  }

  if (!project) notFound()

  const isEs      = locale === 'es'
  const title       = isEs ? project.title_es       : project.title_en
  const description = isEs ? project.description_es : project.description_en
  const content     = isEs ? project.content_es     : project.content_en

  const catLabel = CATEGORY_LABELS[project.category.toLowerCase()] ?? project.category
  const catColor = CATEGORY_COLORS[project.category.toLowerCase()] ?? 'rgba(250,204,21,0.85)'
  const catText  = CATEGORY_TEXT[project.category.toLowerCase()]   ?? '#fff'

  // Build gallery: cover first (if not already in images array), then rest
  const galleryImages: string[] = []
  if (project.cover_image) galleryImages.push(project.cover_image)
  for (const img of (project.images ?? [])) {
    if (img !== project.cover_image) galleryImages.push(img)
  }

  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '21/9', minHeight: '320px', maxHeight: '560px', overflow: 'hidden', background: '#111' }}>
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={title}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a1a14 0%,#2a2a1a 100%)' }} />
        )}

        {/* Gradient scrim */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.45) 45%, transparent 100%)',
        }} />

        {/* Back link top-left */}
        <Link
          href={`/${locale}#projects`}
          style={{
            position: 'absolute',
            top: '24px',
            left: '28px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '24px',
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.85)',
            fontSize: '0.83rem',
            fontWeight: 600,
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.12)',
            transition: 'all 0.2s ease',
            zIndex: 2,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          {isEs ? 'Proyectos' : 'Projects'}
        </Link>

        {/* Category badge + Featured */}
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '28px',
          display: 'flex',
          gap: '8px',
          zIndex: 2,
        }}>
          <span style={{
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '0.74rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            background: catColor,
            color: catText,
          }}>
            {catLabel}
          </span>
          {project.is_featured && (
            <span style={{
              padding: '5px 14px',
              borderRadius: '20px',
              fontSize: '0.74rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              background: 'rgba(250,204,21,0.9)',
              color: '#1a1a14',
            }}>
              ★ Featured
            </span>
          )}
        </div>

        {/* Title overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '28px clamp(20px, 5vw, 56px)',
          zIndex: 2,
        }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#f0f0f0',
            lineHeight: 1.1,
            textShadow: '0 2px 20px rgba(0,0,0,0.7)',
            maxWidth: '700px',
          }}>
            {title}
          </h1>
        </div>
      </div>

      {/* ── Body ── */}
      <div
        className="container-site project-detail-grid"
        style={{ paddingTop: '48px', paddingBottom: '96px' }}
      >
        {/* Left column — main content */}
        <div>

          {/* Description */}
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            lineHeight: 1.85,
            marginBottom: '40px',
            borderLeft: '3px solid var(--accent)',
            paddingLeft: '20px',
          }}>
            {description}
          </p>

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '16px',
              }}>
                {isEs ? 'Galería' : 'Gallery'} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.9rem' }}>({galleryImages.length})</span>
              </h2>
              <ProjectGallery images={galleryImages} title={title} videoUrls={project.video_url} />
            </div>
          )}

          {/* Process / Rich text */}
          {content && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
                paddingTop: '8px',
                borderTop: '1px solid var(--border-glass)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent)">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  margin: 0,
                }}>
                  {isEs ? 'Proceso & Notas' : 'Process & Notes'}
                </h2>
              </div>
              <div className="prose-dark" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="project-detail-sidebar" style={{ position: 'sticky', top: '96px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Links */}
          {(project.demo_url || project.github_url) && (
            <div className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                {isEs ? 'Enlaces' : 'Links'}
              </span>
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                  </svg>
                  {isEs ? 'Ver Demo' : 'Live Demo'}
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              )}
            </div>
          )}

          {/* Tech stack */}
          {project.tech_tags && project.tech_tags.length > 0 && (
            <div className="glass" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'block', marginBottom: '14px' }}>
                Tech Stack
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {project.tech_tags.map((tag) => (
                  <span key={tag} className="skill-tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Category */}
          <div className="glass" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
              {isEs ? 'Categoría' : 'Category'}
            </span>
            <span style={{
              display: 'inline-block',
              padding: '5px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              background: catColor,
              color: catText,
            }}>
              {catLabel}
            </span>
          </div>

          {/* Image count */}
          {galleryImages.length > 0 && (
            <div style={{
              padding: '14px 18px',
              borderRadius: '10px',
              background: 'rgba(250,204,21,0.06)',
              border: '1px solid rgba(250,204,21,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {galleryImages.length} {isEs ? 'imágenes' : 'images'}
              </span>
            </div>
          )}
        </aside>
      </div>

    </main>
  )
}

interface ProjectDetail {
  id: string
  slug: string
  title_en: string
  title_es: string
  description_en: string
  description_es: string
  content_en: string | null
  content_es: string | null
  category: string
  tech_tags: string[]
  github_url: string | null
  demo_url: string | null
  cover_image: string | null
  images: string[]
  video_url: string[] | null
  is_published: boolean
  is_featured: boolean
}
