import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { PostForm } from '@/components/admin/editors/PostForm'

export const dynamic = 'force-dynamic'

export default async function NewPostPage() {
  const supabase = createAdminClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('id,title_en')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/posts" className="admin-back-link">← Posts</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          New Post
        </h1>
      </div>
      <PostForm projects={projects ?? []} />
    </div>
  )
}
