'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { slugify } from '@/lib/utils/slugify'

export interface ProjectFormData {
  title_en: string
  title_es: string
  description_en: string
  description_es: string
  content_en: string
  content_es: string
  category: string
  tech_tags: string          // comma-separated string from form
  github_url: string
  demo_url: string
  cover_image: string
  is_published: boolean
  is_featured: boolean
  sort_order: number
}

function parseFormData(raw: ProjectFormData) {
  return {
    title_en:       raw.title_en.trim(),
    title_es:       raw.title_es.trim(),
    description_en: raw.description_en.trim(),
    description_es: raw.description_es.trim(),
    content_en:     raw.content_en || null,
    content_es:     raw.content_es || null,
    category:       raw.category,
    tech_tags:      raw.tech_tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    github_url:   raw.github_url.trim() || null,
    demo_url:     raw.demo_url.trim() || null,
    cover_image:  raw.cover_image.trim() || null,
    is_published: raw.is_published,
    is_featured:  raw.is_featured,
    sort_order:   raw.sort_order,
  }
}

export async function createProject(data: ProjectFormData): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const parsed   = parseFormData(data)
  const slug     = slugify(parsed.title_en)

  const { error } = await supabase.from('projects').insert({ ...parsed, slug })

  if (error) return { error: error.message }

  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')
  redirect('/admin/projects')
}

export async function updateProject(id: string, data: ProjectFormData): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const parsed   = parseFormData(data)
  const slug     = slugify(parsed.title_en)

  const { error } = await supabase
    .from('projects')
    .update({ ...parsed, slug })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')
  redirect('/admin/projects')
}

export async function deleteProject(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')
  return {}
}

export async function togglePublish(id: string, published: boolean): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('projects')
    .update({ is_published: published })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')
  return {}
}
