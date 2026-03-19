'use client'

import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  async function handleGitHubLogin() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        scopes: 'read:user',
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="glass p-10 rounded-[var(--radius)] w-full max-w-md text-center">
        <div className="mb-8">
          <span className="font-heading text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            JoshTVR<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
          <p className="mt-2 text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            Admin Panel
          </p>
        </div>

        <h1 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
          Admin Access
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          Sign in with your GitHub account to access the admin panel.
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            {error === 'unauthorized' ? 'Access denied. This admin panel is private.' : 'Authentication failed. Please try again.'}
          </div>
        )}

        <button
          onClick={handleGitHubLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            boxShadow: '0 0 24px var(--accent-glow)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Sign in with GitHub
        </button>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
