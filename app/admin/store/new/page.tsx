import Link from 'next/link'
import { ProductForm } from '../ProductForm'

export const dynamic = 'force-dynamic'

export default function NewProductPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/store" className="admin-back-link">← Store</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>New Product</h1>
      </div>
      <ProductForm />
    </div>
  )
}
