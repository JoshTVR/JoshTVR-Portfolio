import type { LanguageStat } from '@/lib/github/api'

interface LanguageBarProps {
  languages: LanguageStat[]
}

export function LanguageBar({ languages }: LanguageBarProps) {
  if (!languages.length) return null

  return (
    <div className="glass reveal" style={{ padding: '24px' }}>
      {/* Stacked bar */}
      <div
        style={{
          display: 'flex',
          height: '8px',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '20px',
          gap: '1px',
        }}
      >
        {languages.map((lang) => (
          <div
            key={lang.name}
            title={`${lang.name} — ${lang.percentage}%`}
            style={{
              width:      `${lang.percentage}%`,
              background: lang.color,
              flexShrink: 0,
              transition: 'opacity 200ms ease',
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          display:  'flex',
          flexWrap: 'wrap',
          gap:      '12px 20px',
        }}
      >
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        '6px',
            }}
          >
            <span
              style={{
                width:        '10px',
                height:       '10px',
                borderRadius: '50%',
                background:   lang.color,
                flexShrink:   0,
              }}
            />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {lang.name}
            </span>
            <span
              style={{
                fontSize:   '0.78rem',
                color:      'var(--accent-light)',
                fontWeight: 600,
              }}
            >
              {lang.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
