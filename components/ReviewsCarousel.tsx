'use client'

import {useCallback, useEffect, useRef, useState} from 'react'

export type Review = {
  _id?: string
  quote: string
  author?: string
  source?: string
  rating?: number
}

function stars(n = 5) {
  const c = Math.max(0, Math.min(5, Math.round(n)))
  return '★★★★★'.slice(0, c)
}

export default function ReviewsCarousel({
  reviews,
  reviewScore = '5.0',
  reviewCount = 45,
  reviewSource = 'iWantGreatCare',
}: {
  reviews: Review[]
  reviewScore?: string
  reviewCount?: number
  reviewSource?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [maxIndex, setMaxIndex] = useState(0)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [overflow, setOverflow] = useState<Record<number, boolean>>({})
  const stepRef = useRef(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track || !track.children.length) return
    const first = track.children[0] as HTMLElement
    const cardW = first.getBoundingClientRect().width
    const gap = parseFloat(getComputedStyle(track).gap || '0') || 0
    stepRef.current = cardW + gap
    const vpW = (track.parentElement as HTMLElement).getBoundingClientRect().width
    const perView = Math.max(1, Math.round((vpW + gap) / stepRef.current))
    setMaxIndex(Math.max(0, track.children.length - perView))
    const ov: Record<number, boolean> = {}
    Array.from(track.children).forEach((c, i) => {
      const text = c.querySelector('.rev-text') as HTMLElement | null
      if (text) ov[i] = text.scrollHeight - text.clientHeight > 4
    })
    setOverflow(ov)
  }, [])

  const translate = useCallback((n: number) => {
    const track = trackRef.current
    if (track) track.style.transform = `translateX(${-n * stepRef.current}px)`
  }, [])

  const go = useCallback(
    (n: number) => {
      const clamped = Math.max(0, Math.min(n, maxIndex))
      setIndex(clamped)
      translate(clamped)
    },
    [maxIndex, translate],
  )

  const resetTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => {
      setIndex((i) => {
        const nx = i >= maxIndex ? 0 : i + 1
        translate(nx)
        return nx
      })
    }, 7000)
  }, [maxIndex, translate])

  useEffect(() => {
    measure()
    const onResize = () => {
      measure()
      go(0)
    }
    window.addEventListener('resize', onResize)
    const t = setTimeout(measure, 400)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(t)
    }
  }, [measure, go, reviews])

  useEffect(() => {
    resetTimer()
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [resetTimer])

  const next = () => {
    go(index >= maxIndex ? 0 : index + 1)
    resetTimer()
  }
  const prev = () => {
    go(index <= 0 ? maxIndex : index - 1)
    resetTimer()
  }

  const dots = Array.from({length: maxIndex + 1}, (_, n) => n)

  return (
    <section className="reviews" aria-label="Patient reviews">
      <div className="reviews-head reveal">
        <div className="reviews-intro">
          <span className="eyebrow">Patient Reviews</span>
          <h2 className="display">What our patients say</h2>
        </div>
        <div className="reviews-aside">
          <div className="reviews-rating">
            <img className="iwgc" src="/images/iwgc-logo.png" alt="iWantGreatCare verified reviews" />
            <div className="rating-meta">
              <div className="stars" aria-hidden="true">
                ★★★★★
              </div>
              <p>
                <strong>{reviewScore}</strong> · {reviewCount} verified reviews
              </p>
            </div>
          </div>
          <div className="reviews-nav">
            <button className="car-arrow prev" onClick={prev} disabled={index === 0} aria-label="Previous reviews">
              ←
            </button>
            <button className="car-arrow next" onClick={next} disabled={index === maxIndex} aria-label="Next reviews">
              →
            </button>
          </div>
        </div>
      </div>

      <div className="carousel">
        <div className="car-viewport">
          <div className="car-track" ref={trackRef}>
            {reviews.map((r, i) => {
              const cite = [r.author || 'Verified patient', r.source || reviewSource].filter(Boolean).join(' · ')
              return (
                <blockquote className={`review${expanded[i] ? ' expanded' : ''}`} key={r._id || i}>
                  <div className="rev-stars" aria-hidden="true">
                    {stars(r.rating)}
                  </div>
                  <p className="rev-text">{r.quote}</p>
                  {overflow[i] ? (
                    <button className="rev-more" type="button" onClick={() => setExpanded((e) => ({...e, [i]: !e[i]}))}>
                      {expanded[i] ? 'Read less' : 'Read more'}
                    </button>
                  ) : null}
                  <cite>{cite}</cite>
                </blockquote>
              )
            })}
          </div>
        </div>
      </div>

      <div className="car-dots" aria-hidden="true">
        {dots.map((n) => (
          <button
            key={n}
            type="button"
            className={n === index ? 'active' : ''}
            onClick={() => {
              go(n)
              resetTimer()
            }}
          />
        ))}
      </div>
    </section>
  )
}
