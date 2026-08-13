/**
 * The copy currently set in the page templates, kept as the fallback for the
 * CMS-driven pages and as the source the import script seeds Sanity from.
 *
 * Every field a page reads has an entry here, so an empty or unreachable CMS
 * renders exactly what the page rendered before it was migrated. Images stay
 * as repository paths: the CMS fields are optional, and a page falls back to
 * these when no image has been set.
 */

export type PageHero = {
  eyebrow?: string
  headingTop?: string
  headingEm?: string
  body?: string
  imageUrl?: string
  imageAlt?: string
  ctaLabel?: string
  ctaHref?: string
}

export type CtaBand = {
  eyebrow?: string
  heading?: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  imageUrl?: string
}

export type LabelledItem = {label?: string; value?: string}

export type LocationCard = {
  name: string
  tag?: string
  address?: string
  description?: string
  mapUrl?: string
  imageUrl?: string
}

export type ContactPageContent = {
  seo: {title: string; description: string}
  hero: PageHero
  enquiryEyebrow: string
  enquiryHeadingTop: string
  enquiryHeadingEm: string
  enquiryBody: string
  enquiryMeta: LabelledItem[]
  locationsEyebrow: string
  locationsHeading: string
  locationsBody: string
  locationsSummary: LabelledItem[]
  locationsLinkLabel: string
}

export type LocationsPageContent = {
  seo: {title: string; description: string}
  hero: PageHero
  cards: LocationCard[]
  closing: CtaBand
}

export const CONTACT_PAGE: ContactPageContent = {
  seo: {
    title: 'Request a Consultation | RV Plastic Surgery',
    description:
      'Request a consultation with Mr Roshan Vijayan, Consultant Plastic Surgeon in Hertfordshire. Enquiries answered personally, usually within a day.',
  },
  hero: {
    eyebrow: 'Begin',
    headingTop: 'Request a',
    headingEm: 'consultation.',
    body: 'Tell Mr Vijayan a little about what you’d like to achieve. Enquiries are answered personally, usually within a day, with no pressure, only an honest, expert opinion.',
    imageUrl: '/images/web/consultation.jpg',
    imageAlt: 'An unhurried consultation',
    ctaLabel: 'Request a Consultation',
    ctaHref: '#enquiry',
  },
  enquiryEyebrow: 'Get in Touch',
  enquiryHeadingTop: 'A conversation,',
  enquiryHeadingEm: 'to begin with.',
  enquiryBody:
    'Every first consultation is 20–30 unhurried minutes, time to listen, assess and explore your goals before anything is decided.',
  enquiryMeta: [
    {label: 'Call', value: '01727 221799'},
    {label: 'Email', value: 'enquiries@vijayan.co.uk'},
    {label: 'Practice', value: 'Hatfield, Hemel Hempstead, St Albans and Stevenage'},
    {label: 'Hours', value: 'Mon–Fri, 9am–5pm'},
  ],
  locationsEyebrow: 'Where to Find Us',
  locationsHeading: 'Four Hertfordshire settings',
  locationsBody: 'Choose whichever is most convenient, we’ll do the rest.',
  locationsSummary: [
    {label: 'One Hatfield', value: '3 Hatfield Avenue, Hatfield, AL10 9UA'},
    {label: 'One Stop Healthcare', value: 'Boundary Way, Hemel Hempstead, HP2 7YU'},
    {label: 'London Skin Clinic', value: '152 London Road, St Albans, AL1 1PQ'},
    {label: 'Lister Hospital', value: 'Coreys Mill Lane, Stevenage, SG1 4AB · NHS'},
  ],
  locationsLinkLabel: 'View all locations',
}

export const LOCATIONS_PAGE: LocationsPageContent = {
  seo: {
    title: 'Locations | RV Plastic Surgery',
    description:
      'Mr Roshan Vijayan consults across four trusted private and NHS settings in Hertfordshire.',
  },
  hero: {
    eyebrow: 'Locations',
    headingTop: 'Consulting across',
    headingEm: 'Hertfordshire.',
    body: 'Mr Vijayan sees patients at four trusted private and NHS settings, each calm, modern and easy to reach, with consultations often available within a week or two.',
    imageUrl: '/images/web/clinic-interior.jpg',
    imageAlt: 'A calm, luxurious clinic interior',
    ctaLabel: 'Request a Consultation',
    ctaHref: '/contact',
  },
  cards: [
    {
      name: 'One Hatfield Hospital',
      tag: 'Private · Main Practice',
      address: '3 Hatfield Avenue, Hatfield, AL10 9UA',
      description:
        'A modern private hospital and the home of Mr Vijayan’s main practice, Leonie Grace Ltd, with on-site theatres, imaging and overnight care.',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=One+Hatfield+Hospital+AL10+9UA',
      imageUrl: '/images/web/loc-hatfield.png',
    },
    {
      name: 'One Stop Healthcare',
      tag: 'Private',
      address: 'One Medical House, Boundary Way, Hemel Hempstead, HP2 7YU',
      description:
        'A contemporary private outpatient and diagnostic centre, ideal for consultations and minor procedures in west Hertfordshire.',
      mapUrl:
        'https://www.google.com/maps/search/?api=1&query=One+Stop+Healthcare+Hemel+Hempstead+HP2+7YU',
      imageUrl: '/images/web/loc-osd.png',
    },
    {
      name: 'London Skin Clinic',
      tag: 'Private · Skin',
      address: '152 London Road, St Albans, AL1 1PQ',
      description:
        'An elegant St Albans clinic for skin assessments, mole and lesion checks and minor skin surgery in a discreet setting.',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=152+London+Road+St+Albans+AL1+1PQ',
      imageUrl: '/images/web/loc-london.png',
    },
    {
      name: 'Lister Hospital',
      tag: 'NHS',
      address: 'Coreys Mill Lane, Stevenage, SG1 4AB',
      description:
        'Mr Vijayan’s NHS base, where he serves as a consultant plastic surgeon within the East and North Hertfordshire NHS Trust.',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lister+Hospital+Stevenage+SG1+4AB',
      imageUrl: '/images/web/consultation.jpg',
    },
  ],
  closing: {
    eyebrow: 'Begin',
    heading: 'Find a time that suits you',
    body: 'Tell us where is most convenient and we’ll arrange your consultation, often within a week or two.',
    ctaLabel: 'Request a Consultation',
    ctaHref: '/contact',
    imageUrl: '/images/web/clinic-interior.jpg',
  },
}
