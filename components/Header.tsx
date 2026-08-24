'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import Link from 'next/link'
import {procedurePath} from '@/lib/procedurePath'

type Procedure = {slug: string; title: string; category?: string; image?: string | null}
/** A before & after treatment, one per page under /gallery. */
type Result = {slug: string; title: string}
type Settings = {phone?: string} | null

/** Menu columns, in display order. Headings link to the matching band on /procedures. */
const GROUPS = [
  {key: 'body', label: 'Body & Breast', anchor: 'body'},
  {key: 'face', label: 'Face & Eyes', anchor: 'face'},
  {key: 'skin', label: 'Skin & Reconstruction', anchor: 'skin'},
] as const

const FALLBACK_IMAGE = '/images/web/procedures-hero.png'

function telHref(phone?: string) {
  if (!phone) return 'tel:+441727221799'
  let d = phone.replace(/[^\d+]/g, '')
  if (d.charAt(0) === '0') d = '+44' + d.slice(1)
  return 'tel:' + d
}

export default function Header({
  settings,
  procedures,
  results = [],
}: {
  settings: Settings
  procedures: Procedure[]
  results?: Result[]
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [preview, setPreview] = useState<Procedure | null>(null)
  const [megaOpen, setMegaOpen] = useState(false)
  // The panel hangs off the bottom of a tall header, so there is dead space
  // between the trigger and the panel. A short close delay lets the cursor
  // cross it without the menu vanishing mid-move.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }
  const openMega = () => {
    cancelClose()
    setMegaOpen(true)
  }
  const closeMega = (delay = 380) => {
    cancelClose()
    closeTimer.current = setTimeout(() => {
      setMegaOpen(false)
      setPreview(null)
    }, delay)
  }
  useEffect(() => cancelClose, [])
  const phone = settings?.phone || '01727 221799'
  const tel = telHref(settings?.phone)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The menu scrolls itself, so hold the page still behind it.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const grouped = useMemo(() => {
    const by = (key: string) =>
      procedures.filter((p) => (p.category || 'other').toLowerCase() === key)
    // Anything in a category without its own column still needs a home.
    const known = new Set<string>(GROUPS.map((g) => g.key))
    const rest = procedures.filter((p) => !known.has((p.category || 'other').toLowerCase()))
    return GROUPS.map((g) => ({
      ...g,
      items: g.key === 'body' ? [...by('body'), ...rest] : by(g.key),
    })).filter((g) => g.items.length)
  }, [procedures])

  const featured = preview || grouped[0]?.items.find((p) => p.image) || grouped[0]?.items[0] || null
  const close = () => setOpen(false)

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="header">
        <nav className="nav nav-left" aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <span
            className={`nav-drop${grouped.length ? ' has-mega' : ''}${megaOpen ? ' open' : ''}`}
            onMouseEnter={openMega}
            onMouseLeave={() => closeMega()}
            onFocus={openMega}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) closeMega(0)
            }}
          >
            <Link href="/procedures">
              Procedures<span className="nav-caret" aria-hidden="true">▾</span>
            </Link>

            {grouped.length ? (
              <div className="mega">
                <div className="mega-inner">
                  {grouped.map((g) => (
                    <div className="mega-col" key={g.key}>
                      <Link className="mega-head" href={`/procedures/#${g.anchor}`} onClick={() => closeMega(0)}>
                        {g.label}
                      </Link>
                      <ul>
                        {g.items.map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={procedurePath(p.category, p.slug)}
                              onMouseEnter={() => setPreview(p)}
                              onFocus={() => setPreview(p)}
                              onClick={() => closeMega(0)}
                            >
                              {p.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className="mega-feature">
                    <img src={featured?.image || FALLBACK_IMAGE} alt="" aria-hidden="true" />
                    {featured ? (
                      <Link
                        className="mega-feature-cap"
                        href={procedurePath(featured.category, featured.slug)}
                        onClick={() => closeMega(0)}
                      >
                        <span className="mega-feature-title">{featured.title}</span>
                        <span className="mega-feature-cta">
                          View procedure <span className="arrow">→</span>
                        </span>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <span className="nav-menu">
                <Link href="/procedures">All procedures</Link>
              </span>
            )}
          </span>
          <span className="nav-drop">
            <Link href="/gallery">
              Before &amp; After
              {results.length ? (
                <span className="nav-caret" aria-hidden="true">
                  ▾
                </span>
              ) : null}
            </Link>
            {results.length ? (
              <span className="nav-menu">
                {results.map((r) => (
                  <Link key={r.slug} href={`/gallery/${r.slug}`}>
                    {r.title}
                  </Link>
                ))}
                <Link className="nav-menu-all" href="/gallery">
                  See every case
                </Link>
              </span>
            ) : null}
          </span>
          <Link href="/locations">Locations</Link>
        </nav>

        <Link className="brand" href="/" aria-label="RV Plastic Surgery home">
          <img className="brand-mark" src="/images/logo-white.svg" alt="RV Plastic Surgery" />
        </Link>

        <div className="nav-end">
          <nav className="nav nav-right" aria-label="Primary">
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <a className="header-phone" href={tel}>
            {phone}
          </a>
          <Link className="btn btn-pill btn-gold header-cta" href="/contact">
            <span className="cta-full">Request a Consultation</span>
            <span className="cta-mini">Consultation</span>
          </Link>
        </div>

        <a className="header-phone-icon" href={tel} aria-label={`Call ${phone}`}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>

        <button
          className="menu-toggle"
          id="menuToggle"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </header>

      <div className={`mobile-menu${open ? ' open' : ''}`} id="mobileMenu" aria-hidden={!open}>
        <nav>
          <Link href="/" onClick={close}>Home</Link>
          <Link href="/about" onClick={close}>About</Link>
          <Link href="/procedures" onClick={close}>Procedures</Link>
          {grouped.map((g) => (
            <details className="mm-group" key={g.key}>
              <summary className="mm-head">{g.label}</summary>
              <div className="mm-items">
                {g.items.map((p) => (
                  <Link key={p.slug} href={procedurePath(p.category, p.slug)} onClick={close}>
                    {p.title}
                  </Link>
                ))}
              </div>
            </details>
          ))}
          <Link href="/gallery" onClick={close}>Before &amp; After</Link>
          {results.length ? (
            <details className="mm-group">
              <summary className="mm-head">Results by procedure</summary>
              <div className="mm-items">
                {results.map((r) => (
                  <Link key={r.slug} href={`/gallery/${r.slug}`} onClick={close}>
                    {r.title}
                  </Link>
                ))}
              </div>
            </details>
          ) : null}
          <Link href="/locations" onClick={close}>Locations</Link>
          <Link href="/blog" onClick={close}>Blog</Link>
          <Link href="/contact" onClick={close}>Contact</Link>
        </nav>
        <Link className="btn btn-pill btn-gold" href="/contact" onClick={close}>
          Request a Consultation
        </Link>
      </div>
    </>
  )
}
