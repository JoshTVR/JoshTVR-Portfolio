import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

async function getCv(locale: string, slug: string) {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('cvs')
      .select('title, role, file_url, locale')
      .eq('slug', slug)
      .eq('locale', locale)
      .eq('is_active', true)
      .single()
    return data
  } catch {
    return null
  }
}

export default async function CvPage({ params }: Props) {
  const { locale, slug } = await params
  const cv = await getCv(locale, slug)
  if (!cv) notFound()

  const isEs = locale === 'es'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
          {isEs ? 'Currículum Vitae' : 'Curriculum Vitae'}
        </p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Joshua Hernandez
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--accent-light)', fontWeight: 600, marginBottom: '40px' }}>
          {cv.title}
        </p>
        <a
          href={cv.file_url}
          download
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 32px',
            borderRadius: '12px',
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none',
            boxShadow: '0 0 32px var(--accent-glow)',
            transition: 'transform 200ms ease',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {isEs ? 'Descargar PDF' : 'Download PDF'}
        </a>
        <p style={{ marginTop: '20px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <a href={isEs ? '/es' : '/en'} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← {isEs ? 'Ver portfolio' : 'View portfolio'}
          </a>
        </p>
      </div>
    </div>
  )
}
