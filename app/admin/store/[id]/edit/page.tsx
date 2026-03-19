import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { ProductForm } from '../../ProductForm'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let product = null
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('products').select('*').eq('id', id).single()
    product = data
  } catch { /* ignore */ }
  if (!product) notFound()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/store" className="admin-back-link">← Store</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>Edit: {product.name_en}</h1>
      </div>
      <ProductForm initial={{ ...product, id }} />
    </div>
  )
}
