/**
 * Turns the 'Before & After' section on for the procedures that have cases.
 *
 * Run from the repo root, signed in to Sanity (`npx sanity login`):
 *
 *   npx sanity exec scripts/enable-before-after.ts --with-user-token
 *
 * The section is hidden only when a document has showResults set to false —
 * the field defaults to true and the page treats anything but false as on. So
 * this sets it to true on the procedures that have photographs in
 * lib/baCases.ts, and reports the ones already on rather than writing to them.
 *
 * Procedures with no cases are left untouched: the page hides the section on
 * its own when nothing matches, so flipping their switch would change nothing
 * today and would silently override a deliberate choice later. Re-running is
 * safe.
 */
import {getCliClient} from 'sanity/cli'
import {BA_PROCEDURES} from '../lib/baCases'

const client = getCliClient()

async function run() {
  // every procedure page referenced by a case, de-duplicated
  const slugs = [...new Set(BA_PROCEDURES.flatMap((p) => p.procedureSlugs))].sort()

  const docs: {_id: string; title: string; slug: string; showResults?: boolean}[] =
    await client.fetch(
      `*[_type=="procedure" && slug.current in $slugs]{_id, title, "slug": slug.current, showResults}`,
      {slugs},
    )

  const found = new Set(docs.map((d) => d.slug))
  const missing = slugs.filter((s) => !found.has(s))
  if (missing.length) {
    console.log('No procedure document for these slugs, so nothing to enable:')
    missing.forEach((s) => console.log('   ' + s))
  }

  const toFix = docs.filter((d) => d.showResults === false)
  const already = docs.filter((d) => d.showResults !== false)

  already.forEach((d) => console.log(`already on   ${d.slug}`))

  if (!toFix.length) {
    console.log('\nNothing to change.')
    return
  }

  let tx = client.transaction()
  toFix.forEach((d) => {
    console.log(`enabling     ${d.slug}`)
    tx = tx.patch(d._id, (patch) => patch.set({showResults: true}))
  })
  await tx.commit()

  console.log(`\nEnabled 'Before & After' on ${toFix.length} procedure(s).`)
  console.log('Published documents are patched directly; drafts are untouched.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
