import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import PortableTextBody, {toPlain} from '@/components/PortableTextBody'
import {pageMetadata} from '@/lib/meta'
import {sanityFetch, sanityFetchRequired} from '@/sanity/lib/fetch'
import {client} from '@/sanity/lib/client'
import {conditionQuery, conditionSlugsQuery, conditionListQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'
import {procedurePath} from '@/lib/procedurePath'

type Params = {params: Promise<{slug: string}>}

const DEF_HERO = '/images/web/procedures-hero.webp'

const heroSrc = (img: unknown) =>
  (img as {asset?: unknown})?.asset ? urlFor(img as never).width(2000).quality(78).url() : DEF_HERO

export async function generateStaticParams() {
  try {
    const rows = await client.fetch<{slug: string}[]>(conditionSlugsQuery)
    return (rows || []).map((r) => ({slug: r.slug}))
  } catch {
    return []
  }
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {slug} = await params
  const c = await sanityFetchRequired<any>(conditionQuery, {slug})
  if (!c) return {}
  return pageMetadata({
    path: `/conditions/${slug}/`,
    title: c.seoTitle || `${c.title} | RV Plastic Surgery`,
    description: c.seoDescription || toPlain(c.heroPromise) || undefined,
    image: c.heroImage?.asset ? urlFor(c.heroImage as never).width(1200).quality(80).url() : undefined,
  })
}

export default async function ConditionPage({params}: Params) {
  const {slug} = await params
  const c = await sanityFetchRequired<any>(conditionQuery, {slug})
  if (!c) notFound()

  const others = (await sanityFetch<{_id: string; title: string; slug: string}[]>(
    conditionListQuery,
    {},
    [],
  )).filter((x) => x.slug !== slug)

  return (
    <>
      <section className="page-hero">
        <img src={heroSrc(c.heroImage)} alt="" aria-hidden="true" decoding="async" fetchPriority="high" />
        <div className="page-hero-veil" />
        <div className="page-hero-inner reveal">
          {c.eyebrow ? <span className="eyebrow">{c.eyebrow}</span> : null}
          <h1 className="display">{c.heroHeading || c.title}</h1>
          {c.heroPromise ? <PortableTextBody value={c.heroPromise} /> : null}
          <div className="page-hero-actions">
            <Link className="btn btn-pill btn-gold" href="/contact">
              Request a Consultation
            </Link>
          </div>
          <Breadcrumbs
            trail={[{name: 'Conditions', href: '/conditions'}, {name: c.title}]}
          />
        </div>
      </section>

      {c.body?.length ? (
        <section className="section">
          <div className="narrow prose reveal">
            <PortableTextBody value={c.body} />
          </div>
        </section>
      ) : null}

      {c.procedures?.length ? (
        <section className="section bg-ivory2">
          <div className="section-head center reveal">
            <h2 className="display">How it is treated</h2>
            <p>The procedures Mr Vijayan uses to address this, each explained in full.</p>
          </div>
          <div className="why-grid reveal">
            {c.procedures.map((p: any) => (
              <Link className="why-card" key={p.slug} href={procedurePath(p.category, p.slug)}>
                <h4>{p.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {others.length ? (
        <section className="section">
          <div className="section-head center reveal">
            <h2 className="display">Other conditions</h2>
          </div>
          <div className="why-grid reveal">
            {others.map((o) => (
              <Link className="why-card" key={o.slug} href={`/conditions/${o.slug}/`}>
                <h4>{o.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
