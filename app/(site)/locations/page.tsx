import Link from 'next/link'
import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {locationsPageQuery} from '@/sanity/lib/queries'
import {mergeContent} from '@/sanity/lib/pages'
import {LOCATIONS_PAGE, type LocationsPageContent} from '@/lib/pageContent'

async function getContent(): Promise<LocationsPageContent> {
  const cms = await sanityFetch<unknown>(locationsPageQuery, {}, null)
  return mergeContent(LOCATIONS_PAGE, cms)
}

export async function generateMetadata(): Promise<Metadata> {
  const {seo} = await getContent()
  return {title: seo.title, description: seo.description}
}

export default async function LocationsPage() {
  const c = await getContent()

  return (
    <>
      <section className="page-hero">
        <img src={c.hero.imageUrl} alt={c.hero.imageAlt} />
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
          </div>
        </div>
      </section>

      <section className="section">
        <div className="loc-cards">
          {c.cards.map((card) => (
            <article className="loc-card reveal" key={card.name}>
              <div className="loc-img">
                <img src={card.imageUrl} alt={card.name} />
              </div>
              <div className="loc-info">
                <span className="loc-tag">{card.tag}</span>
                <h3>{card.name}</h3>
                <p className="loc-addr">{card.address}</p>
                <p className="loc-addr">{card.description}</p>
                {card.mapUrl ? (
                  <div className="loc-link">
                    <a className="btn btn-text" href={card.mapUrl} target="_blank" rel="noopener">
                      Get directions <span className="arrow">→</span>
                    </a>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <img src={c.closing.imageUrl} alt="" aria-hidden="true" />
        <div className="cb-inner reveal">
          <span className="eyebrow">{c.closing.eyebrow}</span>
          <h2 className="display">{c.closing.heading}</h2>
          <p>{c.closing.body}</p>
          <Link className="btn btn-pill btn-gold" href={c.closing.ctaHref || '/contact'}>
            {c.closing.ctaLabel}
          </Link>
        </div>
      </section>
    </>
  )
}
