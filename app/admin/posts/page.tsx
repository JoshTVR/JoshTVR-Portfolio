import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import PostsListClient, { type PostRow } from './PostsListClient'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://joshtvr.com'

async function getPosts() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('posts')
      .select('id,slug,title_en,title_es,excerpt_es,type,tags,is_published,shared_linkedin,shared_instagram,shared_facebook,shared_threads,linkedin_post_id,facebook_post_id,instagram_post_url,threads_post_url,published_at,scheduled_at,is_ai_generated,card_type,card_images,cover_image,created_at')
      .order('created_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export default async function AdminPostsPage() {
  const posts = await getPosts()
  const published = posts.filter((p: PostRow) => p.is_published).length
  const scheduled = posts.filter((p: PostRow) => !p.is_published && p.scheduled_at).length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Posts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {posts.length} total · {published} published · {scheduled} scheduled
          </p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '10px 20px' }}>
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="glass" style={{ padding: '48px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No posts yet. Create your first post to share devlogs, announcements, and tutorials.
        </div>
      ) : (
        <PostsListClient posts={posts as PostRow[]} siteUrl={SITE_URL} />
      )}
    </div>
  )
}
