'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import Link from 'next/link'
import {SERVICE_TAGS, type ServiceTag} from '@/lib/serviceCategories'

type Service = {id: string; title: string; img: string; alt: string; cta: string}

/**
 * The cards, in order. `id` matches both the band on /procedures the button
 * scrolls to and the service list in lib/serviceCategories, so the names shown
 * here are the same ones that page shows and each links to its own page.
 */
const SERVICES: Service[] = [
  {
    id: 'body',
    title: 'Body',
    img: '/images/web/body-contour.jpg',
    alt: 'Body contouring surgery',
    cta: 'View all body procedures',
  },
  {
    id: 'breast',
    title: 'Breast',
    img: '/images/web/decolletage.jpg',
    alt: 'Breast surgery',
    cta: 'View all breast procedures',
  },
  {
    id: 'face',
    title: 'Face & Eyes',
    img: '/images/web/face-portrait.jpg',
    alt: 'Facial aesthetic surgery',
    cta: 'View all facial procedures',
  },
  {
    id: 'skin',
    title: 'Skin & Reconstruction',
    img: '/images/web/instruments.jpg',
    alt: 'Skin and reconstructive surgery',
    cta: 'View all skin procedures',
  },
]

/** Two columns per card, filled down then across. */
const columns = (tags: ServiceTag[]) => {
  const half = Math.ceil(tags.length / 2)
  return [tags.slice(0, half), tags.slice(half)]
}

const GAP = 14

/**
 * @param paths procedure slug -> its URL, resolved on the server from Sanity so
 *   a service whose page has not been published yet stays a plain label.
 */
export default function ServicesCarousel({paths = {}}: {paths?: Record<string, string>}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const cwRef = useRef(0)
  // the card that was open a moment ago is still shrinking, so it must not be
  // the one the offset is measured from
  const leaving = useRef(0)

  const render = useCallback((idx: number) => {
    const track = trackRef.current
    if (track) track.style.transform = `translateX(${-idx * (cwRef.current + GAP)}px)`
  }, [])

  /**
   * The track shifts by one collapsed card per step, so it needs a collapsed
   * card's width. Card widths animate over .85s, so measuring the card that is
   * opening or the one that is closing returns a width part-way through the
   * animation: the track then stops short and the open card's first letters sit
   * outside the viewport. Measure one that is not moving.
   */
  const measure = useCallback(
    (idx: number) => {
      const track = trackRef.current
      if (!track || !track.children.length) return
      const kids = Array.from(track.children) as HTMLElement[]
      const settled =
        kids.find((_, i) => i !== idx && i !== leaving.current) ||
        kids.find((_, i) => i !== idx) ||
        kids[0]
      cwRef.current = settled.getBoundingClientRect().width
      render(idx)
    },
    [render],
  )

  useEffect(() => {
    measure(active)
    const onResize = () => measure(active)
    window.addEventListener('resize', onResize)

    // whatever the mid-animation measurement produced, the widths are final
    // once the card has finished growing, so take them again and correct
    const track = trackRef.current
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName === 'flex-basis') {
        leaving.current = active
        measure(active)
      }
    }
    track?.addEventListener('transitionend', onEnd)

    return () => {
      window.removeEventListener('resize', onResize)
      track?.removeEventListener('transitionend', onEnd)
      leaving.current = active
    }
  }, [active, measure])

  const go = (n: number) => setActive((n + SERVICES.length) % SERVICES.length)

  return (
    <div className="svc-stage reveal">
      <button className="svc-arrow prev" onClick={() => go(active - 1)} aria-label="Previous service">
        ‹
      </button>
      <div className="svc-viewport">
        <div className="svc-track" ref={trackRef}>
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className={`svc-card${i === active ? ' active' : ''}`}
              onClick={() => i !== active && go(i)}
            >
              <img src={s.img} alt={s.alt} />
              <div className="svc-veil" />
              <div className="svc-body">
                <h3 className="svc-title">{s.title}</h3>
                <div className="svc-reveal">
                  <div className="svc-cols">
                    {columns(SERVICE_TAGS[s.id] || []).map((col, ci) => (
                      <ul key={ci}>
                        {col.map((t) => {
                          const href = t.slug ? paths[t.slug] : undefined
                          return (
                            <li key={t.label}>
                              {href ? <Link href={href}>{t.label}</Link> : t.label}
                            </li>
                          )
                        })}
                      </ul>
                    ))}
                  </div>
                  <Link className="btn svc-cta" href={`/procedures/#${s.id}`}>
                    {s.cta} <span>›</span>
                  </Link>
                </div>
              </div>
              <span className="svc-tab">{s.title}</span>
            </article>
          ))}
        </div>
      </div>
      <button className="svc-arrow next" onClick={() => go(active + 1)} aria-label="Next service">
        ›
      </button>
    </div>
  )
}
