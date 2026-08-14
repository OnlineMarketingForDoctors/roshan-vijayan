import type {MetadataRoute} from 'next'
import {SITE_URL, isLive} from '@/lib/site'

/**
 * /robots.txt
 *
 * Until NEXT_PUBLIC_SITE_LIVE is set, everything is disallowed: the preview
 * URLs must not be indexed, or Google finds the staging copy first and the real
 * domain launches competing with itself. The noindex tag in app/layout.tsx says
 * the same thing — belt and braces, since robots.txt only asks crawlers not to
 * fetch, while the tag keeps an already-known URL out of the results.
 *
 * /studio is disallowed either way. It is the CMS, not content.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isLive) {
    return {rules: {userAgent: '*', disallow: '/'}}
  }

  return {
    rules: {userAgent: '*', allow: '/', disallow: ['/studio/', '/api/']},
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
