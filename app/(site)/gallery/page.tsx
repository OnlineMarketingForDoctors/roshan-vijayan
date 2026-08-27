import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import {webPageLd} from '@/lib/schema'
import {pageMetadata} from '@/lib/meta'
import type {Metadata} from 'next'
import BeforeAfterGallery from '@/components/BeforeAfterGallery'
import {sanityFetch} from '@/sanity/lib/fetch'
import {beforeAfterQuery} from '@/sanity/lib/queries'
import {buildBAProcedures, type SanityBACase} from '@/sanity/lib/ba'

export const metadata: Metadata = pageMetadata({
  path: '/gallery/',
  title: 'Before & After | RV Plastic Surgery',
  description:
    'Real before-and-after results from Mr Roshan Vijayan’s patients — natural, balanced and beautifully healed.',
})

export default async function GalleryPage() {
  const cases = await sanityFetch<SanityBACase[]>(beforeAfterQuery, {}, [])
  const procedures = buildBAProcedures(cases)

  return (
    <>
      <section className="page-hero">
        <img src="/images/web/decolletage.webp" alt="Soft editorial portrait" decoding="async" fetchPriority="high" />
        <div className="page-hero-veil" />
        <div className="page-hero-inner reveal">
          <span className="eyebrow">Before &amp; After</span>
          <h1 className="display">
            Results that
            <br />
            <em>speak softly.</em>
          </h1>
          <p>
            Real outcomes from real patients, natural, balanced and beautifully healed. Drag the handle
            on each case to reveal the journey, before and after.
          </p>
          <div className="page-hero-actions">
            <Link className="btn btn-pill btn-gold" href="/contact">
              Request a Consultation
            </Link>
            <Link className="btn btn-text light" href="/procedures">
              Explore procedures <span className="arrow">→</span>
            </Link>
          </div>
          <Breadcrumbs trail={[{name: 'Before & After', href: '/gallery'}]} />
        </div>
      </section>

      <section className="results">
        <BeforeAfterGallery procedures={procedures} />
      </section>

      <section className="section bg-cream center">
        <div className="narrow reveal">
          <span className="eyebrow">A Note on Privacy</span>
          <p className="lead">
            Every image is shared with the patient’s full, written consent. Many more cases can be
            viewed in confidence during your consultation.
          </p>
          <p className="body">
            Results vary from person to person, and the right outcome is the one that suits your body
            and your goals. Mr Vijayan will always give you a realistic, honest view of what surgery can
            achieve for you.
          </p>
        </div>
      </section>

      <section className="cta-band">
        <img src="/images/web/robe-window.webp" alt="" aria-hidden="true" decoding="async" loading="lazy" />
        <div className="cb-inner reveal">
          <span className="eyebrow">Begin</span>
          <h2 className="display">See more results in person</h2>
          <p>Book a consultation to view a wider portfolio relevant to your goals, in complete confidence.</p>
          <Link className="btn btn-pill btn-gold" href="/contact">
            Request a Consultation
          </Link>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageLd({
              path: '/gallery/',
              name: 'Before & After',
              description: metadata.description as string,
            }),
          ),
        }}
      />
    </>
  )
}
