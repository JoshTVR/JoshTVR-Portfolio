'use client'

import React, { useState } from 'react'

interface SocialPreviewProps {
  titleEn:    string
  titleEs:    string
  excerptEn:  string
  excerptEs:  string
  coverImage: string
  slug:       string
  tags:       string   // comma-separated
  type:       string
  // For the manual post buttons (only shown in edit mode)
  postId?:    string
  sharedLinkedin?:  boolean
  sharedInstagram?: boolean
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.joshtvr.com'

function typeEmoji(type: string) {
  if (type === 'devlog') return '🛠️'
  if (type === 'announcement') return '📢'
  if (type === 'tutorial') return '📚'
  return '✍️'
}

export function SocialPreview(p: SocialPreviewProps) {
  const [tab, setTab] = useState<'linkedin' | 'instagram'>('linkedin')
  const [sharing,  setSharing]  = useState<'linkedin' | 'instagram' | null>(null)
  const [liShared, setLiShared] = useState(p.sharedLinkedin ?? false)
  const [igShared, setIgShared] = useState(p.sharedInstagram ?? false)
  const [toast,    setToast]    = useState('')

  const postUrl  = `${SITE_URL}/en/posts/${p.slug}`
  const tagList  = p.tags.split(',').map(t => t.trim()).filter(Boolean)
  const hashTags = tagList.map(t => `#${t}`).join(' ')
  const liText   = [p.titleEn, p.excerptEn, postUrl].filter(Boolean).join('\n\n')
  const igCaption = `${typeEmoji(p.type)} ${p.titleEs}\n\n${p.excerptEs}\n\n👉 ${SITE_URL}/es/posts/${p.slug}\n\n${hashTags} #joshtvr`

  async function handleShare(network: 'linkedin' | 'instagram') {
    if (!p.postId) return
    setSharing(network)
    setToast('')
    try {
      const res  = await fetch('/api/social/post', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ network, postId: p.postId }),
      })
      const json = await res.json()
      if (json.ok) {
        if (network === 'linkedin') setLiShared(true)
        else setIgShared(true)
        setToast('¡Publicado! ✓')
      } else {
        setToast(json.error ?? 'Error al publicar')
      }
    } catch {
      setToast('Error de red')
    }
    setSharing(null)
    setTimeout(() => setToast(''), 4000)
  }

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {(['linkedin', 'instagram'] as const).map(n => (
          <button key={n} type="button" onClick={() => setTab(n)} style={{
            padding: '7px 16px', borderRadius: '8px', fontSize: '0.82rem',
            fontWeight: tab === n ? 700 : 500, cursor: 'pointer', border: 'none',
            background: tab === n
              ? n === 'linkedin' ? 'rgba(0,119,181,0.2)' : 'rgba(225,48,108,0.2)'
              : 'rgba(255,255,255,0.05)',
            color: tab === n
              ? n === 'linkedin' ? '#38bdf8' : '#f472b6'
              : 'var(--text-muted)',
          }}>
            {n === 'linkedin' ? 'LinkedIn' : 'Instagram'}
          </button>
        ))}
      </div>

      {/* LinkedIn mockup */}
      {tab === 'linkedin' && (
        <div style={{ background: '#1b1f23', borderRadius: '12px', overflow: 'hidden', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(124,58,237,0.3)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#a78bfa' }}>J</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>Joshua Bermúdez <span style={{ fontSize: '0.72rem', fontWeight: 400, color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '1px 6px', borderRadius: '4px', marginLeft: '4px' }}>1st</span></div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '1px' }}>Developer & Content Creator</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '1px' }}>Just now · 🌐</div>
            </div>
          </div>
          {/* Text */}
          <div style={{ padding: '0 16px 12px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {liText.length > 300 ? liText.slice(0, 300) + '…' : liText}
          </div>
          {/* Image */}
          {p.coverImage ? (
            <img src={p.coverImage} alt="" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '1/1', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.8rem' }}>
              No image — generate card first
            </div>
          )}
          {/* Actions */}
          <div style={{ padding: '8px 16px', display: 'flex', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {['👍 Like','💬 Comment','🔁 Repost','📤 Send'].map(a => (
              <span key={a} style={{ fontSize: '0.72rem', color: '#64748b' }}>{a}</span>
            ))}
          </div>
        </div>
      )}

      {/* Instagram mockup */}
      {tab === 'instagram' && (
        <div style={{ background: '#1b1f23', borderRadius: '12px', overflow: 'hidden', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Header */}
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0' }}>joshtvrr</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#64748b' }}>···</span>
          </div>
          {/* Image */}
          {p.coverImage ? (
            <img src={p.coverImage} alt="" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '1/1', background: 'rgba(225,48,108,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.8rem' }}>
              No image — generate card first
            </div>
          )}
          {/* Actions */}
          <div style={{ padding: '10px 14px 4px', display: 'flex', gap: '14px' }}>
            {['❤️','💬','📤'].map(a => <span key={a} style={{ fontSize: '1.1rem' }}>{a}</span>)}
            <span style={{ marginLeft: 'auto', fontSize: '1.1rem' }}>🔖</span>
          </div>
          {/* Caption */}
          <div style={{ padding: '4px 14px 14px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            <strong style={{ color: '#e2e8f0' }}>joshtvrr</strong>{' '}
            <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {igCaption.length > 250 ? igCaption.slice(0, 250) + '…' : igCaption}
            </span>
          </div>
        </div>
      )}

      {/* Manual post buttons (only if postId provided) */}
      {p.postId && (
        <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {liShared ? (
            <span style={{ fontSize: '0.78rem', padding: '6px 14px', borderRadius: '8px', background: 'rgba(0,119,181,0.12)', color: '#38bdf8', fontWeight: 700 }}>✓ Posted to LinkedIn</span>
          ) : (
            <button type="button" onClick={() => handleShare('linkedin')} disabled={sharing !== null}
              style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: sharing ? 'default' : 'pointer', background: 'rgba(0,119,181,0.15)', color: '#38bdf8', border: '1px solid rgba(0,119,181,0.3)' }}>
              {sharing === 'linkedin' ? 'Posting…' : 'Post to LinkedIn'}
            </button>
          )}
          {igShared ? (
            <span style={{ fontSize: '0.78rem', padding: '6px 14px', borderRadius: '8px', background: 'rgba(225,48,108,0.12)', color: '#f472b6', fontWeight: 700 }}>✓ Posted to Instagram</span>
          ) : (
            <button type="button" onClick={() => handleShare('instagram')} disabled={sharing !== null}
              style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: sharing ? 'default' : 'pointer', background: 'rgba(225,48,108,0.15)', color: '#f472b6', border: '1px solid rgba(225,48,108,0.3)' }}>
              {sharing === 'instagram' ? 'Posting…' : 'Post to Instagram'}
            </button>
          )}
          {toast && (
            <span style={{ fontSize: '0.8rem', color: toast.startsWith('¡') ? '#34d399' : '#f87171' }}>{toast}</span>
          )}
        </div>
      )}
    </div>
  )
}
