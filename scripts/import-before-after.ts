/**
 * Moves the before & after set from the repository into Sanity.
 *
 * Run from the repo root, or from the Actions tab via the "Run a Sanity
 * script" workflow:
 *
 *   npx sanity exec scripts/import-before-after.ts --with-user-token
 *
 * Reads lib/baCases.ts, uploads each pair from public/images/ba/ and creates
 * one beforeAfterCase document per pair, linked to the procedure pages it
 * belongs on. Document ids are derived from the treatment and position, so
 * re-running updates the same documents rather than duplicating them, and
 * images already on a document are left alone.
 *
 * The files stay in the repository afterwards. Sanity drives the site; the
 * repository copy is the backup, so nothing here exists only in the CMS.
 */
import {getCliClient} from 'sanity/cli'
import {readFileSync, existsSync} from 'fs'
import {join} from 'path'
import {BA_PROCEDURES} from '../lib/baCases'

const client = getCliClient()
const ROOT = process.cwd()

const idFor = (treatmentSlug: string, i: number) => `beforeAfterCase.${treatmentSlug}-${i + 1}`

async function uploadFromPublic(url: string, filename: string) {
  const path = join(ROOT, 'public', url.replace(/^\//, ''))
  if (!existsSync(path)) throw new Error(`missing file: ${path}`)
  const asset = await client.assets.upload('image', readFileSync(path), {filename})
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

async function run() {
  // procedure slug -> document id, so cases can reference their pages
  const procDocs: {_id: string; slug: string}[] = await client.fetch(
    `*[_type=="procedure" && defined(slug.current)]{_id, "slug": slug.current}`,
  )
  const procIdBySlug = new Map(procDocs.map((d) => [d.slug, d._id]))

  let created = 0
  let updated = 0
  const missingProcedures = new Set<string>()

  for (const group of BA_PROCEDURES) {
    for (const [i, patient] of group.patients.entries()) {
      const _id = idFor(group.slug, i)
      const existing = await client.fetch<Record<string, unknown> | null>(
        `*[_id==$id][0]{_id, beforeImage, afterImage}`,
        {id: _id},
      )

      const refs = group.procedureSlugs
        .map((s) => {
          const id = procIdBySlug.get(s)
          if (!id) missingProcedures.add(s)
          return id
        })
        .filter(Boolean)
        .map((id, n) => ({_type: 'reference', _ref: id as string, _key: `p${n}`}))

      const doc: Record<string, unknown> = {
        caption: patient.caption,
        treatment: group.title,
        category: group.area,
        procedures: refs,
        order: created + updated,
      }
      if (patient.beforeLabel) doc.beforeLabel = patient.beforeLabel
      if (patient.afterLabel) doc.afterLabel = patient.afterLabel

      if (!existing?.beforeImage) {
        doc.beforeImage = await uploadFromPublic(patient.beforeUrl, `${group.slug}-${i + 1}-before.jpg`)
      }
      if (!existing?.afterImage) {
        doc.afterImage = await uploadFromPublic(patient.afterUrl, `${group.slug}-${i + 1}-after.jpg`)
      }

      if (existing) {
        await client.patch(_id).set(doc).commit()
        updated++
        console.log(`updated  ${_id}  ${patient.caption}`)
      } else {
        await client.createOrReplace({_id, _type: 'beforeAfterCase', ...doc})
        created++
        console.log(`created  ${_id}  ${patient.caption}`)
      }
    }
  }

  if (missingProcedures.size) {
    console.log('\nNo procedure document for these slugs, so those links were skipped:')
    for (const s of missingProcedures) console.log('   ' + s)
  }
  console.log(`\n${created} created, ${updated} updated.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
