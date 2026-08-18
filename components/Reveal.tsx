'use client'

import {useEffect} from 'react'

/**
 * Global scroll-reveal: adds `.in` to `.reveal` elements as they enter view.
 *
 * New elements are picked up by a MutationObserver rather than by re-running
 * this effect per route. The blog category filters change only the query
 * string, so an effect keyed on the pathname never fired for them and every
 * card in the filtered grid stayed at opacity 0 — present in the HTML, blank
 * on screen.
 */
export default function Reveal() {
  useEffect(() => {
    const query = '.reveal:not(.in)'

    // no IntersectionObserver: show everything rather than hide it
    if (!('IntersectionObserver' in window)) {
      const showAll = () =>
        document.querySelectorAll<HTMLElement>(query).forEach((el) => el.classList.add('in'))
      showAll()
      const mo = new MutationObserver(showAll)
      mo.observe(document.body, {childList: true, subtree: true})
      return () => mo.disconnect()
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

    // observing an element twice is a no-op, so this can run as often as it likes
    const observeAll = () =>
      document.querySelectorAll<HTMLElement>(query).forEach((el) => io.observe(el))

    observeAll()

    // batched to one pass per frame: a route change mutates the DOM many times
    let frame = 0
    const mo = new MutationObserver(() => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        observeAll()
      })
    })
    mo.observe(document.body, {childList: true, subtree: true})

    return () => {
      mo.disconnect()
      io.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return null
}
