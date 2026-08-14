import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/fetch'
import {reviewsQuery, siteSettingsQuery, beforeAfterQuery, homePageQuery} from '@/sanity/lib/queries'
import {FALLBACK_REVIEWS} from '@/sanity/lib/fallbacks'
import ReviewsCarousel, {type Review} from '@/components/ReviewsCarousel'
import BeforeAfter from '@/components/BeforeAfter'
import {buildBAProcedures, type SanityBACase} from '@/sanity/lib/ba'
import {mergeContent} from '@/sanity/lib/pages'
import {HOME_PAGE, type HomePageContent} from '@/lib/pageContent'
import PortableTextBody from '@/components/PortableTextBody'
import type {Metadata} from 'next'
import {absoluteUrl} from '@/lib/site'
import ServicesCarousel from '@/components/ServicesCarousel'
import ContactForm from '@/components/ContactForm'

type Settings = {reviewScore?: string; reviewCount?: number; reviewSource?: string} | null

async function getContent(): Promise<HomePageContent> {
  const cms = await sanityFetch<unknown>(homePageQuery, {}, null)
  return mergeContent(HOME_PAGE, cms)
}

export async function generateMetadata(): Promise<Metadata> {
  const {seo} = await getContent()
  return {
    alternates: {canonical: absoluteUrl('/')},
    title: seo.title,
    description: seo.description,
  }
}

export default async function Home() {
  const [reviews, settings, baCases, c] = await Promise.all([
    sanityFetch<Review[]>(reviewsQuery, {}, []),
    sanityFetch<Settings>(siteSettingsQuery, {}, null),
    sanityFetch<SanityBACase[]>(beforeAfterQuery, {}, []),
    getContent(),
  ])

  const reviewList = reviews.length ? reviews : FALLBACK_REVIEWS
  const baProcedures = buildBAProcedures(baCases)

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-media">
          <img src={c.heroImageUrl} alt={c.heroImageAlt} />
          <div className="hero-veil" />
        </div>
        <div className="hero-inner">
          <div className="hero-copy reveal">
            <span className="eyebrow">{c.heroEyebrow}</span>
            <h1 className="display">
              {c.heroHeadingTop}
              <br />
              <em>{c.heroHeadingEm}</em>
              <br />
              {c.heroHeadingBottom}
            </h1>
            <p className="hero-sub">{c.heroBody}</p>
            <div className="hero-actions">
              <Link className="btn btn-pill btn-gold" href="/contact">
                {c.heroCtaLabel}
              </Link>
              <Link className="btn btn-text" href="/procedures">
                {c.heroLinkLabel} <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
        <ul className="usp" aria-label="Why patients choose Mr Vijayan">
          {c.usps.map((u, i) => (
            <li key={i}><span className="usp-no">{String(i + 1).padStart(2, '0')}</span>{u}</li>
          ))}
        </ul>
      </section>

      {/* REVIEWS */}
      <ReviewsCarousel
        reviews={reviewList}
        reviewScore={settings?.reviewScore || '5.0'}
        reviewCount={settings?.reviewCount ?? 45}
        reviewSource={settings?.reviewSource || 'iWantGreatCare'}
      />

      {/* PHILOSOPHY */}
      <section className="philosophy" id="ethos">
        <div className="blob blob-1" aria-hidden="true" />
        <div className="phil-portrait reveal">
          <img src={c.philImageUrl} alt="Mr Roshan Vijayan, Consultant Plastic Surgeon" />
          <img className="phil-sign" src="/images/web/signature.png" alt="Signature of Mr Roshan Vijayan" />
        </div>
        <div className="phil-copy reveal">
          <span className="eyebrow">{c.philEyebrow}</span>
          <p className="lead-quote display">
            <em>{c.philQuote}</em>
          </p>
          <PortableTextBody value={c.philBody} />
          <Link className="btn btn-text" href="/about">
            {c.philLinkLabel} <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      {/* RESULTS */}
      <section className="results" id="gallery">
        <div className="results-head reveal">
          <span className="eyebrow">{c.resultsEyebrow}</span>
          <h2 className="display">
            {c.resultsHeadingTop} <em>{c.resultsHeadingEm}</em>
          </h2>
          <p>{c.resultsBody}</p>
        </div>
        <BeforeAfter procedures={baProcedures} />
      </section>

      {/* SERVICES */}
      <section className="services" id="procedures">
        <div className="svc-intro reveal">
          <span className="eyebrow">{c.servicesEyebrow}</span>
          <h2 className="display">
            {c.servicesHeadingTop}
            <br />
            <em>{c.servicesHeadingEm}</em>
          </h2>
          <p>{c.servicesBody}</p>
          <Link className="btn btn-text" href="/procedures">
            {c.servicesLinkLabel} <span className="arrow">→</span>
          </Link>
        </div>
        <ServicesCarousel />
      </section>

      {/* THE DIFFERENCE */}
      <section className="difference" id="difference">
        <div className="diff-media reveal">
          <img src={c.diffImageUrl} alt="Mr Roshan Vijayan, Consultant Plastic Surgeon" />
        </div>
        <div className="diff-copy">
          <span className="eyebrow">{c.diffEyebrow}</span>
          <h2 className="display">
            {c.diffHeadingA}<em>{c.diffHeadingEm1}</em>{c.diffHeadingB}<em>{c.diffHeadingEm2}</em>
          </h2>
          <ul className="diff-list">
            {c.diffItems.map((item, i) => (
              <li className="reveal" key={i}>
                <span>{item.title}</span>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
          <img className="sig diff-sign" src="/images/web/signature.png" alt="Signature of Mr Roshan Vijayan" />
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="blob blob-2" aria-hidden="true" />
        <div className="about-copy reveal">
          <span className="eyebrow">{c.aboutEyebrow}</span>
          <h2 className="display">
            {c.aboutHeadingTop}
            <br />
            <em>{c.aboutHeadingEm}</em>
          </h2>
          <PortableTextBody value={c.aboutBody} />
          <ul className="creds">
            {c.aboutCredentials.map((cred, i) => (
              <li key={i}>{cred}</li>
            ))}
          </ul>
          <p className="gmc">{c.aboutGmcLine}</p>
        </div>
        <div className="about-media reveal">
          <img src={c.aboutImageUrl} alt="Mr Vijayan in consultation with a patient" />
          <div className="about-stat">
            <strong>{c.aboutStatValue}</strong>
            <span>{c.aboutStatLabel}</span>
          </div>
        </div>
      </section>

      {/* ACCREDITATIONS */}
      <section className="accred">
        <p className="accred-label reveal">{c.accredMembershipsLabel}</p>
        <div className="logo-row memberships reveal">
          <img src="/images/logos/gmc.webp" alt="General Medical Council" />
          <img src="/images/logos/rcs.webp" alt="Royal College of Surgeons" />
          <img src="/images/logos/bapras.webp" alt="BAPRAS" />
          <img src="/images/logos/baaps.webp" alt="BAAPS" />
        </div>
        <p className="accred-label reveal">{c.accredInsurersLabel}</p>
        <div className="logo-row insurers reveal">
          <img src="/images/logos/bupa.webp" alt="Bupa" />
          <img src="/images/logos/axa.webp" alt="AXA Health" />
          <img src="/images/logos/aviva.webp" alt="Aviva" />
          <img src="/images/logos/vitality.webp" alt="Vitality" />
          <img src="/images/logos/wpa.webp" alt="WPA" />
          <img src="/images/logos/aetna.webp" alt="Aetna" />
        </div>
      </section>

      {/* JOURNEY */}
      <section className="journey">
        <header className="journey-head reveal">
          <span className="eyebrow">{c.journeyEyebrow}</span>
          <h2 className="display">{c.journeyHeading}</h2>
        </header>
        <ol className="steps">
          {c.journeySteps.map((step, i) => (
            <li className="reveal" key={i}>
              <span className="step-no">{String(i + 1).padStart(2, '0')}</span>
              <h4>{step.title}</h4>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* LOCATIONS */}
      <section className="locations" id="locations">
        <div className="loc-media reveal">
          <img src={c.locationsImageUrl} alt="A calm, luxurious clinic interior" />
        </div>
        <div className="loc-copy reveal">
          <span className="eyebrow">{c.locationsEyebrow}</span>
          <h2 className="display">
            {c.locationsHeadingTop}<em>{c.locationsHeadingEm}</em>
          </h2>
          <ul className="loc-list">
            {c.locationItems.map((l, i) => (
              <li key={i}>
                <h4>{l.label}</h4>
                <p>{l.value}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <div className="contact-inner">
          <div className="contact-copy reveal">
            <span className="eyebrow">{c.contactEyebrow}</span>
            <h2 className="display">
              {c.contactHeadingTop}
              <br />
              <em>{c.contactHeadingEm}</em>
            </h2>
            <p>{c.contactBody}</p>
            <ul className="contact-meta">
              {c.contactMeta.map((m, i) => (
                <li key={i}>
                  <span>{m.label}</span> {m.value}
                </li>
              ))}
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  )
}
