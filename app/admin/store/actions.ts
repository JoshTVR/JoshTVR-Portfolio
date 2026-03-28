'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export interface ProductFormData {
  name_en:          string
  name_es:          string
  description_en:   string
  description_es:   string
  type:             string
  price:            number  // cents
  currency:         string
  stripe_price_id:  string
  stock:            number | null
  file_url:         string | null
  is_active:        boolean
}

export async function createProduct(data: ProductFormData): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').insert({
    ...data,
    stripe_price_id: data.stripe_price_id || null,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/store')
  redirect('/admin/store')
}

export async function updateProduct(id: string, data: ProductFormData): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').update({
    ...data,
    stripe_price_id: data.stripe_price_id || null,
  }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/store')
  redirect('/admin/store')
}

export async function deleteProduct(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/store')
  return {}
}

export async function toggleActive(id: string, active: boolean): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').update({ is_active: active }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/store')
  return {}
}
