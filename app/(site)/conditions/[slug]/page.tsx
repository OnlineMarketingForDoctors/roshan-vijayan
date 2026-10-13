import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import PortableTextBody, {toPlain} from '@/components/PortableTextBody'
import {pageMetadata} from '@/lib/meta'
import {faqLd} from '@/lib/schema'
import {sanityFetch, sanityFetchRequired} from '@/sanity/lib/fetch'
import {client} from '@/sanity/lib/client'
import {conditionQuery, conditionSlugsQuery, conditionListQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'
import GlanceIcon from '@/components/GlanceIcon'

type Params = {params: Promise<{slug: string}>}

const DEF_HERO = '/images/web/procedures-hero.webp'

const heroSrc = (img: unknown) =>
  (img as {asset?: unknown})?.asset ? urlFor(img as never).width(2000).quality(78).url() : DEF_HERO

/**
 * Splits the body into bands, one per H2, so the page alternates its ground
 * instead of running as a single column of text. Anything before the first
 * heading — the opening paragraphs — joins the first band rather than becoming
 * a band of its own, which keeps the second heading on the tinted ground.
 */
type Block = {_type?: string; style?: string}
type ImageBlock = Block & {asset?: unknown; alt?: string; caption?: string}

/** How many picture-carrying bands precede this one, so the sides alternate. */
function pictureIndex(all: Block[][], i: number): number {
  return all.slice(0, i).filter((b) => b.some((x) => x?._type === 'image')).length
}

function bands(body: unknown): Block[][] {
  if (!Array.isArray(body)) return []
  const out: Block[][] = []
  const lead: Block[] = []
  for (const block of body as Block[]) {
    const heading = block?._type === 'block' && block?.style === 'h2'
    if (heading) out.push(out.length ? [block] : [...lead, block])
    else if (out.length) out[out.length - 1].push(block)
    else lead.push(block)
  }
  // a body with no headings at all is still one band
  return out.length ? out : lead.length ? [lead] : []
}

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

      {c.medicalReview ? (
        <section className="section" style={{paddingTop: '2.6rem', paddingBottom: 0}}>
          <div className="narrow med-review reveal">
            <PortableTextBody value={c.medicalReview} />
          </div>
        </section>
      ) : null}

      {bands(c.body).map((band, i) => {
        // A band with a picture in it reads as a feature row — picture one
        // side, the section's words the other — rather than an image dropped
        // into the middle of a column. Sides alternate down the page.
        const picture = band.find((b) => b?._type === 'image') as ImageBlock | undefined
        const words = band.filter((b) => b !== picture)
        const flip = pictureIndex(bands(c.body), i) % 2 === 1
        return (
          <section className={`section${i % 2 ? ' bg-ivory2' : ''}`} key={i}>
            {picture?.asset ? (
              <div className={`feature-row${flip ? ' flip' : ''}`}>
                <div className="feature-media reveal">
                  <div className="fm-frame">
                    <img
                      src={urlFor(picture as never).width(900).quality(82).url()}
                      alt={picture.alt || ''}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  {picture.caption ? <p className="fm-caption">{picture.caption}</p> : null}
                </div>
                <div className="feature-copy reveal">
                  <div className="prose">
                    <PortableTextBody value={words} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="narrow prose reveal">
                <PortableTextBody value={band} />
              </div>
            )}
          </section>
        )
      })}

      {c.whyPoints?.length ? (
        <section className="section bg-cream" id="why">
          <div className="section-head center reveal">
            <h2 className="display">{c.whyHeading || 'Why choose Mr Roshan Vijayan'}</h2>
            <PortableTextBody value={c.whyIntro} />
          </div>
          <div className="why-grid reveal">
            {c.whyPoints.map((point: string, i: number) => (
              <div className="why-card" key={i}>
                <GlanceIcon icon="check" className="wc-icon" />
                <h4>{point}</h4>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {c.faqs?.length ? (
        <section className="section bg-ivory2" id="faq">
          <div className="section-head center reveal">
            <h2 className="display">{c.faqHeading || 'Frequently asked questions'}</h2>
          </div>
          <div className="faq-list reveal">
            {c.faqs.map((f: any, i: number) => (
              <details className="faq-item" key={i}>
                <summary>
                  <h3>{f.question}</h3>
                </summary>
                <PortableTextBody value={f.answer} />
              </details>
            ))}
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                faqLd(c.faqs.map((f: any) => ({question: f.question, answer: toPlain(f.answer)}))),
              ),
            }}
          />
        </section>
      ) : null}

      {c.ctaHeading || c.ctaBody ? (
        <section className="section center" id="book">
          <div className="narrow reveal">
            <h2 className="display">{c.ctaHeading || 'Book your consultation'}</h2>
            <PortableTextBody value={c.ctaBody} />
            <Link className="btn btn-pill btn-gold" href="/contact" style={{marginTop: '1.6rem'}}>
              Request a Consultation
            </Link>
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
