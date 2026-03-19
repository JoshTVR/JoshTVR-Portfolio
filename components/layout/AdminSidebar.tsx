'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/admin',           label: 'Dashboard',  exact: true },
  { href: '/admin/projects',  label: 'Projects' },
  { href: '/admin/services',  label: 'Services' },
  { href: '/admin/store',     label: 'Store' },
  { href: '/admin/orders',    label: 'Orders' },
  { href: '/admin/inquiries', label: 'Inquiries' },
  { href: '/admin/settings',  label: 'Settings' },
]

function isActive(pathname: string, href: string, exact: boolean) {
  return exact ? pathname === href : pathname.startsWith(href)
}

export function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside
      style={{
        width: '220px',
        flexShrink: 0,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/admin" style={{ textDecoration: 'none' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            JoshTVR<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
          <p
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginTop: '2px',
            }}
          >
            Admin Panel
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '12px 8px', flex: 1 }}>
        {NAV.map(({ href, label, exact }) => {
          const active = isActive(pathname, href, exact ?? false)
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '9px 12px',
                borderRadius: '8px',
                marginBottom: '2px',
                fontSize: '0.88rem',
                fontWeight: active ? 600 : 400,
                textDecoration: 'none',
                transition: 'all 150ms ease',
                background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: active ? 'var(--accent-light)' : 'var(--text-muted)',
                borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
              }}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Back to site + Logout */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '9px 12px',
            borderRadius: '8px',
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            marginBottom: '2px',
            transition: 'color 150ms ease',
          }}
        >
          ← View Site
        </Link>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '9px 12px',
            borderRadius: '8px',
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
