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
