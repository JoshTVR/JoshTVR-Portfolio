'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  stagger?: boolean
}

export function ScrollReveal({ children, className, stagger = false }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn(stagger ? 'reveal-stagger' : 'reveal', className)}>
      {children}
    </div>
  )
}
