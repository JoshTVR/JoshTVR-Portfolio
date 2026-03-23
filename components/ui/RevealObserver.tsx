'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const makeVisible = (el: Element) => el.classList.add('is-visible')

    const revealInView = () => {
      document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.92) makeVisible(el)
      })
    }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { makeVisible(e.target); io.unobserve(e.target) }
      }),
      { threshold: 0.06 }
    )

    const attach = () => {
      document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
        if (!el.classList.contains('is-visible')) io.observe(el)
      })
      revealInView()
    }

    attach()
    const t1 = setTimeout(attach, 150)
    const t2 = setTimeout(attach, 500)

    // Re-reveal when theme changes
    const mo = new MutationObserver(revealInView)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => { io.disconnect(); mo.disconnect(); clearTimeout(t1); clearTimeout(t2) }
  }, [pathname])

  return null
}
