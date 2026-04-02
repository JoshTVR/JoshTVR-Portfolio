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
  postId?:    string
  sharedLinkedin?:  boolean
  sharedInstagram?: boolean
  sharedFacebook?:  boolean
  sharedThreads?:   boolean
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.joshtvr.com'

type Network = 'linkedin' | 'instagram' | 'facebook' | 'threads'

function typeEmoji(type: string) {
  if (type === 'devlog') return '🛠️'
  if (type === 'announcement') return '📢'
  if (type === 'tutorial') return '📚'
  return '✍️'
}

interface ConfirmModalProps {
  network: Network
  previewText: string
  hasImage: boolean
  onCancel: () => void
  onConfirm: () => void
}

function ConfirmModal({ network, previewText, hasImage, onCancel, onConfirm }: ConfirmModalProps) {
  const needsImage = network !== 'threads'
  const networkColor: Record<Network, string> = {
    linkedin: '#38bdf8', instagram: '#f472b6', facebook: '#60a5fa', threads: 'var(--text-primary)',
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass" style={{ padding: '24px', borderRadius: '16px', maxWidth: '480px', width: '100%' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Post to <span style={{ color: networkColor[network], textTransform: 'capitalize' }}>{network}</span>?
        </h3>
        {needsImage && !hasImage && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', marginBottom: '14px', fontSize: '0.82rem', color: '#f87171' }}>
            ⚠️ No hay imagen disponible. El post se publicará sin imagen — genera las cards primero.
          </div>
        )}
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

export function SocialPreview(p: SocialPreviewProps) {
  const [tab,        setTab]        = useState<Network>('linkedin')
  const [sharing,    setSharing]    = useState<Network | null>(null)
  const [pendingNet, setPendingNet] = useState<Network | null>(null)
  const [liShared,   setLiShared]   = useState(p.sharedLinkedin  ?? false)
  const [igShared,   setIgShared]   = useState(p.sharedInstagram ?? false)
  const [fbShared,   setFbShared]   = useState(p.sharedFacebook  ?? false)
  const [thShared,   setThShared]   = useState(p.sharedThreads   ?? false)
  const [toast,      setToast]      = useState('')

  const postUrl   = `${SITE_URL}/en/posts/${p.slug}`
  const tagList   = p.tags.split(',').map(t => t.trim()).filter(Boolean)
  const hashTags  = tagList.map(t => `#${t}`).join(' ')
  const liText    = [p.titleEn, p.excerptEn, postUrl].filter(Boolean).join('\n\n')
  const igCaption = `${typeEmoji(p.type)} ${p.titleEs}\n\n${p.excerptEs}\n\n👉 ${SITE_URL}/es/posts/${p.slug}\n\n${hashTags} #joshtvr`
  const thText    = `${typeEmoji(p.type)} ${p.titleEs ?? p.titleEn}\n\n${p.excerptEs ?? p.excerptEn ?? ''}\n\n${hashTags} #joshtvr`.trim()
  const hasImage  = Boolean(p.coverImage)

  function getPreviewText(network: Network) {
    if (network === 'linkedin') return liText
    if (network === 'threads')  return thText
    return igCaption
  }

  async function confirmShare() {
    if (!pendingNet) return
    const network = pendingNet
    setPendingNet(null)
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
        if (network === 'linkedin')       setLiShared(true)
        else if (network === 'instagram') setIgShared(true)
        else if (network === 'facebook')  setFbShared(true)
        else                              setThShared(true)
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

  const tabs: { id: Network; label: string; activeColor: string }[] = [
    { id: 'linkedin',  label: 'LinkedIn',  activeColor: 'rgba(0,119,181,0.2)'  },
    { id: 'instagram', label: 'Instagram', activeColor: 'rgba(225,48,108,0.2)' },
    { id: 'facebook',  label: 'Facebook',  activeColor: 'rgba(24,119,242,0.2)' },
    { id: 'threads',   label: 'Threads',   activeColor: 'rgba(255,255,255,0.1)' },
  ]
  const tabTextColor: Record<Network, string> = {
    linkedin: '#38bdf8', instagram: '#f472b6', facebook: '#60a5fa', threads: 'var(--text-primary)',
  }

  return (
    <div>
      {pendingNet && (
        <ConfirmModal
          network={pendingNet}
          previewText={getPreviewText(pendingNet)}
          hasImage={hasImage}
          onCancel={() => setPendingNet(null)}
          onConfirm={confirmShare}
        />
      )}

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{
            padding: '7px 16px', borderRadius: '8px', fontSize: '0.82rem',
            fontWeight: tab === t.id ? 700 : 500, cursor: 'pointer', border: 'none',
            background: tab === t.id ? t.activeColor : 'rgba(255,255,255,0.05)',
            color: tab === t.id ? tabTextColor[t.id] : 'var(--text-muted)',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* LinkedIn mockup */}
      {tab === 'linkedin' && (
        <div style={{ background: '#1b1f23', borderRadius: '12px', overflow: 'hidden', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(124,58,237,0.3)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#a78bfa' }}>J</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>Joshua Bermúdez <span style={{ fontSize: '0.72rem', fontWeight: 400, color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '1px 6px', borderRadius: '4px', marginLeft: '4px' }}>1st</span></div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '1px' }}>Developer & Content Creator</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '1px' }}>Just now · 🌐</div>
            </div>
          </div>
          <div style={{ padding: '0 16px 12px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {liText.length > 300 ? liText.slice(0, 300) + '…' : liText}
          </div>
          {p.coverImage ? (
            <img src={p.coverImage} alt="" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '1/1', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.8rem' }}>
              No image — generate card first
            </div>
          )}
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
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0' }}>joshtvrr</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#64748b' }}>···</span>
          </div>
          {p.coverImage ? (
            <img src={p.coverImage} alt="" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '1/1', background: 'rgba(225,48,108,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.8rem' }}>
              No image — generate card first
            </div>
          )}
          <div style={{ padding: '10px 14px 4px', display: 'flex', gap: '14px' }}>
            {['❤️','💬','📤'].map(a => <span key={a} style={{ fontSize: '1.1rem' }}>{a}</span>)}
            <span style={{ marginLeft: 'auto', fontSize: '1.1rem' }}>🔖</span>
          </div>
          <div style={{ padding: '4px 14px 14px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            <strong style={{ color: '#e2e8f0' }}>joshtvrr</strong>{' '}
            <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {igCaption.length > 250 ? igCaption.slice(0, 250) + '…' : igCaption}
            </span>
          </div>
        </div>
      )}

      {/* Facebook mockup */}
      {tab === 'facebook' && (
        <div style={{ background: '#1b1f23', borderRadius: '12px', overflow: 'hidden', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(24,119,242,0.25)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#60a5fa' }}>J</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>JoshTVR</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '1px' }}>Facebook Page · Just now · 🌐</div>
            </div>
          </div>
          <div style={{ padding: '0 16px 12px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {igCaption.length > 300 ? igCaption.slice(0, 300) + '…' : igCaption}
          </div>
          {p.coverImage ? (
            <img src={p.coverImage} alt="" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '1/1', background: 'rgba(24,119,242,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.8rem' }}>
              No image — generate card first
            </div>
          )}
          <div style={{ padding: '8px 16px', display: 'flex', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {['👍 Like','💬 Comment','↗️ Share'].map(a => (
              <span key={a} style={{ fontSize: '0.72rem', color: '#64748b' }}>{a}</span>
            ))}
          </div>
        </div>
      )}

      {/* Threads mockup */}
      {tab === 'threads' && (
        <div style={{ background: '#1b1f23', borderRadius: '12px', overflow: 'hidden', maxWidth: '460px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0' }}>J</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>joshtvr</span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>now</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.55, marginTop: '6px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {thText.length > 300 ? thText.slice(0, 300) + '…' : thText}
              </div>
              {p.coverImage && (
                <img src={p.coverImage} alt="" style={{ width: '100%', borderRadius: '8px', marginTop: '10px', objectFit: 'cover' }} />
              )}
            </div>
          </div>
          <div style={{ padding: '4px 16px 12px', display: 'flex', gap: '16px' }}>
            {['❤️ Like','💬 Comment','🔁 Repost','✈️ Send'].map(a => (
              <span key={a} style={{ fontSize: '0.72rem', color: '#64748b' }}>{a}</span>
            ))}
          </div>
        </div>
      )}

      {/* Manual post buttons (only if postId provided) */}
      {p.postId && (
        <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {liShared ? (
            <span style={{ fontSize: '0.78rem', padding: '6px 14px', borderRadius: '8px', background: 'rgba(0,119,181,0.12)', color: '#38bdf8', fontWeight: 700 }}>✓ Posted to LinkedIn</span>
          ) : (
            <button type="button" onClick={() => setPendingNet('linkedin')} disabled={sharing !== null}
              style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: sharing ? 'default' : 'pointer', background: 'rgba(0,119,181,0.15)', color: '#38bdf8', border: '1px solid rgba(0,119,181,0.3)' }}>
              {sharing === 'linkedin' ? 'Posting…' : 'Post to LinkedIn'}
            </button>
          )}
          {igShared ? (
            <span style={{ fontSize: '0.78rem', padding: '6px 14px', borderRadius: '8px', background: 'rgba(225,48,108,0.12)', color: '#f472b6', fontWeight: 700 }}>✓ Posted to Instagram</span>
          ) : (
            <button type="button" onClick={() => setPendingNet('instagram')} disabled={sharing !== null}
              style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: sharing ? 'default' : 'pointer', background: 'rgba(225,48,108,0.15)', color: '#f472b6', border: '1px solid rgba(225,48,108,0.3)' }}>
              {sharing === 'instagram' ? 'Posting…' : 'Post to Instagram'}
            </button>
          )}
          {fbShared ? (
            <span style={{ fontSize: '0.78rem', padding: '6px 14px', borderRadius: '8px', background: 'rgba(24,119,242,0.12)', color: '#60a5fa', fontWeight: 700 }}>✓ Posted to Facebook</span>
          ) : (
            <button type="button" onClick={() => setPendingNet('facebook')} disabled={sharing !== null}
              style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: sharing ? 'default' : 'pointer', background: 'rgba(24,119,242,0.15)', color: '#60a5fa', border: '1px solid rgba(24,119,242,0.3)' }}>
              {sharing === 'facebook' ? 'Posting…' : 'Post to Facebook'}
            </button>
          )}
          {thShared ? (
            <span style={{ fontSize: '0.78rem', padding: '6px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', color: 'var(--text-primary)', fontWeight: 700 }}>✓ Posted to Threads</span>
          ) : (
            <button type="button" onClick={() => setPendingNet('threads')} disabled={sharing !== null}
              style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: sharing ? 'default' : 'pointer', background: 'rgba(255,255,255,0.07)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.15)' }}>
              {sharing === 'threads' ? 'Posting…' : 'Post to Threads'}
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
