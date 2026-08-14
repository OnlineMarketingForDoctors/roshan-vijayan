/**
 * Reads a WordPress export file (WXR) and turns post bodies into portable text.
 *
 * The export is the authoritative copy of the old blog: one XML file holding
 * every post's title, slug, date, excerpt and body HTML, plus the attachment
 * records that give each featured image its URL. It beats scraping the live
 * site, which sits behind a bot challenge and would only ever give us the
 * rendered theme rather than the content itself.
 *
 * Pure functions, no network and no Sanity, so the parsing and the conversion
 * can be tested on their own — see scripts/lib/wxr.test.ts.
 */

export type WxrPost = {
  id: string
  title: string
  slug: string
  status: string
  type: string
  date: string | null
  excerpt: string
  html: string
  thumbnailId: string | null
}

export type WxrAttachment = {id: string; url: string; title: string}

export type Wxr = {posts: WxrPost[]; attachments: Map<string, WxrAttachment>}

/* ------------------------------------------------------------------ XML bits */

const decodeEntities = (s: string): string =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&#8220;|&ldquo;/g, '“')
    .replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&hellip;/g, '…')
    .replace(/&amp;/g, '&') // last, so &amp;lt; does not become <

/** First <tag>…</tag> inside a chunk, entities resolved. Namespaced tags allowed. */
const tag = (xml: string, name: string): string => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'))
  return m ? decodeEntities(m[1]).trim() : ''
}

/** WordPress writes dates as "2024-03-01 09:30:00" in no particular zone. */
export const toIsoDate = (wpDate: string): string | null => {
  const m = wpDate.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/)
  if (!m) return null
  const [, y, mo, d, h, mi, s] = m
  if (y === '0000') return null
  return `${y}-${mo}-${d}T${h}:${mi}:${s}Z`
}

export function parseWxr(xml: string): Wxr {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1])
  const posts: WxrPost[] = []
  const attachments = new Map<string, WxrAttachment>()

  for (const item of items) {
    const type = tag(item, 'wp:post_type')
    const id = tag(item, 'wp:post_id')

    if (type === 'attachment') {
      const url = tag(item, 'wp:attachment_url')
      if (id && url) attachments.set(id, {id, url, title: tag(item, 'title')})
      continue
    }
    if (type !== 'post') continue

    // the featured image is a postmeta pointing at an attachment id
    const thumb = item.match(
      /<wp:meta_key>(?:<!\[CDATA\[)?_thumbnail_id(?:\]\]>)?<\/wp:meta_key>\s*<wp:meta_value>(?:<!\[CDATA\[)?(\d+)/,
    )

    posts.push({
      id,
      title: tag(item, 'title'),
      slug: tag(item, 'wp:post_name'),
      status: tag(item, 'wp:status'),
      type,
      date: toIsoDate(tag(item, 'wp:post_date_gmt')) || toIsoDate(tag(item, 'wp:post_date')),
      excerpt: tag(item, 'excerpt:encoded'),
      html: tag(item, 'content:encoded'),
      thumbnailId: thumb ? thumb[1] : null,
    })
  }

  return {posts, attachments}
}

/* --------------------------------------------------------- HTML to portable text */

export type Span = {_type: 'span'; _key: string; text: string; marks: string[]}
export type MarkDef = {_type: 'link'; _key: string; href: string}
export type Block = {
  _type: 'block'
  _key: string
  style: string
  listItem?: 'bullet' | 'number'
  level?: number
  markDefs: MarkDef[]
  children: Span[]
}
/** Images are emitted with the source URL; the importer swaps in an asset ref. */
export type ImageBlock = {_type: 'image'; _key: string; url: string; alt: string}
export type Content = Block | ImageBlock

const stripTags = (s: string) => decodeEntities(s.replace(/<[^>]+>/g, ''))

/** Collapses whitespace but keeps single spaces between words. */
const tidy = (s: string) => s.replace(/\s+/g, ' ').trim()

/**
 * Inline markup to spans. Handles the tags WordPress editors actually produce:
 * strong/b, em/i, and links. Anything else contributes its text.
 */
function inlineSpans(html: string, key: (p: string) => string): {spans: Span[]; markDefs: MarkDef[]} {
  const spans: Span[] = []
  const markDefs: MarkDef[] = []
  // split on the inline tags we understand, keeping the delimiters
  const parts = html.split(/(<\/?(?:strong|b|em|i|a)\b[^>]*>)/i)

  const marks: string[] = []
  let linkKey: string | null = null

  for (const part of parts) {
    if (!part) continue
    const open = part.match(/^<(strong|b|em|i|a)\b([^>]*)>$/i)
    const close = part.match(/^<\/(strong|b|em|i|a)>$/i)

    if (open) {
      const name = open[1].toLowerCase()
      if (name === 'a') {
        const href = open[2].match(/href=["']([^"']+)["']/i)?.[1]
        if (href) {
          linkKey = key('m')
          markDefs.push({_type: 'link', _key: linkKey, href: decodeEntities(href)})
          marks.push(linkKey)
        }
      } else {
        marks.push(name === 'b' ? 'strong' : name === 'i' ? 'em' : name)
      }
      continue
    }
    if (close) {
      const name = close[1].toLowerCase()
      const mark = name === 'a' ? linkKey : name === 'b' ? 'strong' : name === 'i' ? 'em' : name
      const at = mark ? marks.lastIndexOf(mark) : -1
      if (at >= 0) marks.splice(at, 1)
      if (name === 'a') linkKey = null
      continue
    }

    const text = decodeEntities(part.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ')
    if (!text.trim()) continue
    spans.push({_type: 'span', _key: key('s'), text, marks: [...marks]})
  }

  return {spans, markDefs}
}

/**
 * Block-level HTML to portable text.
 *
 * WordPress classic-editor content often separates paragraphs with blank lines
 * rather than <p> tags, so bare text between block elements is treated as its
 * own paragraph rather than being dropped.
 */
export function htmlToPortableText(html: string): Content[] {
  let n = 0
  const key = (p: string) => `${p}${(n++).toString(36)}`

  const out: Content[] = []
  const push = (style: string, inner: string, listItem?: 'bullet' | 'number') => {
    const {spans, markDefs} = inlineSpans(inner, key)
    if (!spans.length || !spans.some((s) => s.text.trim())) return
    const block: Block = {_type: 'block', _key: key('b'), style, markDefs, children: spans}
    if (listItem) {
      block.listItem = listItem
      block.level = 1
    }
    out.push(block)
  }

  // images anywhere become their own block, so pull them out first
  const source = html.replace(/<figure\b[^>]*>([\s\S]*?)<\/figure>/gi, '$1')

  const BLOCK = /<(h[1-6]|p|ul|ol|blockquote|img)\b([^>]*)>(?:([\s\S]*?)<\/\1>)?/gi
  let last = 0
  let m: RegExpExecArray | null

  while ((m = BLOCK.exec(source))) {
    // text sitting between block elements is still a paragraph
    const between = source.slice(last, m.index)
    if (tidy(stripTags(between))) push('normal', between)
    last = BLOCK.lastIndex

    const name = m[1].toLowerCase()
    const attrs = m[2] || ''
    const inner = m[3] || ''

    if (name === 'img') {
      const src = attrs.match(/src=["']([^"']+)["']/i)?.[1]
      if (src) {
        out.push({
          _type: 'image',
          _key: key('i'),
          url: decodeEntities(src),
          alt: decodeEntities(attrs.match(/alt=["']([^"']*)["']/i)?.[1] || ''),
        })
      }
      continue
    }

    if (name === 'ul' || name === 'ol') {
      const listItem = name === 'ul' ? 'bullet' : 'number'
      for (const li of inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)) push('normal', li[1], listItem)
      continue
    }

    if (name === 'blockquote') {
      // a quote usually wraps its own paragraphs
      const paras = [...inner.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((p) => p[1])
      if (paras.length) paras.forEach((p) => push('blockquote', p))
      else push('blockquote', inner)
      continue
    }

    if (/^h[1-6]$/.test(name)) {
      // WordPress body headings already sit under the post title, so they pass
      // through as they are. Only a stray h1 is demoted, since the page renders
      // the title as its h1 and two would compete.
      const level = Math.max(2, Number(name[1]))
      push(`h${Math.min(4, level)}`, inner)
      continue
    }

    // paragraphs may still contain an image
    const img = inner.match(/<img\b([^>]*)>/i)
    if (img) {
      const src = img[1].match(/src=["']([^"']+)["']/i)?.[1]
      const rest = inner.replace(/<img\b[^>]*>/i, '')
      if (src) {
        out.push({
          _type: 'image',
          _key: key('i'),
          url: decodeEntities(src),
          alt: decodeEntities(img[1].match(/alt=["']([^"']*)["']/i)?.[1] || ''),
        })
      }
      if (tidy(stripTags(rest))) push('normal', rest)
      continue
    }

    push('normal', inner)
  }

  const tail = source.slice(last)
  if (tidy(stripTags(tail))) {
    // classic-editor posts separate paragraphs by blank lines
    for (const para of tail.split(/\n\s*\n/)) if (tidy(stripTags(para))) push('normal', para)
  }

  return out
}

/** Plain text of a post body, for building an excerpt when the export has none. */
export const plainText = (blocks: Content[]): string =>
  blocks
    .filter((b): b is Block => b._type === 'block')
    .map((b) => b.children.map((c) => c.text).join(''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
