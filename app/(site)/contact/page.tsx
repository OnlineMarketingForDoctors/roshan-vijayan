import Link from 'next/link'
import type {Metadata} from 'next'
import {absoluteUrl} from '@/lib/site'
import ContactForm from '@/components/ContactForm'
import {sanityFetch} from '@/sanity/lib/fetch'
import {contactPageQuery} from '@/sanity/lib/queries'
import {mergeContent} from '@/sanity/lib/pages'
import {CONTACT_PAGE, type ContactPageContent} from '@/lib/pageContent'

async function getContent(): Promise<ContactPageContent> {
  const cms = await sanityFetch<unknown>(contactPageQuery, {}, null)
  return mergeContent(CONTACT_PAGE, cms)
}

export async function generateMetadata(): Promise<Metadata> {
  const {seo} = await getContent()
  return {
    alternates: {canonical: absoluteUrl('/contact/')},
    title: seo.title,
    description: seo.description,
  }
}

export default async function ContactPage() {
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
            {/* The form is already on this page, so send them to it rather than round the houses. */}
            <a className="btn btn-pill btn-gold" href={c.hero.ctaHref}>
              {c.hero.ctaLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="contact" id="enquiry">
        <div className="contact-inner">
          <div className="contact-copy reveal">
            <span className="eyebrow">{c.enquiryEyebrow}</span>
            <h2 className="display">
              {c.enquiryHeadingTop}
              <br />
              <em>{c.enquiryHeadingEm}</em>
            </h2>
            <p>{c.enquiryBody}</p>
            <ul className="contact-meta">
              {c.enquiryMeta.map((m, i) => (
                <li key={i}>
                  <span>{m.label}</span> {m.value}
                </li>
              ))}
            </ul>
          </div>
          <ContactForm withLocation />
        </div>
      </section>

      <section className="section bg-ivory2 center">
        <div className="section-head center reveal">
          <span className="eyebrow">{c.locationsEyebrow}</span>
          <h2 className="display">{c.locationsHeading}</h2>
          <p>{c.locationsBody}</p>
        </div>
        <div className="stat-band reveal">
          {c.locationsSummary.map((l, i) => (
            <div className="stat" key={i}>
              <strong style={{fontSize: '1.4rem'}}>{l.label}</strong>
              <span>{l.value}</span>
            </div>
          ))}
        </div>
        <p style={{marginTop: '2rem'}}>
          <Link className="btn btn-text" href="/locations">
            {c.locationsLinkLabel} <span className="arrow">→</span>
          </Link>
        </p>
      </section>
    </>
  )
}
