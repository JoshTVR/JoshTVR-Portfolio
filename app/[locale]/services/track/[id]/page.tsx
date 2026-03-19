import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Track Proposal — JoshTVR' }

interface InquiryTrack {
  id:         string
  name:       string
  status:     string
  created_at: string
  metadata:   Record<string, string>
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string; description: string }> = {
  new:           { label: 'Submitted',      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',   icon: '📨', description: 'Your proposal has been received and is in the queue.' },
  reviewing:     { label: 'Under Review',   color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',   icon: '🔍', description: "I'm reviewing your proposal carefully. Expect a response within 48h." },
  proposal_sent: { label: 'Proposal Sent',  color: '#a78bfa', bg: 'rgba(139,92,246,0.12)',   icon: '📋', description: "I've sent a detailed proposal to your email. Check your inbox!" },
  accepted:      { label: 'Accepted',       color: '#10b981', bg: 'rgba(16,185,129,0.12)',   icon: '✅', description: "Great news! Your project has been accepted. I'll reach out shortly to start." },
  rejected:      { label: 'Not a fit',      color: '#f87171', bg: 'rgba(239,68,68,0.12)',    icon: '❌', description: "Unfortunately this project isn't a fit right now. See the note below." },
  read:          { label: 'Read',           color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',   icon: '👀', description: 'Your proposal has been read.' },
  replied:       { label: 'Replied',        color: '#10b981', bg: 'rgba(16,185,129,0.12)',   icon: '💬', description: 'A reply has been sent to your email.' },
  completed:     { label: 'Completed',      color: '#10b981', bg: 'rgba(16,185,129,0.12)',   icon: '🎉', description: 'Project completed successfully!' },
}

const STATUS_TIMELINE = ['new', 'reviewing', 'proposal_sent', 'accepted']

export default async function TrackPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params

  let inquiry: InquiryTrack | null = null
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('inquiries')
      .select('id,name,status,created_at,metadata')
      .eq('id', id)
      .single()
    inquiry = data
  } catch { /* supabase not configured */ }

  if (!inquiry && process.env.NEXT_PUBLIC_SUPABASE_URL) notFound()

  // Demo mode if no supabase
  const demo = !inquiry
  const inq = inquiry ?? {
    id,
    name: 'Demo User',
    status: 'reviewing',
    created_at: new Date().toISOString(),
    metadata: { service_title: 'VR / AR Development', service_category: 'vr-ar', response_note: '' },
  }

  const cfg = STATUS_CONFIG[inq.status] ?? STATUS_CONFIG.new
  const adminStatus: string = (inq.metadata?.admin_status as string) || inq.status
  const responseNote: string = (inq.metadata?.response_note as string) || ''
  const serviceTitle: string = (inq.metadata?.service_title as string) || 'Your service request'

  const currentStep = STATUS_TIMELINE.indexOf(adminStatus === 'rejected' ? 'accepted' : adminStatus)

  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '96px', paddingBottom: '80px' }}>
      <div className="container-site" style={{ maxWidth: '640px' }}>
        <Link href={`/${locale}/services`} className="admin-back-link" style={{ display: 'inline-flex', marginBottom: '32px', gap: '6px' }}>
          ← Back to services
        </Link>

        {demo && (
          <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontSize: '0.85rem', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '24px' }}>
            ⚠ Demo mode — Supabase not configured. This is a preview of the tracking page.
          </div>
        )}

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Proposal tracker
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '36px', fontSize: '0.9rem' }}>
          Tracking: <strong style={{ color: 'var(--text-primary)' }}>{serviceTitle}</strong>
        </p>

        {/* Current status card */}
        <div style={{ padding: '28px', borderRadius: '16px', background: cfg.bg, border: `1px solid ${cfg.color}33`, marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '2rem', flexShrink: 0 }}>{cfg.icon}</span>
          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: cfg.color, marginBottom: '6px' }}>{cfg.label}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{cfg.description}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="glass" style={{ padding: '28px', borderRadius: '16px', marginBottom: '24px' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>Progress</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {STATUS_TIMELINE.map((s, i) => {
              const c = STATUS_CONFIG[s]
              const done    = currentStep > i || (inq.status !== 'rejected' && inq.status === s) || currentStep >= i
              const current = adminStatus === s || (i === STATUS_TIMELINE.length - 1 && (adminStatus === 'accepted' || adminStatus === 'rejected' || adminStatus === 'completed'))
              const isRejected = adminStatus === 'rejected' && i === STATUS_TIMELINE.length - 1
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                      background: done ? (isRejected ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)') : 'rgba(255,255,255,0.06)',
                      border: `2px solid ${done ? (isRejected ? '#f87171' : '#10b981') : 'rgba(255,255,255,0.1)'}`,
                      color: done ? (isRejected ? '#f87171' : '#10b981') : 'var(--text-muted)',
                    }}>
                      {done ? (isRejected ? '✕' : '✓') : i + 1}
                    </div>
                    {i < STATUS_TIMELINE.length - 1 && (
                      <div style={{ width: '2px', height: '32px', background: done ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.07)', margin: '4px 0' }} />
                    )}
                  </div>
                  <div style={{ paddingTop: '4px', paddingBottom: i < STATUS_TIMELINE.length - 1 ? '24px' : 0 }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: current ? 700 : 500, color: current ? 'var(--text-primary)' : done ? 'var(--text-muted)' : 'rgba(255,255,255,0.3)' }}>
                      {isRejected ? 'Not a fit' : c.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Admin response note */}
        {responseNote && (
          <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px', borderLeft: '3px solid var(--accent)' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Message from JoshTVR</p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{responseNote}</p>
          </div>
        )}

        {/* Meta */}
        <div className="glass" style={{ padding: '20px 24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Submitted by</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{inq.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Date</span>
            <span style={{ color: 'var(--text-primary)' }}>{new Date(inq.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tracking ID</span>
            <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{inq.id}</span>
          </div>
        </div>

        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <a href="mailto:joshtvr4@gmail.com" style={{ color: 'var(--accent-light)', fontSize: '0.88rem', textDecoration: 'underline' }}>
            Have questions? Email me directly
          </a>
        </div>
      </div>
    </main>
  )
}
