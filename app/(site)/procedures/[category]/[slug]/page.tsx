import Link from 'next/link'
import {notFound} from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import {medicalProcedureLd, faqLd} from '@/lib/schema'
import {pageMetadata} from '@/lib/meta'
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
  hero: '/images/web/bl-hero.webp',
  /** the same picture cropped for a phone; see narrowHero */
  heroNarrow: '/images/web/bl-hero-narrow.webp',
  overview: '/images/web/bl-overview.webp',
  benefits: '/images/web/decolletage.webp',
  candidates: '/images/web/bl-candidates.webp',
  techniques: '/images/web/bl-techniques-split.webp',
  procedure: '/images/web/consultation.webp',
}

function img(src: unknown, fallback: string, w: number, q = 82) {
  if (src && (src as {asset?: unknown}).asset) return urlFor(src as never).width(w).quality(q).url()
  return fallback
}

/* Every treatment photograph is composed the same way: the model stands at the
   right of the frame, with the room's empty wall on the left for the desktop
   overlay to sit on. A phone crops the sides off a centred window, which lands
   her head under the call and menu buttons — measured across all eighteen,
   between 68% and 86% of the frame, where the buttons start at 69%.

   So a phone gets a different region of the picture: the right 60% of its
   width and the top 83% of its height. Anchoring right is what centres her —
   scaling alone would not, since the right-most faces stay at 67% and still
   touch the buttons. Anchoring top is what keeps the crop off the top of her
   head. Together they put every face between 38% and 60% of the frame and
   leave the model half again as present on a small screen. What it costs is
   the bottom sixth, which is floor, and which the veil was fading out anyway.

   The region's own ratio is the phone hero's ratio, so nothing is cropped
   twice. Sanity's asset ref carries the pixel dimensions, so no extra query is
   needed to work out where to cut. */
const NARROW_W = 0.598
const NARROW_RATIO = 390 / 303 // the phone hero box, measured

function narrowHero(src: unknown): string | null {
  const ref = (src as {asset?: {_ref?: unknown}} | undefined)?.asset?._ref
  const dims = typeof ref === 'string' ? /-(\d+)x(\d+)-/.exec(ref) : null
  if (!dims) return null
  const W = Number(dims[1])
  const H = Number(dims[2])
  const w = Math.round(W * NARROW_W)
  const h = Math.min(H, Math.round(w / NARROW_RATIO))
  return urlFor(src as never).rect(W - w, 0, w, h).width(1000).quality(78).url()
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

/**
 * Section backgrounds, resolved against the sections that are actually on.
 *
 * Every band on this page is optional, so a tint written into the markup
 * leaves two identical backgrounds touching whenever the section between them
 * is switched off: a procedure with no before-and-after cases ran the intro
 * straight into the overview, and with nothing to separate them the two read
 * as one enormous empty gap. Journey and recovery collided the same way on
 * every page.
 *
 * The tints below are therefore an intention rather than an instruction. They
 * are walked in document order and any that would repeat the band above it
 * moves on to the next tint, so the page alternates whichever sections happen
 * to be showing. Sections with a treatment of their own — the photographic
 * band, the surgeon's portrait — break the run and reset it.
 */
const TINTS = ['', 'bg-ivory2', 'bg-cream']

const TINT_INTENT: [string, string][] = [
  ['intro', ''],
  ['results', 'bg-ivory2'],
  ['overview', ''],
  ['glance', 'bg-ivory2'],
  ['concerns', ''],
  ['benefits', 'bg-cream'],
  ['candidates', ''],
  ['techniques', 'bg-cream'],
  ['procedure', 'own'],
  ['journey', ''],
  ['recovery', ''],
  ['risks', 'bg-cream'],
  ['why', 'bg-ivory2'],
  ['surgeon', 'own'],
  ['cost', ''],
  ['faq', 'bg-ivory2'],
  ['related', ''],
]

function resolveTints(on: Record<string, boolean>): Record<string, string> {
  const out: Record<string, string> = {}
  let previous: string | null = null
  for (const [id, intent] of TINT_INTENT) {
    if (!on[id]) continue
    if (intent === 'own') {
      previous = 'own'
      continue
    }
    const tint: string =
      intent === previous ? TINTS[(TINTS.indexOf(intent) + 1) % TINTS.length] : intent
    out[id] = tint
    previous = tint
  }
  return out
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
  return pageMetadata({
    path: `/procedures/${category}/${slug}/`,
    title: p.seoTitle || `${p.title} in Hertfordshire | RV Plastic Surgery`,
    description: p.seoDescription || toPlain(p.heroPromise) || undefined,
    image: img(p.heroImage, '', 1200),
  })
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

  // which sections this procedure actually renders — read by the sub-nav and
  // by the background resolver, so the two can never disagree
  const on: Record<string, boolean> = {
    intro: show(p.showIntro) && !!p.introBody?.length,
    results: showResults,
    overview: show(p.showOverview),
    glance: show(p.showGlance) && !!p.atAGlance?.length,
    concerns: show(p.showConditions) && !!p.conditions?.length,
    benefits: show(p.showBenefits) && !!p.benefitsList?.length,
    candidates: show(p.showCandidates),
    techniques: show(p.showTechniques) && !!p.techniques?.length,
    procedure: show(p.showProcedure),
    journey: show(p.showJourney) && !!p.journey?.length,
    recovery: show(p.showRecovery) && !!p.recovery?.length,
    risks: show(p.showRisks) && !!p.risks?.length,
    why: show(p.showWhy) && !!p.whyPoints?.length,
    surgeon: show(p.showSurgeon),
    cost: show(p.showCost),
    faq: show(p.showFaqs) && !!p.faqs?.length,
    related: show(p.showRelated) && !!p.related?.length,
  }

  const tint = resolveTints(on)
  /** The class list for a numbered section, with the background it resolved to. */
  const band = (id: string) => `section${tint[id] ? ` ${tint[id]}` : ''} proc-anchor`

  const subnav = [
    {id: 'results', label: 'Before & After'},
    {id: 'overview', label: 'Overview'},
    {id: 'glance', label: 'At a Glance'},
    {id: 'concerns', label: 'Concerns'},
    {id: 'benefits', label: 'Benefits'},
    {id: 'candidates', label: 'Candidates'},
    {id: 'techniques', label: 'Techniques'},
    {id: 'procedure', label: 'Procedure'},
    {id: 'journey', label: 'Journey'},
    {id: 'recovery', label: 'Recovery'},
    {id: 'risks', label: 'Risks'},
    {id: 'surgeon', label: 'Surgeon'},
    {id: 'cost', label: 'Cost'},
    {id: 'faq', label: 'FAQs'},
  ].filter((s) => on[s.id])

  const path = `/procedures/${category}/${slug}/`
  const procedureLd = medicalProcedureLd({
    path,
    name: p.title,
    description: p.seoDescription || toPlain(p.heroPromise) || undefined,
    image: img(p.heroImage, absoluteUrl(DEF.hero), 1600),
  })
  const faqBlock = show(p.showFaqs)
    ? faqLd((p.faqs || []).map((f: any) => ({question: f.question, answer: toPlain(f.answer)})))
    : null

  return (
    <>
      {/* HERO */}
      <section className="proc-hero">
        <picture>
          <source media="(max-width: 640px)" srcSet={narrowHero(p.heroImage) || DEF.heroNarrow} />
          <img
            src={img(p.heroImage, DEF.hero, 2000, 78)}
            className={p.heroImageFlip ? 'mirrored' : undefined}
            alt={altOf(p.heroImage, '')}
            {...(altOf(p.heroImage, '') ? {} : {'aria-hidden': true as const})}
            decoding="async"
            fetchPriority="high"
          />
        </picture>
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
          <Breadcrumbs
            trail={[{name: 'Procedures', href: '/procedures'}, {name: p.title}]}
          />
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
          {subnav.map((s) => (
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
      {on.intro ? (
        <section className={`section center${tint.intro ? ` ${tint.intro}` : ''}`}>
          <div className="narrow reveal">
            {p.introHeading ? <h2 className="display">{p.introHeading}</h2> : null}
            <div className="prose intro-prose">
              <PortableTextBody value={p.introBody} />
            </div>
          </div>
        </section>
      ) : null}

      {/* BEFORE & AFTER */}
      {on.results ? (
        <section className={band('results')} id="results">
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
      {on.overview ? (
        <section className={band('overview')} id="overview">
          <div className="feature-row">
            <div className="feature-media reveal">
              <div className="fm-frame">
                <img src={img(p.overviewImage, DEF.overview, 900)} className={p.overviewImageFlip ? 'mirrored' : undefined} alt={altOf(p.overviewImage, p.title)} decoding="async" loading="lazy" />
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
      {on.glance ? (
        <section className={band('glance')} id="glance">
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
      {on.concerns ? (
        <section className={band('concerns')} id="concerns">
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
      {on.benefits ? (
        <section className={band('benefits')} id="benefits">
          <div className="feature-row">
            <div className="feature-media reveal">
              <div className="fm-frame">
                <img src={img(p.benefitsImage, DEF.benefits, 900)} className={p.benefitsImageFlip ? 'mirrored' : undefined} alt={altOf(p.benefitsImage, p.benefitsHeading || 'Benefits')} decoding="async" loading="lazy" />
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
      {on.candidates ? (
        <section className={band('candidates')} id="candidates">
          <div className="feature-row flip">
            <div className="feature-media reveal">
              <div className="fm-frame">
                <img src={img(p.candidatesImage, DEF.candidates, 900)} className={p.candidatesImageFlip ? 'mirrored' : undefined} alt={altOf(p.candidatesImage, 'Is it right for you?')} decoding="async" loading="lazy" />
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
      {on.techniques ? (
        <section className={band('techniques')} id="techniques">
          <div className="feature-row">
            <div className="feature-media reveal">
              <div className="fm-frame">
                <img className={`tech-illus${p.techniquesImageFlip ? ' mirrored' : ''}`} src={img(p.techniquesImage, DEF.techniques, 900, 88)} alt={altOf(p.techniquesImage, p.techniquesHeading || 'Techniques')} decoding="async" loading="lazy" />
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
      {on.procedure ? (
        <section className="proc-band proc-anchor" id="procedure">
          <img src={img(p.procedureImage, DEF.procedure, 1600, 78)} className={p.procedureImageFlip ? 'mirrored' : undefined} alt="" aria-hidden="true" decoding="async" loading="lazy" />
          <div className="pb-inner reveal">
            {p.procedureHeading ? <h2 className="display">{p.procedureHeading}</h2> : null}
            <div className="prose">
              <PortableTextBody value={p.procedureBody} />
            </div>
          </div>
        </section>
      ) : null}

      {/* TREATMENT JOURNEY */}
      {on.journey ? (
        <section className={band('journey')} id="journey">
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
      {on.recovery ? (
        <section className={band('recovery')} id="recovery">
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
      {on.risks ? (
        <section className={band('risks')} id="risks">
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
      {on.why ? (
        <section className={band('why')} id="why">
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
      {on.surgeon ? (
        <section className="philosophy proc-anchor" id="surgeon">
          <div className="blob blob-1" aria-hidden="true" />
          <div className="phil-portrait reveal">
            <img src="/images/web/doctor-suit.webp" alt="Mr Roshan Vijayan, Consultant Plastic Surgeon" decoding="async" loading="lazy" />
            <img className="phil-sign" src="/images/web/signature.webp" alt="Signature of Mr Roshan Vijayan" decoding="async" loading="lazy" />
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
      {on.cost ? (
        <section className={band('cost')} id="cost">
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
      {on.faq ? (
        <section className={band('faq')} id="faq">
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
      {on.related ? (
        <section className={band('related')} id="related">
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
        <img src="/images/web/clinic-interior.webp" alt="" aria-hidden="true" decoding="async" loading="lazy" />
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(procedureLd)}}
      />
      {faqBlock ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(faqBlock)}}
        />
      ) : null}
    </>
  )
}
