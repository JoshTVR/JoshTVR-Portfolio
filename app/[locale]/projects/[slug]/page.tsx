import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

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

  const title       = locale === 'es' ? project.title_es       : project.title_en
  const description = locale === 'es' ? project.description_es : project.description_en
  const content     = locale === 'es' ? project.content_es     : project.content_en

  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '96px', paddingBottom: '80px' }}>
      <div className="container-site" style={{ maxWidth: '860px' }}>
        {/* Back link */}
        <Link
          href={`/${locale}#projects`}
          className="admin-back-link"
          style={{ marginBottom: '32px' }}
        >
          ← Back to Projects
        </Link>

        {/* Cover image */}
        {project.cover_image && (
          <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '40px' }}>
            <Image src={project.cover_image} alt={title} fill style={{ objectFit: 'cover' }} priority />
          </div>
        )}

        {/* Category + tags */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <span className={`project-badge badge-${project.category.toLowerCase()}`}
            style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {project.category}
          </span>
          {project.tech_tags?.map((tag: string) => (
            <span key={tag} style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '0.76rem', fontWeight: 500, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
          {title}
        </h1>

        {/* Description */}
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '32px' }}>
          {description}
        </p>

        {/* Links */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Live Demo
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              GitHub
            </a>
          )}
        </div>

        {/* Rich text content */}
        {content && (
          <div className="prose-dark" dangerouslySetInnerHTML={{ __html: content }} />
        )}

        {/* Image gallery */}
        {project.images && project.images.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>
              Gallery
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {project.images.map((img: string, i: number) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '10px', overflow: 'hidden' }}>
                  <Image src={img} alt={`${title} ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}
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
  is_published: boolean
  is_featured: boolean
}
