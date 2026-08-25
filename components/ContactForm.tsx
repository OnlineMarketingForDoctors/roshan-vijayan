'use client'

import {useEffect, useState} from 'react'

const FORM_ID = 'nJQrEBBPxEMKYWcU0pOR'
const SRC = `https://api.leadconnectorhq.com/widget/form/${FORM_ID}`
const EMBED_SCRIPT = 'https://link.msgsndr.com/js/form_embed.js'

/** The height the form is authored at, held until it reports its own. */
const AUTHORED_HEIGHT = 682

/**
 * The enquiry form, embedded from LeadConnector.
 *
 * An iframe cannot size itself, so the height comes from the form: it posts its
 * rendered height to the page. LeadConnector's own embed script does this and
 * is loaded here; the messages are also read directly, because that script
 * measures the forms present when it first runs and this one mounts
 * client-side on two different pages.
 *
 * The iframe is created only once the listener is attached. Rendering it
 * immediately loses the race — the form can post its height before this
 * component is listening, and the frame then sits at its authored height for
 * good. The wrapper reserves the space either way, so nothing shifts.
 *
 * `withLocation` is kept so the two call sites read as they did; which fields
 * are asked for is now set in LeadConnector rather than here.
 */
export default function ContactForm({withLocation = false}: {withLocation?: boolean}) {
  void withLocation
  const [height, setHeight] = useState(AUTHORED_HEIGHT)
  const [listening, setListening] = useState(false)

  useEffect(() => {
    if (!document.querySelector(`script[src="${EMBED_SCRIPT}"]`)) {
      const s = document.createElement('script')
      s.src = EMBED_SCRIPT
      s.async = true
      document.body.appendChild(s)
    }

    // The payload shape has varied between versions of the embed, so anything
    // from the form's own origin carrying a plausible height is taken and
    // everything else ignored.
    const onMessage = (e: MessageEvent) => {
      let host = ''
      try {
        host = new URL(e.origin).hostname
      } catch {
        // an opaque origin must not throw and take the listener down with it
        return
      }
      if (!/(^|\.)(leadconnectorhq\.com|msgsndr\.com)$/.test(host)) return

      const d = e.data as Record<string, unknown> | null
      const raw = d && typeof d === 'object' ? (d.height ?? d.scrollHeight) : undefined
      const h = typeof raw === 'string' ? parseInt(raw, 10) : typeof raw === 'number' ? raw : NaN
      if (Number.isFinite(h) && h > 120) setHeight(Math.ceil(h))
    }

    window.addEventListener('message', onMessage)
    setListening(true)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <div className="form-embed" style={{minHeight: height}}>
      {listening ? (
        <iframe
          src={SRC}
          id={`inline-${FORM_ID}`}
          title="Contact Form"
          style={{width: '100%', height, border: 'none', borderRadius: 0, display: 'block'}}
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="Contact Form"
          data-height={AUTHORED_HEIGHT}
          data-layout-iframe-id={`inline-${FORM_ID}`}
          data-form-id={FORM_ID}
        />
      ) : null}
    </div>
  )
}
