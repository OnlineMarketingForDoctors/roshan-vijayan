'use client'

import {useRef, useState} from 'react'
import type {BAPatient} from '@/lib/baCases'

/**
 * Before/after reveal. The two frames are stacked and the top one is clipped to
 * --pos, so both images must share dimensions; the gallery set is 800x680
 * throughout. Shared by the homepage strip and the gallery page.
 */
export default function BASlider({c}: {c: BAPatient}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)

  const set = (clientX: number) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const pct = ((clientX - r.left) / r.width) * 100
    setPos(Math.max(3, Math.min(97, pct)))
  }

  const nudge = (delta: number) => setPos((p) => Math.max(3, Math.min(97, p + delta)))

  return (
    <figure className="ba-card">
      <div
        className="ba-slider"
        ref={ref}
        style={{['--pos' as string]: pos + '%'}}
        onPointerDown={(e) => {
          dragging.current = true
          try {
            ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
          } catch {}
          set(e.clientX)
        }}
        onPointerMove={(e) => {
          if (dragging.current) set(e.clientX)
        }}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <img className="ba-img ba-after" src={c.afterUrl} alt={`${c.caption}, after`} loading="lazy" decoding="async" />
        <img className="ba-img ba-before" src={c.beforeUrl} alt={`${c.caption}, before`} loading="lazy" decoding="async" />
        <span className="ba-tagline ba-tag-before">{c.beforeLabel || 'Before'}</span>
        <span className="ba-tagline ba-tag-after">{c.afterLabel || 'After'}</span>
        <button
          className="ba-handle"
          aria-label="Drag or use the arrow keys to compare before and after"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault()
              nudge(-4)
            }
            if (e.key === 'ArrowRight') {
              e.preventDefault()
              nudge(4)
            }
          }}
        >
          <span className="ba-grip">‹ ›</span>
        </button>
      </div>
      <figcaption>{c.caption}</figcaption>
    </figure>
  )
}
