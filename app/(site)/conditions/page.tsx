import Link from 'next/link'
import type {Metadata} from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import {pageMetadata} from '@/lib/meta'
import {sanityFetch} from '@/sanity/lib/fetch'
import {conditionListQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'
import PortableTextBody, {toPlain} from '@/components/PortableTextBody'

type Row = {
  _id: string
  title: string
  slug: string
  eyebrow?: string
  heroImage?: {asset?: unknown}
  heroPromise?: unknown
}

// Made for this page rather than borrowed from the procedures hub. The
// subject sits right of centre and the left two thirds is open wall, which
// is where the veil darkens and the headline sits.
const DEF_HERO = '/images/web/conditions-hero.webp'

export const metadata: Metadata = pageMetadata({
  path: '/conditions/',
  title: 'Conditions We Treat | RV Plastic Surgery',
  description:
    'The concerns Mr Roshan Vijayan treats, and the surgery that addresses each one. ' +
    'Consultant-led care in Hertfordshire and London.',
})

export default async function ConditionsPage() {
  const conditions = await sanityFetch<Row[]>(conditionListQuery, {}, [])

  return (
    <>
      <section className="page-hero">
        <img src={DEF_HERO} alt="" aria-hidden="true" decoding="async" fetchPriority="high" />
        <div className="page-hero-veil" />
        <div className="page-hero-inner reveal">
          <span className="eyebrow">Conditions</span>
          <h1 className="display">What brought you here</h1>
          <p>
            A condition is the thing you notice, not the operation that treats it. Each page below
            explains what is happening, what can be done about it, and which procedure answers it.
          </p>
          <div className="page-hero-actions">
            <Link className="btn btn-pill btn-gold" href="/contact">
              Request a Consultation
            </Link>
            <Link className="btn btn-text light" href="/procedures">
              Browse procedures <span className="arrow">→</span>
            </Link>
          </div>
          <Breadcrumbs trail={[{name: 'Conditions', href: '/conditions'}]} />
        </div>
      </section>

      <section className="section">
        {conditions.length ? (
          <div className="feature-row-list">
            {conditions.map((c) => (
              <article className="cond-card reveal" key={c._id}>
                <Link className="cond-link" href={`/conditions/${c.slug}/`}>
                  <span className="cond-media">
                    <img
                      src={
                        c.heroImage?.asset
                          ? urlFor(c.heroImage as never).width(720).height(540).quality(78).url()
                          : DEF_HERO
                      }
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className="cond-copy">
                    {c.eyebrow ? <span className="eyebrow">{c.eyebrow}</span> : null}
                    <span className="cond-title display">{c.title}</span>
                    {toPlain(c.heroPromise) ? <span className="cond-sub">{toPlain(c.heroPromise)}</span> : null}
                    <span className="btn btn-text">
                      Read more <span className="arrow">→</span>
                    </span>
                  </span>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="narrow center reveal">
            <p>
              Condition pages are being written. In the meantime, the{' '}
              <Link href="/procedures">procedures</Link> explain what each operation addresses.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
