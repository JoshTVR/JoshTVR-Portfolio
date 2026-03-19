import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const supabase = createAdminClient()
    const [projectsRes, inquiriesRes, ordersRes, pubProjectsRes] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('projects').select('id', { count: 'exact', head: true }).eq('is_published', true),
    ])
    return {
      totalProjects:     projectsRes.count ?? 0,
      publishedProjects: pubProjectsRes.count ?? 0,
      newInquiries:      inquiriesRes.count ?? 0,
      totalOrders:       ordersRes.count ?? 0,
    }
  } catch {
    return { totalProjects: 0, publishedProjects: 0, newInquiries: 0, totalOrders: 0 }
  }
}

async function getRecentInquiries() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('inquiries')
      .select('id,name,email,message,created_at,status')
      .order('created_at', { ascending: false })
      .limit(5)
    return data ?? []
  } catch {
    return []
  }
}

export default async function AdminDashboard() {
  const [stats, inquiries] = await Promise.all([getStats(), getRecentInquiries()])

  const cards = [
    { label: 'Total Projects',     value: stats.totalProjects,     href: '/admin/projects', color: 'var(--accent)' },
    { label: 'Published',          value: stats.publishedProjects,  href: '/admin/projects', color: '#10b981' },
    { label: 'New Inquiries',      value: stats.newInquiries,       href: '/admin/inquiries', color: '#f59e0b' },
    { label: 'Orders',             value: stats.totalOrders,         href: '/admin/orders',    color: '#3b82f6' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.8rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '6px',
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Welcome back, JoshTVR. Here's what's happening.
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '40px',
        }}
      >
        {cards.map(({ label, value, href, color }) => (
          <Link
            key={label}
            href={href}
            style={{ textDecoration: 'none' }}
          >
            <div
              className="glass"
              style={{
                padding: '24px 20px',
                borderRadius: '12px',
                transition: 'transform 200ms ease, box-shadow 200ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = ''
              }}
            >
              <p
                style={{
                  fontSize: '2rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  color,
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                {value}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <Link href="/admin/projects/new" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '10px 20px' }}>
          + New Project
        </Link>
        <Link href="/admin/settings" className="btn btn-ghost" style={{ fontSize: '0.88rem', padding: '10px 20px' }}>
          Settings
        </Link>
      </div>

      {/* Recent inquiries */}
      {inquiries.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Recent Inquiries
          </h2>
          <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            {inquiries.map((inq: InquiryRow, i) => (
              <div
                key={inq.id}
                style={{
                  padding: '16px 20px',
                  borderBottom: i < inquiries.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{inq.name}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{inq.email}</span>
                    {inq.status === 'new' && (
                      <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', textTransform: 'uppercase' }}>
                        New
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inq.message}
                  </p>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                  {new Date(inq.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
          <Link href="/admin/inquiries" style={{ display: 'inline-block', marginTop: '12px', fontSize: '0.85rem', color: 'var(--accent-light)' }}>
            View all inquiries →
          </Link>
        </div>
      )}
    </div>
  )
}

interface InquiryRow {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  status: string
}
