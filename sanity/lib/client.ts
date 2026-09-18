import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from '../env'

// Server-side read token. Non-NEXT_PUBLIC env vars are undefined in the browser,
// so this token is never exposed client-side. It lets the site read all
// published content reliably, independent of anonymous dataset access rules.
const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_WRITE_TOKEN

/**
 * Reads go through Sanity's CDN. Every query used to hit the live API, which is
 * the metered endpoint: with a revalidation window across roughly 185 pages,
 * each firing several queries, a crawl was enough to exhaust the project's API
 * request quota, and once Sanity answered 402 every procedure and blog page
 * rendered empty and 404ed.
 *
 * The CDN is the endpoint meant for published reads at this volume, and Sanity
 * purges it when a document is published, so this costs nothing in freshness.
 * It requires perspective 'published' — drafts always bypass the CDN.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  token,
})
