'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'

/* ─── Static service catalogue ─────────────────────────────────────────── */
const SERVICES = [
  {
    id:          'vr-ar',
    gradient:    'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    accentColor: '#9d5cf6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={32} height={32}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.5A2.25 2.25 0 0 1 4.5 5.25h15a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25H12m-9.75-9v9m0 0H12m0 0v-9m0 9h9.75M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" />
      </svg>
    ),
    title:       'VR / AR Development',
    description: 'Immersive virtual and augmented reality experiences for training, entertainment, architecture, and product visualization.',
    features:    ['Unity & Unreal Engine', 'Meta Quest / WebXR', 'Real-time simulations', 'Spatial UI & UX design', '360° video experiences'],
    priceFrom:   80000,
    currency:    'usd',
    timeline:    '4–12 weeks',
  },
  {
    id:          '3d-art',
    gradient:    'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    accentColor: '#60a5fa',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={32} height={32}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
    title:       '3D Art & Animation',
    description: 'High-fidelity 3D modeling, rigging, character animation, and cinematic rendering for games, film, and product visualization.',
    features:    ['Blender / Maya / Cinema 4D', 'Character rigging & skinning', 'Physics simulations', 'Cinematic rendering', 'Game-ready assets'],
    priceFrom:   30000,
    currency:    'usd',
    timeline:    '1–6 weeks',
  },
  {
    id:          'backend',
    gradient:    'linear-gradient(135deg, #059669 0%, #047857 100%)',
    accentColor: '#10b981',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={32} height={32}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 6 0m-6 0H3m16.5 0a3 3 0 0 0 3-3m-3 3a3 3 0 1 1-6 0m6 0h1.5m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.416m14.095-5.13 1.15-.416M6.53 9.072A6.004 6.004 0 0 0 8.25 9h7.5a6 6 0 0 0 1.72-.247M10.5 6.194V5.25m3 .944V5.25m-3 0a3 3 0 0 0-3 3v.257" />
      </svg>
    ),
    title:       'Backend & APIs',
    description: 'Scalable server-side systems, REST & GraphQL APIs, databases, microservices, and cloud infrastructure.',
    features:    ['Node.js / Python / Go', 'PostgreSQL / Redis / MongoDB', 'REST & GraphQL APIs', 'Authentication & security', 'Cloud deployment (AWS/Vercel)'],
    priceFrom:   50000,
    currency:    'usd',
    timeline:    '2–8 weeks',
  },
  {
    id:          'data-ai',
    gradient:    'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    accentColor: '#f59e0b',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={32} height={32}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    title:       'Data Science & AI',
    description: 'Machine learning models, data pipelines, business intelligence dashboards, and AI-powered automation.',
    features:    ['Python / TensorFlow / PyTorch', 'Predictive ML models', 'ETL pipelines', 'Interactive dashboards', 'NLP & Computer Vision'],
    priceFrom:   60000,
    currency:    'usd',
    timeline:    '3–10 weeks',
  },
  {
    id:          'design',
    gradient:    'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
    accentColor: '#ec4899',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={32} height={32}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
      </svg>
    ),
    title:       'UI/UX & Digital Design',
    description: 'Beautiful user interfaces, brand identities, motion graphics, and complete digital design systems.',
    features:    ['Figma & Adobe Suite', 'Brand identity & logos', 'Motion graphics & video', 'Design systems', 'Prototyping & user testing'],
    priceFrom:   25000,
    currency:    'usd',
    timeline:    '1–4 weeks',
  },
  {
    id:          'fullstack',
    gradient:    'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
    accentColor: '#22d3ee',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={32} height={32}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
    title:       'Full-Stack Web Apps',
    description: 'Complete web applications from design to deployment — admin panels, e-commerce, SaaS products, and more.',
    features:    ['Next.js / React / TypeScript', 'Supabase / PostgreSQL', 'Stripe payments', 'Bilingual (EN/ES)', 'Vercel deployment'],
    priceFrom:   100000,
    currency:    'usd',
    timeline:    '4–16 weeks',
  },
]

const TIMELINES  = ['ASAP', '1 month', '1–3 months', '3–6 months', 'Flexible / ongoing']
const BUDGETS    = ['Under $500', '$500 – $1,500', '$1,500 – $5,000', '$5,000 – $15,000', '$15,000+', "Let's discuss"]

type Step = 'grid' | 'form' | 'success'

interface FormState {
  serviceId:   string
  serviceTitle:string
  description: string
  timeline:    string
  budget:      string
  references:  string
  name:        string
  email:       string
}

export default function ServicesPage() {
  const locale = useLocale()
  const [step,        setStep]        = useState<Step>('grid')
  const [form,        setForm]        = useState<FormState>({
    serviceId: '', serviceTitle: '', description: '', timeline: '',
    budget: '', references: '', name: '', email: '',
  })
  const [trackingId,  setTrackingId]  = useState<string | null>(null)
  const [submitting,  setSubmitting]  = useState(false)
  const [error,       setError]       = useState<string | null>(null)
  const [formStep,    setFormStep]    = useState(1) // 1 = project, 2 = budget/timeline, 3 = contact

  function openForm(svc: typeof SERVICES[number]) {
    setForm(f => ({ ...f, serviceId: svc.id, serviceTitle: svc.title }))
    setFormStep(1)
    setError(null)
    setStep('form')
  }

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function submit() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:      form.name,
          email:     form.email,
          message:   form.description,
          budget:    form.budget,
          metadata: {
            service_category: form.serviceId,
            service_title:    form.serviceTitle,
            timeline:         form.timeline,
            references:       form.references,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Submission failed')
      setTrackingId(data.id)
      setStep('success')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Price formatter ── */
  function fmtPrice(cents: number, currency: string) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(cents / 100)
  }

  /* ── Input style ── */
  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)', fontSize: '0.93rem', outline: 'none',
  }

  /* ══════════════════════════════════════════════════════════
     STEP: success
  ══════════════════════════════════════════════════════════ */
  if (step === 'success') {
    return (
      <main style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '96px', paddingBottom: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass" style={{ maxWidth: '520px', width: '100%', margin: '0 24px', padding: '48px 40px', borderRadius: '20px', textAlign: 'center' }}>
          {/* Checkmark */}
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5} width={32} height={32}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Proposal submitted!
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '32px' }}>
            Your proposal for <strong style={{ color: 'var(--text-primary)' }}>{form.serviceTitle}</strong> is now under review. I&apos;ll get back to you within 48 hours.
          </p>

          {trackingId && (
            <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '28px' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>Tracking ID</p>
              <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent-light)', wordBreak: 'break-all' }}>{trackingId}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {trackingId && (
              <Link
                href={`/${locale}/services/track/${trackingId}`}
                className="btn btn-primary"
                style={{ fontSize: '0.9rem', padding: '12px 24px' }}
              >
                Track my proposal →
              </Link>
            )}
            <button onClick={() => { setStep('grid'); setForm({ serviceId: '', serviceTitle: '', description: '', timeline: '', budget: '', references: '', name: '', email: '' }) }} className="btn btn-ghost" style={{ fontSize: '0.9rem', padding: '12px 24px' }}>
              Back to services
            </button>
          </div>
        </div>
      </main>
    )
  }

  /* ══════════════════════════════════════════════════════════
     STEP: form (proposal multi-step form)
  ══════════════════════════════════════════════════════════ */
  if (step === 'form') {
    const svc = SERVICES.find(s => s.id === form.serviceId)

    return (
      <main style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '96px', paddingBottom: '80px' }}>
        <div className="container-site" style={{ maxWidth: '680px' }}>
          {/* Back */}
          <button onClick={() => setStep('grid')} className="admin-back-link" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none' }}>
            ← Back to services
          </button>

          {/* Service badge */}
          {svc && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: svc.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                {svc.icon}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{svc.title}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Proposal request · {fmtPrice(svc.priceFrom, svc.currency)} starting</p>
              </div>
            </div>
          )}

          {/* Progress steps */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {['Project details', 'Budget & timeline', 'Contact'].map((label, i) => {
              const n = i + 1
              const active = formStep === n
              const done   = formStep > n
              return (
                <div key={n} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ height: '3px', borderRadius: '3px', background: done || active ? 'var(--accent)' : 'rgba(255,255,255,0.08)' }} />
                  <span style={{ fontSize: '0.72rem', color: active ? 'var(--accent-light)' : 'var(--text-muted)', fontWeight: active ? 700 : 400 }}>{label}</span>
                </div>
              )
            })}
          </div>

          {error && <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.3)', marginBottom: '20px' }}>{error}</div>}

          <div className="glass" style={{ padding: '36px', borderRadius: '16px' }}>
            {/* Step 1 */}
            {formStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Describe your project</h2>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>What do you need?</label>
                  <textarea
                    style={{ ...inp, minHeight: '140px', resize: 'vertical' }}
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="Describe your project in as much detail as possible — what you want to achieve, the target audience, any specific requirements..."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Reference links or inspiration (optional)</label>
                  <textarea
                    style={{ ...inp, minHeight: '80px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem' }}
                    value={form.references}
                    onChange={e => set('references', e.target.value)}
                    placeholder={'https://example.com\nhttps://dribbble.com/shots/...'}
                  />
                </div>

                <button
                  onClick={() => { if (!form.description.trim()) { setError('Please describe your project'); return; } setError(null); setFormStep(2) }}
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-end', fontSize: '0.9rem', padding: '12px 28px' }}
                >
                  Next →
                </button>
              </div>
            )}

            {/* Step 2 */}
            {formStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Budget & timeline</h2>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Budget range</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {BUDGETS.map(b => (
                      <button
                        key={b}
                        onClick={() => set('budget', b)}
                        style={{
                          padding: '12px', borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer', border: '1px solid',
                          background: form.budget === b ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
                          borderColor: form.budget === b ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                          color: form.budget === b ? 'var(--accent-light)' : 'var(--text-muted)',
                          fontWeight: form.budget === b ? 700 : 400,
                          transition: 'all 150ms ease',
                        }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Expected timeline</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {TIMELINES.map(tl => (
                      <button
                        key={tl}
                        onClick={() => set('timeline', tl)}
                        style={{
                          padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem', cursor: 'pointer', border: '1px solid', textAlign: 'left',
                          background: form.timeline === tl ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
                          borderColor: form.timeline === tl ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                          color: form.timeline === tl ? 'var(--accent-light)' : 'var(--text-muted)',
                          fontWeight: form.timeline === tl ? 700 : 400,
                          transition: 'all 150ms ease',
                        }}
                      >
                        {tl}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                  <button onClick={() => setFormStep(1)} className="btn btn-ghost" style={{ fontSize: '0.9rem', padding: '12px 24px' }}>← Back</button>
                  <button
                    onClick={() => { if (!form.budget) { setError('Please select a budget range'); return; } if (!form.timeline) { setError('Please select a timeline'); return; } setError(null); setFormStep(3) }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.9rem', padding: '12px 28px' }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {formStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Your contact info</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Full name</label>
                    <input style={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Email</label>
                    <input type="email" style={inp} value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
                  </div>
                </div>

                {/* Summary */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Proposal summary</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Service</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{form.serviceTitle}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Budget</span>
                    <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>{form.budget}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Timeline</span>
                    <span style={{ color: 'var(--text-primary)' }}>{form.timeline}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                  <button onClick={() => setFormStep(2)} className="btn btn-ghost" style={{ fontSize: '0.9rem', padding: '12px 24px' }}>← Back</button>
                  <button
                    onClick={() => {
                      if (!form.name.trim()) { setError('Please enter your name'); return; }
                      if (!form.email.trim() || !form.email.includes('@')) { setError('Please enter a valid email'); return; }
                      setError(null)
                      submit()
                    }}
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{ fontSize: '0.9rem', padding: '12px 28px' }}
                  >
                    {submitting ? 'Sending…' : 'Send proposal ✓'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    )
  }

  /* ══════════════════════════════════════════════════════════
     STEP: grid — main services page
  ══════════════════════════════════════════════════════════ */
  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '96px', paddingBottom: '80px' }}>
      <div className="container-site">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Freelance Services</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.15 }}>
            Let&apos;s build something<br /><span style={{ color: 'var(--accent)' }}>great together</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.75 }}>
            Professional development across VR/AR, 3D art, backend systems, AI/data, design, and full-stack web — pick your domain and submit a proposal.
          </p>
        </div>

        {/* Service cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '24px', marginBottom: '72px' }}>
          {SERVICES.map(svc => (
            <div
              key={svc.id}
              className="glass"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 250ms ease, box-shadow 250ms ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${svc.accentColor}33`
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = ''
              }}
            >
              {/* Card header */}
              <div style={{ background: svc.gradient, padding: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ color: 'rgba(255,255,255,0.9)', flexShrink: 0 }}>{svc.icon}</div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>From</p>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
                    {fmtPrice(svc.priceFrom, svc.currency)}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)' }}>{svc.timeline}</p>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{svc.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{svc.description}</p>
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                  {svc.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: svc.accentColor, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => openForm(svc)}
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '0.9rem', padding: '13px', marginTop: 'auto', background: svc.gradient, boxShadow: `0 0 24px ${svc.accentColor}40` }}
                >
                  Request this service →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="glass" style={{ padding: '48px', borderRadius: '20px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Have something custom in mind?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            Not sure which category fits your project? Just reach out — we&apos;ll figure it out together.
          </p>
          <a href="mailto:joshtvr4@gmail.com" className="btn btn-primary" style={{ fontSize: '0.95rem' }}>
            Send me an email
          </a>
        </div>
      </div>
    </main>
  )
}
