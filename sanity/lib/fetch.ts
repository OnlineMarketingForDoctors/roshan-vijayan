import {client} from './client'

/**
 * Resilient fetch: on any error (network, unreachable, etc.) it returns the
 * provided fallback instead of throwing. Keeps the site rendering even if
 * Sanity is momentarily unreachable, and lets prerendering succeed offline.
 *
 * Every result is tagged 'sanity' so the /api/revalidate webhook can purge all
 * Sanity-derived pages on demand when content changes in Studio — edits then
 * appear immediately instead of waiting for the ISR window.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
): Promise<T> {
  try {
    return await client.fetch<T>(query, params, {next: {tags: ['sanity']}})
  } catch (e) {
    console.error('Sanity fetch failed:', (e as Error)?.message)
    return fallback
  }
}

/**
 * The same read, but a failure is allowed to throw.
 *
 * Use this wherever the result decides whether a page exists. sanityFetch
 * cannot tell "this document was deleted" from "Sanity did not answer", and
 * collapsing both into an empty fallback makes a page call notFound() during an
 * outage — which caches a 404 and tells search engines the page is gone. That
 * is exactly what happened when the project's API quota ran out: every
 * procedure and blog page 404ed while its content sat untouched in the CMS.
 *
 * Letting the error travel is what keeps that from recurring. During
 * revalidation Next keeps serving the last good render and retries later, and a
 * page it has never rendered answers 5xx — which crawlers come back to, unlike
 * a 404. Genuine absence still reaches notFound(), because the query returns
 * null rather than throwing.
 *
 * Anything a page can sensibly render without — reviews, related posts, site
 * settings — should keep using sanityFetch and its fallback.
 */
export async function sanityFetchRequired<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  return client.fetch<T>(query, params, {next: {tags: ['sanity']}})
}
