'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export interface ServiceFormData {
  title_en:       string
  title_es:       string
  description_en: string
  description_es: string
  features:       string[]
  price_from:     number | null  // cents, null = contact for price
  currency:       string
  category:       string
  is_active:      boolean
  sort_order:     number
}

export async function createService(data: ServiceFormData): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('services').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/services')
  revalidatePath('/en/services')
  revalidatePath('/es/services')
  redirect('/admin/services')
}

export async function updateService(id: string, data: ServiceFormData): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('services').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/services')
  revalidatePath('/en/services')
  revalidatePath('/es/services')
  redirect('/admin/services')
}

export async function deleteService(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/services')
  revalidatePath('/en/services')
  revalidatePath('/es/services')
  return {}
}

export async function toggleServiceActive(id: string, active: boolean): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('services').update({ is_active: active }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/services')
  revalidatePath('/en/services')
  revalidatePath('/es/services')
  return {}
}
