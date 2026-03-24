'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createNote(formData: FormData) {
  const supabase = createAdminClient()
  const title  = (formData.get('title')  as string).trim()
  const body   = (formData.get('body')   as string).trim()
  const status = (formData.get('status') as string) || 'idea'
  const tagsRaw = (formData.get('tags')  as string).trim()
  const tags   = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : []

  const { error } = await supabase.from('notes').insert({ title, body, status, tags })
  if (error) throw new Error(error.message)

  revalidatePath('/admin/notes')
  redirect('/admin/notes')
}

export async function updateNote(id: string, formData: FormData) {
  const supabase = createAdminClient()
  const title  = (formData.get('title')  as string).trim()
  const body   = (formData.get('body')   as string).trim()
  const status = (formData.get('status') as string) || 'idea'
  const tagsRaw = (formData.get('tags')  as string).trim()
  const tags   = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : []

  const { error } = await supabase.from('notes').update({ title, body, status, tags, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/notes')
  redirect('/admin/notes')
}

export async function deleteNote(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/notes')
}
