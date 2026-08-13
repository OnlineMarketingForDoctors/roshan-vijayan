'use client'

import {useState} from 'react'
import BASlider from '@/components/BASlider'
import type {BAProcedure} from '@/lib/baCases'

/**
 * Gallery layout: procedures listed down the left, the selected procedure's
 * patients shown to the right, two across where a procedure has two.
 */
export default function BeforeAfterGallery({procedures}: {procedures: BAProcedure[]}) {
  const [active, setActive] = useState(procedures[0]?.slug ?? '')
  const current = procedures.find((p) => p.slug === active) ?? procedures[0]

  // area headings, in the order the procedures themselves appear
  const areas = procedures.reduce<string[]>(
    (acc, p) => (acc.includes(p.area) ? acc : [...acc, p.area]),
    [],
  )

  if (!current) return null

  return (
    <div className="bag">
      {/* narrow screens get this instead of the menu: eleven procedures with
          names this long cannot be shown as a row or a wrap without either
          hiding most of them or pushing the images off the screen */}
      <div className="bag-select-wrap">
        <label className="bag-select-label" htmlFor="bag-procedure">
          Procedure
        </label>
        <select
          id="bag-procedure"
          className="bag-select"
          value={current.slug}
          onChange={(e) => setActive(e.target.value)}
        >
          {areas.map((area) => (
            <optgroup label={area} key={area}>
              {procedures
                .filter((p) => p.area === area)
                .map((p) => (
                  <option value={p.slug} key={p.slug}>
                    {p.title} ({p.patients.length})
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      <nav className="bag-nav reveal" aria-label="Procedures">
        {areas.map((area) => (
          <div className="bag-group" key={area}>
            <h3 className="bag-area">{area}</h3>
            <ul>
              {procedures
                .filter((p) => p.area === area)
                .map((p) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      className={`bag-link${p.slug === current.slug ? ' active' : ''}`}
                      aria-current={p.slug === current.slug ? 'true' : undefined}
                      onClick={() => setActive(p.slug)}
                    >
                      <span>{p.title}</span>
                      <span className="bag-count">{p.patients.length}</span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="bag-panel">
        <div className="bag-head reveal">
          <h2 className="display">{current.title}</h2>
          <p>
            {current.patients.length === 1
              ? 'One patient shown. Drag the handle on the image to reveal the result.'
              : `${current.patients.length} patients shown. Drag the handle on each image to reveal the result.`}
          </p>
        </div>
        <div
          className={`bag-grid${current.patients.length === 1 ? ' bag-grid-one' : ''}`}
          key={current.slug}
        >
          {current.patients.map((p, i) => (
            <BASlider key={`${current.slug}-${i}`} c={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
