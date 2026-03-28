'use client'

import { useTransition, useState } from 'react'
import { togglePublish, deletePost, markShared } from './actions'

const TYPE_EMOJI: Record<string, string> = {
  devlog:       '🎮',
  announcement: '📢',
  tutorial:     '📚',
  post:         '✍️',
}

interface PostRow {
  id:               string
  slug:             string
  title_en:         string
  title_es:         string
  excerpt_es:       string | null
  type:             string
  tags:             string[]
  is_published:     boolean
  shared_linkedin:  boolean
  shared_instagram: boolean
}

export function PublishToggle({ id, published }: { id: string; published: boolean }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() => startTransition(async () => { await togglePublish(id, !published); window.location.reload() })}
      disabled={isPending}
      style={{
        padding: '4px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
        border: 'none', cursor: isPending ? 'default' : 'pointer',
        background: published ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)',
        color: published ? '#10b981' : 'var(--text-muted)',
      }}
    >
      {isPending ? '…' : published ? 'Published' : 'Draft'}
    </button>
  )
}

export function ShareButtons({ post, siteUrl }: { post: PostRow; siteUrl: string }) {
  const [isPending, startTransition] = useTransition()
  const [igCopied, setIgCopied] = useState(false)

  const postUrl = `${siteUrl}/es/posts/${post.slug}`

  function handleLinkedIn() {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${siteUrl}/en/posts/${post.slug}`)}`
    window.open(shareUrl, '_blank', 'noopener,noreferrer')
    startTransition(async () => { await markShared(post.id, 'linkedin') })
  }

  async function handleInstagram() {
    const emoji  = TYPE_EMOJI[post.type] ?? '✍️'
    const tags   = post.tags.map(t => `#${t}`).join(' ')
    const caption = `${emoji} ${post.title_es}\n\n${post.excerpt_es ?? ''}\n\n👉 ${postUrl}\n\n${tags} #joshtvr`
    await navigator.clipboard.writeText(caption)
    setIgCopied(true)
    setTimeout(() => setIgCopied(false), 2500)
    startTransition(async () => { await markShared(post.id, 'instagram') })
  }

  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
      {post.shared_linkedin
        ? <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '20px', background: 'rgba(0,119,181,0.12)', color: '#0077b5', fontWeight: 700 }}>✓ LinkedIn</span>
        : (
          <button
            onClick={handleLinkedIn}
            disabled={isPending}
            style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px', background: 'rgba(0,119,181,0.1)', color: '#0077b5', border: '1px solid rgba(0,119,181,0.25)', cursor: 'pointer', fontWeight: 600 }}
          >
            LinkedIn ↗
          </button>
        )
      }
      {post.shared_instagram
        ? <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '20px', background: 'rgba(225,48,108,0.12)', color: '#e1306c', fontWeight: 700 }}>✓ Instagram</span>
        : (
          <button
            onClick={handleInstagram}
            disabled={isPending}
            style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px', background: 'rgba(225,48,108,0.1)', color: '#e1306c', border: '1px solid rgba(225,48,108,0.25)', cursor: 'pointer', fontWeight: 600 }}
          >
            {igCopied ? '¡Copiado! ✓' : 'Copy IG'}
          </button>
        )
      }
    </div>
  )
}

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() => {
        if (!confirm(`Delete "${title}"?`)) return
        startTransition(async () => { await deletePost(id); window.location.reload() })
      }}
      disabled={isPending}
      style={{ fontSize: '0.78rem', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
    >
      {isPending ? '…' : 'Delete'}
    </button>
  )
}
