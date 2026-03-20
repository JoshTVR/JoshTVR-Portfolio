'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: '34px',
        height: '34px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        background: 'rgba(250, 204, 21, 0.10)',
        border: '1px solid rgba(250, 204, 21, 0.22)',
        color: 'var(--accent)',
        cursor: 'pointer',
        transition: 'all 150ms ease',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(250, 204, 21, 0.22)'
        e.currentTarget.style.boxShadow  = '0 0 12px var(--accent-glow)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(250, 204, 21, 0.10)'
        e.currentTarget.style.boxShadow  = 'none'
      }}
    >
      {theme === 'dark' ? (
        /* Sun */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zM2 13h2a1 1 0 0 0 0-2H2a1 1 0 0 0 0 2zm18 0h2a1 1 0 0 0 0-2h-2a1 1 0 0 0 0 2zM11 2v2a1 1 0 0 0 2 0V2a1 1 0 0 0-2 0zm0 18v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-2 0zM5.99 4.58a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41L5.99 4.58zm12.37 12.37a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06a1 1 0 0 0-1.41-1.41zM7.05 18.36l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06a1 1 0 0 0-1.41-1.41z"/>
        </svg>
      ) : (
        /* Moon */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-5.4-5.4c0-1.81.89-3.42 2.26-4.4A9.085 9.085 0 0 0 12 3z"/>
        </svg>
      )}
    </button>
  )
}
