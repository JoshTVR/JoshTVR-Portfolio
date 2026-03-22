'use client'

import { useEffect } from 'react'

export default function RevealObserver() {
  useEffect(() => {
    const makeVisible = (el: Element) => el.classList.add('is-visible')

    const revealInView = () => {
      document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.92) makeVisible(el)
      })
    }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { makeVisible(e.target); io.unobserve(e.target) } }),
      { threshold: 0.06 }
    )

    const attach = () => {
      document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => io.observe(el))
      revealInView()
    }

    attach()
    const t = setTimeout(attach, 300)

    // Re-reveal when theme changes (data-theme attribute toggles)
    const mo = new MutationObserver(revealInView)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => { io.disconnect(); mo.disconnect(); clearTimeout(t) }
  }, [])

  return null
}
