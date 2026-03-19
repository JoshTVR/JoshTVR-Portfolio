import { cn } from '@/lib/utils/cn'
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'ghost' | 'sm' | 'sm-ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant
  href: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:  'inline-flex items-center gap-2 px-7 py-3 rounded-[10px] font-semibold text-[0.95rem] text-white transition-all duration-300 hover:-translate-y-0.5',
  ghost:    'inline-flex items-center gap-2 px-7 py-3 rounded-[10px] font-semibold text-[0.95rem] transition-all duration-300 hover:-translate-y-0.5',
  'sm':     'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-semibold text-[0.82rem] text-white transition-all duration-300 hover:-translate-y-px',
  'sm-ghost': 'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-semibold text-[0.82rem] transition-all duration-300 hover:-translate-y-px',
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary:   { background: 'var(--accent)', boxShadow: '0 0 24px var(--accent-glow)' },
  ghost:     { background: 'transparent', color: 'var(--text-primary)', border: 'var(--glass-border)' },
  'sm':      { background: 'var(--accent)', boxShadow: '0 0 14px var(--accent-glow)' },
  'sm-ghost':{ background: 'transparent', color: 'var(--text-muted)', border: 'var(--glass-border)' },
}

export function Button({ variant = 'primary', className, style, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(variantClasses[variant], className)}
      style={{ ...variantStyles[variant], fontFamily: 'var(--font-body)', ...style }}
      {...props}
    >
      {children}
    </button>
  )
}

export function LinkButton({ variant = 'primary', className, style, href, children, ...props }: LinkButtonProps) {
  return (
    <a
      href={href}
      className={cn(variantClasses[variant], className)}
      style={{ ...variantStyles[variant], fontFamily: 'var(--font-body)', ...style }}
      {...props}
    >
      {children}
    </a>
  )
}
