/**
 * Where Mr Vijayan consults, written once.
 *
 * The same four settings were listed in four places — the footer, the contact
 * page summary, the homepage strip and the locations page cards — and they had
 * already drifted: the footer omitted Lister Hospital entirely, and the contact
 * page shortened two of the names and one of the addresses while the other
 * pages spelled them out. Each of those lists is now derived from this one, so
 * correcting an address here corrects it everywhere.
 *
 * The CMS still owns what the pages render: these are the fallbacks the pages
 * use when a field is empty, and what the import script seeds Sanity from.
 */

export type Location = {
  name: string
  /** The setting, as shown on the locations page card. */
  tag: string
  address: string
  description: string
  mapUrl: string
  imageUrl: string
  /** NHS bases are marked in the one-line lists, where there is no tag. */
  nhs?: boolean
}

export const LOCATIONS: Location[] = [
  {
    name: 'One Hatfield Hospital',
    tag: 'Private · Main Practice',
    address: '3 Hatfield Avenue, Hatfield, AL10 9UA',
    description:
      'A modern private hospital and the home of Mr Vijayan’s main practice, Leonie Grace Ltd, with on-site theatres, imaging and overnight care.',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=One+Hatfield+Hospital+AL10+9UA',
    imageUrl: '/images/web/loc-hatfield.webp',
  },
  {
    name: 'One Stop Healthcare',
    tag: 'Private',
    address: 'One Medical House, Boundary Way, Hemel Hempstead, HP2 7YU',
    description:
      'A contemporary private outpatient and diagnostic centre, ideal for consultations and minor procedures in west Hertfordshire.',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=One+Stop+Healthcare+Hemel+Hempstead+HP2+7YU',
    imageUrl: '/images/web/loc-osd.webp',
  },
  {
    name: 'London Skin Clinic',
    tag: 'Private · Skin',
    address: '152 London Road, St Albans, AL1 1PQ',
    description:
      'An elegant St Albans clinic for skin assessments, mole and lesion checks and minor skin surgery in a discreet setting.',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=152+London+Road+St+Albans+AL1+1PQ',
    imageUrl: '/images/web/loc-london.webp',
  },
  {
    name: 'Lister Hospital',
    tag: 'NHS',
    address: 'Coreys Mill Lane, Stevenage, SG1 4AB',
    description:
      'Mr Vijayan’s NHS base, where he serves as a consultant plastic surgeon within the East and North Hertfordshire NHS Trust.',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lister+Hospital+Stevenage+SG1+4AB',
    imageUrl: '/images/web/consultation.webp',
    nhs: true,
  },
]

/** Name and address on one line each, for the contact page and homepage. */
export const locationLines = (): {label: string; value: string}[] =>
  LOCATIONS.map((l) => ({label: l.name, value: l.nhs ? `${l.address} · NHS` : l.address}))

/** Name and address only, for the footer. */
export const locationSummaries = (): {name: string; address: string}[] =>
  LOCATIONS.map((l) => ({name: l.name, address: l.address}))
