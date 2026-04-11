'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { slugify } from '@/lib/utils/slugify'

export interface PostFormData {
  title_en:    string
  title_es:    string
  excerpt_en:  string
  excerpt_es:  string
  content_en:  string
  content_es:  string
  cover_image: string
  youtube_url: string
  project_id:  string
  type:        string
  tags:        string   // comma-separated
  is_published: boolean
  // Content automation fields
  scheduled_at?:    string | null   // ISO datetime
  card_type?:       string | null
  card_data?:       Record<string, unknown> | null
  card_images?:     string[]        // carousel slide URLs
  color_theme?:     string | null
  is_ai_generated?: boolean
  burst_group_id?:  string | null
}

function parseFormData(raw: PostFormData) {
  return {
    title_en:    raw.title_en.trim(),
    title_es:    raw.title_es.trim(),
    excerpt_en:  raw.excerpt_en.trim() || null,
    excerpt_es:  raw.excerpt_es.trim() || null,
    content_en:  raw.content_en || null,
    content_es:  raw.content_es || null,
    cover_image: raw.cover_image.trim() || null,
    youtube_url: raw.youtube_url.trim() || null,
    project_id:  raw.project_id || null,
    type:        raw.type,
    tags:        raw.tags.split(',').map(t => t.trim()).filter(Boolean),
    is_published: raw.is_published,
    published_at: raw.is_published ? new Date().toISOString() : null,
    // Content automation
    scheduled_at:    raw.scheduled_at?.trim() || null,
    card_type:       raw.card_type || null,
    card_data:       raw.card_data ?? null,
    card_images:     raw.card_images?.length ? raw.card_images : null,
    color_theme:     raw.color_theme || null,
    is_ai_generated: raw.is_ai_generated ?? false,
    burst_group_id:  raw.burst_group_id || null,
  }
}

function revalidateAll() {
  revalidatePath('/admin/posts')
  revalidatePath('/en/posts')
  revalidatePath('/es/posts')
  revalidatePath('/en')
  revalidatePath('/es')
}

export async function createPost(data: PostFormData): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const parsed   = parseFormData(data)
  const slug     = slugify(parsed.title_en)

  const { error } = await supabase.from('posts').insert({ ...parsed, slug })
  if (error) return { error: error.message }

  revalidateAll()
  redirect('/admin/posts')
}

export async function updatePost(id: string, data: PostFormData): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const parsed   = parseFormData(data)
  const slug     = slugify(parsed.title_en)

  const { error } = await supabase.from('posts').update({ ...parsed, slug }).eq('id', id)
  if (error) return { error: error.message }

  revalidateAll()
  redirect(`/admin/posts/${id}/edit`)
}

export async function deletePost(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidateAll()
  return {}
}

export async function togglePublish(id: string, published: boolean): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('posts')
    .update({ is_published: published, published_at: published ? new Date().toISOString() : null })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidateAll()
  return {}
}

export async function markShared(id: string, network: 'linkedin' | 'instagram'): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const field = network === 'linkedin' ? 'shared_linkedin' : 'shared_instagram'
  const { error } = await supabase.from('posts').update({ [field]: true }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/posts')
  return {}
}

/**
 * Persist generated card images directly to the DB so the social-share buttons
 * can pick them up immediately, without requiring the user to hit Save first.
 * The first slide also becomes the post's cover image.
 */
export async function persistGeneratedCards(
  id: string,
  urls: string[],
): Promise<{ error?: string }> {
  if (!urls.length) return { error: 'No images to persist' }
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('posts')
    .update({ card_images: urls, cover_image: urls[0] })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/posts')
  return {}
}
