'use client'

import { useEffect, useRef, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function UserMenu() {
  const [user,     setUser]     = useState<User | null>(null)
  const [open,     setOpen]     = useState(false)
  const [loading,  setLoading]  = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user); setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (loading) return <div style={{ width: 36, height: 36 }} />

  // Not logged in — null (Navbar will show Sign In button instead)
  if (!user) return null

  const initials = (user.user_metadata?.full_name as string | undefined)
    ?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    ?? user.email?.[0].toUpperCase()
    ?? '?'

  const avatar = user.user_metadata?.avatar_url as string | undefined

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '2px solid var(--accent)',
          cursor: 'pointer', overflow: 'hidden',
          background: 'var(--accent)', color: '#000',
          fontWeight: 700, fontSize: '0.8rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0,
        }}
        aria-label="User menu"
      >
        {avatar
          ? <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : initials}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          background: 'var(--bg-secondary)',
          border: 'var(--glass-border)',
          borderRadius: '12px',
          padding: '8px',
          minWidth: '180px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          zIndex: 300,
        }}>
          {/* User info */}
          <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid var(--border-glass)', marginBottom: '6px' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              {(user.user_metadata?.full_name as string | undefined) ?? 'Account'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
              {user.email}
            </p>
          </div>

          <a
            href="/en/orders"
            onClick={() => setOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '9px 12px', borderRadius: '8px', fontSize: '0.875rem',
              color: 'var(--text-primary)', textDecoration: 'none',
              transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
            </svg>
            My Orders
          </a>

          <button
            onClick={async () => { await supabase.auth.signOut(); setOpen(false); window.location.reload() }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
              padding: '9px 12px', borderRadius: '8px', fontSize: '0.875rem',
              color: '#f87171', background: 'none', border: 'none', cursor: 'pointer',
              textAlign: 'left', transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
