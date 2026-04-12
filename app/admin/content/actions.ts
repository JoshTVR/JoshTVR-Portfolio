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

// ─── Reschedule queue ─────────────────────────────────────────────────────────

export interface RescheduleOptions {
  postsPerDay: 1 | 2
  startDate?:  string             // 'YYYY-MM-DD' — defaults to tomorrow CDMX
  scope?:      'all' | 'ai' | 'overdue'
  apply?:      boolean
}

export interface RescheduleEntry {
  id:             string
  title:          string
  old_scheduled:  string | null
  new_scheduled:  string
}

export interface RescheduleResult {
  total:    number
  applied:  boolean
  preview:  RescheduleEntry[]
  error?:   string
}

/**
 * Spreads unpublished posts across upcoming days at 1-2 posts/day so the
 * publish cron picks them up steadily. Default times are 14:00 UTC and
 * 23:00 UTC, which land at ~8 AM and ~5 PM in CDMX (UTC-6, no DST).
 *
 * Pass `apply: false` first to inspect the assignment, then call again
 * with `apply: true` to commit.
 */
export async function rescheduleQueue(
  opts: RescheduleOptions,
): Promise<RescheduleResult> {
  const supabase = createAdminClient()

  // 1. Fetch eligible posts
  let q = supabase
    .from('posts')
    .select('id,title_en,scheduled_at,created_at,is_ai_generated')
    .eq('is_published', false)

  if (opts.scope === 'ai') {
    q = q.eq('is_ai_generated', true)
  } else if (opts.scope === 'overdue') {
    q = q.lt('scheduled_at', new Date().toISOString())
         .not('scheduled_at', 'is', null)
  }
  // 'all' (default) → every unpublished post

  q = q.order('created_at', { ascending: true })

  const { data: rows, error } = await q
  if (error) return { total: 0, applied: false, preview: [], error: error.message }

  const posts = (rows ?? []) as Array<{ id: string; title_en: string; scheduled_at: string | null }>

  // 2. Build day-by-day slots
  // Start at user-supplied date or tomorrow (UTC midnight).
  const startDate = opts.startDate
    ? new Date(`${opts.startDate}T00:00:00Z`)
    : (() => {
        const d = new Date()
        d.setUTCDate(d.getUTCDate() + 1)
        d.setUTCHours(0, 0, 0, 0)
        return d
      })()

  // 14:00 UTC = 8 AM CDMX, 23:00 UTC = 5 PM CDMX
  const slotsUTC = opts.postsPerDay === 1 ? [14] : [14, 23]

  const preview: RescheduleEntry[] = posts.map((p, i) => {
    const dayOffset = Math.floor(i / opts.postsPerDay)
    const slotIdx   = i % opts.postsPerDay
    const date      = new Date(startDate)
    date.setUTCDate(date.getUTCDate() + dayOffset)
    date.setUTCHours(slotsUTC[slotIdx], 0, 0, 0)
    return {
      id:            p.id,
      title:         p.title_en,
      old_scheduled: p.scheduled_at,
      new_scheduled: date.toISOString(),
    }
  })

  // 3. Apply if requested. Supabase has no native batch-update with distinct
  //    values per row, so we fire one update per post in parallel.
  if (opts.apply && preview.length > 0) {
    const results = await Promise.all(
      preview.map((entry) =>
        supabase
          .from('posts')
          .update({ scheduled_at: entry.new_scheduled })
          .eq('id', entry.id),
      ),
    )
    const failed = results.find((r) => r.error)
    if (failed?.error) {
      return { total: preview.length, applied: false, preview, error: failed.error.message }
    }
    revalidatePath('/admin/content')
    revalidatePath('/admin/posts')
  }

  return { total: preview.length, applied: !!opts.apply, preview }
}

export async function resetAIPosts(): Promise<{ reset: number; error?: string }> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('posts')
    .update({
      is_published:     false,
      shared_linkedin:  false,
      shared_instagram: false,
      shared_facebook:  false,
      published_at:     null,
    })
    .eq('is_ai_generated', true)
    .select('id')
  if (error) return { reset: 0, error: error.message }
  revalidatePath('/admin/content')
  revalidatePath('/admin/posts')
  return { reset: data?.length ?? 0 }
}
