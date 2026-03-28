import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function DownloadsPage({ params }: PageProps) {
  const { locale } = await params
  const isEs = locale === 'es'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}`)

  // Get paid orders for this user (by user_id or email), with product info
  const { data: orders } = await supabase
    .from('orders')
    .select('id, created_at, amount, currency, product_id')
    .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
    .eq('status', 'paid')
    .order('created_at', { ascending: false })

  // Collect unique product IDs that have a download file
  const seen = new Set<string>()
  const productIds: string[] = []
  for (const o of orders ?? []) {
    if (o.product_id && !seen.has(o.product_id)) {
      seen.add(o.product_id)
      productIds.push(o.product_id)
    }
  }

  let products: ProductRow[] = []
  if (productIds.length > 0) {
    const { data } = await supabase
      .from('products')
      .select('id, name_en, name_es, description_en, description_es, type, file_url')
      .in('id', productIds)
      .not('file_url', 'is', null)
    products = (data ?? []) as ProductRow[]
  }

  const productMap = Object.fromEntries(products.map(p => [p.id, p]))

  const downloadableOrders = (orders ?? []).filter(
    (o: OrderRow) => o.product_id && productMap[o.product_id]
  )

  return (
    <main style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '760px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {isEs ? 'Mis Descargas' : 'My Downloads'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '40px' }}>
          {isEs
            ? 'Archivos de tus compras. Disponibles en cualquier momento.'
            : 'Files from your purchases. Available anytime.'}
        </p>

        {downloadableOrders.length === 0 ? (
          <div className="glass" style={{ padding: '48px', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📦</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {isEs
                ? 'Aún no tienes compras con archivos descargables.'
                : "You don't have any purchases with downloadable files yet."}
            </p>
            <a
              href={`/${locale}/store`}
              className="btn btn-primary"
              style={{ display: 'inline-block', marginTop: '20px', fontSize: '0.88rem', padding: '10px 24px' }}
            >
              {isEs ? 'Ir a la tienda' : 'Go to store'}
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {downloadableOrders.map((order: OrderRow) => {
              const product = productMap[order.product_id!]
              const name    = isEs ? product.name_es : product.name_en
              const desc    = isEs ? product.description_es : product.description_en
              const price   = new Intl.NumberFormat(isEs ? 'es-MX' : 'en-US', {
                style: 'currency', currency: order.currency ?? 'usd',
              }).format(order.amount / 100)

              return (
                <div
                  key={order.id}
                  className="glass"
                  style={{
                    padding: '24px', borderRadius: '16px',
                    border: '1px solid rgba(124,58,237,0.15)',
                    display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 52, height: 52, borderRadius: '12px', flexShrink: 0,
                    background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{name}</p>
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: 1.5 }}>{desc}</p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(order.created_at).toLocaleDateString(isEs ? 'es-MX' : 'en-US')}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-light)' }}>{price}</span>
                      <span style={{
                        fontSize: '0.7rem', padding: '2px 8px', borderRadius: '20px',
                        background: 'rgba(16,185,129,0.12)', color: '#10b981',
                        border: '1px solid rgba(16,185,129,0.2)', fontWeight: 700,
                      }}>
                        {product.type}
                      </span>
                    </div>
                  </div>

                  {/* Download button */}
                  <a
                    href={product.file_url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem', padding: '10px 20px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '7px' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    {isEs ? 'Descargar' : 'Download'}
                  </a>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

interface OrderRow {
  id: string
  created_at: string
  amount: number
  currency: string
  product_id: string | null
}

interface ProductRow {
  id: string
  name_en: string
  name_es: string
  description_en: string
  description_es: string
  type: string
  file_url: string | null
}
