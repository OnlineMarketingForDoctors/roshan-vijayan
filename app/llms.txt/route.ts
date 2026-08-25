import {sanityFetch} from '@/sanity/lib/fetch'
import {
  siteSettingsQuery,
  procedureListQuery,
  blogIndexQuery,
  beforeAfterQuery,
} from '@/sanity/lib/queries'
import {buildBAProcedures, type SanityBACase} from '@/sanity/lib/ba'
import {procedurePath, categorySegment} from '@/lib/procedurePath'
import {absoluteUrl} from '@/lib/site'
import {toPlain} from '@/components/PortableTextBody'

/**
 * /llms.txt — the site, written for a language model rather than a browser.
 *
 * Same idea as robots.txt and sitemap.xml: one file, at a predictable path,
 * that says what this site is and what is on it. It is built from Sanity like
 * the sitemap is, so publishing a procedure or an article lists it here with
 * nothing to remember.
 *
 * Format follows llmstxt.org: an H1, a blockquote summary, then H2 sections of
 * `- [name](url): note` links.
 */

export const revalidate = 3600

type Procedure = {_id: string; title: string; slug: string; category?: string; heroPromise?: unknown}
type Post = {_id: string; title: string; slug: string; excerpt?: string; category?: string}
type Settings = {
  practiceName?: string
  surgeonName?: string
  credentials?: string
  gmcNumber?: string
  phone?: string
  email?: string
  locations?: {name?: string; address?: string; note?: string}[]
} | null

// The URL segments procedures actually live under — see lib/procedurePath.
const AREAS: {seg: string; title: string}[] = [
  {seg: 'body', title: 'Body'},
  {seg: 'face', title: 'Face & Eyes'},
  {seg: 'skin', title: 'Skin & Reconstruction'},
  {seg: 'other', title: 'Other Procedures'},
]

/** A one-line note for a link, cut at a word boundary. */
function note(value: unknown, max = 160) {
  const t = toPlain(value).replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return t.slice(0, t.lastIndexOf(' ', max)).replace(/[,;:]$/, '') + '…'
}

const PAGES: [string, string, string][] = [
  ['About Mr Vijayan', '/about/', 'Training, appointments, memberships and approach.'],
  ['Procedures', '/procedures/', 'Every procedure offered, grouped by area of the body.'],
  ['Before & After', '/gallery/', 'Consented before-and-after photographs, by procedure.'],
  ['Locations', '/locations/', 'Where Mr Vijayan consults and operates.'],
  ['Journal', '/blog/', 'Articles on surgery, recovery and aftercare.'],
  ['Contact', '/contact/', 'Enquiry form, telephone number and email address.'],
  ['Sitemap', '/sitemap/', 'Every page on the site in one list.'],
]

/** One line of a link list. Newlines in a title would break the format. */
const line = (name: string, path: string, note?: string) =>
  `- [${name.replace(/\s+/g, ' ').trim()}](${absoluteUrl(path)})${note ? `: ${note.replace(/\s+/g, ' ').trim()}` : ''}`

export async function GET() {
  const [settings, procedures, posts, baCases] = await Promise.all([
    sanityFetch<Settings>(siteSettingsQuery, {}, null),
    sanityFetch<Procedure[]>(procedureListQuery, {}, []),
    sanityFetch<Post[]>(blogIndexQuery, {}, []),
    sanityFetch<SanityBACase[]>(beforeAfterQuery, {}, []),
  ])

  const practice = settings?.practiceName || 'RV Plastic Surgery'
  const surgeon = settings?.surgeonName || 'Mr Roshan Vijayan'
  const credentials = settings?.credentials || 'MBBS FRCS(Plast)'
  const results = buildBAProcedures(baCases)

  const out: string[] = []
  out.push(`# ${practice}`)
  out.push('')
  out.push(
    `> The practice of ${surgeon}, ${credentials}, Consultant Plastic Surgeon in Hertfordshire. ` +
      'Aesthetic and reconstructive surgery of the body, breast, face and skin, consultant-led ' +
      'from first consultation through to aftercare.',
  )
  out.push('')

  const facts: string[] = []
  if (settings?.gmcNumber) facts.push(`GMC number ${settings.gmcNumber}`)
  if (settings?.phone) facts.push(`telephone ${settings.phone}`)
  if (settings?.email) facts.push(`email ${settings.email}`)
  const places = (settings?.locations || []).map((l) => l.name).filter(Boolean)
  if (places.length) facts.push(`consulting at ${places.join(', ')}`)
  if (facts.length) {
    out.push(`${surgeon} — ${facts.join('; ')}.`)
    out.push('')
  }
  out.push(
    'Everything below is published on the site itself. Surgical outcomes vary between people, ' +
      'and nothing here is a substitute for a consultation.',
  )
  out.push('')

  out.push('## Pages')
  out.push('')
  for (const [name, path, note] of PAGES) out.push(line(name, path, note))
  out.push('')

  for (const area of AREAS) {
    const items = procedures.filter(
      (p) => p.slug && p.title && categorySegment(p.category) === area.seg,
    )
    if (!items.length) continue
    out.push(`## ${area.title}`)
    out.push('')
    for (const p of items)
      out.push(line(p.title, `${procedurePath(p.category, p.slug)}/`, note(p.heroPromise)))
    out.push('')
  }

  if (results.length) {
    out.push('## Before & After')
    out.push('')
    for (const r of results) {
      const n = r.patients.length
      out.push(line(r.title, `/gallery/${r.slug}/`, `${n} ${n === 1 ? 'case' : 'cases'}`))
    }
    out.push('')
  }

  if (posts.length) {
    out.push('## Journal')
    out.push('')
    for (const p of posts) {
      if (!p.slug || !p.title) continue
      out.push(line(p.title, `/blog/${p.slug}/`, note(p.excerpt) || p.category))
    }
    out.push('')
  }

  return new Response(out.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
