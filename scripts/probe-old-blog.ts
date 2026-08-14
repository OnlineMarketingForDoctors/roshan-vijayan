/**
 * Reports what the old blog at vijayan.co.uk is built on and what is on it.
 *
 * Reads only — it writes nothing to Sanity and nothing to disk. Run it from
 * the Actions tab via the "Run a Sanity script" workflow:
 *
 *   scripts/probe-old-blog.ts
 *
 * The remote session cannot reach vijayan.co.uk: the network policy answers
 * 403 to the connection, so neither curl nor the fetch tool gets through. A
 * GitHub runner has ordinary internet access, so the discovery happens there
 * and the answer comes back in the workflow log.
 *
 * What the importer has to do depends entirely on the answer. If the site is
 * WordPress, /wp-json/wp/v2/posts returns every post as clean JSON — title,
 * HTML body, excerpt, date, slug and featured image — and the import is a
 * straight mapping. If it is not, the posts have to be scraped from the
 * markup, which needs the page structure in front of us first.
 */

const SITE = 'https://vijayan.co.uk'
const UA = 'Mozilla/5.0 (compatible; content-migration/1.0)'

type Probe = {url: string; status: number; type: string; body: string; error?: string}

async function get(url: string, maxBytes = 200_000): Promise<Probe> {
  try {
    const res = await fetch(url, {headers: {'User-Agent': UA, Accept: '*/*'}, redirect: 'follow'})
    const text = await res.text()
    return {
      url: res.url,
      status: res.status,
      type: res.headers.get('content-type') || '',
      body: text.slice(0, maxBytes),
    }
  } catch (err) {
    return {url, status: 0, type: '', body: '', error: (err as Error)?.message}
  }
}

const line = (s = '') => console.log(s)
const rule = (t: string) => {
  line()
  line('='.repeat(70))
  line(t)
  line('='.repeat(70))
}

async function wordpress() {
  rule('1. WordPress REST API')

  const probe = await get(`${SITE}/wp-json/wp/v2/posts?per_page=100&orderby=date&order=desc`)
  line(`GET /wp-json/wp/v2/posts -> ${probe.status} ${probe.type}${probe.error ? ` (${probe.error})` : ''}`)

  if (probe.status !== 200 || !probe.type.includes('json')) {
    line('Not a WordPress REST endpoint, or it is disabled.')
    return false
  }

  let posts: any[]
  try {
    posts = JSON.parse(probe.body)
  } catch {
    line('Responded with JSON content-type but the body did not parse — likely truncated.')
    line('Raw start: ' + probe.body.slice(0, 300))
    return false
  }

  if (!Array.isArray(posts)) {
    line('Expected an array of posts, got: ' + typeof posts)
    return false
  }

  line(`\nIt is WordPress. ${posts.length} post(s) returned.\n`)
  line('  #  date        slug                                      body    images  title')
  line('  ' + '-'.repeat(96))

  posts.forEach((p, i) => {
    const html: string = p.content?.rendered || ''
    const imgs = (html.match(/<img\b/gi) || []).length
    const date = (p.date || '').slice(0, 10)
    const slug = String(p.slug || '').slice(0, 40).padEnd(40)
    const title = String(p.title?.rendered || '').replace(/&#\d+;|&\w+;/g, "'").slice(0, 60)
    line(
      `  ${String(i + 1).padStart(2)}  ${date}  ${slug}  ${String(html.length).padStart(6)}  ` +
        `${String(imgs).padStart(6)}  ${title}`,
    )
  })

  const withCover = posts.filter((p) => p.featured_media).length
  line(`\n  ${withCover} of ${posts.length} have a featured image.`)
  line(`  Fields on a post: ${Object.keys(posts[0] || {}).sort().join(', ')}`)

  // one full example, so the importer can be written against real markup
  const sample = posts[0]
  if (sample) {
    rule('2. First post in full (sample for the importer)')
    line(`title    : ${sample.title?.rendered}`)
    line(`slug     : ${sample.slug}`)
    line(`date     : ${sample.date}`)
    line(`link     : ${sample.link}`)
    line(`excerpt  : ${String(sample.excerpt?.rendered || '').replace(/<[^>]+>/g, '').trim().slice(0, 300)}`)
    line(`\n--- content.rendered, first 3000 chars ---`)
    line(String(sample.content?.rendered || '').slice(0, 3000))
    line(`--- end ---`)

    if (sample.featured_media) {
      const media = await get(`${SITE}/wp-json/wp/v2/media/${sample.featured_media}`, 20_000)
      try {
        const m = JSON.parse(media.body)
        line(`\nfeatured image: ${m.source_url}`)
        line(`alt text      : ${m.alt_text || '(none)'}`)
      } catch {
        line('\nfeatured image: could not read the media record')
      }
    }
  }

  return true
}

async function fallback() {
  rule('Not WordPress — looking at the markup instead')

  const index = await get(`${SITE}/blog/`)
  line(`GET /blog/ -> ${index.status} ${index.type}${index.error ? ` (${index.error})` : ''}`)
  if (index.status !== 200) {
    line('Could not read the blog index. Nothing further to report.')
    return
  }

  const html = index.body

  const FINGERPRINTS: [string, RegExp][] = [
    ['WordPress', /wp-content|wp-includes|wp-json/i],
    ['Wix', /wix\.com|wixstatic/i],
    ['Squarespace', /squarespace/i],
    ['Webflow', /webflow/i],
    ['Shopify', /cdn\.shopify/i],
    ['Ghost', /ghost\.io|content\/images/i],
    ['HubSpot', /hs-sites|hubspot/i],
  ]
  const hits = FINGERPRINTS.filter(([, re]) => re.test(html)).map(([name]) => name)
  line(`\nPlatform fingerprints: ${hits.length ? hits.join(', ') : 'none recognised'}`)

  const gen = html.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)/i)
  line(`Generator meta       : ${gen ? gen[1] : '(none)'}`)

  const links = [...new Set([...html.matchAll(/href=["']([^"']*\/blog\/[^"'#?]+)["']/gi)].map((m) => m[1]))]
    .filter((h) => !/\/blog\/?$/.test(h))
  line(`\nLinks that look like posts (${links.length}):`)
  links.slice(0, 60).forEach((h) => line('   ' + h))

  for (const path of ['/sitemap.xml', '/wp-sitemap.xml', '/post-sitemap.xml', '/sitemap_index.xml']) {
    const sm = await get(`${SITE}${path}`, 4000)
    line(`\nGET ${path} -> ${sm.status} ${sm.type}`)
    if (sm.status === 200) line(sm.body.slice(0, 1200))
  }

  rule('Blog index markup, first 4000 chars')
  line(html.slice(0, 4000))
}

async function run() {
  line(`Probing ${SITE} — read only, nothing is written.`)
  const isWp = await wordpress()
  if (!isWp) await fallback()
  rule('Done')
  line('Paste this log back into the conversation and the importer can be written against it.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
