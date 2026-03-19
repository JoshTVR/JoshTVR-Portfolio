import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

async function getOrders() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('orders')
      .select('id,customer_email,customer_name,amount,currency,status,created_at,stripe_session_id')
      .order('created_at', { ascending: false })
      .limit(100)
    return data ?? []
  } catch {
    return []
  }
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  paid:     { bg: 'rgba(16,185,129,0.15)',  color: '#10b981' },
  pending:  { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  failed:   { bg: 'rgba(239,68,68,0.15)',  color: '#f87171' },
  refunded: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()
  const totalRevenue = orders
    .filter((o: OrderRow) => o.status === 'paid')
    .reduce((sum: number, o: OrderRow) => sum + o.amount, 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {orders.length} orders · Revenue:{' '}
            <strong style={{ color: '#10b981' }}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'usd', minimumFractionDigits: 2 }).format(totalRevenue / 100)}
            </strong>
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="glass" style={{ padding: '48px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No orders yet. Orders will appear here after customers complete purchases.
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 100px 100px 120px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            <span>Customer</span><span>Session</span><span>Amount</span><span>Status</span><span>Date</span>
          </div>
          {orders.map((o: OrderRow, i) => {
            const sc    = STATUS_COLORS[o.status] ?? STATUS_COLORS.pending
            const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: o.currency ?? 'usd', minimumFractionDigits: 2 }).format(o.amount / 100)
            return (
              <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1fr 160px 100px 100px 120px', padding: '14px 20px', borderBottom: i < orders.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{o.customer_name ?? '—'}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{o.customer_email}</p>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {o.stripe_session_id.slice(-12)}
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-light)' }}>{price}</span>
                <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', background: sc.bg, color: sc.color }}>
                  {o.status}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {new Date(o.created_at).toLocaleDateString()}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface OrderRow { id: string; customer_email: string; customer_name: string | null; amount: number; currency: string; status: string; created_at: string; stripe_session_id: string }
