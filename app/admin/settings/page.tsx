import { createAdminClient } from '@/lib/supabase/admin'
import { SettingsForm } from './SettingsForm'

export const dynamic = 'force-dynamic'

async function getSettings() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('settings')
      .select('key,value')
      .in('key', ['store_visible', 'sections_visible'])
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

      <SettingsForm storeVisible={storeVisible} sectionsVisible={sectionsVisible} />
    </div>
  )
}
