'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export interface CvFormData {
  title:       string
  role:        string
  locale:      string
  slug:        string
  file_url:    string
  is_featured: boolean
  is_active:   boolean
  sort_order:  number
}

export async function createCv(data: CvFormData): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  // If marking as featured, clear existing featured for same locale
  if (data.is_featured) {
    await supabase.from('cvs').update({ is_featured: false }).eq('locale', data.locale)
  }
  const { error } = await supabase.from('cvs').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/cvs')
  return {}
}

export async function deleteCv(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('cvs').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/cvs')
  return {}
}

export async function toggleCvFeatured(id: string, locale: string, featured: boolean): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  if (featured) {
    await supabase.from('cvs').update({ is_featured: false }).eq('locale', locale)
  }
  const { error } = await supabase.from('cvs').update({ is_featured: featured }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/cvs')
  revalidatePath('/en')
  revalidatePath('/es')
  return {}
}

export async function toggleCvActive(id: string, active: boolean): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('cvs').update({ is_active: active }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/cvs')
  return {}
}
