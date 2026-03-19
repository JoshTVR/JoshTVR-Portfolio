import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('services')
      .select('id,title_en,title_es,description_en,description_es,features,price_from,currency,category,sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    return NextResponse.json({ services: data ?? [] })
  } catch {
    return NextResponse.json({ services: [] })
  }
}
