/**
 * Where the site lives, resolved once.
 *
 * The domain is not settled yet, so nothing hard-codes it. Set
 * NEXT_PUBLIC_SITE_URL in Vercel when it is, and canonical links, Open Graph
 * URLs, the sitemap and robots.txt all follow from that one value.
 *
 * Until then it falls back to whichever Vercel URL is serving the request, so
 * previews describe themselves rather than pointing at a domain that does not
 * exist. NEXT_PUBLIC_SITE_LIVE gates indexing separately: a preview should be
 * self-consistent but must still stay out of Google.
 */

/** True only once the real domain is serving the site. */
export const isLive = process.env.NEXT_PUBLIC_SITE_LIVE === 'true'

const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
const fromVercel = process.env.NEXT_PUBLIC_VERCEL_URL?.trim()

/** No trailing slash: callers append paths that start with one. */
export const SITE_URL = (
  fromEnv ||
  (fromVercel ? `https://${fromVercel}` : '') ||
  'http://localhost:3000'
).replace(/\/+$/, '')

/**
 * An absolute URL for a path. Paths keep their trailing slash to match
 * next.config.ts, so a canonical link never disagrees with the URL that
 * actually served the page.
 */
export const absoluteUrl = (path = '/') => {
  const withLeading = path.startsWith('/') ? path : `/${path}`
  const withTrailing = withLeading.endsWith('/') ? withLeading : `${withLeading}/`
  return `${SITE_URL}${withTrailing}`
}
