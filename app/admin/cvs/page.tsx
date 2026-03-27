import { createAdminClient } from '@/lib/supabase/admin'
import { ToggleCvActiveButton, ToggleCvFeaturedButton, DeleteCvButton } from './CvRowActions'
import { CvUploadForm } from './CvUploadForm'

export const dynamic = 'force-dynamic'

interface CvRow {
  id:          string
  title:       string
  role:        string
  locale:      string
  slug:        string
  file_url:    string
  is_featured: boolean
  is_active:   boolean
  sort_order:  number
  created_at:  string
}

async function getCvs(): Promise<CvRow[]> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('cvs')
      .select('*')
      .order('locale', { ascending: true })
      .order('sort_order', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

export default async function AdminCvsPage() {
  const cvs = await getCvs()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>CVs</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{cvs.length} CV{cvs.length !== 1 ? 's' : ''} · Print HTML to PDF, then upload here</p>
        </div>
        <CvUploadForm />
      </div>

      <div style={{ marginBottom: '20px', padding: '14px 20px', borderRadius: '10px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <strong style={{ color: 'var(--accent-light)' }}>How to add a CV:</strong> Open <code style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>public/cv/[version].html</code> in your browser → Ctrl+P → Save as PDF → Upload above.
        Public URLs follow the pattern: <code style={{ fontSize: '0.82rem' }}>/en/cv/vr-developer</code>, <code style={{ fontSize: '0.82rem' }}>/es/cv/3d-artist</code>, etc.
      </div>

      {cvs.length === 0 ? (
        <div className="glass" style={{ padding: '48px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '12px', fontSize: '0.95rem' }}>No CVs uploaded yet.</p>
          <p style={{ fontSize: '0.85rem' }}>Open any <code>public/cv/*.html</code> file in your browser, print to PDF, and upload it above.</p>
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px 90px 110px 180px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            <span>Title / Slug</span>
            <span>Lang</span>
            <span>Status</span>
            <span>Featured</span>
            <span>Public Link</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>
          {cvs.map((cv, i) => (
            <div key={cv.id} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px 90px 110px 180px', padding: '14px 20px', borderBottom: i < cvs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', gap: '8px' }}>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{cv.title}</p>
                <p style={{ fontSize: '0.77rem', color: 'var(--text-muted)', marginTop: '2px' }}>/{cv.locale}/cv/{cv.slug}</p>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{cv.locale}</span>
              <ToggleCvActiveButton id={cv.id} active={cv.is_active} />
              <ToggleCvFeaturedButton id={cv.id} locale={cv.locale} featured={cv.is_featured} />
              <a
                href={`/${cv.locale}/cv/${cv.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.78rem', color: 'var(--accent-light)', textDecoration: 'none' }}
              >
                View page ↗
              </a>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <a
                  href={cv.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  PDF ↗
                </a>
                <DeleteCvButton id={cv.id} title={cv.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
