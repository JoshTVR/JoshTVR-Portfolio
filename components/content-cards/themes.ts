export type ThemeName =
  | 'midnight'
  | 'matrix'
  | 'sunset'
  | 'ocean'
  | 'minimal'
  | 'neon'
  | 'spooky'
  | 'holiday'

export interface Theme {
  name: ThemeName
  label: string
  bg: string
  surface: string
  accent: string
  accentRgb: string
  text: string
  textMuted: string
  codeBg: string
  seasonal?: boolean
}

export const THEMES: Record<ThemeName, Theme> = {
  midnight: {
    name: 'midnight',
    label: 'Midnight',
    bg: '#0a0a1a',
    surface: '#12122a',
    accent: '#7c3aed',
    accentRgb: '124,58,237',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    codeBg: '#0f0f23',
  },
  matrix: {
    name: 'matrix',
    label: 'Matrix',
    bg: '#0d1117',
    surface: '#161b22',
    accent: '#10b981',
    accentRgb: '16,185,129',
    text: '#e6edf3',
    textMuted: '#8b949e',
    codeBg: '#0d1117',
  },
  sunset: {
    name: 'sunset',
    label: 'Sunset',
    bg: '#1a0a0a',
    surface: '#2a1010',
    accent: '#f97316',
    accentRgb: '249,115,22',
    text: '#fef3c7',
    textMuted: '#d97706',
    codeBg: '#1f0f0a',
  },
  ocean: {
    name: 'ocean',
    label: 'Ocean',
    bg: '#0a1a2a',
    surface: '#102030',
    accent: '#0ea5e9',
    accentRgb: '14,165,233',
    text: '#e0f2fe',
    textMuted: '#7dd3fc',
    codeBg: '#071520',
  },
  minimal: {
    name: 'minimal',
    label: 'Minimal',
    bg: '#111827',
    surface: '#1f2937',
    accent: '#f1f5f9',
    accentRgb: '241,245,249',
    text: '#f9fafb',
    textMuted: '#9ca3af',
    codeBg: '#0f172a',
  },
  neon: {
    name: 'neon',
    label: 'Neon',
    bg: '#0a0a0a',
    surface: '#151515',
    accent: '#ec4899',
    accentRgb: '236,72,153',
    text: '#fdf4ff',
    textMuted: '#d946ef',
    codeBg: '#0f0010',
  },
  spooky: {
    name: 'spooky',
    label: 'Spooky 🎃',
    bg: '#0f0500',
    surface: '#1a0a00',
    accent: '#f97316',
    accentRgb: '249,115,22',
    text: '#fef3c7',
    textMuted: '#9333ea',
    codeBg: '#0a0300',
    seasonal: true,
  },
  holiday: {
    name: 'holiday',
    label: 'Holiday 🎄',
    bg: '#0a1a0a',
    surface: '#0f2a0f',
    accent: '#ef4444',
    accentRgb: '239,68,68',
    text: '#fef9c3',
    textMuted: '#86efac',
    codeBg: '#061006',
    seasonal: true,
  },
}

export const BASE_THEMES: ThemeName[] = ['midnight', 'matrix', 'sunset', 'ocean', 'minimal', 'neon']
export const SEASONAL_THEMES: ThemeName[] = ['spooky', 'holiday']

/** Default seasonal windows (month-day ranges, inclusive) */
export const SEASONAL_WINDOWS: { theme: ThemeName; startMD: string; endMD: string }[] = [
  { theme: 'spooky',  startMD: '10-15', endMD: '10-31' },
  { theme: 'holiday', startMD: '12-01', endMD: '12-31' },
]
