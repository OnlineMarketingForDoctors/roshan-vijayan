/**
 * Seeds the editable page documents with the copy currently on the site.
 *
 *   npx sanity exec scripts/import-pages.ts --with-user-token
 *
 * or from the Actions tab via the "Run a Sanity script" workflow.
 *
 * Without this the documents are empty and Studio shows blank fields, which
 * makes it look as though the copy is gone even though the pages still render
 * it from lib/pageContent.ts. Running it puts the live wording in front of the
 * editor so they can change it rather than retype it.
 *
 * Text only: images stay as repository paths, and the CMS image fields are
 * left empty so the pages keep using them until someone uploads a replacement.
 *
 * Existing documents are NOT overwritten by default — re-running reports what
 * it would change instead, so edits made in Studio survive. Pass --force to
 * overwrite them with the repository copy.
 */
import {getCliClient} from 'sanity/cli'
import {CONTACT_PAGE, LOCATIONS_PAGE, ABOUT_PAGE, HOME_PAGE} from '../lib/pageContent'

const client = getCliClient()
const force = process.argv.includes('--force')

const keyed = <T extends object>(prefix: string, items: T[]) =>
  items.map((item, i) => ({...item, _key: `${prefix}${i}`}))

// image fields are deliberately omitted; the pages fall back to the repo paths
const stripImage = <T extends {imageUrl?: string}>(o: T) => {
  const {imageUrl, ...rest} = o
  return rest
}

const DOCS: {_id: string; _type: string; label: string; doc: Record<string, unknown>}[] = [
  {
    _id: 'contactPage',
    _type: 'contactPage',
    label: 'Contact page',
    doc: {
      seo: CONTACT_PAGE.seo,
      hero: stripImage(CONTACT_PAGE.hero),
      enquiryEyebrow: CONTACT_PAGE.enquiryEyebrow,
      enquiryHeadingTop: CONTACT_PAGE.enquiryHeadingTop,
      enquiryHeadingEm: CONTACT_PAGE.enquiryHeadingEm,
      enquiryBody: CONTACT_PAGE.enquiryBody,
      enquiryMeta: keyed('m', CONTACT_PAGE.enquiryMeta),
      locationsEyebrow: CONTACT_PAGE.locationsEyebrow,
      locationsHeading: CONTACT_PAGE.locationsHeading,
      locationsBody: CONTACT_PAGE.locationsBody,
      locationsSummary: keyed('l', CONTACT_PAGE.locationsSummary),
      locationsLinkLabel: CONTACT_PAGE.locationsLinkLabel,
    },
  },
  {
    _id: 'locationsPage',
    _type: 'locationsPage',
    label: 'Locations page',
    doc: {
      seo: LOCATIONS_PAGE.seo,
      hero: stripImage(LOCATIONS_PAGE.hero),
      cards: keyed(
        'c',
        LOCATIONS_PAGE.cards.map((card) => ({_type: 'locationCard', ...stripImage(card)})),
      ),
      closing: stripImage(LOCATIONS_PAGE.closing),
    },
  },
  {
    _id: 'aboutPage',
    _type: 'aboutPage',
    label: 'About page',
    doc: {
      seo: ABOUT_PAGE.seo,
      hero: stripImage(ABOUT_PAGE.hero),
      profileEyebrow: ABOUT_PAGE.profileEyebrow,
      profileHeadingTop: ABOUT_PAGE.profileHeadingTop,
      profileHeadingBottom: ABOUT_PAGE.profileHeadingBottom,
      profileBody: ABOUT_PAGE.profileBody,
      credentials: ABOUT_PAGE.credentials,
      gmcLine: ABOUT_PAGE.gmcLine,
      ethosEyebrow: ABOUT_PAGE.ethosEyebrow,
      ethosQuote: ABOUT_PAGE.ethosQuote,
      ethosBody: ABOUT_PAGE.ethosBody,
      stats: keyed('s', ABOUT_PAGE.stats),
      interestEyebrow: ABOUT_PAGE.interestEyebrow,
      interestHeadingTop: ABOUT_PAGE.interestHeadingTop,
      interestHeadingBottom: ABOUT_PAGE.interestHeadingBottom,
      interestBody: ABOUT_PAGE.interestBody,
      interestLinkLabel: ABOUT_PAGE.interestLinkLabel,
      differenceEyebrow: ABOUT_PAGE.differenceEyebrow,
      differenceHeading: ABOUT_PAGE.differenceHeading,
      differenceItems: keyed('d', ABOUT_PAGE.differenceItems),
      closing: stripImage(ABOUT_PAGE.closing),
    },
  },
  {
    _id: 'homePage',
    _type: 'homePage',
    label: 'Homepage',
    doc: {
      seo: HOME_PAGE.seo,
      heroEyebrow: HOME_PAGE.heroEyebrow,
      heroHeadingTop: HOME_PAGE.heroHeadingTop,
      heroHeadingEm: HOME_PAGE.heroHeadingEm,
      heroHeadingBottom: HOME_PAGE.heroHeadingBottom,
      heroBody: HOME_PAGE.heroBody,
      heroCtaLabel: HOME_PAGE.heroCtaLabel,
      heroLinkLabel: HOME_PAGE.heroLinkLabel,
      heroImageAlt: HOME_PAGE.heroImageAlt,
      usps: HOME_PAGE.usps,
      philEyebrow: HOME_PAGE.philEyebrow,
      philQuote: HOME_PAGE.philQuote,
      philBody: HOME_PAGE.philBody,
      philLinkLabel: HOME_PAGE.philLinkLabel,
      resultsEyebrow: HOME_PAGE.resultsEyebrow,
      resultsHeadingTop: HOME_PAGE.resultsHeadingTop,
      resultsHeadingEm: HOME_PAGE.resultsHeadingEm,
      resultsBody: HOME_PAGE.resultsBody,
      servicesEyebrow: HOME_PAGE.servicesEyebrow,
      servicesHeadingTop: HOME_PAGE.servicesHeadingTop,
      servicesHeadingEm: HOME_PAGE.servicesHeadingEm,
      servicesBody: HOME_PAGE.servicesBody,
      servicesLinkLabel: HOME_PAGE.servicesLinkLabel,
      diffEyebrow: HOME_PAGE.diffEyebrow,
      diffHeadingA: HOME_PAGE.diffHeadingA,
      diffHeadingEm1: HOME_PAGE.diffHeadingEm1,
      diffHeadingB: HOME_PAGE.diffHeadingB,
      diffHeadingEm2: HOME_PAGE.diffHeadingEm2,
      diffItems: keyed('f', HOME_PAGE.diffItems),
      aboutEyebrow: HOME_PAGE.aboutEyebrow,
      aboutHeadingTop: HOME_PAGE.aboutHeadingTop,
      aboutHeadingEm: HOME_PAGE.aboutHeadingEm,
      aboutBody: HOME_PAGE.aboutBody,
      aboutCredentials: HOME_PAGE.aboutCredentials,
      aboutGmcLine: HOME_PAGE.aboutGmcLine,
      aboutStatValue: HOME_PAGE.aboutStatValue,
      aboutStatLabel: HOME_PAGE.aboutStatLabel,
      accredMembershipsLabel: HOME_PAGE.accredMembershipsLabel,
      accredInsurersLabel: HOME_PAGE.accredInsurersLabel,
      journeyEyebrow: HOME_PAGE.journeyEyebrow,
      journeyHeading: HOME_PAGE.journeyHeading,
      journeySteps: keyed('j', HOME_PAGE.journeySteps),
      locationsEyebrow: HOME_PAGE.locationsEyebrow,
      locationsHeadingTop: HOME_PAGE.locationsHeadingTop,
      locationsHeadingEm: HOME_PAGE.locationsHeadingEm,
      locationItems: keyed('n', HOME_PAGE.locationItems),
      contactEyebrow: HOME_PAGE.contactEyebrow,
      contactHeadingTop: HOME_PAGE.contactHeadingTop,
      contactHeadingEm: HOME_PAGE.contactHeadingEm,
      contactBody: HOME_PAGE.contactBody,
      contactMeta: keyed('t', HOME_PAGE.contactMeta),
    },
  },
]

async function run() {
  for (const {_id, _type, label, doc} of DOCS) {
    const existing = await client.fetch<{_id: string} | null>(`*[_id==$id][0]{_id}`, {id: _id})

    if (existing && !force) {
      console.log(`skipped  ${label} — already exists (pass --force to overwrite)`)
      continue
    }

    await client.createOrReplace({_id, _type, ...doc})
    console.log(`${existing ? 'replaced' : 'created '} ${label}  (${_id})`)
  }
  console.log('\nImages were not uploaded; the pages keep using the files in the repository.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
