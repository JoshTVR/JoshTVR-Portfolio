import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

async function getAnalyticsData() {
  const supabase = createAdminClient()
  const now      = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()

  const [
    postsThisMonth,
    postsLastMonth,
    allPosts,
    allInquiries,
    socialTokens,
    cronSettings,
    githubCache,
  ] = await Promise.all([
    supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true)
      .gte('published_at', thisMonthStart),
    supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true)
      .gte('published_at', lastMonthStart)
      .lt('published_at', thisMonthStart),
    supabase
      .from('posts')
      .select('id,title_en,type,published_at,shared_linkedin,shared_instagram,shared_facebook,shared_threads,is_ai_generated')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(100),
    supabase
      .from('inquiries')
      .select('id,status,created_at,metadata'),
    supabase
      .from('settings')
      .select('key,value')
      .in('key', ['linkedin_token', 'instagram_token', 'facebook_token', 'threads_token']),
    supabase
      .from('settings')
      .select('value')
      .eq('key', 'github_devlog_last_run')
      .single(),
    supabase
      .from('settings')
      .select('value')
      .eq('key', 'github_cache')
      .single(),
  ])

  const posts      = allPosts.data ?? []
  const inquiries  = allInquiries.data ?? []
  const tokenRows  = socialTokens.data ?? []

  // ─── Content metrics ─────────────────────────────────────────────────────
  const publishedThisMonth = postsThisMonth.count ?? 0
  const publishedLastMonth = postsLastMonth.count ?? 0
  const monthDelta         = publishedThisMonth - publishedLastMonth

  const platformCounts = {
    linkedin:  posts.filter(p => p.shared_linkedin).length,
    instagram: posts.filter(p => p.shared_instagram).length,
    facebook:  posts.filter(p => p.shared_facebook).length,
    threads:   posts.filter(p => p.shared_threads).length,
  }

  // ─── Business metrics ────────────────────────────────────────────────────
  const total       = inquiries.length
  const byStatus    = inquiries.reduce<Record<string, number>>((acc, i) => {
    acc[i.status] = (acc[i.status] ?? 0) + 1
    return acc
  }, {})
  const converted   = (byStatus['accepted'] ?? 0) + (byStatus['completed'] ?? 0)
  const convRate    = total > 0 ? Math.round((converted / total) * 100) : 0

  // Weekly inquiry sparkline — last 8 weeks
  const weeks: { label: string; count: number }[] = []
  for (let w = 7; w >= 0; w--) {
    const weekStart = new Date(now.getTime() - (w + 1) * 7 * 24 * 60 * 60 * 1000)
    const weekEnd   = new Date(now.getTime() - w * 7 * 24 * 60 * 60 * 1000)
    const count     = inquiries.filter(i => {
      const d = new Date(i.created_at)
      return d >= weekStart && d < weekEnd
    }).length
    weeks.push({ label: `W${8 - w}`, count })
  }
  const maxWeek = Math.max(...weeks.map(w => w.count), 1)

  // ─── Token health ────────────────────────────────────────────────────────
  type TokenHealth = { name: string; connected: boolean; daysLeft: number | null; warning: boolean }
  const tokenHealth: TokenHealth[] = ['linkedin_token', 'instagram_token', 'facebook_token', 'threads_token'].map(key => {
    const row       = tokenRows.find(r => r.key === key)
    const val       = row?.value as { access_token?: string; expires_at?: string } | null
    const connected = Boolean(val?.access_token)
    let daysLeft: number | null = null
    if (val?.expires_at) {
      daysLeft = Math.floor((new Date(val.expires_at).getTime() - now.getTime()) / 86400000)
    }
    return {
      name: key.replace('_token', '').replace('_', ' '),
      connected,
      daysLeft,
      warning: daysLeft !== null && daysLeft < 7,
    }
  })

  const devlogLastRun = (cronSettings.data?.value as { timestamp?: string } | null)?.timestamp ?? null
  const githubUpdated = (githubCache.data?.value as { fetchedAt?: string } | null)?.fetchedAt ?? null

  return {
    publishedThisMonth,
    publishedLastMonth,
    monthDelta,
    platformCounts,
    total,
    byStatus,
    converted,
    convRate,
    weeks,
    maxWeek,
    tokenHealth,
    devlogLastRun,
    githubUpdated,
  }
}

function TokenPill({ name, connected, daysLeft, warning }: {
  name: string; connected: boolean; daysLeft: number | null; warning: boolean
}) {
  const bg    = !connected ? 'rgba(239,68,68,0.1)'  : warning ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)'
  const color = !connected ? '#f87171'               : warning ? '#f59e0b'               : '#10b981'
  const label = !connected ? 'Not connected'         : daysLeft === null ? 'Connected' : `${daysLeft}d left`

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{name}</span>
      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700, background: bg, color }}>{label}</span>
    </div>
  )
}

export default async function AnalyticsPage() {
  const d = await getAnalyticsData()

  const statusLabels: Record<string, string> = {
    new: 'New', reviewing: 'Reviewing', proposal_sent: 'Proposal Sent',
    accepted: 'Accepted', rejected: 'Rejected', replied: 'Replied',
    completed: 'Completed', read: 'Read',
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Analytics
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Overview of content, business, and site health.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

        {/* ─── Section 1: Content Performance ─────────────────────────────── */}
        <div className="glass" style={{ padding: '24px', borderRadius: '14px', gridColumn: 'span 1' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', letterSpacing: '0.02em' }}>
            Content Performance
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'This month', value: d.publishedThisMonth, color: 'var(--accent-light)' },
              { label: 'Last month', value: d.publishedLastMonth, color: 'var(--text-muted)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', textAlign: 'center' }}>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color, lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
              </div>
            ))}
          </div>

          {d.monthDelta !== 0 && (
            <p style={{ fontSize: '0.82rem', color: d.monthDelta > 0 ? '#10b981' : '#f87171', marginBottom: '20px' }}>
              {d.monthDelta > 0 ? `+${d.monthDelta}` : d.monthDelta} posts vs last month
            </p>
          )}

          <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Platform reach
          </p>
          {Object.entries(d.platformCounts).map(([platform, count]) => (
            <div key={platform} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{platform}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{count} posts</span>
            </div>
          ))}
        </div>

        {/* ─── Section 2: Business ─────────────────────────────────────────── */}
        <div className="glass" style={{ padding: '24px', borderRadius: '14px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', letterSpacing: '0.02em' }}>
            Business
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total inquiries', value: d.total, color: 'var(--accent-light)' },
              { label: 'Conversion rate', value: `${d.convRate}%`, color: d.convRate > 20 ? '#10b981' : '#f59e0b' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', textAlign: 'center' }}>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color, lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Inquiries by status */}
          <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            By status
          </p>
          {Object.entries(d.byStatus).sort((a, b) => b[1] - a[1]).map(([status, count]) => (
            <div key={status} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{statusLabels[status] ?? status}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{count}</span>
            </div>
          ))}

          {/* Weekly sparkline */}
          {d.weeks.some(w => w.count > 0) && (
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                Weekly inquiries (last 8 weeks)
              </p>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '48px' }}>
                {d.weeks.map(({ label, count }) => (
                  <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: `${Math.max(4, (count / d.maxWeek) * 40)}px`,
                        background: count > 0 ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                        borderRadius: '3px 3px 0 0',
                        transition: 'height 300ms ease',
                      }}
                      title={`${label}: ${count} inquiries`}
                    />
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── Section 3: Site Health ──────────────────────────────────────── */}
        <div className="glass" style={{ padding: '24px', borderRadius: '14px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', letterSpacing: '0.02em' }}>
            Site Health
          </h2>

          <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Social tokens
          </p>
          {d.tokenHealth.map(t => (
            <TokenPill key={t.name} {...t} />
          ))}

          <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              Cron & cache
            </p>
            {[
              { label: 'Devlog last run', value: d.devlogLastRun ? new Date(d.devlogLastRun).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never' },
              { label: 'GitHub cache', value: d.githubUpdated ? new Date(d.githubUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Not cached' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
