import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { DeleteProjectButton, TogglePublishButton } from './ProjectRowActions'

export const dynamic = 'force-dynamic'

async function getProjects() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('projects')
      .select('id,slug,title_en,category,is_published,is_featured,sort_order,created_at')
      .order('sort_order', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

export default async function AdminProjectsPage() {
  const projects = await getProjects()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Projects
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{projects.length} total</p>
        </div>
        <Link href="/admin/projects/new" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '10px 20px' }}>
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div
          className="glass"
          style={{
            padding: '48px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <p style={{ fontSize: '1rem', marginBottom: '16px' }}>No projects yet.</p>
          <Link href="/admin/projects/new" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '10px 20px' }}>
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 100px 100px 160px',
              padding: '12px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}
          >
            <span>Title</span>
            <span>Category</span>
            <span>Status</span>
            <span>Featured</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {projects.map((p: ProjectRow, i) => (
            <div
              key={p.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 100px 100px 160px',
                padding: '14px 20px',
                borderBottom: i < projects.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                alignItems: 'center',
                transition: 'background 150ms ease',
              }}
              className="admin-table-row"
            >
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '2px' }}>
                  {p.title_en}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>/{p.slug}</p>
              </div>

              <span
                className={`badge-${p.category}`}
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {p.category}
              </span>

              <TogglePublishButton id={p.id} published={p.is_published} />

              <span style={{ fontSize: '0.82rem', color: p.is_featured ? '#f59e0b' : 'var(--text-muted)' }}>
                {p.is_featured ? '★ Yes' : '—'}
              </span>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Link
                  href={`/admin/projects/${p.id}/edit`}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: 'rgba(255,255,255,0.06)',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 150ms ease',
                  }}
                >
                  Edit
                </Link>
                <DeleteProjectButton id={p.id} title={p.title_en} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface ProjectRow {
  id: string
  slug: string
  title_en: string
  category: string
  is_published: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
}
