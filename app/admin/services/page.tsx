import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { ToggleServiceButton, DeleteServiceButton } from './ServiceRowActions'

export const dynamic = 'force-dynamic'

interface ServiceRow {
  id:         string
  title_en:   string
  category:   string
  price_from: number | null
  currency:   string
  is_active:  boolean
  sort_order: number
}

async function getServices(): Promise<ServiceRow[]> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('services')
      .select('id,title_en,category,price_from,currency,is_active,sort_order')
      .order('sort_order', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

export default async function AdminServicesPage() {
  const services = await getServices()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Services</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{services.length} services</p>
        </div>
        <Link href="/admin/services/new" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '10px 20px' }}>
          + New Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="glass" style={{ padding: '48px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '16px' }}>No services yet.</p>
          <Link href="/admin/services/new" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '10px 20px' }}>Add first service</Link>
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 80px 150px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            <span>Title</span><span>Category</span><span>Price From</span><span>Status</span><span style={{ textAlign: 'right' }}>Actions</span>
          </div>
          {services.map((s, i) => {
            const price = s.price_from != null
              ? new Intl.NumberFormat('en-US', { style: 'currency', currency: s.currency ?? 'usd', minimumFractionDigits: 0 }).format(s.price_from / 100)
              : 'Contact'
            return (
              <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 80px 150px', padding: '14px 20px', borderBottom: i < services.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{s.title_en}</p>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{s.category}</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--accent-light)', fontWeight: 600 }}>{price}</span>
                <ToggleServiceButton id={s.id} active={s.is_active} />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <Link href={`/admin/services/${s.id}/edit`} style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)' }}>Edit</Link>
                  <DeleteServiceButton id={s.id} title={s.title_en} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
