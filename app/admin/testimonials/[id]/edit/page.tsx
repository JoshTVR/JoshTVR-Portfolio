import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { TestimonialForm } from '../../TestimonialForm'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditTestimonialPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single()

  if (!data) notFound()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/testimonials" className="admin-back-link">← Testimonials</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>Edit — {data.author_name}</h1>
      </div>
      <TestimonialForm initial={data} />
    </div>
  )
}
