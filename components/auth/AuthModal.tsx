'use client'

import { useEffect, useRef, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  defaultTab?: 'sign-in' | 'sign-up'
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
const USER_CALLBACK = `${siteUrl}/api/auth/user-callback`

export function AuthModal({ open, onClose, defaultTab = 'sign-in' }: AuthModalProps) {
  const [tab, setTab]         = useState<'sign-in' | 'sign-up'>(defaultTab)
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const backdropRef           = useRef<HTMLDivElement>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (open) { setEmail(''); setPassword(''); setError(null); setSuccess(null); setTab(defaultTab) }
  }, [open, defaultTab])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null); setSuccess(null)
    if (tab === 'sign-in') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      onClose()
      window.location.reload()
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: USER_CALLBACK } })
      if (error) { setError(error.message); setLoading(false); return }
      setSuccess('Check your email to confirm your account.')
    }
    setLoading(false)
  }

  async function handleOAuth(provider: 'github' | 'google') {
    setLoading(true); setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: USER_CALLBACK },
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div style={{
        background: 'var(--bg-secondary)',
        border: 'var(--glass-border)',
        borderRadius: '20px',
        padding: 'clamp(24px, 5vw, 40px)',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        position: 'relative',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '1.3rem', lineHeight: 1,
            padding: '4px 8px',
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Title */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
          {tab === 'sign-in' ? 'Welcome back' : 'Create account'}
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          {tab === 'sign-in' ? 'Sign in to track your orders and purchases.' : 'Sign up to buy products and services.'}
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--bg-primary)', borderRadius: '10px', padding: '4px' }}>
          {(['sign-in', 'sign-up'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); setSuccess(null) }}
              style={{
                flex: 1, padding: '8px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.15s',
                background: tab === t ? 'var(--accent)' : 'transparent',
                color: tab === t ? '#000' : 'var(--text-muted)',
              }}
            >
              {t === 'sign-in' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* OAuth Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {([
            { provider: 'github' as const, label: 'GitHub', icon: 'M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.72-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.8c1.02.005 2.05.138 3.01.404 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z' },
            { provider: 'google' as const, label: 'Google', icon: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' },
          ]).map(({ provider, label, icon }) => (
            <button
              key={provider}
              onClick={() => handleOAuth(provider)}
              disabled={loading}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '10px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                background: 'var(--bg-primary)', border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)', transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d={icon} />
              </svg>
              {label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>or continue with email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
        </div>

        {/* Email form */}
        <form onSubmit={handleEmail} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '12px 14px', borderRadius: '10px', fontSize: '0.9rem',
              background: 'var(--bg-primary)', border: '1px solid var(--border-glass)',
              color: 'var(--text-primary)', outline: 'none', width: '100%',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              padding: '12px 14px', borderRadius: '10px', fontSize: '0.9rem',
              background: 'var(--bg-primary)', border: '1px solid var(--border-glass)',
              color: 'var(--text-primary)', outline: 'none', width: '100%',
            }}
          />

          {error   && <p style={{ fontSize: '0.8rem', color: '#f87171', margin: 0 }}>{error}</p>}
          {success && <p style={{ fontSize: '0.8rem', color: '#4ade80', margin: 0 }}>{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Loading…' : tab === 'sign-in' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
