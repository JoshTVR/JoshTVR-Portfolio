import Link from 'next/link'
import { ProjectForm } from '@/components/admin/editors/ProjectForm'

export const dynamic = 'force-dynamic'

export default function NewProjectPage() {
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
          New Project
        </h1>
      </div>

      <ProjectForm />
    </div>
  )
}
