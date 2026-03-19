import Link from 'next/link'
import { ServiceForm } from '../ServiceForm'

export const dynamic = 'force-dynamic'

export default function NewServicePage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/services" className="admin-back-link">← Services</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>New Service</h1>
      </div>
      <ServiceForm />
    </div>
  )
}
