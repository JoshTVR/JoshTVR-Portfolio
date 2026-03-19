import type { ContributionWeek } from '@/lib/github/api'

interface ContributionHeatmapProps {
  weeks:       ContributionWeek[]
  label?:      string
  totalLabel?: string
  total?:      number
}

// Level → fill color using accent purple
const LEVEL_COLORS = [
  'rgba(255,255,255,0.05)',  // 0 — no contribution
  'rgba(124, 58, 237, 0.3)', // 1
  'rgba(124, 58, 237, 0.5)', // 2
  'rgba(124, 58, 237, 0.75)',// 3
  'rgba(124, 58, 237, 1)',   // 4 — max
]

const CELL  = 11 // px — cell size
const GAP   = 3  // px — gap between cells
const STEP  = CELL + GAP  // 14px per cell

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

export function ContributionHeatmap({
  weeks,
  label      = 'contributions in the last year',
  totalLabel = 'Contributions',
  total,
}: ContributionHeatmapProps) {
  if (!weeks.length) return null

  const W = weeks.length
  const svgWidth  = W * STEP - GAP
  const svgHeight = 7 * STEP - GAP

  // Month labels — find first week of each month
  const monthLabels: { x: number; label: string }[] = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const firstDay = week.days[0]
    if (!firstDay) return
    const m = new Date(firstDay.date).getMonth()
    if (m !== lastMonth) {
      lastMonth = m
      monthLabels.push({
        x:     wi * STEP,
        label: new Date(firstDay.date).toLocaleDateString('en-US', { month: 'short' }),
      })
    }
  })

  const computed = total ?? weeks
    .flatMap(w => w.days)
    .reduce((s, d) => s + d.count, 0)

  return (
    <div className="glass reveal" style={{ padding: '24px', overflow: 'hidden' }}>
      {/* Header */}
      <p
        style={{
          fontSize:   '0.82rem',
          color:      'var(--text-muted)',
          marginBottom: '16px',
        }}
      >
        <strong style={{ color: 'var(--accent-light)' }}>
          {computed.toLocaleString()}
        </strong>{' '}
        {label}
      </p>

      {/* SVG heatmap — scrollable on mobile */}
      <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
        <svg
          width={svgWidth + 30}
          height={svgHeight + 28}
          viewBox={`0 0 ${svgWidth + 30} ${svgHeight + 28}`}
          role="img"
          aria-label={`${totalLabel} heatmap`}
        >
          {/* Day labels (left axis) */}
          {DAY_LABELS.map((d, i) =>
            d ? (
              <text
                key={i}
                x={0}
                y={20 + i * STEP + CELL / 2 + 4}
                fontSize="9"
                fill="var(--text-muted)"
                fontFamily="system-ui, sans-serif"
                textAnchor="start"
              >
                {d}
              </text>
            ) : null
          )}

          {/* Month labels (top axis) */}
          {monthLabels.map(({ x, label: ml }) => (
            <text
              key={ml + x}
              x={x + 28}
              y={12}
              fontSize="9"
              fill="var(--text-muted)"
              fontFamily="system-ui, sans-serif"
            >
              {ml}
            </text>
          ))}

          {/* Grid */}
          <g transform="translate(28, 20)">
            {weeks.map((week, wi) =>
              week.days.map((day, di) => (
                <rect
                  key={`${wi}-${di}`}
                  x={wi * STEP}
                  y={di * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={LEVEL_COLORS[day.level] ?? LEVEL_COLORS[0]}
                  style={{ transition: 'opacity 150ms ease' }}
                >
                  <title>{`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}</title>
                </rect>
              ))
            )}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div
        style={{
          display:     'flex',
          alignItems:  'center',
          gap:         '6px',
          marginTop:   '12px',
          justifyContent: 'flex-end',
        }}
      >
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Less</span>
        {LEVEL_COLORS.map((color, i) => (
          <span
            key={i}
            style={{
              width:        '10px',
              height:       '10px',
              borderRadius: '2px',
              background:   color,
              display:      'inline-block',
              border:       '1px solid rgba(255,255,255,0.06)',
            }}
          />
        ))}
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>More</span>
      </div>
    </div>
  )
}
