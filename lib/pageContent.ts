/**
 * The copy currently set in the page templates, kept as the fallback for the
 * CMS-driven pages and as the source the import script seeds Sanity from.
 *
 * Every field a page reads has an entry here, so an empty or unreachable CMS
 * renders exactly what the page rendered before it was migrated. Images stay
 * as repository paths: the CMS fields are optional, and a page falls back to
 * these when no image has been set.
 */

import {LOCATIONS, locationLines} from './locations'

export type PageHero = {
  eyebrow?: string
  headingTop?: string
  headingEm?: string
  body?: string
  imageUrl?: string
  /** The same scene, extended upward, for the stacked hero on a phone. */
  imageUrlNarrow?: string
  imageAlt?: string
  ctaLabel?: string
  ctaHref?: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
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
    imageUrl: '/images/web/consultation.webp',
    imageUrlNarrow: '/images/web/consultation-tall.webp',
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
  locationsSummary: locationLines(),
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
    imageUrl: '/images/web/clinic-interior.webp',
    imageUrlNarrow: '/images/web/clinic-interior-tall.webp',
    imageAlt: 'A calm, luxurious clinic interior',
    ctaLabel: 'Request a Consultation',
    ctaHref: '/contact',
  },
  // the nhs flag only marks the one-line lists; the card shows the tag instead
  cards: LOCATIONS.map(({nhs, ...card}) => card),
  closing: {
    eyebrow: 'Begin',
    heading: 'Find a time that suits you',
    body: 'Tell us where is most convenient and we’ll arrange your consultation, often within a week or two.',
    ctaLabel: 'Request a Consultation',
    ctaHref: '/contact',
    imageUrl: '/images/web/clinic-interior.webp',
  },
}

/* ---- portable text helpers ---------------------------------------------
   The rich-text fields are stored as Sanity blocks so an editor keeps bold
   inside a paragraph. These build the same structure for the fallback.      */

type Span = {_type: 'span'; _key: string; text: string; marks: string[]}
export type Block = {_type: 'block'; _key: string; style: 'normal'; markDefs: never[]; children: Span[]}

let blockSeq = 0
const span = (text: string, marks: string[] = []): Span => ({
  _type: 'span',
  _key: `s${blockSeq++}`,
  text,
  marks,
})
const block = (children: Span[]): Block => ({
  _type: 'block',
  _key: `b${blockSeq++}`,
  style: 'normal',
  markDefs: [],
  children,
})
export const para = (text: string): Block => block([span(text)])
/** a paragraph with one bold run in the middle */
export const paraStrong = (before: string, bold: string, after: string): Block =>
  block([span(before), span(bold, ['strong']), span(after)])

export type TitledItem = {title?: string; body?: string}
export type StatItem = {value?: string; label?: string}

export type AboutPageContent = {
  seo: {title: string; description: string}
  hero: PageHero
  profileEyebrow: string
  profileHeadingTop: string
  profileHeadingBottom: string
  profileBody: Block[]
  credentials: string[]
  gmcLine: string
  profileImageUrl: string
  ethosEyebrow: string
  ethosQuote: string
  ethosBody: string
  stats: StatItem[]
  interestEyebrow: string
  interestHeadingTop: string
  interestHeadingBottom: string
  interestBody: Block[]
  interestLinkLabel: string
  interestImageUrl: string
  differenceEyebrow: string
  differenceHeading: string
  differenceItems: TitledItem[]
  closing: CtaBand
}

export const ABOUT_PAGE: AboutPageContent = {
  seo: {
    title: 'About Mr Roshan Vijayan | RV Plastic Surgery',
    description:
      'Mr Roshan Vijayan, Consultant Plastic Surgeon in Hertfordshire — where artistry meets medicine. Eighteen years in medicine, consultant-led, natural results.',
  },
  hero: {
    eyebrow: 'About Mr Vijayan',
    headingTop: 'Where artistry',
    headingEm: 'meets medicine.',
    body: 'A consultant plastic surgeon who treats every operation as a partnership, is honest about what is involved, and devoted to a result that looks entirely, naturally you.',
    imageUrl: '/images/web/about-hero.webp',
    imageUrlNarrow: '/images/web/about-hero-tall.webp',
    imageAlt: 'Mr Roshan Vijayan, Consultant Plastic Surgeon',
    ctaLabel: 'Request a Consultation',
    ctaHref: '/contact',
    ctaSecondaryLabel: 'Explore procedures',
    ctaSecondaryHref: '/procedures',
  },
  profileEyebrow: 'Eighteen Years a Doctor',
  profileHeadingTop: 'An artist’s eye, a',
  profileHeadingBottom: 'doctor’s honesty.',
  profileBody: [
    para(
      'Qualified as a doctor in 2008, Mr Vijayan has spent eighteen years in medicine, trained extensively across London’s teaching hospitals, and is now in his fifth year as an NHS consultant plastic surgeon.',
    ),
    para(
      'Alongside his private practice he holds a wide NHS practice consisting of skin-cancer removal and reconstruction, body contouring, hand surgery and complex reconstructive work. He has published extensively, presented internationally, and continues to train and mentor surgeons.',
    ),
  ],
  credentials: ['BSc (Hons), 2006', 'MBBS, 2008', 'FRCS (Plast)', 'Executive MBA', 'PgCert Clinical Education'],
  gmcLine: 'GMC Reg. No. 7020524',
  profileImageUrl: '/images/web/doctor-suit.webp',
  ethosEyebrow: 'Precision · Care · Integrity',
  ethosQuote:
    '“I believe in surgery as a partnership, a shared journey, with honesty about what is involved and a result that looks entirely, naturally you.”',
  ethosBody:
    'For Mr Vijayan, plastic surgery sits where artistry meets medicine. A creative person at heart, he is drawn to studying a problem holistically, taking time, and crafting a result that is balanced and proportioned. He is, first and foremost, a doctor, frank about what is safe, advisable and truly in your best interests.',
  stats: [
    {value: '18', label: 'years in medicine'},
    {value: '14', label: 'years a surgeon'},
    {value: '5th yr', label: 'as an NHS consultant'},
    {value: '1,000s', label: 'of operations performed'},
  ],
  interestEyebrow: 'A Particular Interest',
  interestHeadingTop: 'Restoring the body',
  interestHeadingBottom: 'after change.',
  interestBody: [
    paraStrong(
      'Mr Vijayan’s special interest is ',
      'body restoration after pregnancy and significant weight loss',
      ', refining loose, redundant skin to reveal the physique beneath, and restoring the confidence to live fully again.',
    ),
    para(
      'Every plan is studied and drawn up individually, followed by a thorough written summary so you can reflect, unhurried, before deciding anything.',
    ),
  ],
  interestLinkLabel: 'Explore procedures',
  interestImageUrl: '/images/web/robe-window.webp',
  differenceEyebrow: 'The Vijayan Difference',
  differenceHeading: 'Care that is genuinely personal',
  differenceItems: [
    {
      title: 'Early, flexible availability',
      body: 'Consultations often within a week or two, with flexible scheduling for surgery itself.',
    },
    {
      title: 'Highly bespoke plans',
      body: 'Each plan is studied and drawn up individually, with a thorough written summary after your consultation.',
    },
    {
      title: 'Two-surgeon safety on complex cases',
      body: 'For more complex procedures, Mr Vijayan frequently has a senior surgeon assist him, for greater precision, less time under anaesthetic and an added layer of safety.',
    },
    {
      title: 'Consultant-led aftercare',
      body: 'Mr Vijayan personally reviews you, answers emails within a day, and calls on day one after surgery, never handed to others.',
    },
    {
      title: 'A second consultation, included',
      body: 'Time to recap, ask anything that has surfaced, and confirm, built into the process as standard.',
    },
  ],
  closing: {
    eyebrow: 'Begin',
    heading: 'Have a conversation with Mr Vijayan',
    body: 'Enquiries are answered personally, usually within a day. There is no pressure, only an honest, expert opinion.',
    ctaLabel: 'Request a Consultation',
    ctaHref: '/contact',
    imageUrl: '/images/web/clinic-interior.webp',
  },
}

export type HomePageContent = {
  seo: {title: string; description: string}
  heroEyebrow: string
  heroHeadingTop: string
  heroHeadingEm: string
  heroHeadingBottom: string
  heroBody: string
  heroCtaLabel: string
  heroLinkLabel: string
  heroImageUrl: string
  /** The same scene, taller, for narrow screens. See the <picture> in the home page. */
  heroImageUrlNarrow: string
  heroImageAlt: string
  usps: string[]
  philEyebrow: string
  philQuote: string
  philBody: Block[]
  philLinkLabel: string
  philImageUrl: string
  resultsEyebrow: string
  resultsHeadingTop: string
  resultsHeadingEm: string
  resultsBody: string
  servicesEyebrow: string
  servicesHeadingTop: string
  servicesHeadingEm: string
  servicesBody: string
  servicesLinkLabel: string
  diffEyebrow: string
  diffHeadingA: string
  diffHeadingEm1: string
  diffHeadingB: string
  diffHeadingEm2: string
  diffItems: TitledItem[]
  diffImageUrl: string
  aboutEyebrow: string
  aboutHeadingTop: string
  aboutHeadingEm: string
  aboutBody: Block[]
  aboutCredentials: string[]
  aboutGmcLine: string
  aboutImageUrl: string
  aboutStatValue: string
  aboutStatLabel: string
  accredMembershipsLabel: string
  accredInsurersLabel: string
  journeyEyebrow: string
  journeyHeading: string
  journeySteps: TitledItem[]
  locationsEyebrow: string
  locationsHeadingTop: string
  locationsHeadingEm: string
  locationItems: LabelledItem[]
  locationsImageUrl: string
  contactEyebrow: string
  contactHeadingTop: string
  contactHeadingEm: string
  contactBody: string
  contactMeta: LabelledItem[]
}

export const HOME_PAGE: HomePageContent = {
  seo: {
    title: 'RV Plastic Surgery | Mr Roshan Vijayan, Consultant Plastic Surgeon',
    description:
      'Natural, balanced aesthetic and reconstructive surgery, consultant-led, in Hertfordshire, by Mr Roshan Vijayan, MBBS FRCS(Plast).',
  },
  heroEyebrow: 'Consultant Plastic Surgeon · Hertfordshire',
  heroHeadingTop: 'The quiet art of',
  heroHeadingEm: 'looking like yourself',
  heroHeadingBottom: 'again.',
  heroBody:
    'Mr Roshan Vijayan specialises in natural, beautifully balanced body contouring and aesthetic surgery, restoring confidence with safe, tried-and-tested technique, expertly executed.',
  heroCtaLabel: 'Request a Consultation',
  heroLinkLabel: 'Explore procedures',
  heroImageUrl: '/images/web/hero-2.webp',
  heroImageUrlNarrow: '/images/web/hero-2-tall.webp',
  heroImageAlt: 'A poised, confident woman in champagne silk',
  usps: [
    'Consultant-led care, first call to final review',
    'Your second consultation, included',
    'Unlimited Consultant follow-up at no extra cost',
    'Appointments often within two weeks',
    'Honest, no-pressure advice, always',
    'Two-surgeon safety on more complex cases',
  ],
  philEyebrow: 'Meet Mr Vijayan',
  philQuote:
    '“I believe in surgery as a partnership, a shared journey, with honesty about what is involved and a result that looks entirely, naturally you.”',
  philBody: [
    para(
      'For Mr Vijayan, plastic surgery sits where artistry meets medicine. An artistic eye, meticulous attention to detail and a holistic, unhurried approach shape every plan he creates. He is, first and foremost, a doctor, frank about what is safe, advisable and truly in your best interests.',
    ),
    paraStrong(
      'His particular interest is ',
      'body restoration after pregnancy and weight loss',
      ': refining loose, redundant skin to reveal the physique beneath, and restoring the confidence to live fully again.',
    ),
  ],
  philLinkLabel: 'More about Mr Vijayan',
  philImageUrl: '/images/web/doctor-suit.webp',
  resultsEyebrow: 'Before & After',
  resultsHeadingTop: 'Results that',
  resultsHeadingEm: 'speak softly.',
  resultsBody:
    'Real outcomes from real patients, natural, balanced and beautifully healed. Drag the handle on each case to reveal the journey, before and after.',
  servicesEyebrow: 'Signature Procedures',
  servicesHeadingTop: 'Our main',
  servicesHeadingEm: 'services',
  servicesBody:
    'Whether you are restoring your body after weight loss or pregnancy, refining your shape, or seeking expert facial, eyelid and skin-cancer reconstruction, every plan is studied and drawn up individually, with Mr Vijayan’s artistry, honesty and consultant-led care at its heart.',
  servicesLinkLabel: 'View all services',
  diffEyebrow: 'The Vijayan Difference',
  diffHeadingA: 'Surgery that is ',
  diffHeadingEm1: 'safer,',
  diffHeadingB: ' care that is ',
  diffHeadingEm2: 'personal.',
  diffItems: [
    {
      title: 'Early, flexible availability',
      body: 'Consultations often within a week or two, with flexible scheduling for surgery.',
    },
    {
      title: 'Highly bespoke plans',
      body: 'Each plan is studied and drawn up individually, with a thorough written summary after your consultation.',
    },
    {
      title: 'Two-surgeon safety on complex cases',
      body: 'For more complex procedures, Mr Vijayan frequently has a senior surgeon assist him, for greater precision, less time under anaesthetic and an added layer of safety.',
    },
    {
      title: 'Consultant-led aftercare',
      body: 'Mr Vijayan personally reviews you, answers your emails within a day, and calls on day one after surgery, never handed to others.',
    },
  ],
  diffImageUrl: '/images/web/doctor-difference.webp',
  aboutEyebrow: 'About Mr Vijayan',
  aboutHeadingTop: 'Eighteen years a doctor.',
  aboutHeadingEm: 'An artist’s eye.',
  aboutBody: [
    para(
      'Qualified in London in 2008 with a first-class intercalated degree in Endocrinology, Mr Vijayan trained across more than twenty teaching hospitals, among them the Queen Victoria, Royal London, Royal Free, Chelsea & Westminster and Guy’s & St Thomas’. Now in his fifth year as an NHS consultant, he has published widely, presented internationally, and visited leading units in South Korea and Taiwan.',
    ),
    para(
      'A creative person at heart, he is drawn to the artistry of plastic surgery: studying a problem holistically, taking time, and crafting a result that is natural and proportioned.',
    ),
  ],
  aboutCredentials: [
    'BSc (Hons) Endocrinology',
    'MBBS, Imperial College London',
    'MRCS (Eng)',
    'FRCS (Plast)',
    'Executive MBA',
    'PgCert Clinical Education',
  ],
  aboutGmcLine: 'GMC Reg. No. 7020524',
  aboutImageUrl: '/images/web/consultation.webp',
  aboutStatValue: '20–30',
  aboutStatLabel: 'minutes, unhurried, every first consultation',
  accredMembershipsLabel: 'Registered & accredited',
  accredInsurersLabel: 'Recognised by leading insurers',
  journeyEyebrow: 'A Shared Journey',
  journeyHeading: 'What to expect',
  journeySteps: [
    {title: 'Enquiry', body: 'A simple message or call to begin the conversation.'},
    {title: 'First consultation', body: '20–30 unhurried minutes to listen, assess and explore your goals.'},
    {title: 'Written plan', body: 'A thorough letter summarising the approach, recovery and risks.'},
    {title: 'Second consultation', body: 'Included as standard, to recap, answer questions and confirm.'},
    {title: 'Surgery', body: 'Performed by Mr Vijayan with a senior surgical assistant.'},
    {title: 'Aftercare', body: 'A day-one call and unlimited, consultant-led follow-up.'},
  ],
  locationsEyebrow: 'Locations',
  locationsHeadingTop: 'Across ',
  locationsHeadingEm: 'Hertfordshire.',
  locationItems: locationLines(),
  locationsImageUrl: '/images/web/clinic-interior.webp',
  contactEyebrow: 'Begin',
  contactHeadingTop: 'Request a',
  contactHeadingEm: 'consultation.',
  contactBody:
    'Tell Mr Vijayan a little about what you’d like to achieve. Enquiries are answered personally, usually within a day.',
  contactMeta: [
    {label: 'Call', value: '01727 221799'},
    {label: 'Email', value: 'enquiries@vijayan.co.uk'},
    {label: 'Practice', value: 'Hatfield, Hemel Hempstead, St Albans and Stevenage'},
  ],
}
