import { cn } from '@/lib/utils/cn'
import { HTMLAttributes } from 'react'

interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3'
}

export function SectionTitle({ as: Tag = 'h2', className, children, ...props }: SectionTitleProps) {
  return (
    <Tag
      className={cn('reveal section-title-line', className)}
      style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
        fontWeight: 700,
        marginBottom: '3rem',
        letterSpacing: '-0.02em',
        color: 'var(--text-primary)',
      }}
      {...props}
    >
      {children}
    </Tag>
  )
}
