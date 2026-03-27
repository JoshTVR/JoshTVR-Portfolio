'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export interface TestimonialFormData {
  quote_en:       string
  quote_es:       string
  author_name:    string
  author_role_en: string
  author_role_es: string
  is_visible:     boolean
  sort_order:     number
}

export async function createTestimonial(data: TestimonialFormData): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('testimonials').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/testimonials')
  revalidatePath('/en')
  revalidatePath('/es')
  redirect('/admin/testimonials')
}

export async function updateTestimonial(id: string, data: TestimonialFormData): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('testimonials').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/testimonials')
  revalidatePath('/en')
  revalidatePath('/es')
  redirect('/admin/testimonials')
}

export async function deleteTestimonial(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/testimonials')
  revalidatePath('/en')
  revalidatePath('/es')
  return {}
}

export async function toggleTestimonialVisible(id: string, visible: boolean): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('testimonials').update({ is_visible: visible }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/testimonials')
  revalidatePath('/en')
  revalidatePath('/es')
  return {}
}
