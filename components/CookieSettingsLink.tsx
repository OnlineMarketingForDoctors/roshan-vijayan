'use client'

import {openCookieSettings} from '@/components/CookieConsent'

/**
 * Reopens the cookie banner. Consent has to be as easy to withdraw as it was
 * to give, which means a way back to the question from every page.
 */
export default function CookieSettingsLink() {
  return (
    <button type="button" className="foot-legal-btn" onClick={openCookieSettings}>
      Cookie settings
    </button>
  )
}
