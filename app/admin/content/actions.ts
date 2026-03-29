'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { slugify } from '@/lib/utils/slugify'
import {
  type ThemeRotationState,
  type ManualOverride,
  defaultRotationState,
  assignThemesToMonths,
  getMonthsForYear,
} from '@/lib/theme-engine'

// ─── Theme State ─────────────────────────────────────────────────────────────

export async function getThemeState(): Promise<ThemeRotationState> {
  const supabase = createAdminClient()
  const year = new Date().getFullYear()

  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'theme_rotation_state')
    .single()

  if (data?.value) {
    const state = data.value as ThemeRotationState
    // New year → reinitialize
    if (state.year !== year) {
      const fresh = assignThemesToMonths(getMonthsForYear(year), defaultRotationState(year))
      await saveThemeState(fresh)
      return fresh
    }
    return state
  }

  // First time — initialize and assign all months of this year
  const fresh = assignThemesToMonths(getMonthsForYear(year), defaultRotationState(year))
  await saveThemeState(fresh)
  return fresh
}

export async function saveThemeState(state: ThemeRotationState): Promise<void> {
  const supabase = createAdminClient()
  await supabase
    .from('settings')
    .upsert({ key: 'theme_rotation_state', value: state }, { onConflict: 'key' })
}

export async function addManualOverride(
  override: ManualOverride,
): Promise<{ error?: string }> {
  const state = await getThemeState()
  state.manual_overrides = [...state.manual_overrides, override]
  await saveThemeState(state)
  revalidatePath('/admin/content')
  return {}
}

export async function removeManualOverride(index: number): Promise<{ error?: string }> {
  const state = await getThemeState()
  state.manual_overrides = state.manual_overrides.filter((_, i) => i !== index)
  await saveThemeState(state)
  revalidatePath('/admin/content')
  return {}
}

// ─── Content Import ───────────────────────────────────────────────────────────

export interface ImportedPost {
  title_en: string
  title_es?: string
  excerpt_en?: string
  excerpt_es?: string
  content_en?: string
  content_es?: string
  type?: string
  card_type?: string
  card_data?: Record<string, unknown>
  tags?: string[]
  color_theme?: string
  scheduled_at?: string
  is_ai_generated?: boolean
  burst_group_id?: string
}

export async function importContentPlan(
  posts: ImportedPost[],
): Promise<{ imported: number; error?: string }> {
  const supabase = createAdminClient()

  const rows = posts.map(p => ({
    title_en:       p.title_en,
    title_es:       p.title_es   || p.title_en,
    excerpt_en:     p.excerpt_en || null,
    excerpt_es:     p.excerpt_es || null,
    content_en:     p.content_en || null,
    content_es:     p.content_es || null,
    type:           p.type       || 'post',
    card_type:      p.card_type  || null,
    card_data:      p.card_data  || null,
    tags:           p.tags       || [],
    color_theme:    p.color_theme || 'midnight',
    scheduled_at:   p.scheduled_at || null,
    is_ai_generated: p.is_ai_generated ?? true,
    burst_group_id:  p.burst_group_id || null,
    is_published:    false,
    // Append a short random suffix to avoid slug collisions on bulk import
    slug: `${slugify(p.title_en)}-${Math.random().toString(36).slice(2, 7)}`,
  }))

  const { error } = await supabase.from('posts').insert(rows)
  if (error) return { imported: 0, error: error.message }

  revalidatePath('/admin/content')
  revalidatePath('/admin/posts')
  return { imported: rows.length }
}

// ─── Queue / Calendar data ────────────────────────────────────────────────────

export interface ContentPost {
  id: string
  title_en: string
  type: string
  card_type: string | null
  color_theme: string | null
  is_published: boolean
  is_ai_generated: boolean
  burst_group_id: string | null
  scheduled_at: string | null
  published_at: string | null
  created_at: string
}

export async function getContentPosts(): Promise<ContentPost[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('posts')
    .select('id,title_en,type,card_type,color_theme,is_published,is_ai_generated,burst_group_id,scheduled_at,published_at,created_at')
    .order('scheduled_at', { ascending: true, nullsFirst: false })
  return (data ?? []) as ContentPost[]
}

export async function bulkDeletePosts(ids: string[]): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('posts').delete().in('id', ids)
  if (error) return { error: error.message }
  revalidatePath('/admin/content')
  revalidatePath('/admin/posts')
  return {}
}
