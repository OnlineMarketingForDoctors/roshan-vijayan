/**
 * Adds five new before & after cases to Sanity. Add-only: it creates the five
 * documents and never reads, patches or reorders any case already there, so
 * the twelve existing cases keep their images, captions and order.
 *
 *   npx sanity exec scripts/add-ba-cases-2026-09.ts --with-user-token
 *
 * Orders start at 13, after the highest order in use, so the new treatments
 * append to the gallery. The blepharoplasty case carries the treatment name of
 * the case already there, which is what puts it in that group rather than in a
 * group of its own.
 *
 * Nose contouring is reconstructive, so it links to the skin cancer page and
 * not to rhinoplasty; the ear case is a skin tumour, so it does not link to
 * prominent ear correction.
 */
import {getCliClient} from 'sanity/cli'
import {readFileSync, existsSync} from 'fs'
import {join} from 'path'

const client = getCliClient()
const ROOT = process.cwd()
const SKIN = 'aesthetic-repair-and-reconstruction-after-skin-cancer-removal'

type NewCase = {
  id: string
  files: string
  caption: string
  treatment: string
  category: string
  procedureSlugs: string[]
  beforeLabel?: string
}

const CASES: NewCase[] = [
  {
    id: 'beforeAfterCase.upper-and-lower-lid-blepharoplasty-2',
    files: 'upper-lower-bleph-2',
    caption: 'Upper and lower lid blepharoplasty · Patient two',
    treatment: 'Upper & Lower Lid Blepharoplasty',
    category: 'Face',
    procedureSlugs: ['upper-and-lower-lid-blepharoplasty'],
  },
  {
    id: 'beforeAfterCase.nasolabial-flap-1',
    files: 'nasolabial-flap-1',
    caption: 'Nasolabial flap reconstruction',
    treatment: 'Nasolabial Flap',
    category: 'Skin & Reconstruction',
    procedureSlugs: [SKIN],
  },
  {
    id: 'beforeAfterCase.nose-contouring-1',
    files: 'nose-contouring-1',
    caption: 'Nose contouring · Patient one',
    treatment: 'Nose Contouring',
    category: 'Skin & Reconstruction',
    procedureSlugs: [SKIN],
  },
  {
    id: 'beforeAfterCase.nose-contouring-2',
    files: 'nose-contouring-2',
    caption: 'Nose contouring · Patient two',
    treatment: 'Nose Contouring',
    category: 'Skin & Reconstruction',
    procedureSlugs: [SKIN],
  },
  {
    id: 'beforeAfterCase.skin-tumour-ear-1',
    files: 'skin-tumour-ear-1',
    caption:
      'Skin tumour excision and reconstruction · Ear · Shown during surgery and after',
    treatment: 'Skin Tumour · Ear',
    category: 'Skin & Reconstruction',
    procedureSlugs: [SKIN],
    beforeLabel: 'During',
  },
]

const FIRST_ORDER = 13

async function upload(base: string, kind: 'before' | 'after') {
  const name = `${base}-${kind}.jpg`
  const path = join(ROOT, 'public', 'images', 'ba', name)
  if (!existsSync(path)) throw new Error(`missing file: ${path}`)
  const asset = await client.assets.upload('image', readFileSync(path), {filename: name})
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

async function run() {
  const procDocs: {_id: string; slug: string}[] = await client.fetch(
    `*[_type=="procedure" && defined(slug.current)]{_id, "slug": slug.current}`,
  )
  const procIdBySlug = new Map(procDocs.map((d) => [d.slug, d._id]))

  // Refuse to run if any of the five ids is taken, rather than overwrite one.
  const taken: string[] = await client.fetch(`*[_id in $ids]._id`, {ids: CASES.map((c) => c.id)})
  if (taken.length) throw new Error(`already present, refusing to overwrite: ${taken.join(', ')}`)

  for (const [i, c] of CASES.entries()) {
    const refs = c.procedureSlugs.map((s, n) => {
      const id = procIdBySlug.get(s)
      if (!id) throw new Error(`no procedure page for slug: ${s}`)
      return {_type: 'reference', _ref: id, _key: `p${n}`}
    })

    const doc: Record<string, unknown> = {
      _id: c.id,
      _type: 'beforeAfterCase',
      caption: c.caption,
      treatment: c.treatment,
      category: c.category,
      procedures: refs,
      order: FIRST_ORDER + i,
      beforeImage: await upload(c.files, 'before'),
      afterImage: await upload(c.files, 'after'),
    }
    if (c.beforeLabel) doc.beforeLabel = c.beforeLabel

    await client.create(doc as never)
    console.log(`created ${c.id} (order ${FIRST_ORDER + i}) — ${c.caption}`)
  }

  console.log(`\ndone: ${CASES.length} cases added, none replaced`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
