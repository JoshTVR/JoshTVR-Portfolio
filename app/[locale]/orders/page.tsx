'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Order = {
  id: string
  created_at: string
  status: string
  total_amount: number
  items: Array<{ name: string; quantity: number; price: number }>
}

const STATUS_COLOR: Record<string, string> = {
  pending:    '#f59e0b',
  processing: '#3b82f6',
  shipped:    '#8b5cf6',
  delivered:  '#22c55e',
  cancelled:  '#ef4444',
}

export default function OrdersPage() {
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user,    setUser]    = useState<{ email?: string } | null>(null)
  const router = useRouter()
  const locale = useLocale()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push(`/${locale}`); return }
      setUser(data.user)
      supabase
        .from('orders')
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
        .then(({ data: rows }) => {
          setOrders((rows as Order[]) ?? [])
          setLoading(false)
        })
    })
  }, [locale, router])

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--bg-primary)', paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px' }}>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
          My Orders
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '36px', fontSize: '0.95rem' }}>
          {user?.email}
        </p>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: '90px', borderRadius: '14px' }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '64px 24px',
            border: 'var(--glass-border)', borderRadius: '20px',
            background: 'var(--glass-bg)',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: '16px' }}>
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No orders yet.</p>
            <a href={`/${locale}/store`} className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
              Visit the Store
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: 'var(--glass-bg)',
                  border: 'var(--glass-border)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>
                    {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px', fontSize: '0.9rem' }}>
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                    {Array.isArray(order.items) ? order.items.map((i) => `${i.name} x${i.quantity}`).join(', ') : '—'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '0.78rem', fontWeight: 700, padding: '4px 12px',
                    borderRadius: '999px', textTransform: 'capitalize',
                    background: `${STATUS_COLOR[order.status] ?? '#888'}22`,
                    color: STATUS_COLOR[order.status] ?? '#888',
                    border: `1px solid ${STATUS_COLOR[order.status] ?? '#888'}44`,
                  }}>
                    {order.status}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1rem' }}>
                    ${(order.total_amount / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}