import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  // The old site served every URL with a trailing slash. Matching it keeps the
  // migrated paths identical, e.g. /procedures/body/thigh-lift/.
  // Note: this also redirects /api/* to /api/*/ — the Sanity revalidation
  // webhook must therefore point at /api/revalidate/ with the slash.
  trailingSlash: true,
  images: {
    remotePatterns: [{protocol: 'https', hostname: 'cdn.sanity.io'}],
  },
}

export default nextConfig
