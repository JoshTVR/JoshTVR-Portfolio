import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { PublishToggle, ShareButtons, DeletePostButton } from './PostRowActions'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://joshtvr.com'

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  devlog:       { bg: 'rgba(124,58,237,0.15)',  color: '#a78bfa' },
  announcement: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  tutorial:     { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
  post:         { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' },
}

async function getPosts() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('posts')
      .select('id,slug,title_en,title_es,excerpt_es,type,tags,is_published,shared_linkedin,shared_instagram,published_at,scheduled_at,is_ai_generated,card_type,created_at')
      .order('created_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export default async function AdminPostsPage() {
  const posts = await getPosts()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Posts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {posts.length} total · {posts.filter((p: PostRow) => p.is_published).length} published · {posts.filter((p: PostRow) => !p.is_published && p.scheduled_at).length} scheduled
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {posts.map((post: PostRow) => {
            const tc = TYPE_COLORS[post.type] ?? TYPE_COLORS.post
            return (
              <div key={post.id} className="glass" style={{ padding: '16px 20px', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', padding: '2px 9px', borderRadius: '20px', fontWeight: 700, background: tc.bg, color: tc.color }}>
                      {post.type}
                    </span>
                    {post.card_type && (
                      <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '20px', background: 'rgba(56,189,248,0.12)', color: '#38bdf8', fontWeight: 600 }}>
                        {post.card_type}
                      </span>
                    )}
                    {post.is_ai_generated && (
                      <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '20px', background: 'rgba(167,139,250,0.12)', color: '#a78bfa', fontWeight: 600 }}>
                        🤖 AI
                      </span>
                    )}
                    {!post.is_published && post.scheduled_at && (
                      <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '20px', background: 'rgba(251,191,36,0.12)', color: '#fbbf24', fontWeight: 600 }}>
                        ⏰ {new Date(post.scheduled_at).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', margin: 0 }}>
                      {post.title_en}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <PublishToggle id={post.id} published={post.is_published} />
                    <ShareButtons post={post} siteUrl={SITE_URL} />
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <Link href={`/admin/posts/${post.id}/edit`} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                    Edit
                  </Link>
                  <DeletePostButton id={post.id} title={post.title_en} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface PostRow {
  id: string; slug: string; title_en: string; title_es: string
  excerpt_es: string | null; type: string; tags: string[]
  is_published: boolean; shared_linkedin: boolean; shared_instagram: boolean
  published_at: string | null; scheduled_at: string | null
  is_ai_generated: boolean; card_type: string | null
  created_at: string
}
