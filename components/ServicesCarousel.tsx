'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import Link from 'next/link'

type Service = {title: string; img: string; alt: string; cols: string[][]; cta: string}

const SERVICES: Service[] = [
  {
    title: 'Body',
    img: '/images/web/body-contour.jpg',
    alt: 'Body contouring surgery',
    cols: [
      ['Abdominoplasty', 'Arm Lift', 'Thigh Lift'],
      ['Liposuction', 'Post-Weight-Loss Lift', 'Mummy Makeover'],
    ],
    cta: 'View all body procedures',
  },
  {
    title: 'Breast',
    img: '/images/web/decolletage.jpg',
    alt: 'Breast surgery',
    cols: [
      ['Breast Reduction', 'Breast Uplift', 'Breast Augmentation'],
      ['Breast Reconstruction', 'Gynaecomastia', 'Nipple Correction'],
    ],
    cta: 'View all breast procedures',
  },
  {
    title: 'Face & Eyes',
    img: '/images/web/face-portrait.jpg',
    alt: 'Facial aesthetic surgery',
    cols: [
      ['Facelift', 'Brow Lift', 'Eyelid Surgery'],
      ['Rhinoplasty', 'Lip Lift', 'Ear Correction'],
    ],
    cta: 'View all facial procedures',
  },
  {
    title: 'Skin & Reconstruction',
    img: '/images/web/instruments.jpg',
    alt: 'Skin and reconstructive surgery',
    cols: [
      ['Skin-Cancer Removal', 'Mole & Cyst Removal', 'Lipoma Removal'],
      ['Scar Revision', 'Reconstructive Surgery', 'Dermatoscopy Review'],
    ],
    cta: 'View all skin procedures',
  },
]

const GAP = 14

export default function ServicesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const cwRef = useRef(0)

  const render = useCallback((idx: number) => {
    const track = trackRef.current
    if (track) track.style.transform = `translateX(${-idx * (cwRef.current + GAP)}px)`
  }, [])

  const measure = useCallback(
    (idx: number) => {
      const track = trackRef.current
      if (!track || !track.children.length) return
      const collapsed = Array.from(track.children).find((_, i) => i !== idx) || track.children[0]
      cwRef.current = (collapsed as HTMLElement).getBoundingClientRect().width
      render(idx)
    },
    [render],
  )

  useEffect(() => {
    measure(active)
    const onResize = () => measure(active)
    window.addEventListener('resize', onResize)
    const t = setTimeout(() => measure(active), 400)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(t)
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
                    {s.cols.map((col, ci) => (
                      <ul key={ci}>
                        {col.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ))}
                  </div>
                  <Link className="btn svc-cta" href="/procedures">
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
