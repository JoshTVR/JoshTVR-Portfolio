'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function setInquiryStatus(id: string, newStatus: string): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('inquiries')
    .update({ status: newStatus })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/inquiries')
  revalidatePath('/admin')
  return {}
}

export async function setResponseNote(id: string, note: string): Promise<{ error?: string }> {
  const supabase = createAdminClient()

  // Read current metadata first
  const { data } = await supabase
    .from('inquiries')
    .select('metadata')
    .eq('id', id)
    .single()

  const current = (data?.metadata as Record<string, unknown>) ?? {}
  const updated = { ...current, response_note: note }

  const { error } = await supabase
    .from('inquiries')
    .update({ metadata: updated })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/inquiries')
  return {}
}
