import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
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
import {buildBAGroups} from '@/sanity/lib/ba'
import PortableTextBody from '@/components/PortableTextBody'
import GlanceIcon from '@/components/GlanceIcon'
import ReviewsCarousel, {type Review} from '@/components/ReviewsCarousel'
import BeforeAfter from '@/components/BeforeAfter'

type Params = {params: Promise<{slug: string}>}

const show = (v: unknown) => v !== false

// Section image fallbacks (used until an editor sets images in Sanity)
const DEF = {
  overview: '/images/web/bl-overview.jpg',
  candidates: '/images/web/bl-candidates.jpg',
  techniques: '/images/web/bl-techniques-split.png',
  procedure: '/images/web/consultation.jpg',
}

function img(src: unknown, fallback: string, w: number, q = 82) {
  if (src && (src as {asset?: unknown}).asset) return urlFor(src as never).width(w).quality(q).url()
  return fallback
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<{slug: string}[]>(procedureSlugsQuery)
    return (slugs || []).map((s) => ({slug: s.slug}))
  } catch {
    return []
  }
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {slug} = await params
  const p = await sanityFetch<any>(procedureQuery, {slug}, null)
  if (!p) return {}
  return {
    title: p.seoTitle || `${p.title} in Hertfordshire | RV Plastic Surgery`,
    description: p.seoDescription || p.heroPromise || undefined,
  }
}

export default async function ProcedurePage({params}: Params) {
  const {slug} = await params
  const [p, reviews, baCases, settings] = await Promise.all([
    sanityFetch<any>(procedureQuery, {slug}, null),
    sanityFetch<Review[]>(reviewsQuery, {}, []),
    sanityFetch<unknown[]>(beforeAfterQuery, {}, []),
    sanityFetch<any>(siteSettingsQuery, {}, null),
  ])

  if (!p) notFound()

  const reviewList = reviews.length ? reviews : FALLBACK_REVIEWS
  const groups = buildBAGroups(baCases as never)

  const subnav: {id: string; label: string; on: boolean}[] = [
    {id: 'results', label: 'Before & After', on: show(p.showResults)},
    {id: 'overview', label: 'Overview', on: show(p.showOverview)},
    {id: 'glance', label: 'At a Glance', on: show(p.showGlance) && !!p.atAGlance?.length},
    {id: 'candidates', label: 'Candidates', on: show(p.showCandidates)},
    {id: 'techniques', label: 'Techniques', on: show(p.showTechniques)},
    {id: 'procedure', label: 'The Procedure', on: show(p.showProcedure)},
    {id: 'recovery', label: 'Recovery', on: show(p.showRecovery) && !!p.recovery?.length},
    {id: 'risks', label: 'Risks', on: show(p.showRisks)},
    {id: 'surgeon', label: 'Your Surgeon', on: show(p.showSurgeon)},
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
          acceptedAnswer: {'@type': 'Answer', text: f.answer},
        })),
      }
    : null

  return (
    <>
      {/* HERO */}
      <section className="proc-hero">
        <img src="/images/web/bl-hero.jpg" alt="Soft, warm editorial portrait" />
        <div className="proc-hero-veil" />
        <div className="proc-hero-inner reveal">
          <span className="eyebrow">{p.category} · Surgery</span>
          <h1 className="display">{p.title}</h1>
          {p.heroPromise ? <p className="proc-hero-sub">{p.heroPromise}</p> : null}
          {p.benefits?.length ? (
            <ul className="proc-benefits">
              {p.benefits.map((b: string, i: number) => (
                <li key={i}>{b}</li>
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

      {/* BEFORE & AFTER */}
      {show(p.showResults) ? (
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
          <BeforeAfter groups={groups} />
        </section>
      ) : null}

      {/* OVERVIEW */}
      {show(p.showOverview) ? (
        <section className="section proc-anchor" id="overview">
          <div className="feature-row">
            <div className="feature-media reveal">
              <img src={img(p.overviewImage, DEF.overview, 900)} alt={p.title} />
              <span className="fm-tag">{p.title}</span>
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
            <h2 className="display">{p.title} at a glance</h2>
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

      {/* CANDIDATES */}
      {show(p.showCandidates) ? (
        <section className="section proc-anchor" id="candidates">
          <div className="feature-row flip">
            <div className="feature-media reveal">
              <img src={img(p.candidatesImage, DEF.candidates, 900)} alt="Is it right for you?" />
              <span className="fm-tag">Is It Right for You?</span>
            </div>
            <div className="feature-copy reveal">
              <h2 className="display">Who may consider {p.title.toLowerCase()}?</h2>
              {p.candidatesIntro ? <p>{p.candidatesIntro}</p> : null}
              {p.candidates?.length ? (
                <ul className="check-list">
                  {p.candidates.map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              ) : null}
              {p.candidatesOutro ? <p>{p.candidatesOutro}</p> : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* TECHNIQUES */}
      {show(p.showTechniques) && p.techniques?.length ? (
        <section className="section bg-cream proc-anchor" id="techniques">
          <div className="feature-row">
            <div className="feature-media reveal">
              <img className="tech-illus" src={img(p.techniquesImage, DEF.techniques, 900, 88)} alt="Techniques" />
            </div>
            <div className="feature-copy reveal">
              <h2 className="display">Techniques</h2>
              {p.techniquesIntro ? <p>{p.techniquesIntro}</p> : null}
              <ul className="tech-list">
                {p.techniques.map((t: any, i: number) => (
                  <li key={i}>
                    <strong>
                      {t.name}
                      {t.tier ? ` · ${t.tier}` : ''}
                    </strong>
                    {t.description ? <span>{t.description}</span> : null}
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
          <img src={img(p.procedureImage, DEF.procedure, 1600, 78)} alt="" aria-hidden="true" />
          <div className="pb-inner reveal">
            {p.procedureHeading ? <h2 className="display">{p.procedureHeading}</h2> : null}
            <div className="prose">
              <PortableTextBody value={p.procedureBody} />
            </div>
          </div>
        </section>
      ) : null}

      {/* RECOVERY */}
      {show(p.showRecovery) && p.recovery?.length ? (
        <section className="section proc-anchor" id="recovery">
          <div className="section-head center reveal">
            <h2 className="display">
              A steady, supported
              <br />
              recovery.
            </h2>
          </div>
          <ul className="tl reveal">
            {p.recovery.map((r: any, i: number) => (
              <li key={i}>
                <h4>{r.stage}</h4>
                <p>{r.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* RISKS */}
      {show(p.showRisks) && p.risks?.length ? (
        <section className="section bg-cream proc-anchor" id="risks">
          <div className="section-head center reveal">
            <h2 className="display">Risks and considerations</h2>
            {p.risksIntro ? <p>{p.risksIntro}</p> : null}
          </div>
          <ul className="risk-grid reveal">
            {p.risks.map((r: any, i: number) => (
              <li key={i}>
                <strong>{r.title}</strong>
                {r.description}
              </li>
            ))}
          </ul>
          <p className="vs-note reveal">
            Your safety is paramount. Consultant-led aftercare, a day-one call and unlimited follow-up
            mean any concern is seen and addressed by Mr Vijayan personally.
          </p>
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
            <h2 className="display">Meet your surgeon</h2>
            {p.surgeonQuote ? (
              <p className="lead-quote display">
                <em>“{p.surgeonQuote}”</em>
              </p>
            ) : null}
            <p>
              Your {p.title.toLowerCase()} is carried out by Mr Roshan Vijayan, a Consultant Plastic
              Surgeon who trained across more than twenty teaching hospitals, among them the Queen
              Victoria in East Grinstead, one of the birthplaces of plastic surgery.
            </p>
            <p>
              He brings an artistic eye and reconstructive precision to <strong>breast and body
              surgery</strong>, planning each case individually and, for more complex procedures,
              operating alongside a second consultant surgeon for shorter, safer surgery. From your
              first call to your final review, your care stays personally with him.
            </p>
            <Link className="btn btn-text" href="/about">
              More about Mr Vijayan <span className="arrow">→</span>
            </Link>
          </div>
        </section>
      ) : null}

      {/* WHY CHOOSE US (static, applies to all) */}
      {show(p.showWhy) ? (
        <section className="section bg-ivory2 proc-anchor" id="why">
          <div className="section-head center reveal">
            <h2 className="display">Why choose us</h2>
            <p>Care that is genuinely personal, and surgery that is genuinely safer.</p>
          </div>
          <div className="why-grid reveal">
            {[
              ['Consultant-led aftercare', 'Mr Vijayan personally reviews you, answers emails within a day and calls on day one after surgery, never handed to others.'],
              ['A bespoke surgical plan', 'Your surgery is studied and drawn up individually, with a thorough written summary so you can reflect, unhurried, before deciding.'],
              ['A second consultation, included', 'Time to recap, ask anything that has surfaced and confirm, built into the process as standard.'],
              ['Honest, realistic guidance', 'A frank, expert view of what surgery can and cannot achieve, with no pressure, ever.'],
              ['Two-surgeon safety on complex cases', 'For more complex procedures, Mr Vijayan operates alongside a second consultant surgeon, for greater precision and an added layer of safety.'],
              ['Early, flexible availability', 'Consultations often within a week or two, with flexible scheduling for surgery itself, so you are never left waiting.'],
            ].map(([h, b]) => (
              <div className="why-card" key={h}>
                <GlanceIcon icon="check" className="wc-icon" />
                <h4>{h}</h4>
                <p>{b}</p>
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

      {/* COST */}
      {show(p.showCost) ? (
        <section className="section proc-anchor" id="cost">
          <div className="section-head center reveal">
            <h2 className="display">{p.title} cost</h2>
            {p.costIntro ? <p>{p.costIntro}</p> : null}
          </div>
          <div className="cost-card reveal">
            {p.costFrom ? <div className="cost-figure">{p.costFrom}</div> : null}
            <p className="cost-sub">
              Indicative guide. Your exact, all-inclusive quote is confirmed in writing after your
              consultation, with no hidden costs.
            </p>
            {p.costIncludes?.length ? (
              <>
                <p className="cost-incl-label">Your fee includes</p>
                <ul className="cost-incl">
                  {p.costIncludes.map((c: string, i: number) => (
                    <li key={i}>{c}</li>
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
            <h2 className="display">Common questions</h2>
          </div>
          <div className="faq-list reveal">
            {p.faqs.map((f: any, i: number) => (
              <details className="faq-item" key={i}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
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
              <Link className="related-card" href={`/procedures/${r.slug}`} key={r.slug}>
                <h3>{r.title}</h3>
                {r.heroPromise ? <p>{r.heroPromise}</p> : null}
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
          <h2 className="display">Have a conversation with Mr Vijayan</h2>
          <p>
            Enquiries are answered personally, usually within a day. There is no pressure, only an
            honest, expert opinion on whether {p.title.toLowerCase()} is right for you.
          </p>
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
