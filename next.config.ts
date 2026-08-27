import type {NextConfig} from 'next'
import {LEGACY_REDIRECTS} from './lib/legacyRedirects'

const nextConfig: NextConfig = {
  // The old site served every URL with a trailing slash. Matching it keeps the
  // migrated paths identical, e.g. /procedures/body/thigh-lift/.
  // Note: this also redirects /api/* to /api/*/ — the Sanity revalidation
  // webhook must therefore point at /api/revalidate/ with the slash.
  trailingSlash: true,
  images: {
    remotePatterns: [{protocol: 'https', hostname: 'cdn.sanity.io'}],
  },

  /**
   * One address per page.
   *
   * Vercel redirects http to https by itself for a custom domain, and will
   * redirect www to the apex if www is added to the project as a redirecting
   * domain — that is the right place for it, because it happens at the edge
   * before the application is reached. This is the belt to that braces: if www
   * ever resolves here directly, it is sent to the apex permanently rather than
   * serving a second copy of the site at a second address.
   */
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{type: 'host', value: '(?:www\\.)vijayan\\.co\\.uk'}],
        destination: 'https://vijayan.co.uk/:path*',
        permanent: true,
      },
      // the old site's addresses — see lib/legacyRedirects.ts
      ...LEGACY_REDIRECTS,
    ]
  },
}

export default nextConfig
