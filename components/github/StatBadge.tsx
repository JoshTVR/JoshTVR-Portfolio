interface StatBadgeProps {
  value: number | string
  label: string
  accent?: boolean
}

export function StatBadge({ value, label, accent = false }: StatBadgeProps) {
  return (
    <div
      className="glass reveal-stagger"
      style={{
        padding: '24px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        transition: 'transform 300ms ease, box-shadow 300ms ease',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.2rem',
          fontWeight: 700,
          lineHeight: 1,
          color: accent ? 'var(--accent-light)' : 'var(--text-primary)',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
        }}
      >
        {label}
      </span>
    </div>
  )
}
