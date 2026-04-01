import { createAdminClient } from '@/lib/supabase/admin'
import { SettingsForm } from './SettingsForm'

export const dynamic = 'force-dynamic'

interface TokenValue {
  access_token: string
  expires_at: string
  person_urn?: string
  name?: string
  user_id?: string
  username?: string
}

async function getSettings() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('settings')
      .select('key,value')
      .in('key', ['store_visible', 'sections_visible', 'linkedin_token', 'instagram_token', 'facebook_token'])
    const map: Record<string, unknown> = {}
    for (const row of data ?? []) map[row.key] = row.value
    return map
  } catch {
    return {}
  }
}

export default async function SettingsPage() {
  const settings = await getSettings()

  const storeVisible = settings['store_visible'] === true || settings['store_visible'] === 'true'
  const sectionsVisible = (settings['sections_visible'] as Record<string, boolean> | null) ?? {
    github_stats: true,
    testimonials: true,
    store_nav: false,
  }

  const linkedinToken  = settings['linkedin_token']  as TokenValue | null | undefined
  const instagramToken = settings['instagram_token'] as TokenValue | null | undefined
  const facebookToken  = settings['facebook_token']  as (TokenValue & { page_id?: string; page_name?: string }) | null | undefined

  const linkedinConnected  = !!(linkedinToken?.access_token)
  const instagramConnected = !!(instagramToken?.access_token)
  const facebookConnected  = !!(facebookToken?.access_token)

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.8rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '6px',
          }}
        >
          Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Control visibility and site-wide options.</p>
      </div>

      <SettingsForm
        storeVisible={storeVisible}
        sectionsVisible={sectionsVisible}
        linkedinConnected={linkedinConnected}
        linkedinName={linkedinToken?.name ?? ''}
        linkedinExpiresAt={linkedinToken?.expires_at ?? ''}
        instagramConnected={instagramConnected}
        instagramUsername={instagramToken?.username ?? ''}
        instagramExpiresAt={instagramToken?.expires_at ?? ''}
        facebookConnected={facebookConnected}
        facebookPageName={(facebookToken as Record<string, string> | null | undefined)?.page_name ?? ''}
        facebookExpiresAt={facebookToken?.expires_at ?? ''}
      />
    </div>
  )
}
