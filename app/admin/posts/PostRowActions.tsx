'use client'

import { useTransition, useState } from 'react'
import { togglePublish, deletePost } from './actions'

const TYPE_EMOJI: Record<string, string> = {
  devlog:       '🎮',
  announcement: '📢',
  tutorial:     '📚',
  post:         '✍️',
}

function typeEmoji(type: string) {
  if (type === 'devlog')       return '🛠️'
  if (type === 'announcement') return '📢'
  if (type === 'tutorial')     return '📚'
  return '✍️'
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
  card_images?:     string[] | null
  cover_image?:     string | null
}

type Network = 'linkedin' | 'instagram' | 'facebook' | 'threads'

interface ShareModalProps {
  network: Network
  post: PostRow
  onCancel: () => void
  onConfirm: () => void
}

function ShareModal({ network, post, onCancel, onConfirm }: ShareModalProps) {
  const tags        = (post.tags ?? []).map(t => `#${t}`).join(' ')
  const previewText = `${typeEmoji(post.type)} ${post.title_es ?? post.title_en}\n\n${post.excerpt_es ?? ''}\n\n${tags} #joshtvr`.trim()
  const hasImage    = (post.card_images?.length ?? 0) > 0 || Boolean(post.cover_image)
  const needsImage  = network !== 'threads'

  const networkColor: Record<Network, string> = {
    linkedin: '#0077b5', instagram: '#e1306c', facebook: '#1877f2', threads: 'var(--text-primary)',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div className="glass" style={{ padding: '24px', borderRadius: '16px', maxWidth: '480px', width: '100%' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Post to <span style={{ color: networkColor[network], textTransform: 'capitalize' }}>{network}</span>?
        </h3>

        {/* No image warning */}
        {needsImage && !hasImage && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', marginBottom: '14px', fontSize: '0.82rem', color: '#f87171' }}>
            ⚠️ No hay imagen disponible. Este post se publicará sin imagen — considera generar las cards primero.
          </div>
        )}

        {/* Text preview */}
        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px', fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '140px', overflowY: 'auto', lineHeight: 1.55 }}>
          {previewText}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel}
            style={{ padding: '8px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '0.85rem' }}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm}
            style={{ padding: '8px 20px', borderRadius: '8px', background: 'rgba(124,58,237,0.2)', color: 'var(--accent-light)', border: '1px solid rgba(124,58,237,0.4)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
            Confirm & Post
          </button>
        </div>
      </div>
    </div>
  )
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

export function ShareButtons({ post }: { post: PostRow }) {
  const [sharing,    setSharing]    = useState<Network | null>(null)
  const [pendingNet, setPendingNet] = useState<Network | null>(null)
  const [liShared,   setLiShared]   = useState(post.shared_linkedin)
  const [igShared,   setIgShared]   = useState(post.shared_instagram)
  const [fbShared,   setFbShared]   = useState(post.shared_facebook)
  const [thShared,   setThShared]   = useState(post.shared_threads)
  const [toast,      setToast]      = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function requestShare(network: Network) {
    setPendingNet(network)
  }

  async function confirmShare() {
    if (!pendingNet) return
    const network = pendingNet
    setPendingNet(null)
    setSharing(network)
    try {
      const res  = await fetch('/api/social/post', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ network, postId: post.id }),
      })
      const json = await res.json()
      if (json.ok) {
        if (network === 'linkedin')  setLiShared(true)
        else if (network === 'instagram') setIgShared(true)
        else if (network === 'threads')   setThShared(true)
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

  const btnStyle = (bg: string, color: string, border: string): React.CSSProperties => ({
    fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px',
    background: bg, color, border, cursor: sharing ? 'default' : 'pointer', fontWeight: 600,
  })

  return (
    <>
      {pendingNet && (
        <ShareModal
          network={pendingNet}
          post={post}
          onCancel={() => setPendingNet(null)}
          onConfirm={confirmShare}
        />
      )}
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
          : <button onClick={() => requestShare('linkedin')} disabled={sharing !== null} style={btnStyle('rgba(0,119,181,0.1)', '#0077b5', '1px solid rgba(0,119,181,0.25)')}>
              {sharing === 'linkedin' ? '…' : 'LinkedIn'}
            </button>
        }
        {igShared
          ? <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '20px', background: 'rgba(225,48,108,0.12)', color: '#e1306c', fontWeight: 700 }}>✓ Instagram</span>
          : <button onClick={() => requestShare('instagram')} disabled={sharing !== null} style={btnStyle('rgba(225,48,108,0.1)', '#e1306c', '1px solid rgba(225,48,108,0.25)')}>
              {sharing === 'instagram' ? '…' : 'Instagram'}
            </button>
        }
        {fbShared
          ? <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '20px', background: 'rgba(24,119,242,0.12)', color: '#1877f2', fontWeight: 700 }}>✓ Facebook</span>
          : <button onClick={() => requestShare('facebook')} disabled={sharing !== null} style={btnStyle('rgba(24,119,242,0.1)', '#1877f2', '1px solid rgba(24,119,242,0.25)')}>
              {sharing === 'facebook' ? '…' : 'Facebook'}
            </button>
        }
        {thShared
          ? <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '20px', background: 'rgba(255,255,255,0.08)', color: 'var(--text-primary)', fontWeight: 700 }}>✓ Threads</span>
          : <button onClick={() => requestShare('threads')} disabled={sharing !== null} style={btnStyle('rgba(255,255,255,0.07)', 'var(--text-primary)', '1px solid rgba(255,255,255,0.15)')}>
              {sharing === 'threads' ? '…' : 'Threads'}
            </button>
        }
      </div>
    </>
  )
}

export function DevlogActions({ id }: { id: string }) {
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <a
        href={`/admin/posts/${id}/edit`}
        style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px', background: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
      >
        Promote to Post
      </a>
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
