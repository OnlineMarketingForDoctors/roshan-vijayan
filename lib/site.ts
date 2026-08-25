/**
 * Where the site lives, resolved once. Canonical links, Open Graph URLs, the
 * JSON-LD identifiers, both sitemaps and llms.txt all follow from this.
 *
 * Resolved in order:
 *
 *   1. NEXT_PUBLIC_SITE_URL, if set. An explicit answer always wins, so the
 *      domain can be changed in Vercel without touching the code.
 *   2. PRODUCTION_URL, on a production deployment. The domain is settled, and
 *      naming it here means production says the same thing whether or not
 *      anyone remembers to set the variable.
 *   3. The Vercel URL serving the request, on a preview. A preview describes
 *      itself rather than claiming to be the live site.
 *   4. localhost, when developing.
 *
 * NEXT_PUBLIC_SITE_LIVE gates indexing separately: this says what the site
 * calls itself, that says whether search engines may act on it. Until the
 * domain actually points at this project, leave it unset — every page carries
 * noindex, so a canonical pointing somewhere not yet serving does no harm.
 */

/** The live domain. No trailing slash. */
const PRODUCTION_URL = 'https://vijayan.co.uk'

/** True only once the real domain is serving the site. */
export const isLive = process.env.NEXT_PUBLIC_SITE_LIVE === 'true'

const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
const fromVercel = process.env.NEXT_PUBLIC_VERCEL_URL?.trim()

/** No trailing slash: callers append paths that start with one. */
export const SITE_URL = (
  fromEnv ||
  (isProduction ? PRODUCTION_URL : '') ||
  (fromVercel ? `https://${fromVercel}` : '') ||
  'http://localhost:3000'
).replace(/\/+$/, '')

/**
 * An absolute URL for a path. Pages keep their trailing slash to match
 * next.config.ts, so a canonical link never disagrees with the URL that
 * actually served the page. A file — /images/web/og-cover.jpg — does not get
 * one: it is not a route, and a slash on the end of it is a 404.
 */
const IS_FILE = /\/[^/]+\.[a-z0-9]{2,5}$/i

export const absoluteUrl = (path = '/') => {
  const withLeading = path.startsWith('/') ? path : `/${path}`
  const withTrailing =
    withLeading.endsWith('/') || IS_FILE.test(withLeading) ? withLeading : `${withLeading}/`
  return `${SITE_URL}${withTrailing}`
}
