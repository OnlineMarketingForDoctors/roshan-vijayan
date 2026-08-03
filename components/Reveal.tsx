'use client'

import {useEffect} from 'react'
import {usePathname} from 'next/navigation'

/** Global scroll-reveal: adds `.in` to `.reveal` elements as they enter view. */
export default function Reveal() {
  const pathname = usePathname()

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.in)'))
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => (e.target as HTMLElement).classList.add('in'), (i % 4) * 90)
            io.unobserve(e.target)
          }
        })
      },
      {threshold: 0.12, rootMargin: '0px 0px -8% 0px'},
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return null
}
