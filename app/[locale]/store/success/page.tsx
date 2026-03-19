import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function StoreSuccessPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations('store.success')

  return (
    <main
      style={{
        background:    'var(--bg-primary)',
        minHeight:     '100vh',
        display:       'flex',
        alignItems:    'center',
        justifyContent:'center',
        padding:       '24px',
      }}
    >
      <div
        className="glass"
        style={{ maxWidth: '480px', width: '100%', padding: '48px', textAlign: 'center', borderRadius: '20px' }}
      >
        <div
          style={{
            width:        '72px',
            height:       '72px',
            borderRadius: '50%',
            background:   'rgba(16,185,129,0.15)',
            border:       '2px solid #10b981',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            margin:       '0 auto 24px',
            fontSize:     '2rem',
          }}
        >
          ✓
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize:   '1.6rem',
            fontWeight: 700,
            color:      'var(--text-primary)',
            marginBottom: '12px',
          }}
        >
          {t('title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '32px' }}>
          {t('message')}
        </p>
        <Link href={`/${locale}/store`} className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '12px 28px' }}>
          {t('back')}
        </Link>
      </div>
    </main>
  )
}
