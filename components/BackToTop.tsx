'use client'

import {useEffect, useState} from 'react'

/**
 * Appears once the visitor is a screen or so down the page, and returns them to
 * the top. Hidden until then so it never sits over the hero.
 */
export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({top: 0, behavior: reduced ? 'auto' : 'smooth'})
  }

  return (
    <button
      type="button"
      className={`to-top${show ? ' show' : ''}`}
      onClick={toTop}
      aria-label="Back to top"
      // Keep it out of the tab order and off screen readers while hidden.
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5" />
        <path d="M5.5 11.5 12 5l6.5 6.5" />
      </svg>
    </button>
  )
}
