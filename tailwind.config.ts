import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary':   '#0a0a0f',
        'bg-secondary': '#0f0f1a',
        'bg-card':      'rgba(255, 255, 255, 0.04)',
        'accent':       '#7c3aed',
        'accent-light': '#9d5cf6',
        'accent-blue':  '#3b82f6',
        'text-primary': '#f0f0f0',
        'text-muted':   '#888899',
        'border-glass': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        glass: '16px',
      },
      backdropBlur: {
        glass: '14px',
      },
      maxWidth: {
        container: '1200px',
      },
      animation: {
        'grid-drift':   'gridDrift 20s linear infinite',
        'rotate-slow':  'rotateSlow 20s linear infinite',
        'bounce-hint':  'bounceHint 2s ease-in-out infinite',
        'blink':        'blink 1s step-end infinite',
      },
      keyframes: {
        gridDrift: {
          '0%':   { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '60px 60px' },
        },
        rotateSlow: {
          to: { transform: 'rotate(360deg)' },
        },
        bounceHint: {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%':      { transform: 'translateX(-50%) translateY(8px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
