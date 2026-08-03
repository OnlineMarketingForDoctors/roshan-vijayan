'use client'

import {useRef, useState} from 'react'
import Link from 'next/link'

export type BACase = {caption: string; beforeUrl: string; afterUrl: string}
export type BAGroups = {breast: BACase[]; body: BACase[]; face: BACase[]}

const TABS: {key: keyof BAGroups; label: string}[] = [
  {key: 'breast', label: 'Breast'},
  {key: 'body', label: 'Body'},
  {key: 'face', label: 'Face'},
]

function Slider({c}: {c: BACase}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)

  const set = (clientX: number) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    let pct = ((clientX - r.left) / r.width) * 100
    pct = Math.max(3, Math.min(97, pct))
    setPos(pct)
  }

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
        <img className="ba-img ba-after" src={c.afterUrl} alt={`${c.caption}, after`} />
        <img className="ba-img ba-before" src={c.beforeUrl} alt={`${c.caption}, before`} />
        <span className="ba-tagline ba-tag-before">Before</span>
        <span className="ba-tagline ba-tag-after">After</span>
        <button className="ba-handle" aria-label="Drag to compare before and after">
          <span className="ba-grip">‹ ›</span>
        </button>
      </div>
      <figcaption>{c.caption}</figcaption>
    </figure>
  )
}

export default function BeforeAfter({
  groups,
  emptyHref = '/gallery',
  emptyText = 'See the full gallery',
}: {
  groups: BAGroups
  emptyHref?: string
  emptyText?: string
}) {
  const [active, setActive] = useState<keyof BAGroups>('breast')

  return (
    <>
      <div className="ba-tabs reveal" role="tablist" aria-label="Result categories">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`ba-tab${active === t.key ? ' active' : ''}`}
            role="tab"
            aria-selected={active === t.key}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="ba-panels reveal">
        {TABS.map((t) => {
          const list = groups[t.key] || []
          const isActive = active === t.key
          return (
            <div key={t.key} className={`ba-panel${isActive ? ' active' : ''}`} hidden={!isActive}>
              {list.length ? (
                <div className={`ba-grid${list.length === 1 ? ' ba-grid-one' : ''}`}>
                  {list.map((c, i) => (
                    <Slider key={i} c={c} />
                  ))}
                </div>
              ) : (
                <p className="ba-empty">
                  {t.label} cases are being prepared for publication.{' '}
                  <Link className="btn btn-text" href={emptyHref}>
                    {emptyText} <span className="arrow">→</span>
                  </Link>
                </p>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
