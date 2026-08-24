import Link from 'next/link'
import type {Metadata} from 'next'
import {absoluteUrl} from '@/lib/site'
import {sanityFetch} from '@/sanity/lib/fetch'
import {locationsPageQuery} from '@/sanity/lib/queries'
import {mergeContent} from '@/sanity/lib/pages'
import {LOCATIONS_PAGE, type LocationsPageContent} from '@/lib/pageContent'
import {LOCATIONS} from '@/lib/locations'

async function getContent(): Promise<LocationsPageContent> {
  const cms = await sanityFetch<unknown>(locationsPageQuery, {}, null)
  const merged = mergeContent(LOCATIONS_PAGE, cms)

  // A CMS list replaces the repository list outright, so a card saved in Studio
  // without a picture arrives with no image at all. Match it back to the
  // repository copy by name rather than render a card with an empty frame.
  return {
    ...merged,
    cards: merged.cards.map((card) => ({
      ...card,
      imageUrl: card.imageUrl || LOCATIONS.find((l) => l.name === card.name)?.imageUrl || '',
    })),
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const {seo} = await getContent()
  return {
    alternates: {canonical: absoluteUrl('/locations/')},
    title: seo.title,
    description: seo.description,
  }
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
                {card.imageUrl ? <img src={card.imageUrl} alt={card.name} /> : null}
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
