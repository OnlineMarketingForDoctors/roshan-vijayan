import {client} from './client'

/**
 * Resilient fetch: on any error (network, unreachable, etc.) it returns the
 * provided fallback instead of throwing. Keeps the site rendering even if
 * Sanity is momentarily unreachable, and lets prerendering succeed offline.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
): Promise<T> {
  try {
    return await client.fetch<T>(query, params)
  } catch (e) {
    console.error('Sanity fetch failed:', (e as Error)?.message)
    return fallback
  }
}
