'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

interface SettingsPayload {
  store_visible: boolean
  sections_visible: {
    github_stats: boolean
    testimonials: boolean
    store_nav: boolean
  }
}

export async function saveSettings(payload: SettingsPayload): Promise<{ error?: string }> {
  const supabase = createAdminClient()

  const upserts = [
    { key: 'store_visible',    value: payload.store_visible },
    { key: 'sections_visible', value: payload.sections_visible },
  ]

  const { error } = await supabase
    .from('settings')
    .upsert(upserts, { onConflict: 'key' })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return {}
}
