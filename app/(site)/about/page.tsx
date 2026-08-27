import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import {webPageLd} from '@/lib/schema'
import {pageMetadata} from '@/lib/meta'
import type {Metadata} from 'next'
import PortableTextBody from '@/components/PortableTextBody'
import {sanityFetch} from '@/sanity/lib/fetch'
import {aboutPageQuery} from '@/sanity/lib/queries'
import {mergeContent} from '@/sanity/lib/pages'
import {ABOUT_PAGE, type AboutPageContent} from '@/lib/pageContent'

async function getContent(): Promise<AboutPageContent> {
  const cms = await sanityFetch<unknown>(aboutPageQuery, {}, null)
  return mergeContent(ABOUT_PAGE, cms)
}

export async function generateMetadata(): Promise<Metadata> {
  const {seo} = await getContent()
  return pageMetadata({path: '/about/', title: seo.title, description: seo.description})
}

export default async function AboutPage() {
  const c = await getContent()

  return (
    <>
      <section className="page-hero">
        <img src={c.hero.imageUrl} alt={c.hero.imageAlt} decoding="async" fetchPriority="high" />
        <div className="page-hero-veil" />
        <div className="page-hero-inner reveal">
          <span className="eyebrow">{c.hero.eyebrow}</span>
          <h1 className="display">
            {c.hero.headingTop}
            <br />
            <em>{c.hero.headingEm}</em>
          </h1>
          <p>{c.hero.body}</p>
          <div className="page-hero-actions">
            <Link className="btn btn-pill btn-gold" href={c.hero.ctaHref || '/contact'}>
              {c.hero.ctaLabel}
            </Link>
            {c.hero.ctaSecondaryLabel ? (
              <Link className="btn btn-text light" href={c.hero.ctaSecondaryHref || '/procedures'}>
                {c.hero.ctaSecondaryLabel} <span className="arrow">→</span>
              </Link>
            ) : null}
          </div>
          <Breadcrumbs trail={[{name: 'About', href: '/about'}]} />
        </div>
      </section>

      <section className="section wm wm-david">
        <div className="feature-row">
          <div className="feature-media reveal">
            <img src={c.profileImageUrl} alt="Mr Roshan Vijayan, Consultant Plastic Surgeon" decoding="async" loading="lazy" />
            <img className="sig fm-sign" src="/images/web/signature.webp" alt="Signature of Mr Roshan Vijayan" decoding="async" loading="lazy" />
          </div>
          <div className="feature-copy reveal">
            <span className="eyebrow">{c.profileEyebrow}</span>
            <h2 className="display">
              {c.profileHeadingTop}
              <br />
              {c.profileHeadingBottom}
            </h2>
            <PortableTextBody value={c.profileBody} />
            <ul className="cred-chips">
              {c.credentials.map((cred, i) => (
                <li key={i}>{cred}</li>
              ))}
            </ul>
            <p className="gmc" style={{marginTop: '1.2rem', color: 'var(--gold-deep)', letterSpacing: '.04em'}}>
              {c.gmcLine}
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-cream center">
        <div className="narrow reveal">
          <span className="eyebrow">{c.ethosEyebrow}</span>
          <p className="lead">
            <em>{c.ethosQuote}</em>
          </p>
          <p className="body">{c.ethosBody}</p>
        </div>
      </section>

      <section className="section">
        <div className="stat-band reveal">
          {c.stats.map((s, i) => (
            <div className="stat" key={i}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="feature-row flip">
          <div className="feature-media reveal">
            <img src={c.interestImageUrl} alt="A poised woman by a window in soft morning light" decoding="async" loading="lazy" />
          </div>
          <div className="feature-copy reveal">
            <span className="eyebrow">{c.interestEyebrow}</span>
            <h2 className="display">
              {c.interestHeadingTop}
              <br />
              {c.interestHeadingBottom}
            </h2>
            <PortableTextBody value={c.interestBody} />
            <Link className="btn btn-text" href="/procedures">
              {c.interestLinkLabel} <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-ivory2 wm wm-venus">
        <div className="section-head center reveal">
          <span className="eyebrow">{c.differenceEyebrow}</span>
          <h2 className="display">{c.differenceHeading}</h2>
        </div>
        <ul className="tl reveal">
          {c.differenceItems.map((item, i) => (
            <li key={i}>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="cta-band">
        <img src={c.closing.imageUrl} alt="" aria-hidden="true" decoding="async" loading="lazy" />
        <div className="cb-inner reveal">
          <span className="eyebrow">{c.closing.eyebrow}</span>
          <h2 className="display">{c.closing.heading}</h2>
          <p>{c.closing.body}</p>
          <Link className="btn btn-pill btn-gold" href={c.closing.ctaHref || '/contact'}>
            {c.closing.ctaLabel}
          </Link>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(webPageLd({path: '/about/', name: c.seo.title, description: c.seo.description}))}}
      />
    </>
  )
}
