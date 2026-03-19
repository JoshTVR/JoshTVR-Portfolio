import { cn } from '@/lib/utils/cn'
import { HTMLAttributes } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function GlassCard({ className, hover = true, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(0,0,0,0.55),0_0_28px_rgba(124,58,237,0.2)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
