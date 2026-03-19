import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      name?:    string
      email?:   string
      message?: string
      budget?:  string
      metadata?: Record<string, unknown>
    }

    const { name, email, message, budget, metadata } = body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('inquiries')
      .insert({ name: name.trim(), email: email.trim(), message: message.trim(), budget: budget ?? null, metadata: metadata ?? {} })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ ok: true, id: data.id })
  } catch (err) {
    console.error('[inquiries]', err)
    return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 })
  }
}
