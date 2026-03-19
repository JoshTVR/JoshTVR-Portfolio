'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { routing } from '@/lib/i18n/routing'

export function LanguageToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function toggle() {
    const next = locale === 'en' ? 'es' : 'en'
    // Swap the locale prefix in the URL
    const newPath = pathname.replace(`/${locale}`, `/${next}`) || `/${next}`
    router.push(newPath)
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      className="text-[0.82rem] font-semibold px-3.5 py-1.5 rounded-lg transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)]"
      style={{
        color: 'var(--text-muted)',
        border: 'var(--glass-border)',
        background: 'transparent',
        fontFamily: 'var(--font-body)',
      }}
      aria-label="Toggle language"
    >
      <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{locale.toUpperCase()}</span>
      <span style={{ margin: '0 3px', opacity: 0.4 }}>/</span>
      <span>{routing.locales.find(l => l !== locale)?.toUpperCase()}</span>
    </button>
  )
}
