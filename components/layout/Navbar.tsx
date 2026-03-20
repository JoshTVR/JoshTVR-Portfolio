'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils/cn'

interface NavbarProps {
  storeVisible?: boolean
}

const NAV_SECTIONS = [
  { hash: 'about',          key: 'about' },
  { hash: 'skills',         key: 'skills' },
  { hash: 'projects',       key: 'projects' },
  { hash: 'experience',     key: 'experience' },
  { hash: 'certifications', key: 'certifications' },
  { hash: 'contact',        key: 'contact' },
] as const

export function Navbar({ storeVisible = false }: NavbarProps) {
  const t        = useTranslations('nav')
  const locale   = useLocale()
  const pathname = usePathname()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  const isHome = pathname === `/${locale}` || pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function href(hash: string) {
    return isHome ? `#${hash}` : `/${locale}#${hash}`
  }

  function closeMenu() { setMenuOpen(false) }

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-[200] transition-all duration-300',
        scrolled ? 'py-3 border-b' : 'py-[18px]'
      )}
      style={scrolled ? {
        background: 'var(--navbar-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'var(--border-glass)',
      } : {}}
    >
      <div className="container-site flex items-center justify-between gap-6">
        {/* Logo */}
        <a href={`/${locale}`} className="flex-shrink-0 text-[1.4rem] font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
          JoshTVR<span style={{ color: 'var(--accent)' }}>.</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_SECTIONS.map(({ hash, key }) => (
            <li key={key}>
              <a
                href={href(hash)}
                className="text-[0.9rem] font-medium px-3.5 py-2 rounded-lg transition-all duration-150 hover:text-[var(--text-primary)] hover:bg-white/5"
                style={{ color: 'var(--text-muted)' }}
              >
                {t(key)}
              </a>
            </li>
          ))}
          <li>
            <a href={`/${locale}/services`} className="text-[0.9rem] font-medium px-3.5 py-2 rounded-lg transition-all duration-150 hover:text-[var(--text-primary)] hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
              {t('services')}
            </a>
          </li>
          {storeVisible && (
            <li>
              <a href={`/${locale}/store`} className="text-[0.9rem] font-medium px-3.5 py-2 rounded-lg transition-all duration-150 hover:text-[var(--text-primary)] hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
                {t('store')}
              </a>
            </li>
          )}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <ThemeToggle />
          <LanguageToggle />
          <button
            className="md:hidden flex flex-col gap-[5px] w-7"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={cn('block h-0.5 rounded-sm transition-all duration-300', menuOpen ? 'rotate-45 translate-y-[7px]' : '')} style={{ background: 'var(--text-primary)' }} />
            <span className={cn('block h-0.5 rounded-sm transition-all duration-300', menuOpen ? 'opacity-0' : '')} style={{ background: 'var(--text-primary)' }} />
            <span className={cn('block h-0.5 rounded-sm transition-all duration-300', menuOpen ? '-rotate-45 -translate-y-[7px]' : '')} style={{ background: 'var(--text-primary)' }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-b py-4 px-6 flex flex-col gap-1" style={{ background: 'var(--navbar-bg)', backdropFilter: 'blur(20px)', borderColor: 'var(--border-glass)' }}>
          {NAV_SECTIONS.map(({ hash, key }) => (
            <a key={key} href={href(hash)} onClick={closeMenu} className="block py-3 px-4 rounded-lg text-[0.9rem] font-medium transition-colors hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
              {t(key)}
            </a>
          ))}
          <a href={`/${locale}/services`} onClick={closeMenu} className="block py-3 px-4 rounded-lg text-[0.9rem] font-medium transition-colors hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
            {t('services')}
          </a>
          {storeVisible && (
            <a href={`/${locale}/store`} onClick={closeMenu} className="block py-3 px-4 rounded-lg text-[0.9rem] font-medium transition-colors hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
              {t('store')}
            </a>
          )}
        </div>
      )}
    </nav>
  )
}
