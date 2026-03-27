import { useTranslations } from 'next-intl'
import { createAdminClient } from '@/lib/supabase/admin'

async function getFeaturedCvUrl(locale: string): Promise<string | null> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('cvs')
      .select('file_url')
      .eq('locale', locale)
      .eq('is_featured', true)
      .eq('is_active', true)
      .single()
    return data?.file_url ?? null
  } catch {
    return null
  }
}

export async function Footer({ locale = 'en' }: { locale?: string }) {
  const t = useTranslations('footer')
  const cvUrl = await getFeaturedCvUrl(locale)

  return (
    <footer style={{ background: '#05050a', borderTop: 'var(--glass-border)' }} className="pt-12 pb-8">
      <div className="container-site">
        <div className="flex items-center justify-between gap-6 flex-wrap mb-8">
          <span className="text-[1.5rem] font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            JoshTVR<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
          {cvUrl && (
            <a
              href={cvUrl}
              download
              className="inline-flex items-center gap-2 px-7 py-3 rounded-[10px] font-semibold text-[0.95rem] text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: 'var(--accent)', boxShadow: '0 0 24px var(--accent-glow)', fontFamily: 'var(--font-body)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {t('cv')}
            </a>
          )}
        </div>

        <div className="flex justify-center gap-5 mb-8">
          {[
            { href: 'https://github.com/JoshTVR', icon: <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>, label: 'GitHub' },
            { href: 'https://www.linkedin.com/in/joshtvr', icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>, label: 'LinkedIn' },
            { href: 'mailto:joshtvr4@gmail.com', icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>, label: 'Email', stroke: true },
          ].map(({ href, icon, label, stroke }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              className="transition-all duration-300 hover:-translate-y-0.5 hover:text-[var(--accent)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={stroke ? 'none' : 'currentColor'} stroke={stroke ? 'currentColor' : undefined} strokeWidth={stroke ? '2' : undefined}>
                {icon}
              </svg>
            </a>
          ))}
        </div>

        <div className="flex justify-between items-center flex-wrap gap-2 pt-6" style={{ borderTop: 'var(--glass-border)' }}>
          <p className="text-[0.85rem]" style={{ color: 'var(--text-muted)' }}>© 2025 Joshua Hernandez</p>
          <p className="text-[0.85rem]" style={{ color: 'var(--text-muted)' }}>{t('made')}</p>
        </div>
      </div>
    </footer>
  )
}
