import { createAdminClient } from '@/lib/supabase/admin'
import { ServicesClient } from './ServicesClient'

export const dynamic = 'force-dynamic'

export interface ServiceRow {
  id:             string
  title_en:       string
  title_es:       string
  description_en: string | null
  description_es: string | null
  features:       string[]
  price_from:     number | null
  currency:       string
  category:       string
  sort_order:     number
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('services')
    .select('id,title_en,title_es,description_en,description_es,features,price_from,currency,category,sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const services = (data ?? []) as ServiceRow[]

  // Group by category preserving sort order
  const groupOrder: string[] = []
  const groups: Record<string, ServiceRow[]> = {}
  for (const s of services) {
    const cat = s.category ?? 'other'
    if (!groups[cat]) { groups[cat] = []; groupOrder.push(cat) }
    groups[cat].push(s)
  }

  return <ServicesClient locale={locale} groups={groups} groupOrder={groupOrder} />
}
