import Link from 'next/link'
import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {siteSettingsQuery} from '@/sanity/lib/queries'

/**
 * Where the enquiry form sends people after it is submitted.
 *
 * Kept out of the search index and out of both sitemaps: it has no standing of
 * its own, and a "thank you" page in the results is a page someone can land on
 * without having enquired. The redirect itself is set on the form in
 * LeadConnector, not here.
 */
export const metadata: Metadata = {
  title: 'Thank you | RV Plastic Surgery',
  description: 'Your enquiry has been received.',
  robots: {index: false, follow: false, nocache: true},
}

type Settings = {phone?: string; email?: string} | null

export default async function ThankYouPage() {
  const settings = await sanityFetch<Settings>(siteSettingsQuery, {}, null)
  const phone = settings?.phone || '01727 221799'
  const email = settings?.email || 'enquiries@vijayan.co.uk'

  return (
    <>
      <section className="page-head">
        <span className="eyebrow">Thank you</span>
        <h1 className="display">Your enquiry is with us.</h1>
        <p>
          Mr Vijayan’s team will be in touch personally, usually within one working day. If your
          enquiry is urgent, please call <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>.
        </p>
      </section>

      <section className="section center">
        <div className="narrow reveal">
          <p className="lead">
            You are welcome to keep reading in the meantime — the journal covers recovery,
            preparation and what each procedure actually involves.
          </p>
          <p className="body">
            You can also reach us at <a href={`mailto:${email}`}>{email}</a>.
          </p>
          <div className="page-hero-actions" style={{justifyContent: 'center', marginTop: '2rem'}}>
            <Link className="btn btn-pill btn-gold" href="/procedures">
              Explore procedures
            </Link>
            <Link className="btn btn-text" href="/blog">
              Read the journal <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
