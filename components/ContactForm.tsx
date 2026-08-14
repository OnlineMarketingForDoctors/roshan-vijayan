'use client'

import {useState} from 'react'
import {LOCATIONS} from '@/lib/locations'

const PROCEDURES = [
  'Breast Reduction or Uplift',
  'Abdominoplasty',
  'Arm or Thigh Lift',
  'Body Contouring after Weight Loss',
  'Face or Eyelid Surgery',
  'Skin / Mole / Lesion',
  'Not sure yet',
]

// Private settings only: an enquiry cannot ask to be seen at the NHS base.
const CHOOSABLE = [...LOCATIONS.filter((l) => !l.nhs).map((l) => l.name), 'No preference']

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT

type State = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactForm({withLocation = false}: {withLocation?: boolean}) {
  const [state, setState] = useState<State>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget

    // Without an endpoint there is nowhere to send it. Say so rather than
    // clearing the form and implying it arrived.
    if (!ENDPOINT) {
      setState('error')
      return
    }

    setState('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {Accept: 'application/json'},
        body: new FormData(form),
      })
      if (!res.ok) throw new Error(`Form endpoint returned ${res.status}`)
      form.reset()
      setState('sent')
    } catch (err) {
      console.error('Enquiry failed to send:', (err as Error)?.message)
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <div className="contact-form reveal form-note" role="status">
        <h3>Thank you — your enquiry is on its way.</h3>
        <p>
          Mr Vijayan answers enquiries personally, usually within a day. If it is urgent, please
          call <a href="tel:+441727221799">01727 221799</a>.
        </p>
      </div>
    )
  }

  const sending = state === 'sending'

  return (
    <form className="contact-form reveal" onSubmit={handleSubmit} noValidate={false}>
      <div className="field">
        <label htmlFor="cf-name">Full name</label>
        <input id="cf-name" type="text" name="name" placeholder="Your name" required />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" type="email" name="email" placeholder="you@email.com" required />
        </div>
        <div className="field">
          <label htmlFor="cf-phone">Phone</label>
          <input id="cf-phone" type="tel" name="phone" placeholder="Mobile" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="cf-procedure">Procedure of interest</label>
        <select id="cf-procedure" name="procedure">
          {PROCEDURES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>
      {withLocation ? (
        <div className="field">
          <label htmlFor="cf-location">Preferred location</label>
          <select id="cf-location" name="location">
            {CHOOSABLE.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      ) : null}
      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" rows={3} placeholder="How can we help?" />
      </div>

      {state === 'error' ? (
        <p className="form-error" role="alert">
          Sorry — that didn’t send. Please call <a href="tel:+441727221799">01727 221799</a> or
          email <a href="mailto:enquiries@vijayan.co.uk">enquiries@vijayan.co.uk</a>.
        </p>
      ) : null}

      <button className="btn btn-pill btn-gold full" type="submit" disabled={sending}>
        {sending ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  )
}
