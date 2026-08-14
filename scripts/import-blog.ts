/**
 * Brings the old WordPress blog into Sanity from an export file.
 *
 *   npx sanity exec scripts/import-blog.ts --with-user-token -- --dry-run
 *   npx sanity exec scripts/import-blog.ts --with-user-token
 *
 * or from the Actions tab via the "Run a Sanity script" workflow. Run it with
 * --dry-run first: it reports exactly what it would create, post by post,
 * without writing anything.
 *
 * Expects the export at content/blog-export.xml (override with --file=path).
 * Produce it in WordPress: Tools -> Export -> Posts -> Download Export File.
 * The export is the authoritative copy — the live site sits behind a bot
 * challenge and its REST API returns 403, so neither can be read directly.
 *
 * Only published posts are imported; drafts, pages and attachments are skipped
 * and counted. Document ids are derived from the slug, so re-running updates a
 * post rather than creating a second copy, and an existing document is left
 * alone unless --force is passed.
 *
 * Images are uploaded into Sanity rather than hotlinked, so the new site does
 * not depend on the old one staying up. They are read from content/uploads/ if
 * a copy of wp-content/uploads has been placed there, and fetched over HTTP
 * otherwise — the old host answers image requests with its bot-challenge page,
 * so the local copy is the route that works. A missing image is reported and
 * the post still imports: losing a picture is recoverable, losing the writing
 * is not.
 *
 * Re-run with --force once the images are available to fill them in; the text
 * is regenerated identically, so nothing else changes.
 */
import {getCliClient} from 'sanity/cli'
import {readFileSync, existsSync} from 'fs'
import {parseWxr, htmlToPortableText, plainText, type Content} from './lib/wxr'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const force = args.includes('--force')
const file = args.find((a) => a.startsWith('--file='))?.slice(7) || 'content/blog-export.xml'

const client = getCliClient()

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

/** Uploaded once per URL however many posts use it. */
const uploaded = new Map<string, string | null>()

/**
 * Where a downloaded copy of wp-content/uploads may sit, mirroring the paths
 * in the URLs. The old host answers image requests with its bot-challenge page
 * rather than the file, so fetching them over HTTP fails; a folder copied off
 * the server sidesteps that entirely and is used in preference when present.
 */
const localFor = (url: string): string | null => {
  const m = url.match(/wp-content\/uploads\/(.+)$/)
  if (!m) return null
  const path = `content/uploads/${decodeURIComponent(m[1].split('?')[0])}`
  return existsSync(path) ? path : null
}

async function uploadImage(url: string): Promise<string | null> {
  if (uploaded.has(url)) return uploaded.get(url)!

  try {
    const local = localFor(url)
    let buf: Buffer

    if (local) {
      buf = readFileSync(local)
    } else {
      const res = await fetch(url, {headers: {'User-Agent': UA, Accept: 'image/*,*/*'}})
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const type = res.headers.get('content-type') || ''
      // the bot challenge answers with HTML and a 200, so the type is checked
      if (!type.startsWith('image/')) throw new Error(`not an image (${type || 'no content-type'})`)

      buf = Buffer.from(await res.arrayBuffer())
    }

    if (buf.length < 100) throw new Error('empty file')

    const filename = decodeURIComponent(url.split('/').pop()?.split('?')[0] || 'image.jpg')
    const asset = await client.assets.upload('image', buf, {filename})
    uploaded.set(url, asset._id)
    console.log(`      uploaded  ${filename}  (${Math.round(buf.length / 1024)}KB)${local ? '  [local copy]' : ''}`)
    return asset._id
  } catch (err) {
    console.log(`      FAILED    ${url}\n                ${(err as Error)?.message}`)
    uploaded.set(url, null)
    return null
  }
}

const imageRef = (id: string, alt: string, key: string, caption?: string) => ({
  _type: 'image',
  _key: key,
  asset: {_type: 'reference', _ref: id},
  alt,
  ...(caption ? {caption} : {}),
})

/** Swaps image URLs for uploaded asset references, dropping any that failed. */
async function resolveImages(blocks: Content[]): Promise<unknown[]> {
  const out: unknown[] = []
  for (const b of blocks) {
    if (b._type !== 'image') {
      out.push(b)
      continue
    }
    if (dryRun) continue
    const id = await uploadImage(b.url)
    if (id) out.push(imageRef(id, b.alt, b._key, b.caption))
  }
  return out
}

const excerptFrom = (text: string) => {
  if (text.length <= 200) return text
  const cut = text.slice(0, 200)
  return cut.slice(0, cut.lastIndexOf(' ')) + '…'
}

async function run() {
  if (!existsSync(file)) {
    console.error(`No export file at ${file}`)
    console.error('In WordPress: Tools -> Export -> Posts -> Download Export File,')
    console.error('then commit it to the repository at that path (or pass --file=).')
    process.exit(1)
  }

  const xml = readFileSync(file, 'utf8')
  const {posts, attachments} = parseWxr(xml)

  const published = posts.filter((p) => p.status === 'publish')
  const skipped = posts.length - published.length

  console.log(`${file}: ${posts.length} post(s), ${attachments.size} attachment(s)`)
  console.log(`${published.length} published${skipped ? `, ${skipped} draft or private skipped` : ''}`)
  if (dryRun) console.log('\n--dry-run: nothing will be written.\n')

  let created = 0
  let updated = 0
  let left = 0

  for (const post of published) {
    const slug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const _id = `blog-${slug}`.slice(0, 128)

    const existing = await client.fetch<{_id: string} | null>(`*[_id==$id][0]{_id}`, {id: _id})
    if (existing && !force) {
      console.log(`\nleft alone  ${slug} — already in Sanity (pass --force to overwrite)`)
      left++
      continue
    }

    const blocks = htmlToPortableText(post.html)
    const text = plainText(blocks)
    const excerpt = post.excerpt.replace(/<[^>]+>/g, '').trim() || excerptFrom(text)

    console.log(`\n${existing ? 'updating  ' : 'creating  '}${slug}`)
    console.log(`      title     ${post.title}`)
    console.log(`      published ${post.date || '(no date — will use today)'}`)
    console.log(`      body      ${blocks.filter((b) => b._type === 'block').length} blocks, ${text.length} chars`)
    console.log(`      excerpt   ${excerpt.slice(0, 90)}${excerpt.length > 90 ? '…' : ''}`)
    console.log(`      category  ${post.categories[0] || '(none)'}`)

    const inlineImages = blocks.filter((b) => b._type === 'image').length
    const coverUrl = post.thumbnailId ? attachments.get(post.thumbnailId)?.url : undefined
    if (coverUrl) console.log(`      cover     ${coverUrl}`)
    else if (post.thumbnailId) console.log(`      cover     referenced ${post.thumbnailId} but no attachment record`)
    if (inlineImages) console.log(`      images    ${inlineImages} in the body`)

    if (dryRun) {
      created++
      continue
    }

    const body = await resolveImages(blocks)
    const coverId = coverUrl ? await uploadImage(coverUrl) : null

    const doc: Record<string, unknown> = {
      _id,
      _type: 'blogPost',
      title: post.title,
      slug: {_type: 'slug', current: slug},
      excerpt,
      publishedAt: post.date || new Date().toISOString(),
      ...(post.categories[0] ? {category: post.categories[0]} : {}),
      body,
      featured: false,
    }
    if (coverId) doc.coverImage = imageRef(coverId, post.title, 'cover')

    await client.createOrReplace(doc as never)
    existing ? updated++ : created++
  }

  console.log('\n' + '-'.repeat(60))
  if (dryRun) {
    console.log(`--dry-run: ${created} post(s) would be imported, ${left} left alone.`)
    console.log('Re-run without --dry-run to write them.')
  } else {
    console.log(`${created} created, ${updated} updated, ${left} left alone.`)
    const failures = [...uploaded.entries()].filter(([, id]) => id === null)
    if (failures.length) {
      console.log(`\n${failures.length} image(s) could not be downloaded from the old site:`)
      failures.forEach(([url]) => console.log('   ' + url))
      console.log('The posts were imported without them. Upload replacements in Studio.')
    }
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
