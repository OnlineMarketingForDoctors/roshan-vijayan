'use client'

import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'

const GTM_ID = 'GTM-M3VTZ7PH'
const KEY = 'rv-cookie-consent'
/** Ask again a year after a choice, which is the usual expectation. */
const REMEMBER_DAYS = 365

type Choice = 'granted' | 'denied'
type Stored = {choice: Choice; at: number}

/** The event a "Cookie settings" control anywhere on the site dispatches. */
export const COOKIE_SETTINGS_EVENT = 'rv:cookie-settings'
export const openCookieSettings = () =>
  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT))

/**
 * Reading and writing the choice. Every access is guarded: a private window, a
 * browser set to block site data, or a thumbnail renderer can all make
 * localStorage throw rather than merely return nothing, and a banner that
 * throws is a page that does not render.
 */
function read(): Choice | null {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Stored
    if (parsed.choice !== 'granted' && parsed.choice !== 'denied') return null
    if (Date.now() - parsed.at > REMEMBER_DAYS * 864e5) return null
    return parsed.choice
  } catch {
    return null
  }
}

function write(choice: Choice) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({choice, at: Date.now()} satisfies Stored))
  } catch {
    // A visitor who blocks storage cannot be remembered, so they will be asked
    // again next time. That is the correct outcome, not an error.
  }
}

/**
 * Consent Mode, spoken the way Google expects: gtag pushes its own `arguments`
 * object onto the data layer, and Tag Manager reads consent commands from
 * there. Pushed before gtm.js loads, so a tag never runs ahead of the answer.
 */
type ConsentState = {
  ad_storage: Choice
  ad_user_data: Choice
  ad_personalization: Choice
  analytics_storage: Choice
}

function gtag(..._args: [string, string, ConsentState]) {
  const w = window as unknown as {dataLayer?: unknown[]}
  w.dataLayer = w.dataLayer || []
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments)
}

const state = (choice: Choice): ConsentState => ({
  ad_storage: choice,
  ad_user_data: choice,
  ad_personalization: choice,
  analytics_storage: choice,
})

let defaultsSet = false
/** Everything starts denied. Said once, before anything else is pushed. */
function setDefaults() {
  if (defaultsSet) return
  defaultsSet = true
  gtag('consent', 'default', state('denied'))
}

function signal(choice: Choice) {
  setDefaults()
  gtag('consent', 'update', state(choice))
}

/**
 * Loads Google Tag Manager. Called only once someone has accepted, so nothing
 * measures anyone who has not agreed to be measured, and nothing at all is
 * requested from Google before then.
 */
function loadGtm() {
  if (document.getElementById('gtm-script')) return
  const w = window as unknown as {dataLayer?: unknown[]}
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'})
  const s = document.createElement('script')
  s.id = 'gtm-script'
  s.async = true
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(s)
}

/**
 * The cookie banner.
 *
 * Analytics are not loaded until someone accepts them. Refusing is one click,
 * in a button of the same size and weight as accepting — the point of asking
 * is spoiled if refusing is made harder than agreeing. The choice is kept in
 * this browser only, and can be changed from the footer at any time.
 */
export default function CookieConsent() {
  const [open, setOpen] = useState(false)
  const [choice, setChoice] = useState<Choice | null>(null)

  useEffect(() => {
    const decided = read()
    setChoice(decided)
    if (decided === 'granted') {
      signal('granted')
      loadGtm()
    } else {
      setOpen(decided === null)
    }

    const reopen = () => setOpen(true)
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen)
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen)
  }, [])

  const decide = useCallback((next: Choice) => {
    write(next)
    setChoice(next)
    signal(next)
    if (next === 'granted') loadGtm()
    setOpen(false)
    // Tags already loaded cannot be unloaded. Someone withdrawing consent in
    // the same visit gets a clean page rather than a page still being measured.
    if (next === 'denied' && document.getElementById('gtm-script')) window.location.reload()
  }, [])

  if (!open) return null

  return (
    <div className="cc" role="region" aria-label="Cookies">
      <div className="cc-inner">
        <div className="cc-copy">
          <p className="cc-title">Cookies on this site</p>
          <p>
            We would like to use Google Analytics to see which pages are useful, so the site can be
            improved. It sets cookies on your device, and we will not do it unless you agree.
            Nothing here needs them to work.{' '}
            <Link href="/cookies-policy" onClick={() => setOpen(false)}>
              Read our Cookies Policy
            </Link>
            .
          </p>
        </div>
        <div className="cc-actions">
          <button type="button" className="btn btn-pill btn-gold" onClick={() => decide('granted')}>
            Accept
          </button>
          <button type="button" className="btn btn-pill btn-ghost" onClick={() => decide('denied')}>
            Reject
          </button>
        </div>
      </div>
      {choice ? (
        <p className="cc-current">
          You previously chose to {choice === 'granted' ? 'accept' : 'reject'} analytics cookies.
        </p>
      ) : null}
    </div>
  )
}
