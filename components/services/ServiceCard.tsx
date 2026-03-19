interface ServiceCardProps {
  title:       string
  description: string
  features:    string[]
  priceFrom:   number | null
  currency:    string
  fromLabel:   string
  inquireLabel:string
  serviceId:   string
  onInquire:   (serviceId: string, title: string) => void
}

export function ServiceCard({
  title,
  description,
  features,
  priceFrom,
  currency,
  fromLabel,
  inquireLabel,
  serviceId,
  onInquire,
}: ServiceCardProps) {
  const price =
    priceFrom != null
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: currency ?? 'usd', minimumFractionDigits: 0 })
          .format(priceFrom / 100)
      : null

  return (
    <div
      className="glass reveal-stagger"
      style={{
        padding:        '32px 28px',
        display:        'flex',
        flexDirection:  'column',
        gap:            '16px',
        transition:     'transform 300ms ease, box-shadow 300ms ease',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize:   '1.15rem',
          fontWeight: 700,
          color:      'var(--text-primary)',
        }}
      >
        {title}
      </h3>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.75, flex: 1 }}>
        {description}
      </p>

      {features.length > 0 && (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: 0, margin: 0 }}>
          {features.map((f, i) => (
            <li
              key={i}
              style={{
                display:    'flex',
                alignItems: 'flex-start',
                gap:        '8px',
                fontSize:   '0.85rem',
                color:      'var(--text-muted)',
              }}
            >
              <span style={{ color: 'var(--accent)', marginTop: '1px', flexShrink: 0 }}>✓</span>
              {f}
            </li>
          ))}
        </ul>
      )}

      <div
        style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          gap:            '12px',
          flexWrap:       'wrap',
          marginTop:      'auto',
          paddingTop:     '16px',
          borderTop:      '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {price && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {fromLabel}{' '}
            <strong style={{ color: 'var(--accent-light)', fontSize: '1.1rem' }}>{price}</strong>
          </p>
        )}
        <button
          onClick={() => onInquire(serviceId, title)}
          className="btn btn-primary"
          style={{ fontSize: '0.85rem', padding: '10px 22px' }}
        >
          {inquireLabel}
        </button>
      </div>
    </div>
  )
}
