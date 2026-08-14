/**
 * Brings the location lists in Sanity into line with lib/locations.ts.
 *
 * Run from the repo root, signed in to Sanity (`npx sanity login`):
 *
 *   npx sanity exec scripts/fix-locations.ts --with-user-token
 *
 * or from the Actions tab via the "Run a Sanity script" workflow.
 *
 * Pass --dry-run to print what it would change without writing.
 *
 * The same four settings are stored in four documents, and they had drifted:
 * Site Settings lists three, missing Lister Hospital, so the footer showed
 * three while the contact page and homepage showed four; and the contact page
 * shortened two names and one address. lib/locations.ts is now the single
 * source those lists are derived from, and this rewrites the stored copies to
 * match it.
 *
 * Each field is compared first and only written when it actually differs, and
 * the old and new values are printed, so a Studio edit is never silently
 * replaced — it is reported as a change before it is made. Only the location
 * fields are touched; everything else in these documents is left alone.
 */
import {getCliClient} from 'sanity/cli'
import {LOCATIONS, locationLines} from '../lib/locations'

const client = getCliClient()
const dryRun = process.argv.includes('--dry-run')

const keyed = <T extends object>(prefix: string, items: T[]) =>
  items.map((item, i) => ({...item, _key: `${prefix}${i}`}))

/**
 * Compares ignoring _key, which is Sanity's own array bookkeeping, and
 * ignoring the order keys happen to come back in — Sanity does not preserve
 * the order they were written in, so comparing serialised objects directly
 * reports a difference where the content is identical. Absent and null are
 * treated alike, since an unset field comes back as either.
 */
const sameContent = (a: unknown, b: unknown) => {
  const strip = (v: unknown): unknown =>
    Array.isArray(v)
      ? v.map(strip)
      : v && typeof v === 'object'
        ? Object.fromEntries(
            Object.entries(v as Record<string, unknown>)
              .filter(([k, val]) => k !== '_key' && val !== null && val !== undefined)
              .sort(([x], [y]) => (x < y ? -1 : x > y ? 1 : 0))
              .map(([k, val]) => [k, strip(val)]),
          )
        : v
  return JSON.stringify(strip(a)) === JSON.stringify(strip(b))
}

const describe = (v: unknown) =>
  Array.isArray(v)
    ? v
        .map((item) => {
          const o = item as Record<string, unknown>
          return `      · ${o.name ?? o.label ?? '(unnamed)'} — ${o.address ?? o.value ?? ''}`
        })
        .join('\n')
    : '      (not set)'

const TARGETS: {_id: string; field: string; label: string; value: unknown}[] = [
  {
    _id: 'siteSettings',
    field: 'locations',
    label: 'Site Settings — footer locations',
    value: keyed(
      'loc',
      LOCATIONS.map((l) => ({
        _type: 'location',
        name: l.name,
        address: l.address,
        ...(l.nhs ? {note: 'NHS'} : {}),
      })),
    ),
  },
  {
    _id: 'contactPage',
    field: 'locationsSummary',
    label: 'Contact page — locations summary',
    value: keyed('l', locationLines()),
  },
  {
    _id: 'homePage',
    field: 'locationItems',
    label: 'Homepage — locations strip',
    value: keyed('n', locationLines()),
  },
  {
    _id: 'locationsPage',
    field: 'cards',
    label: 'Locations page — cards',
    // images are not migrated, so the card image field is left as it is
    value: keyed(
      'c',
      LOCATIONS.map(({nhs, imageUrl, ...card}) => ({_type: 'locationCard', ...card})),
    ),
  },
]

async function run() {
  const changes: {_id: string; field: string; value: unknown}[] = []

  for (const {_id, field, label, value} of TARGETS) {
    const doc = await client.fetch<Record<string, unknown> | null>(`*[_id==$id][0]`, {id: _id})

    if (!doc) {
      console.log(`missing   ${label} — no ${_id} document, so nothing to update`)
      continue
    }

    const current = doc[field]

    if (sameContent(current, value)) {
      console.log(`unchanged ${label}`)
      continue
    }

    console.log(`updating  ${label}`)
    console.log('    from:')
    console.log(describe(current))
    console.log('    to:')
    console.log(describe(value))
    changes.push({_id, field, value})
  }

  if (!changes.length) {
    console.log('\nEverything already matches lib/locations.ts.')
    return
  }

  if (dryRun) {
    console.log(`\n--dry-run: ${changes.length} field(s) would change. Nothing was written.`)
    return
  }

  let tx = client.transaction()
  changes.forEach(({_id, field, value}) => {
    tx = tx.patch(_id, (patch) => patch.set({[field]: value}))
  })
  await tx.commit()

  console.log(`\nUpdated ${changes.length} field(s) across ${new Set(changes.map((c) => c._id)).size} document(s).`)
  console.log('Published documents are patched directly; drafts are untouched.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
