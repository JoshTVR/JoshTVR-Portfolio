import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { ToggleActiveButton, DeleteProductButton } from './ProductRowActions'

export const dynamic = 'force-dynamic'

async function getProducts() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('products')
      .select('id,name_en,type,price,currency,is_active,stock,stripe_price_id')
      .order('created_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export default async function AdminStorePage() {
  const products = await getProducts()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Store</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{products.length} products</p>
        </div>
        <Link href="/admin/store/new" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '10px 20px' }}>
          + New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="glass" style={{ padding: '48px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '16px' }}>No products yet.</p>
          <Link href="/admin/store/new" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '10px 20px' }}>Add first product</Link>
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px 80px 150px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            <span>Name</span><span>Type</span><span>Price</span><span>Stock</span><span>Status</span><span style={{ textAlign: 'right' }}>Actions</span>
          </div>
          {products.map((p: ProductRow, i) => {
            const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: p.currency ?? 'usd', minimumFractionDigits: 0 }).format(p.price / 100)
            return (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px 80px 150px', padding: '14px 20px', borderBottom: i < products.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{p.name_en}</p>
                  {p.stripe_price_id && <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{p.stripe_price_id}</p>}
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{p.type}</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--accent-light)', fontWeight: 600 }}>{price}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.stock ?? '∞'}</span>
                <ToggleActiveButton id={p.id} active={p.is_active} />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <Link href={`/admin/store/${p.id}/edit`} style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)' }}>Edit</Link>
                  <DeleteProductButton id={p.id} name={p.name_en} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface ProductRow { id: string; name_en: string; type: string; price: number; currency: string; is_active: boolean; stock: number | null; stripe_price_id: string | null }
