import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { InquiryActions } from './InquiryStatusButton'

export const dynamic = 'force-dynamic'

interface InquiryRow {
  id:         string
  name:       string
  email:      string
  message:    string
  budget:     string | null
  status:     string
  created_at: string
  metadata:   Record<string, string> | null
}

async function getInquiries(): Promise<InquiryRow[]> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('inquiries')
      .select('id,name,email,message,budget,status,created_at,metadata')
      .order('created_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  new:           { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b', label: 'New' },
  reviewing:     { bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa', label: 'Reviewing' },
  proposal_sent: { bg: 'rgba(139,92,246,0.15)',  color: '#a78bfa', label: 'Proposal Sent' },
  accepted:      { bg: 'rgba(16,185,129,0.15)',  color: '#10b981', label: 'Accepted' },
  rejected:      { bg: 'rgba(239,68,68,0.15)',   color: '#f87171', label: 'Rejected' },
  read:          { bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa', label: 'Read' },
  replied:       { bg: 'rgba(16,185,129,0.15)',  color: '#10b981', label: 'Replied' },
  completed:     { bg: 'rgba(16,185,129,0.15)',  color: '#10b981', label: 'Completed' },
}

export default async function InquiriesPage() {
  const inquiries = await getInquiries()
  const newCount  = inquiries.filter(i => i.status === 'new').length

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          Inquiries
          {newCount > 0 && (
            <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
              {newCount} new
            </span>
          )}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{inquiries.length} total proposals</p>
      </div>

      {inquiries.length === 0 ? (
        <div className="glass" style={{ padding: '48px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No inquiries yet. They&apos;ll appear here when clients submit proposals from the Services page.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {inquiries.map(inq => {
            const meta   = inq.metadata ?? {}
            const sc     = STATUS_STYLES[inq.status] ?? STATUS_STYLES.read
            const svcTitle = (meta.service_title as string) || null
            const responseNote = (meta.response_note as string) || ''
            const daysAgo = Math.floor((Date.now() - new Date(inq.created_at).getTime()) / 86400000)
            const isNew   = inq.status === 'new'
            return (
              <div key={inq.id} className="glass" style={{ padding: '24px', borderRadius: '14px', borderLeft: isNew ? '3px solid #f59e0b' : '3px solid transparent' }}>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{inq.name}</span>
                      <a href={`mailto:${inq.email}`} style={{ fontSize: '0.82rem', color: 'var(--accent-light)', textDecoration: 'none' }}>{inq.email}</a>
                      {inq.budget && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>💰 {inq.budget}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {new Date(inq.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        {' '}
                        <span style={{ color: daysAgo === 0 ? '#f59e0b' : 'var(--text-dim)' }}>
                          ({daysAgo === 0 ? 'today' : `${daysAgo}d ago`})
                        </span>
                      </p>
                      {svcTitle && <span style={{ fontSize: '0.78rem', color: 'var(--accent-light)', background: 'rgba(124,58,237,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{svcTitle}</span>}
                      {meta.timeline && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>⏱ {meta.timeline as string}</span>}
                    </div>
                  </div>
                  <span style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', background: sc.bg, color: sc.color, flexShrink: 0 }}>
                    {sc.label}
                  </span>
                </div>

                {/* Message */}
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {inq.message}
                </p>

                {meta.references && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>References:</strong> {meta.references as string}
                  </p>
                )}

                {/* Response note (if any) */}
                {responseNote && (
                  <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--accent-light)', display: 'block', marginBottom: '4px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your response note</strong>
                    {responseNote}
                  </div>
                )}

                {/* Actions */}
                <InquiryActions id={inq.id} currentStatus={inq.status} currentNote={responseNote} trackingUrl={`/en/services/track/${inq.id}`} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
