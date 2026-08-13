/**
 * Overlays CMS values onto the repository copy in lib/pageContent.ts.
 *
 * Anything the CMS leaves empty keeps its existing value, so a half-filled
 * document cannot blank out part of a page, and an unreachable CMS renders
 * exactly what the page rendered before it was migrated. Empty strings and
 * empty arrays count as "not set" — in Studio a cleared field and an untouched
 * one look the same, and neither should wipe live copy.
 */

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

export function mergeContent<T>(fallback: T, cms: unknown): T {
  if (cms === null || cms === undefined) return fallback

  if (Array.isArray(fallback)) {
    if (!Array.isArray(cms) || !cms.length) return fallback
    return cms as unknown as T
  }

  if (isPlainObject(fallback)) {
    if (!isPlainObject(cms)) return fallback
    const out: Record<string, unknown> = {...fallback}
    for (const key of Object.keys(fallback as Record<string, unknown>)) {
      out[key] = mergeContent((fallback as Record<string, unknown>)[key], cms[key])
    }
    // fields the CMS has that the fallback does not
    for (const key of Object.keys(cms)) {
      if (!(key in out) && cms[key] !== null && cms[key] !== undefined) out[key] = cms[key]
    }
    return out as T
  }

  if (typeof cms === 'string' && cms.trim() === '') return fallback
  return cms as T
}
