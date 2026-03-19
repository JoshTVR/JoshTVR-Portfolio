import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { ProjectForm } from '@/components/admin/editors/ProjectForm'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params

  let project = null
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    project = data
  } catch {
    // ignore
  }

  if (!project) notFound()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/projects" className="admin-back-link">
          ← Projects
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          Edit: {project.title_en}
        </h1>
      </div>

      <ProjectForm initial={{ ...project, id }} />
    </div>
  )
}
