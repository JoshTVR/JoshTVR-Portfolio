import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { PostForm } from '@/components/admin/editors/PostForm'

export const dynamic = 'force-dynamic'

interface PageProps { params: Promise<{ id: string }> }

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params
  const supabase = createAdminClient()

  const [{ data: post }, { data: projects }] = await Promise.all([
    supabase.from('posts').select('*').eq('id', id).single(),
    supabase.from('projects').select('id,title_en').eq('is_published', true).order('sort_order', { ascending: true }),
  ])

  if (!post) notFound()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/posts" className="admin-back-link">← Posts</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Edit: {post.title_en}
        </h1>
      </div>
      <PostForm initial={{ ...post, tags: (post.tags ?? []).join(', ') }} projects={projects ?? []} />
    </div>
  )
}
