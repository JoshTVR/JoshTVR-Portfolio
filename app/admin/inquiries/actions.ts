'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendInquiryConfirmation, sendTestimonialRequest } from '@/lib/email'

export async function setInquiryStatus(id: string, newStatus: string): Promise<{ error?: string }> {
  const supabase = createAdminClient()

  // Fetch inquiry data before updating (needed for emails)
  const { data: inq } = await supabase
    .from('inquiries')
    .select('name,email')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('inquiries')
    .update({ status: newStatus })
    .eq('id', id)
  if (error) return { error: error.message }

  // Send emails on key status transitions
  if (inq) {
    if (newStatus === 'replied') {
      sendInquiryConfirmation({ toEmail: inq.email, toName: inq.name })
        .catch(e => console.error('[email] confirmation:', e))
    }
    if (newStatus === 'completed') {
      sendTestimonialRequest({ toEmail: inq.email, toName: inq.name, inquiryId: id })
        .catch(e => console.error('[email] testimonial request:', e))
    }
  }

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
