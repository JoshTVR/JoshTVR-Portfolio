'use client'

import { useState, useTransition, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { saveSettings } from './actions'

interface Props {
  storeVisible: boolean
  sectionsVisible: Record<string, boolean>
  linkedinConnected: boolean
  linkedinName: string
  linkedinExpiresAt: string
  instagramConnected: boolean
  instagramUsername: string
  instagramExpiresAt: string
  facebookConnected: boolean
  facebookPageName: string
  facebookExpiresAt: string
  threadsConnected: boolean
  threadsUsername: string
  threadsExpiresAt: string
}

export function SettingsForm({
  storeVisible,
  sectionsVisible,
  linkedinConnected,
  linkedinName,
  linkedinExpiresAt,
  instagramConnected,
  instagramUsername,
  instagramExpiresAt,
  facebookConnected,
  facebookPageName,
  facebookExpiresAt,
  threadsConnected,
  threadsUsername,
  threadsExpiresAt,
}: Props) {
  const [store,       setStore]       = useState(storeVisible)
  const [ghStats,     setGhStats]     = useState(sectionsVisible.github_stats ?? true)
  const [testimonials,setTestimonials]= useState(sectionsVisible.testimonials ?? true)
  const [saved,       setSaved]       = useState(false)
  const [isPending,   startTransition]= useTransition()
  const [socialMsg,   setSocialMsg]   = useState('')
  const [cronJob,     setCronJob]     = useState<string | null>(null)
  const [cronResult,  setCronResult]  = useState<unknown>(null)
  const searchParams = useSearchParams()

  async function runCron(job: 'publish' | 'github-devlog' | 'metrics') {
    setCronJob(job)
    setCronResult(null)
    try {
      const res  = await fetch('/api/admin/run-cron', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ job }),
      })
      const json = await res.json()
      setCronResult(json)
    } catch (e) {
      setCronResult({ error: e instanceof Error ? e.message : 'unknown' })
    }
    setCronJob(null)
  }

  useEffect(() => {
    const connected = searchParams.get('social_connected')
    const error = searchParams.get('social_error')
    if (connected === 'linkedin')  setSocialMsg('✓ LinkedIn connected successfully')
    else if (connected === 'instagram') setSocialMsg('✓ Instagram connected successfully')
    else if (connected === 'facebook')  setSocialMsg('✓ Facebook Page connected successfully')
    else if (connected === 'threads')    setSocialMsg('✓ Threads connected successfully')
    else if (error === 'linkedin_token')  setSocialMsg(`LinkedIn token error: ${searchParams.get('detail') ?? 'unknown'}`)
    else if (error === 'linkedin_denied') setSocialMsg('LinkedIn connection was cancelled')
    else if (error === 'instagram_denied') setSocialMsg('Instagram connection was cancelled')
    else if (error === 'instagram_no_account') setSocialMsg('No Instagram Business/Creator account found on your Facebook pages')
    else if (error === 'facebook_denied')   setSocialMsg('Facebook connection was cancelled')
    else if (error === 'facebook_token')    setSocialMsg('Facebook token error — try again')
    else if (error === 'facebook_no_pages') setSocialMsg('No Facebook Pages found — make sure you manage at least one Page')
    else if (error === 'threads_denied')    setSocialMsg('Threads connection was cancelled')
    else if (error === 'threads_token')     setSocialMsg('Threads token error — try again')
    else if (error) setSocialMsg('Connection error — try again')
  }, [searchParams])

  function handleSave() {
    setSaved(false)
    startTransition(async () => {
      await saveSettings({
        store_visible: store,
        sections_visible: {
          github_stats: ghStats,
          testimonials,
          store_nav: store,
        },
      })
      setSaved(true)
    })
  }

  function formatExpiry(iso: string) {
    if (!iso) return ''
    const d = new Date(iso)
    const days = Math.round((d.getTime() - Date.now()) / 86400000)
    if (days < 0) return ' (expired)'
    if (days === 0) return ' (expires today)'
    return ` (expires in ${days}d)`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>

      {/* Store toggle */}
      <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h2 style={sectionTitle}>Store</h2>
        <Toggle
          label="Enable store"
          description="Show the /store route and navigation link. Disable to hide the store from visitors while keeping products in the database."
          checked={store}
          onChange={(v) => { setStore(v) }}
        />
      </div>

      {/* Section visibility */}
      <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h2 style={sectionTitle}>Sections</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Toggle
            label="GitHub Stats"
            description="Show the GitHub contribution heatmap and language stats section on the home page."
            checked={ghStats}
            onChange={setGhStats}
          />
          <Toggle
            label="Testimonials"
            description="Show the testimonials section on the home page."
            checked={testimonials}
            onChange={setTestimonials}
          />
        </div>
      </div>

      {/* Save */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="btn btn-primary"
          style={{ fontSize: '0.9rem', padding: '12px 28px' }}
        >
          {isPending ? 'Saving…' : 'Save Settings'}
        </button>
        {saved && (
          <span style={{ fontSize: '0.88rem', color: '#10b981', fontWeight: 500 }}>
            ✓ Saved
          </span>
        )}
      </div>

      {/* Social Connections */}
      <div id="social" className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h2 style={sectionTitle}>Social Connections</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
          Connect your accounts to publish posts directly from the admin panel. Tokens expire every ~60 days — reconnect when needed.
        </p>

        {socialMsg && (
          <div style={{
            marginBottom: '16px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            background: socialMsg.startsWith('✓') ? 'rgba(16,185,129,0.1)' : 'rgba(248,113,113,0.1)',
            color: socialMsg.startsWith('✓') ? '#10b981' : '#f87171',
            border: `1px solid ${socialMsg.startsWith('✓') ? 'rgba(16,185,129,0.25)' : 'rgba(248,113,113,0.25)'}`,
          }}>
            {socialMsg}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* LinkedIn */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem', marginBottom: '2px' }}>
                LinkedIn
                {linkedinConnected && (
                  <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>✓ Connected</span>
                )}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {linkedinConnected
                  ? `${linkedinName}${formatExpiry(linkedinExpiresAt)}`
                  : 'Not connected — posts will open a share dialog instead'}
              </p>
            </div>
            <a
              href="/api/auth/linkedin"
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: linkedinConnected ? 'rgba(255,255,255,0.07)' : 'rgba(124,58,237,0.15)',
                color: linkedinConnected ? 'var(--text-muted)' : 'var(--accent-light)',
                border: `1px solid ${linkedinConnected ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.3)'}`,
              }}
            >
              {linkedinConnected ? 'Reconnect' : 'Connect LinkedIn'}
            </a>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

          {/* Instagram */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem', marginBottom: '2px' }}>
                Instagram
                {instagramConnected && (
                  <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>✓ Connected</span>
                )}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {instagramConnected
                  ? `@${instagramUsername}${formatExpiry(instagramExpiresAt)}`
                  : 'Not connected — requires Instagram Business or Creator account'}
              </p>
            </div>
            <a
              href="/api/auth/instagram"
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: instagramConnected ? 'rgba(255,255,255,0.07)' : 'rgba(124,58,237,0.15)',
                color: instagramConnected ? 'var(--text-muted)' : 'var(--accent-light)',
                border: `1px solid ${instagramConnected ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.3)'}`,
              }}
            >
              {instagramConnected ? 'Reconnect' : 'Connect Instagram'}
            </a>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

          {/* Facebook Page */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem', marginBottom: '2px' }}>
                Facebook Page
                {facebookConnected && (
                  <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>✓ Connected</span>
                )}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {facebookConnected
                  ? `${facebookPageName}${formatExpiry(facebookExpiresAt)}`
                  : 'Not connected — posts will go to Facebook Page for all content types'}
              </p>
            </div>
            <a
              href="/api/auth/facebook"
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: facebookConnected ? 'rgba(255,255,255,0.07)' : 'rgba(24,119,242,0.15)',
                color: facebookConnected ? 'var(--text-muted)' : '#60a5fa',
                border: `1px solid ${facebookConnected ? 'rgba(255,255,255,0.1)' : 'rgba(24,119,242,0.3)'}`,
              }}
            >
              {facebookConnected ? 'Reconnect' : 'Connect Facebook'}
            </a>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

          {/* Threads */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem', marginBottom: '2px' }}>
                Threads
                {threadsConnected && (
                  <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>✓ Connected</span>
                )}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {threadsConnected
                  ? `@${threadsUsername}${formatExpiry(threadsExpiresAt)}`
                  : 'Not connected — personal Threads account for My Content posts'}
              </p>
            </div>
            <a
              href="/api/auth/threads"
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: threadsConnected ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.08)',
                color: threadsConnected ? 'var(--text-muted)' : 'var(--text-primary)',
                border: `1px solid ${threadsConnected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'}`,
              }}
            >
              {threadsConnected ? 'Reconnect' : 'Connect Threads'}
            </a>
          </div>
        </div>
      </div>

      {/* Cron Diagnostics */}
      <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        <h2 style={sectionTitle}>Cron Diagnostics</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
          Run any scheduled job on demand and inspect the result. Useful when posts aren&apos;t getting published automatically.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <button type="button" onClick={() => runCron('publish')} disabled={cronJob !== null}
            style={cronBtn}>
            {cronJob === 'publish' ? 'Running…' : '▶ Run Publish Now'}
          </button>
          <button type="button" onClick={() => runCron('github-devlog')} disabled={cronJob !== null}
            style={cronBtn}>
            {cronJob === 'github-devlog' ? 'Running…' : '▶ Run GitHub Devlog'}
          </button>
          <button type="button" onClick={() => runCron('metrics')} disabled={cronJob !== null}
            style={cronBtn}>
            {cronJob === 'metrics' ? 'Running…' : '▶ Run Metrics'}
          </button>
        </div>

        {cronResult != null && (
          <pre style={{
            background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px', padding: '12px', fontSize: '0.74rem', color: '#cbd5e1',
            overflow: 'auto', maxHeight: '320px', margin: 0, lineHeight: 1.5,
          }}>
            {JSON.stringify(cronResult, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

const cronBtn: React.CSSProperties = {
  padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
  background: 'rgba(124,58,237,0.15)', color: 'var(--accent-light)',
  border: '1px solid rgba(124,58,237,0.3)', cursor: 'pointer',
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
      <div>
        <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem', marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          flexShrink: 0,
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 200ms ease',
          background: checked ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
          boxShadow: checked ? '0 0 12px var(--accent-glow)' : 'none',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: checked ? '22px' : '3px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 200ms ease',
          }}
        />
      </button>
    </div>
  )
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '20px',
}
