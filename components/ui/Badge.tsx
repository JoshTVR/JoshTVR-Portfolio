import { cn } from '@/lib/utils/cn'

type BadgeCategory = 'vr' | 'ar' | 'data' | 'backend' | 'design' | '3d' | 'video'

interface BadgeProps {
  category: BadgeCategory | string
  label: string
  className?: string
}

export function CategoryBadge({ category, label, className }: BadgeProps) {
  return (
    <span className={cn(`badge-${category}`, 'absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[0.74rem] font-bold uppercase tracking-wide', className)}>
      {label}
    </span>
  )
}

export function TagBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <li
      className={cn('px-2.5 py-0.5 rounded-full text-[0.76rem] font-medium', className)}
      style={{ background: 'rgba(255,255,255,0.06)', border: 'var(--glass-border)', color: 'var(--text-muted)' }}
    >
      {children}
    </li>
  )
}
