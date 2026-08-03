import Link from 'next/link'
import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {procedureListQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'

export const metadata: Metadata = {
  title: 'Procedures | RV Plastic Surgery',
  description:
    'Aesthetic and reconstructive procedures by Mr Roshan Vijayan, Consultant Plastic Surgeon in Hertfordshire.',
}

type Proc = {
  _id: string
  title: string
  slug: string
  category?: string
  heroPromise?: string
  overviewImage?: unknown
}

export default async function ProceduresPage() {
  const procedures = await sanityFetch<Proc[]>(procedureListQuery, {}, [])

  return (
    <>
      <section className="page-hero">
        <img src="/images/web/face-portrait.jpg" alt="Elegant, natural results" />
        <div className="page-hero-veil" />
        <div className="page-hero-inner reveal">
          <span className="eyebrow">Our Services</span>
          <h1 className="display">
            Procedures, considered
            <br />
            <em>individually.</em>
          </h1>
          <p>
            Every plan is studied and drawn up for you alone, with Mr Vijayan’s artistry, honesty and
            consultant-led care at its heart.
          </p>
        </div>
      </section>

      <section className="section">
        {procedures.length ? (
          <div className="related-grid reveal" style={{maxWidth: '1240px', margin: '0 auto'}}>
            {procedures.map((p) => (
              <Link className="related-card" href={`/procedures/${p.slug}`} key={p._id}>
                {p.overviewImage ? (
                  <img
                    src={urlFor(p.overviewImage as never).width(600).quality(80).url()}
                    alt={p.title}
                    style={{width: '100%', borderRadius: '8px', marginBottom: '1rem'}}
                  />
                ) : null}
                <h3>{p.title}</h3>
                {p.heroPromise ? <p>{p.heroPromise}</p> : null}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="section-head center reveal">
            <p>Procedure pages are being prepared. Please check back shortly.</p>
            <Link className="btn btn-pill btn-gold" href="/contact">
              Request a Consultation
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
