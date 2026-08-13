'use client'

import {useState} from 'react'
import Link from 'next/link'
import BASlider from '@/components/BASlider'

export type BACase = {caption: string; beforeUrl: string; afterUrl: string}
export type BAGroups = {breast: BACase[]; body: BACase[]; face: BACase[]}

const TABS: {key: keyof BAGroups; label: string}[] = [
  {key: 'breast', label: 'Breast'},
  {key: 'body', label: 'Body'},
  {key: 'face', label: 'Face'},
]

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
                    <BASlider key={i} c={c} />
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
