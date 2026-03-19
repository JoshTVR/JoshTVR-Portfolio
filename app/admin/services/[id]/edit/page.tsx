import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { ServiceForm } from '../../ServiceForm'

export const dynamic = 'force-dynamic'

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let service = null
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('services').select('*').eq('id', id).single()
    service = data
  } catch { /* ignore */ }
  if (!service) notFound()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/services" className="admin-back-link">← Services</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>Edit: {service.title_en}</h1>
      </div>
      <ServiceForm initial={{ ...service, id }} />
    </div>
  )
}
