import Link from 'next/link'
import { TestimonialForm } from '../TestimonialForm'

export const dynamic = 'force-dynamic'

export default function NewTestimonialPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/testimonials" className="admin-back-link">← Testimonials</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>New Testimonial</h1>
      </div>
      <TestimonialForm />
    </div>
  )
}
