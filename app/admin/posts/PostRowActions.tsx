'use client'

import { useTransition, useState } from 'react'
import { togglePublish, deletePost } from './actions'

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
  shared_facebook:  boolean
  shared_threads:   boolean
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

export function ShareButtons({ post }: { post: PostRow; siteUrl: string }) {
  const [sharing,  setSharing]  = useState<'linkedin' | 'instagram' | 'facebook' | 'threads' | null>(null)
  const [liShared, setLiShared] = useState(post.shared_linkedin)
  const [igShared, setIgShared] = useState(post.shared_instagram)
  const [fbShared, setFbShared] = useState(post.shared_facebook)
  const [thShared, setThShared] = useState(post.shared_threads)
  const [toast,    setToast]    = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleShare(network: 'linkedin' | 'instagram' | 'facebook' | 'threads') {
    setSharing(network)
    try {
      const res  = await fetch('/api/social/post', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ network, postId: post.id }),
      })
      const json = await res.json()
      if (json.ok) {
        if (network === 'linkedin') setLiShared(true)
        else if (network === 'instagram') setIgShared(true)
        else if (network === 'threads') setThShared(true)
        else setFbShared(true)
        showToast('¡Publicado! ✓')
      } else {
        showToast(json.error ?? 'Error al publicar')
      }
    } catch {
      showToast('Error de red')
    }
    setSharing(null)
  }

  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
      {toast && (
        <span style={{
          fontSize: '0.7rem', padding: '3px 10px', borderRadius: '20px',
          background: toast.startsWith('¡') ? 'rgba(16,185,129,0.12)' : 'rgba(248,113,113,0.12)',
          color: toast.startsWith('¡') ? '#10b981' : '#f87171', fontWeight: 600,
        }}>
          {toast}
        </span>
      )}
      {liShared
        ? <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '20px', background: 'rgba(0,119,181,0.12)', color: '#0077b5', fontWeight: 700 }}>✓ LinkedIn</span>
        : (
          <button
            onClick={() => handleShare('linkedin')}
            disabled={sharing !== null}
            style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px', background: 'rgba(0,119,181,0.1)', color: '#0077b5', border: '1px solid rgba(0,119,181,0.25)', cursor: sharing ? 'default' : 'pointer', fontWeight: 600 }}
          >
            {sharing === 'linkedin' ? '…' : 'LinkedIn'}
          </button>
        )
      }
      {igShared
        ? <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '20px', background: 'rgba(225,48,108,0.12)', color: '#e1306c', fontWeight: 700 }}>✓ Instagram</span>
        : (
          <button
            onClick={() => handleShare('instagram')}
            disabled={sharing !== null}
            style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px', background: 'rgba(225,48,108,0.1)', color: '#e1306c', border: '1px solid rgba(225,48,108,0.25)', cursor: sharing ? 'default' : 'pointer', fontWeight: 600 }}
          >
            {sharing === 'instagram' ? '…' : 'Instagram'}
          </button>
        )
      }
      {fbShared
        ? <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '20px', background: 'rgba(24,119,242,0.12)', color: '#1877f2', fontWeight: 700 }}>✓ Facebook</span>
        : (
          <button
            onClick={() => handleShare('facebook')}
            disabled={sharing !== null}
            style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px', background: 'rgba(24,119,242,0.1)', color: '#1877f2', border: '1px solid rgba(24,119,242,0.25)', cursor: sharing ? 'default' : 'pointer', fontWeight: 600 }}
          >
            {sharing === 'facebook' ? '…' : 'Facebook'}
          </button>
        )
      }
      {thShared
        ? <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '20px', background: 'rgba(255,255,255,0.08)', color: 'var(--text-primary)', fontWeight: 700 }}>✓ Threads</span>
        : (
          <button
            onClick={() => handleShare('threads')}
            disabled={sharing !== null}
            style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.07)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.15)', cursor: sharing ? 'default' : 'pointer', fontWeight: 600 }}
          >
            {sharing === 'threads' ? '…' : 'Threads'}
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
