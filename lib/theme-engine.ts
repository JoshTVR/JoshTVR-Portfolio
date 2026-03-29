import { BASE_THEMES, SEASONAL_WINDOWS, type ThemeName } from '@/components/content-cards/themes'

export interface ThemeRotationState {
  year: number
  used_this_cycle: ThemeName[]
  monthly_assignments: Record<string, ThemeName>  // "YYYY-MM" → theme
  manual_overrides: ManualOverride[]
}

export interface ManualOverride {
  start: string   // "YYYY-MM-DD"
  end: string     // "YYYY-MM-DD"
  theme: ThemeName
  label?: string
}

/** Default empty state for a new year */
export function defaultRotationState(year: number): ThemeRotationState {
  return {
    year,
    used_this_cycle: [],
    monthly_assignments: {},
    manual_overrides: [],
  }
}

/**
 * Resolve which theme to use for a given ISO date string "YYYY-MM-DD".
 * Priority: manual override > seasonal holiday > monthly auto-rotation
 */
export function resolveThemeForDate(date: string, state: ThemeRotationState): ThemeName {
  // 1. Manual override
  const override = state.manual_overrides.find(o => date >= o.start && date <= o.end)
  if (override) return override.theme

  // 2. Seasonal holiday (use month-day portion)
  const md = date.slice(5) // "MM-DD"
  for (const win of SEASONAL_WINDOWS) {
    if (md >= win.startMD && md <= win.endMD) return win.theme
  }

  // 3. Monthly auto-rotation
  const yearMonth = date.slice(0, 7) // "YYYY-MM"
  if (state.monthly_assignments[yearMonth]) {
    return state.monthly_assignments[yearMonth]
  }

  // Fallback
  return 'midnight'
}

/**
 * Assign themes to a list of months (YYYY-MM), advancing the rotation cycle.
 * Returns updated state.
 */
export function assignThemesToMonths(
  months: string[],
  state: ThemeRotationState,
): ThemeRotationState {
  const newState = { ...state, monthly_assignments: { ...state.monthly_assignments } }
  let usedThisCycle = [...state.used_this_cycle]

  for (const month of months) {
    if (newState.monthly_assignments[month]) continue  // already assigned

    // Skip if the month is fully covered by a seasonal override
    // (just pick the next base theme anyway for non-seasonal days)

    // Get next unused base theme
    const available = BASE_THEMES.filter(t => !usedThisCycle.includes(t))
    if (available.length === 0) {
      // Reset cycle
      usedThisCycle = []
      // Shuffle order for next cycle (simple rotation)
      const firstUsed = state.used_this_cycle[0]
      const rotated = [...BASE_THEMES.filter(t => t !== firstUsed), firstUsed] as ThemeName[]
      usedThisCycle.push(rotated[0])
      newState.monthly_assignments[month] = rotated[0]
    } else {
      const next = available[0]
      usedThisCycle.push(next)
      newState.monthly_assignments[month] = next
    }
  }

  newState.used_this_cycle = usedThisCycle
  return newState
}

/** Get all YYYY-MM strings for a given year */
export function getMonthsForYear(year: number): string[] {
  return Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, '0')
    return `${year}-${m}`
  })
}

/** Check if a date string (YYYY-MM-DD) falls in a seasonal window */
export function getSeasonalTheme(date: string): ThemeName | null {
  const md = date.slice(5)
  for (const win of SEASONAL_WINDOWS) {
    if (md >= win.startMD && md <= win.endMD) return win.theme
  }
  return null
}
