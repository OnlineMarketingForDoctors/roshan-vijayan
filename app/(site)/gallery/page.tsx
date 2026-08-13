import Link from 'next/link'
import type {Metadata} from 'next'
import BeforeAfterGallery from '@/components/BeforeAfterGallery'
import {BA_PROCEDURES} from '@/lib/baCases'

export const metadata: Metadata = {
  title: 'Before & After | RV Plastic Surgery',
  description:
    'Real before-and-after results from Mr Roshan Vijayan’s patients — natural, balanced and beautifully healed.',
}

export default function GalleryPage() {
  return (
    <>
      <section className="page-hero">
        <img src="/images/web/decolletage.jpg" alt="Soft editorial portrait" />
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
        </div>
      </section>

      <section className="results">
        <BeforeAfterGallery procedures={BA_PROCEDURES} />
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
        <img src="/images/web/robe-window.jpg" alt="" aria-hidden="true" />
        <div className="cb-inner reveal">
          <span className="eyebrow">Begin</span>
          <h2 className="display">See more results in person</h2>
          <p>Book a consultation to view a wider portfolio relevant to your goals, in complete confidence.</p>
          <Link className="btn btn-pill btn-gold" href="/contact">
            Request a Consultation
          </Link>
        </div>
      </section>
    </>
  )
}
