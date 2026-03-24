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
    const t3 = setTimeout(attach, 1500)

    // Watch for .reveal elements added after async page loads (Suspense / streaming)
    let debounce: ReturnType<typeof setTimeout>
    const mo = new MutationObserver((mutations) => {
      // Theme change → re-check visibility
      if (mutations.some(m => m.type === 'attributes')) { revealInView(); return }

      // DOM change → debounced attach (only if new .reveal elements exist)
      const hasNewReveal = mutations.some(m =>
        Array.from(m.addedNodes).some(n => {
          if (!(n instanceof Element)) return false
          return n.classList.contains('reveal') ||
            n.classList.contains('reveal-stagger') ||
            n.querySelector('.reveal, .reveal-stagger') !== null
        })
      )
      if (hasNewReveal) {
        clearTimeout(debounce)
        debounce = setTimeout(attach, 60)
      }
    })

    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(debounce)
    }
  }, [pathname])

  return null
}
