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
import {CONTACT_PAGE, LOCATIONS_PAGE} from '../lib/pageContent'

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
