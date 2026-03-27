import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { ToggleVisibleButton, DeleteTestimonialButton } from './TestimonialRowActions'

export const dynamic = 'force-dynamic'

interface TestimonialRow {
  id:             string
  quote_en:       string
  author_name:    string
  author_role_en: string
  is_visible:     boolean
  sort_order:     number
}

async function getTestimonials(): Promise<TestimonialRow[]> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('testimonials')
      .select('id,quote_en,author_name,author_role_en,is_visible,sort_order')
      .order('sort_order', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Testimonials</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/testimonials/new" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '10px 20px' }}>
          + New Testimonial
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <div className="glass" style={{ padding: '48px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '16px' }}>No testimonials yet.</p>
          <Link href="/admin/testimonials/new" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '10px 20px' }}>Add first testimonial</Link>
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 80px 160px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            <span>Author</span><span>Role</span><span>Status</span><span style={{ textAlign: 'right' }}>Actions</span>
          </div>
          {testimonials.map((t, i) => (
            <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1fr 180px 80px 160px', padding: '14px 20px', borderBottom: i < testimonials.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', gap: '8px' }}>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{t.author_name}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  &ldquo;{t.quote_en.slice(0, 60)}{t.quote_en.length > 60 ? '…' : ''}&rdquo;
                </p>
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t.author_role_en}</span>
              <ToggleVisibleButton id={t.id} visible={t.is_visible} />
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Link href={`/admin/testimonials/${t.id}/edit`} style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)' }}>Edit</Link>
                <DeleteTestimonialButton id={t.id} author={t.author_name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
