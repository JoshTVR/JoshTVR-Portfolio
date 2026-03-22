'use client'

import { useEffect } from 'react'

export default function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08 }
    )

    const observe = () => {
      document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => io.observe(el))
    }

    observe()

    // Re-observe after short delay in case sections mount late
    const t = setTimeout(observe, 400)

    return () => {
      io.disconnect()
      clearTimeout(t)
    }
  }, [])

  return null
}
