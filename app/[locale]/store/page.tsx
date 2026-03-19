import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { CheckoutButton } from '@/components/store/CheckoutButton'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const isEs = locale === 'es'
  return {
    title: isEs ? 'Tienda — JoshTVR' : 'Store — JoshTVR',
    description: isEs ? 'Productos digitales y físicos de JoshTVR.' : 'Digital and physical products by JoshTVR.',
  }
}

interface ProductRow {
  id:             string
  name_en:        string
  name_es:        string
  description_en: string
  description_es: string
  type:           string
  price:          number
  currency:       string
  images:         string[]
  is_active:      boolean
  stock:          number | null
}

export default async function StorePage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations('store')

  // Check if store is visible
  // Default visible in dev; reads from Supabase in production
  let storeVisible = process.env.NODE_ENV === 'development'
  let products: ProductRow[] = []

  try {
    const supabase = await createClient()
    const [settingRes, productsRes] = await Promise.all([
      supabase.from('settings').select('value').eq('key', 'store_visible').single(),
      supabase.from('products')
        .select('id,name_en,name_es,description_en,description_es,type,price,currency,images,is_active,stock')
        .eq('is_active', true)
        .order('created_at', { ascending: false }),
    ])
    if (settingRes.data) storeVisible = settingRes.data.value === true || settingRes.data.value === 'true'
    products = (productsRes.data ?? []) as ProductRow[]
  } catch {
    // Supabase not configured
  }

  if (!storeVisible) notFound()

  const TYPE_LABELS: Record<string, string> = {
    physical:   t('physical'),
    digital:    t('digital'),
    commission: t('commission'),
  }

  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '96px', paddingBottom: '80px' }}>
      <div className="container-site">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 className="section-title" style={{ display: 'block', textAlign: 'center' }}>{t('title')}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.8 }}>
            {t('subtitle')}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="glass" style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '16px' }}>
            <p style={{ fontSize: '1rem' }}>No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              gap:                 '24px',
            }}
          >
            {products.map((p) => {
              const name        = locale === 'es' ? p.name_es        : p.name_en
              const description = locale === 'es' ? p.description_es : p.description_en
              const outOfStock  = p.type === 'physical' && p.stock !== null && p.stock <= 0
              const price       = new Intl.NumberFormat('en-US', {
                style:                 'currency',
                currency:              p.currency ?? 'usd',
                minimumFractionDigits: 0,
              }).format(p.price / 100)

              return (
                <article
                  key={p.id}
                  className="glass reveal-stagger"
                  style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', aspectRatio: '4/3', background: 'rgba(255,255,255,0.03)' }}>
                    {p.images?.[0] ? (
                      <Image src={p.images[0]} alt={name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '3rem', opacity: 0.2 }}>🛍</span>
                      </div>
                    )}
                    <span
                      style={{
                        position:  'absolute', top: '12px', right: '12px',
                        padding:   '3px 10px', borderRadius: '20px',
                        fontSize:  '0.72rem', fontWeight: 700, textTransform: 'uppercase',
                        background: 'rgba(0,0,0,0.6)', color: 'var(--accent-light)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {TYPE_LABELS[p.type] ?? p.type}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {name}
                    </h2>
                    <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.7, flex: 1 }}>
                      {description}
                    </p>
                    {p.type === 'physical' && p.stock !== null && (
                      <p style={{ fontSize: '0.78rem', color: outOfStock ? '#f87171' : '#10b981' }}>
                        {outOfStock ? 'Out of stock' : `${p.stock} in stock`}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: 'auto' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {price}
                      </span>
                      <div style={{ width: '140px' }}>
                        <CheckoutButton
                          productId={p.id}
                          label={t('addToCart')}
                          outOfStock={outOfStock}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
