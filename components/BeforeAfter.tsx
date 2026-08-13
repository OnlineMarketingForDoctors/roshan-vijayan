'use client'

import {useState} from 'react'
import Link from 'next/link'
import BASlider from '@/components/BASlider'
import type {BAProcedure} from '@/lib/baCases'

/**
 * Before & after teaser: one horizontal tab per area, a couple of cases each,
 * and a link through to the full gallery. Tabs come from the data rather than
 * a fixed list, so adding a procedure in a new area adds its tab here.
 *
 * The gallery page uses BeforeAfterGallery instead, which lists every
 * procedure down the side; both share BASlider.
 */
export default function BeforeAfter({
  procedures,
  perTab = 2,
  moreHref = '/gallery',
  moreText = 'See all results',
}: {
  procedures: BAProcedure[]
  /** cases shown per tab before pointing at the full gallery */
  perTab?: number
  moreHref?: string
  moreText?: string
}) {
  const areas = procedures.reduce<string[]>(
    (acc, p) => (acc.includes(p.area) ? acc : [...acc, p.area]),
    [],
  )
  const [active, setActive] = useState(areas[0] ?? '')

  const casesFor = (area: string) =>
    procedures.filter((p) => p.area === area).flatMap((p) => p.patients)

  return (
    <>
      <div className="ba-tabs reveal" role="tablist" aria-label="Result categories">
        {areas.map((area) => (
          <button
            key={area}
            className={`ba-tab${active === area ? ' active' : ''}`}
            role="tab"
            aria-selected={active === area}
            onClick={() => setActive(area)}
          >
            {area}
          </button>
        ))}
      </div>

      <div className="ba-panels reveal">
        {areas.map((area) => {
          const all = casesFor(area)
          const shown = all.slice(0, perTab)
          const isActive = active === area
          return (
            <div key={area} className={`ba-panel${isActive ? ' active' : ''}`} hidden={!isActive}>
              <div className={`ba-grid${shown.length === 1 ? ' ba-grid-one' : ''}`}>
                {shown.map((c, i) => (
                  <BASlider key={`${area}-${i}`} c={c} />
                ))}
              </div>
              <p className="ba-more">
                <Link className="btn btn-text" href={moreHref}>
                  {all.length > shown.length
                    ? `${moreText} (${all.length} in this category)`
                    : moreText}{' '}
                  <span className="arrow">→</span>
                </Link>
              </p>
            </div>
          )
        })}
      </div>
    </>
  )
}
