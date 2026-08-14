/**
 * Points the footer's email address at the practice address.
 *
 * Run from the repo root, signed in to Sanity (`npx sanity login`):
 *
 *   npx sanity exec scripts/fix-footer-email.ts --with-user-token
 *
 * or from the Actions tab via the "Run a Sanity script" workflow.
 *
 * The footer takes its address from siteSettings.email, which held a personal
 * gmail account while every page rendered enquiries@vijayan.co.uk, so the site
 * showed two different addresses depending on where you looked. Nothing in the
 * repository carried the gmail — the fallback in components/Footer.tsx is
 * already the practice address — so there is nothing to fix in code and this
 * corrects the stored value instead.
 *
 * Only replaces the one wrong address: any other value is left alone and
 * reported, so a deliberate change made later is not overwritten. Re-running
 * is safe.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient()

const WRONG = 'roshanvijayan@gmail.com'
const RIGHT = 'enquiries@vijayan.co.uk'

async function run() {
  const docs: {_id: string; email?: string}[] = await client.fetch(
    `*[_type=="siteSettings"]{_id, email}`,
  )

  if (!docs.length) {
    console.log('No siteSettings document, so the footer is already using the repository fallback:')
    console.log(`   ${RIGHT}`)
    return
  }

  const toFix = docs.filter((d) => d.email === WRONG)

  docs
    .filter((d) => d.email !== WRONG)
    .forEach((d) => console.log(`left alone   ${d._id} — ${d.email || '(empty)'}`))

  if (!toFix.length) {
    console.log('\nNothing to change.')
    return
  }

  let tx = client.transaction()
  toFix.forEach((d) => {
    console.log(`updating     ${d._id} — ${WRONG} → ${RIGHT}`)
    tx = tx.patch(d._id, (patch) => patch.set({email: RIGHT}))
  })
  await tx.commit()

  console.log(`\nUpdated ${toFix.length} document(s).`)
  console.log('Published documents are patched directly; drafts are untouched.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
