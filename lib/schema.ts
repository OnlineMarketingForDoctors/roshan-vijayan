import {SITE_URL, absoluteUrl} from '@/lib/site'

/**
 * The structured data the site publishes.
 *
 * One practice, described once here, referenced by @id from everything else, so
 * a search engine reads the pages as one organisation's site rather than as
 * unrelated documents. Everything is built from real page content — nothing is
 * asserted that a reader cannot also see.
 */

const ORG_ID = `${SITE_URL}/#practice`
const SITE_ID = `${SITE_URL}/#website`

type Settings = {
  practiceName?: string
  surgeonName?: string
  credentials?: string
  gmcNumber?: string
  phone?: string
  email?: string
  locations?: {name?: string; address?: string; note?: string}[]
} | null

/** The practice itself. On the homepage only, as the LocalBusiness. */
export function localBusinessLd(settings: Settings) {
  const name = settings?.practiceName || 'RV Plastic Surgery'
  const phone = settings?.phone || '01727 221799'
  const email = settings?.email || 'enquiries@vijayan.co.uk'
  const locations = settings?.locations?.length ? settings.locations : []

  return {
    '@context': 'https://schema.org',
    '@type': ['MedicalBusiness', 'LocalBusiness'],
    '@id': ORG_ID,
    name,
    url: SITE_URL,
    telephone: phone,
    email,
    image: absoluteUrl('/images/web/og-cover.jpg'),
    medicalSpecialty: 'PlasticSurgery',
    areaServed: 'Hertfordshire, United Kingdom',
    founder: {
      '@type': 'Physician',
      name: settings?.surgeonName || 'Mr Roshan Vijayan',
      ...(settings?.credentials ? {honorificSuffix: settings.credentials} : {}),
      ...(settings?.gmcNumber
        ? {
            identifier: {
              '@type': 'PropertyValue',
              name: 'GMC number',
              value: settings.gmcNumber,
            },
          }
        : {}),
      medicalSpecialty: 'PlasticSurgery',
    },
    // the consulting addresses, as they appear on /locations
    location: locations
      .filter((l) => l.name)
      .map((l) => ({
        '@type': 'Place',
        name: l.name,
        ...(l.address ? {address: {'@type': 'PostalAddress', streetAddress: l.address}} : {}),
      })),
  }
}

/** The site as a whole, alongside the homepage's business record. */
export function websiteLd(name = 'RV Plastic Surgery') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE_URL,
    name,
    publisher: {'@id': ORG_ID},
  }
}

/** An ordinary page: about, contact, locations, the gallery and so on. */
export function webPageLd({
  path,
  name,
  description,
}: {
  path: string
  name: string
  description?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl(path)}#page`,
    url: absoluteUrl(path),
    name,
    ...(description ? {description} : {}),
    isPartOf: {'@id': SITE_ID},
    publisher: {'@id': ORG_ID},
  }
}

/** A journal post. */
export function articleLd({
  path,
  title,
  description,
  image,
  published,
  section,
}: {
  path: string
  title: string
  description?: string
  image?: string
  published?: string
  section?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${absoluteUrl(path)}#article`,
    mainEntityOfPage: absoluteUrl(path),
    headline: title,
    ...(description ? {description} : {}),
    ...(image ? {image: [image]} : {}),
    ...(published ? {datePublished: published} : {}),
    ...(section ? {articleSection: section} : {}),
    author: {'@type': 'Person', name: 'Mr Roshan Vijayan'},
    publisher: {'@id': ORG_ID},
    isPartOf: {'@id': SITE_ID},
  }
}

/** A procedure page. */
export function medicalProcedureLd({
  path,
  name,
  description,
  image,
  surgical,
}: {
  path: string
  name: string
  description?: string
  image?: string
  surgical?: boolean
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    '@id': `${absoluteUrl(path)}#procedure`,
    name,
    url: absoluteUrl(path),
    ...(description ? {description} : {}),
    ...(image ? {image} : {}),
    procedureType: surgical === false ? 'NoninvasiveProcedure' : 'SurgicalProcedure',
    provider: {'@id': ORG_ID},
  }
}

/** The questions and answers on a page, where it has any. */
export function faqLd(faqs: {question?: string; answer?: string}[]) {
  const usable = faqs.filter((f) => f.question && f.answer)
  if (!usable.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: usable.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {'@type': 'Answer', text: f.answer},
    })),
  }
}

/** Renders one or more blocks, dropping anything that came out empty. */
export const jsonLd = (...blocks: unknown[]) =>
  JSON.stringify(blocks.filter(Boolean).length === 1 ? blocks.filter(Boolean)[0] : blocks.filter(Boolean))
