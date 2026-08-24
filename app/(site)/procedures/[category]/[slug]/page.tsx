import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import {absoluteUrl} from '@/lib/site'
import {sanityFetch} from '@/sanity/lib/fetch'
import {client} from '@/sanity/lib/client'
import {
  procedureQuery,
  procedureSlugsQuery,
  reviewsQuery,
  beforeAfterQuery,
  siteSettingsQuery,
} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'
import {FALLBACK_REVIEWS} from '@/sanity/lib/fallbacks'
import PortableTextBody, {toPlain} from '@/components/PortableTextBody'
import GlanceIcon from '@/components/GlanceIcon'
import ReviewsCarousel, {type Review} from '@/components/ReviewsCarousel'
import BeforeAfter from '@/components/BeforeAfter'
import {buildBAProcedures, baForProcedureFrom, type SanityBACase} from '@/sanity/lib/ba'
import {categorySegment, procedurePath} from '@/lib/procedurePath'

type Params = {params: Promise<{category: string; slug: string}>}

const show = (v: unknown) => v !== false

/**
 * Coerces a list entry to text. These fields hold plain strings, but a document
 * written against an older schema (risks used to be {title, description}) would
 * otherwise throw "Objects are not valid as a React child" and fail the build.
 */
const asText = (v: unknown): string => {
  if (typeof v === 'string') return v
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>
    return [o.title, o.name, o.stage, o.description]
      .filter((x): x is string => typeof x === 'string' && x.length > 0)
      .join(' — ')
  }
  return ''
}

// Section image fallbacks (used until an editor sets images in Sanity)
const DEF = {
  hero: '/images/web/bl-hero.jpg',
  overview: '/images/web/bl-overview.jpg',
  benefits: '/images/web/decolletage.jpg',
  candidates: '/images/web/bl-candidates.jpg',
  techniques: '/images/web/bl-techniques-split.png',
  procedure: '/images/web/consultation.jpg',
}

function img(src: unknown, fallback: string, w: number, q = 82) {
  if (src && (src as {asset?: unknown}).asset) return urlFor(src as never).width(w).quality(q).url()
  return fallback
}

/** Alt text set on the image in Sanity, falling back to the section's own words. */
const altOf = (src: unknown, fallback: string): string => {
  const a = (src as {alt?: unknown})?.alt
  return typeof a === 'string' && a.trim() ? a : fallback
}

const captionOf = (src: unknown): string | null => {
  const c = (src as {caption?: unknown})?.caption
  return typeof c === 'string' && c.trim() ? c : null
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<{slug: string; category?: string}[]>(procedureSlugsQuery)
    return (slugs || []).map((s) => ({category: categorySegment(s.category), slug: s.slug}))
  } catch {
    return []
  }
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {category, slug} = await params
  const p = await sanityFetch<any>(procedureQuery, {slug}, null)
  if (!p) return {}
  return {
    alternates: {canonical: absoluteUrl(`/procedures/${category}/${slug}/`)},
    title: p.seoTitle || `${p.title} in Hertfordshire | RV Plastic Surgery`,
    description: p.seoDescription || toPlain(p.heroPromise) || undefined,
  }
}

export default async function ProcedurePage({params}: Params) {
  const {category, slug} = await params
  const [p, reviews, settings, allBACases] = await Promise.all([
    sanityFetch<any>(procedureQuery, {slug}, null),
    sanityFetch<Review[]>(reviewsQuery, {}, []),
    sanityFetch<any>(siteSettingsQuery, {}, null),
    sanityFetch<SanityBACase[]>(beforeAfterQuery, {}, []),
  ])

  if (!p) notFound()
  // Keep one canonical URL per procedure: /procedures/<its category>/<slug>.
  if (categorySegment(p.category) !== category) notFound()

  const reviewList = reviews.length ? reviews : FALLBACK_REVIEWS
  // only this procedure's cases; procedures without any drop the section
  const baCases = baForProcedureFrom(buildBAProcedures(allBACases), slug)
  const showResults = show(p.showResults) && baCases.length > 0
  const lower = p.title.toLowerCase()

  const subnav: {id: string; label: string; on: boolean}[] = [
    {id: 'results', label: 'Before & After', on: showResults},
    {id: 'overview', label: 'Overview', on: show(p.showOverview)},
    {id: 'glance', label: 'At a Glance', on: show(p.showGlance) && !!p.atAGlance?.length},
    {id: 'concerns', label: 'Concerns', on: show(p.showConditions) && !!p.conditions?.length},
    {id: 'benefits', label: 'Benefits', on: show(p.showBenefits) && !!p.benefitsList?.length},
    {id: 'candidates', label: 'Candidates', on: show(p.showCandidates)},
    {id: 'techniques', label: 'Techniques', on: show(p.showTechniques) && !!p.techniques?.length},
    {id: 'procedure', label: 'Procedure', on: show(p.showProcedure)},
    {id: 'journey', label: 'Journey', on: show(p.showJourney) && !!p.journey?.length},
    {id: 'recovery', label: 'Recovery', on: show(p.showRecovery) && !!p.recovery?.length},
    {id: 'risks', label: 'Risks', on: show(p.showRisks) && !!p.risks?.length},
    {id: 'surgeon', label: 'Surgeon', on: show(p.showSurgeon)},
    {id: 'cost', label: 'Cost', on: show(p.showCost)},
    {id: 'faq', label: 'FAQs', on: show(p.showFaqs) && !!p.faqs?.length},
  ]

  const faqLd = p.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: p.faqs.map((f: any) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {'@type': 'Answer', text: toPlain(f.answer)},
        })),
      }
    : null

  return (
    <>
      {/* HERO */}
      <section className="proc-hero">
        <img
          src={img(p.heroImage, DEF.hero, 2000, 78)}
          className={p.heroImageFlip ? 'mirrored' : undefined}
          alt={altOf(p.heroImage, '')}
          {...(altOf(p.heroImage, '') ? {} : {'aria-hidden': true as const})}
        />
        <div className="proc-hero-veil" />
        <div className="proc-hero-inner reveal">
          <span className="eyebrow">{p.category} · Surgery</span>
          <h1 className="display">{p.heroHeading || p.title}</h1>
          <div className="proc-hero-sub">
            <PortableTextBody value={p.heroPromise} />
          </div>
          {p.heroBullets?.length ? (
            <ul className="proc-benefits">
              {p.heroBullets.map((b: unknown, i: number) => (
                <li key={i}>{asText(b)}</li>
              ))}
            </ul>
          ) : null}
          <div className="proc-hero-actions">
            <Link className="btn btn-pill btn-gold" href="/contact">
              Request a Consultation
            </Link>
            <a className="btn btn-text light" href="#overview">
              Learn more <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <ReviewsCarousel
        reviews={reviewList}
        reviewScore={settings?.reviewScore || '5.0'}
        reviewCount={settings?.reviewCount ?? 45}
        reviewSource={settings?.reviewSource || 'iWantGreatCare'}
      />

      {/* SUB-NAV */}
      <nav className="proc-subnav" aria-label="On this page">
        <div className="proc-subnav-inner">
          {subnav.filter((s) => s.on).map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* MEDICALLY REVIEWED BY */}
      {p.medicalReview ? (
        <section className="section" style={{paddingTop: '2.6rem', paddingBottom: 0}}>
          <div className="narrow med-review reveal">
            <PortableTextBody value={p.medicalReview} />
          </div>
        </section>
      ) : null}

      {/* INTRO */}
      {show(p.showIntro) && p.introBody?.length ? (
        <section className="section center">
          <div className="narrow reveal">
            {p.introHeading ? <h2 className="display">{p.introHeading}</h2> : null}
            <div className="prose intro-prose">
              <PortableTextBody value={p.introBody} />
            </div>
          </div>
        </section>
      ) : null}

      {/* BEFORE & AFTER */}
      {showResults ? (
        <section className="section bg-ivory2 proc-anchor" id="results">
          <div className="section-head center reveal">
            <h2 className="display">
              Real, natural <em>results.</em>
            </h2>
            <p>
              Outcomes from Mr Vijayan’s own patients, balanced, beautifully healed and entirely
              natural. Drag the handle on each case to reveal the journey.
            </p>
          </div>
          <BeforeAfter procedures={baCases} perTab={6} tabs={false} />
        </section>
      ) : null}

      {/* OVERVIEW */}
      {show(p.showOverview) ? (
        <section className="section proc-anchor" id="overview">
          <div className="feature-row">
            <div className="feature-media reveal">
              <div className="fm-frame">
                <img src={img(p.overviewImage, DEF.overview, 900)} className={p.overviewImageFlip ? 'mirrored' : undefined} alt={altOf(p.overviewImage, p.title)} />
                <span className="fm-tag">{p.title}</span>
              </div>
              {captionOf(p.overviewImage) ? <p className="fm-caption">{captionOf(p.overviewImage)}</p> : null}
            </div>
            <div className="feature-copy reveal">
              {p.overviewHeading ? <h2 className="display">{p.overviewHeading}</h2> : null}
              <div className="prose">
                <PortableTextBody value={p.overviewBody} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* AT A GLANCE */}
      {show(p.showGlance) && p.atAGlance?.length ? (
        <section className="section bg-ivory2 proc-anchor" id="glance">
          <div className="section-head center reveal">
            <h2 className="display">{p.glanceHeading || `${p.title} at a glance`}</h2>
            <p>
              A quick snapshot of what to expect. Every plan is individual, so Mr Vijayan confirms your
              own timings at your consultation.
            </p>
          </div>
          <div className="glance-grid reveal">
            {p.atAGlance.map((g: any, i: number) => (
              <div className="glance-item" key={i}>
                <GlanceIcon icon={g.icon} />
                <div>
                  <h4>{g.label}</h4>
                  <p>{g.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* WHAT IT ADDRESSES */}
      {show(p.showConditions) && p.conditions?.length ? (
        <section className="section proc-anchor" id="concerns">
          <div className="section-head center reveal">
            <h2 className="display">{p.conditionsHeading || 'What it can address'}</h2>
            <PortableTextBody value={p.conditionsIntro} />
          </div>
          <ul className="point-grid reveal">
            {p.conditions.map((c: unknown, i: number) => (
              <li key={i}>{asText(c)}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* BENEFITS */}
      {show(p.showBenefits) && p.benefitsList?.length ? (
        <section className="section bg-cream proc-anchor" id="benefits">
          <div className="feature-row">
            <div className="feature-media reveal">
              <div className="fm-frame">
                <img src={img(p.benefitsImage, DEF.benefits, 900)} className={p.benefitsImageFlip ? 'mirrored' : undefined} alt={altOf(p.benefitsImage, p.benefitsHeading || 'Benefits')} />
                <span className="fm-tag">Benefits</span>
              </div>
              {captionOf(p.benefitsImage) ? <p className="fm-caption">{captionOf(p.benefitsImage)}</p> : null}
            </div>
            <div className="feature-copy reveal">
              <h2 className="display">{p.benefitsHeading || 'Key benefits'}</h2>
              <PortableTextBody value={p.benefitsIntro} />
              <ul className="check-list">
                {p.benefitsList.map((b: unknown, i: number) => (
                  <li key={i}>{asText(b)}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {/* CANDIDATES */}
      {show(p.showCandidates) ? (
        <section className="section proc-anchor" id="candidates">
          <div className="feature-row flip">
            <div className="feature-media reveal">
              <div className="fm-frame">
                <img src={img(p.candidatesImage, DEF.candidates, 900)} className={p.candidatesImageFlip ? 'mirrored' : undefined} alt={altOf(p.candidatesImage, 'Is it right for you?')} />
                <span className="fm-tag">Is It Right for You?</span>
              </div>
              {captionOf(p.candidatesImage) ? <p className="fm-caption">{captionOf(p.candidatesImage)}</p> : null}
            </div>
            <div className="feature-copy reveal">
              <h2 className="display">{p.candidatesHeading || `Who may consider ${lower}?`}</h2>
              <PortableTextBody value={p.candidatesIntro} />
              {p.candidates?.length ? (
                <ul className="check-list">
                  {p.candidates.map((c: unknown, i: number) => (
                    <li key={i}>{asText(c)}</li>
                  ))}
                </ul>
              ) : null}
              <PortableTextBody value={p.candidatesOutro} />
            </div>
          </div>
        </section>
      ) : null}

      {/* TECHNIQUES / PROCEDURE TYPES */}
      {show(p.showTechniques) && p.techniques?.length ? (
        <section className="section bg-cream proc-anchor" id="techniques">
          <div className="feature-row">
            <div className="feature-media reveal">
              <div className="fm-frame">
                <img className={`tech-illus${p.techniquesImageFlip ? ' mirrored' : ''}`} src={img(p.techniquesImage, DEF.techniques, 900, 88)} alt={altOf(p.techniquesImage, p.techniquesHeading || 'Techniques')} />
              </div>
              {captionOf(p.techniquesImage) ? <p className="fm-caption">{captionOf(p.techniquesImage)}</p> : null}
            </div>
            <div className="feature-copy reveal">
              <h2 className="display">{p.techniquesHeading || 'Techniques'}</h2>
              <PortableTextBody value={p.techniquesIntro} />
              <ul className="tech-list">
                {p.techniques.map((t: any, i: number) => (
                  <li key={i}>
                    <h3>
                      {t.name}
                      {t.tier ? ` · ${t.tier}` : ''}
                    </h3>
                    {t.description ? <span><PortableTextBody value={t.description} /></span> : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {/* THE PROCEDURE */}
      {show(p.showProcedure) ? (
        <section className="proc-band proc-anchor" id="procedure">
          <img src={img(p.procedureImage, DEF.procedure, 1600, 78)} className={p.procedureImageFlip ? 'mirrored' : undefined} alt="" aria-hidden="true" />
          <div className="pb-inner reveal">
            {p.procedureHeading ? <h2 className="display">{p.procedureHeading}</h2> : null}
            <div className="prose">
              <PortableTextBody value={p.procedureBody} />
            </div>
          </div>
        </section>
      ) : null}

      {/* TREATMENT JOURNEY */}
      {show(p.showJourney) && p.journey?.length ? (
        <section className="section proc-anchor" id="journey">
          <div className="section-head center reveal">
            <h2 className="display">{p.journeyHeading || 'Your treatment journey'}</h2>
            <PortableTextBody value={p.journeyIntro} />
          </div>
          <ul className="tl reveal">
            {p.journey.map((r: any, i: number) => (
              <li key={i}>
                <h3>{r.stage}</h3>
                <PortableTextBody value={r.description} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* RECOVERY */}
      {show(p.showRecovery) && p.recovery?.length ? (
        <section className="section proc-anchor" id="recovery">
          <div className="section-head center reveal">
            <h2 className="display">
              {p.recoveryHeading || (
                <>
                  A steady, supported
                  <br />
                  recovery.
                </>
              )}
            </h2>
            <PortableTextBody value={p.recoveryIntro} />
          </div>
          <ul className="tl reveal">
            {p.recovery.map((r: any, i: number) => (
              <li key={i}>
                <h3>{r.stage}</h3>
                <PortableTextBody value={r.description} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* RISKS */}
      {show(p.showRisks) && p.risks?.length ? (
        <section className="section bg-cream proc-anchor" id="risks">
          <div className="section-head center reveal">
            <h2 className="display">{p.risksHeading || 'Risks and considerations'}</h2>
            <PortableTextBody value={p.risksIntro} />
          </div>
          <ul className="point-grid reveal">
            {p.risks.map((r: unknown, i: number) => (
              <li key={i}>{asText(r)}</li>
            ))}
          </ul>
          <p className="vs-note reveal">
            Your safety is paramount. Consultant-led aftercare, a day-one call and unlimited follow-up
            mean any concern is seen and addressed by Mr Vijayan personally.
          </p>
        </section>
      ) : null}

      {/* WHY CHOOSE US */}
      {show(p.showWhy) && p.whyPoints?.length ? (
        <section className="section bg-ivory2 proc-anchor" id="why">
          <div className="section-head center reveal">
            <h2 className="display">{p.whyHeading || 'Why choose us'}</h2>
            <PortableTextBody value={p.whyIntro} />
          </div>
          <div className="why-grid reveal">
            {p.whyPoints.map((point: unknown, i: number) => (
              <div className="why-card" key={i}>
                <GlanceIcon icon="check" className="wc-icon" />
                <h4>{asText(point)}</h4>
              </div>
            ))}
          </div>
          <div className="center" style={{marginTop: '2.6rem'}}>
            <Link className="btn btn-pill btn-gold" href="/contact">
              Request a Consultation
            </Link>
          </div>
        </section>
      ) : null}

      {/* SURGEON */}
      {show(p.showSurgeon) ? (
        <section className="philosophy proc-anchor" id="surgeon">
          <div className="blob blob-1" aria-hidden="true" />
          <div className="phil-portrait reveal">
            <img src="/images/web/doctor-suit.jpg" alt="Mr Roshan Vijayan, Consultant Plastic Surgeon" />
            <img className="phil-sign" src="/images/web/signature.png" alt="Signature of Mr Roshan Vijayan" />
          </div>
          <div className="phil-copy reveal">
            <h3 className="display phil-heading">{p.surgeonHeading || 'Meet your surgeon'}</h3>
            <div className="prose">
              <PortableTextBody value={p.surgeonBody} />
            </div>
            <Link className="btn btn-text" href="/about">
              More about Mr Vijayan <span className="arrow">→</span>
            </Link>
          </div>
        </section>
      ) : null}

      {/* COST */}
      {show(p.showCost) ? (
        <section className="section proc-anchor" id="cost">
          <div className="section-head center reveal">
            <h2 className="display">{p.costHeading || `${p.title} cost`}</h2>
            <PortableTextBody value={p.costIntro} />
          </div>
          <div className="cost-card reveal">
            <div className="cost-lead">
              <PortableTextBody value={p.costLead} />
            </div>
            {p.costFrom ? <div className="cost-figure">{p.costFrom}</div> : null}
            <p className="cost-sub">
              {p.costFrom ? 'Indicative guide. ' : ''}Your exact, all-inclusive quote is confirmed in
              writing after your consultation, with no hidden costs.
            </p>
            {p.costIncludes?.length ? (
              <>
                <p className="cost-incl-label">Your fee includes</p>
                <ul className="cost-incl">
                  {p.costIncludes.map((c: unknown, i: number) => (
                    <li key={i}>{asText(c)}</li>
                  ))}
                </ul>
              </>
            ) : null}
            <Link className="btn btn-pill btn-gold" href="/contact" style={{marginTop: '2rem'}}>
              Request your personalised quote
            </Link>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      {show(p.showFaqs) && p.faqs?.length ? (
        <section className="section bg-ivory2 proc-anchor" id="faq">
          <div className="section-head center reveal">
            <h2 className="display">{p.faqHeading || 'Common questions'}</h2>
          </div>
          <div className="faq-list reveal">
            {p.faqs.map((f: any, i: number) => (
              <details className="faq-item" key={i}>
                <summary>
                  <h3>{f.question}</h3>
                </summary>
                <PortableTextBody value={f.answer} />
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {/* RELATED */}
      {show(p.showRelated) && p.related?.length ? (
        <section className="section proc-anchor" id="related">
          <div className="section-head center reveal">
            <h2 className="display">Related procedures</h2>
          </div>
          <div className="related-grid reveal">
            {p.related.map((r: any) => (
              <Link className="related-card" href={procedurePath(r.category, r.slug)} key={r.slug}>
                <h3>{r.title}</h3>
                {toPlain(r.heroPromise) ? <p>{toPlain(r.heroPromise)}</p> : null}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="cta-band proc-anchor" id="enquire">
        <img src="/images/web/clinic-interior.jpg" alt="" aria-hidden="true" />
        <div className="cb-inner reveal">
          <span className="eyebrow">Begin</span>
          <h2 className="display">{p.ctaHeading || 'Have a conversation with Mr Vijayan'}</h2>
          {p.ctaBody ? (
            <PortableTextBody value={p.ctaBody} />
          ) : (
            <p>
              {`Enquiries are answered personally, usually within a day. There is no pressure, only an honest, expert opinion on whether ${lower} is right for you.`}
            </p>
          )}
          <Link className="btn btn-pill btn-gold" href="/contact">
            Request a Consultation
          </Link>
        </div>
      </section>

      {faqLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqLd)}} />
      ) : null}
    </>
  )
}
