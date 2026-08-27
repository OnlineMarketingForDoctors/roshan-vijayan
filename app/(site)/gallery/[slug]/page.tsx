import Link from 'next/link'
import {notFound} from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import {webPageLd} from '@/lib/schema'
import {pageMetadata} from '@/lib/meta'
import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {client} from '@/sanity/lib/client'
import {beforeAfterQuery, procedureSlugsQuery} from '@/sanity/lib/queries'
import {buildBAProcedures, type SanityBACase} from '@/sanity/lib/ba'
import {procedurePath} from '@/lib/procedurePath'
import BASlider from '@/components/BASlider'

type Params = {params: Promise<{slug: string}>}

/**
 * One before & after procedure, at /gallery/<treatment>.
 *
 * The cases come from the same Sanity documents the main gallery reads, grouped
 * by treatment, so publishing a case in Studio puts it on the right page with
 * nothing else to edit. The page exists so each treatment has a URL of its own
 * to link and to rank, rather than living behind a tab.
 */
async function procedures() {
  return buildBAProcedures(await sanityFetch<SanityBACase[]>(beforeAfterQuery, {}, []))
}

export async function generateStaticParams() {
  try {
    const list = buildBAProcedures(await client.fetch<SanityBACase[]>(beforeAfterQuery))
    return list.map((p) => ({slug: p.slug}))
  } catch {
    return []
  }
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {slug} = await params
  const p = (await procedures()).find((x) => x.slug === slug)
  if (!p) return {}
  return pageMetadata({
    path: `/gallery/${slug}/`,
    title: `${p.title} Before & After | RV Plastic Surgery`,
    description:
      `${p.title} before and after photographs from Mr Roshan Vijayan’s own patients, ` +
      'shared with written consent. Drag the handle on each image to reveal the result.',
  })
}

export default async function BAProcedurePage({params}: Params) {
  const {slug} = await params
  const all = await procedures()
  const p = all.find((x) => x.slug === slug)
  if (!p) notFound()

  // the procedure pages these cases belong to, for the link back into the site
  const procSlugs = await sanityFetch<{slug: string; category?: string}[]>(
    procedureSlugsQuery,
    {},
    [],
  )
  const linked = p.procedureSlugs
    .map((s) => procSlugs.find((x) => x.slug === s))
    .filter((x): x is {slug: string; category?: string} => Boolean(x))

  const others = all.filter((x) => x.slug !== p.slug)
  const one = p.patients.length === 1

  return (
    <>
      <section className="page-head">
        <span className="eyebrow">Before &amp; After</span>
        <h1 className="display">{p.title}</h1>
        <p>
          {one
            ? 'A result from Mr Vijayan’s own patients. Drag the handle on the image to reveal it.'
            : 'Results from Mr Vijayan’s own patients. Drag the handle on each image to reveal it.'}
        </p>
        <Breadcrumbs trail={[{name: 'Before & After', href: '/gallery'}, {name: p.title}]} />
      </section>

      <section className="section">
        <div className={`bag-grid ba-page-grid${one ? ' bag-grid-one' : ''}`}>
          {p.patients.map((c, i) => (
            <BASlider key={`${p.slug}-${i}`} c={c} />
          ))}
        </div>

        {linked.length ? (
          <p className="ba-page-link reveal">
            {linked.length === 1 ? 'Read about the procedure: ' : 'Read about these procedures: '}
            {linked.map((l, i) => (
              <span key={l.slug}>
                {i > 0 ? ' · ' : ''}
                <Link href={procedurePath(l.category, l.slug)}>
                  {all.find((x) => x.procedureSlugs.includes(l.slug))?.title || l.slug}
                </Link>
              </span>
            ))}
          </p>
        ) : null}
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
            and your goals. Mr Vijayan will always give you a realistic, honest view of what surgery
            can achieve for you.
          </p>
        </div>
      </section>

      {others.length ? (
        <section className="section">
          <div className="section-head center reveal">
            <h2 className="display">Other results</h2>
          </div>
          <nav className="ba-page-others reveal" aria-label="Other before and after procedures">
            {others.map((o) => (
              <Link key={o.slug} href={`/gallery/${o.slug}`}>
                {o.title}
              </Link>
            ))}
            <Link className="is-all" href="/gallery">
              See every case
            </Link>
          </nav>
        </section>
      ) : null}

      <section className="cta-band">
        <img src="/images/web/robe-window.webp" alt="" aria-hidden="true" decoding="async" loading="lazy" />
        <div className="cb-inner reveal">
          <span className="eyebrow">Begin</span>
          <h2 className="display">See more results in person</h2>
          <p>
            Book a consultation to view a wider portfolio relevant to your goals, in complete
            confidence.
          </p>
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
              path: `/gallery/${p.slug}/`,
              name: `${p.title} Before & After`,
              description: `${p.title} before and after photographs from Mr Roshan Vijayan’s own patients, shared with written consent.`,
            }),
          ),
        }}
      />
    </>
  )
}
