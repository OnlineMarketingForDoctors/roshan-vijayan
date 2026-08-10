'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {procedurePath} from '@/lib/procedurePath'

type Procedure = {slug: string; title: string; category?: string}
type Settings = {phone?: string} | null

function telHref(phone?: string) {
  if (!phone) return 'tel:+441727221799'
  let d = phone.replace(/[^\d+]/g, '')
  if (d.charAt(0) === '0') d = '+44' + d.slice(1)
  return 'tel:' + d
}

export default function Header({settings, procedures}: {settings: Settings; procedures: Procedure[]}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const phone = settings?.phone || '01727 221799'
  const tel = telHref(settings?.phone)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="header">
        <nav className="nav nav-left" aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <span className="nav-drop">
            <Link href="/procedures">
              Procedures<span className="nav-caret" aria-hidden="true">▾</span>
            </Link>
            <span className="nav-menu">
              {procedures.length ? (
                procedures.map((p) => (
                  <Link key={p.slug} href={procedurePath(p.category, p.slug)}>
                    {p.title}
                  </Link>
                ))
              ) : (
                <Link href="/procedures">All procedures</Link>
              )}
            </span>
          </span>
          <Link href="/gallery">Before &amp; After</Link>
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
          {procedures.map((p) => (
            <Link key={p.slug} href={procedurePath(p.category, p.slug)} onClick={close}>
              {p.title}
            </Link>
          ))}
          <Link href="/gallery" onClick={close}>Before &amp; After</Link>
          <Link href="/locations" onClick={close}>Locations</Link>
          <Link href="/blog" onClick={close}>Blog</Link>
          <Link href="/contact" onClick={close}>Contact</Link>
        </nav>
        <Link className="btn btn-pill" href="/contact" onClick={close}>
          Request a Consultation
        </Link>
      </div>
    </>
  )
}
