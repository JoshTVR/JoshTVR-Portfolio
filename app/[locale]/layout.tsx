import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/lib/i18n/routing'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import RevealObserver from '@/components/ui/RevealObserver'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'es')) {
    notFound()
  }

  const messages = await getMessages()

  // Check if store is visible (for navbar)
  // Default true in dev so it's visible without Supabase; production reads from settings
  let storeVisible = process.env.NODE_ENV === 'development'
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'store_visible')
      .single()
    if (data) storeVisible = data.value === true || data.value === 'true'
  } catch {
    // Supabase not configured — use dev default
  }

  return (
    <NextIntlClientProvider messages={messages}>
      <RevealObserver />
      <Navbar storeVisible={storeVisible} />
      <main>{children}</main>
      <Footer />
    </NextIntlClientProvider>
  )
}
