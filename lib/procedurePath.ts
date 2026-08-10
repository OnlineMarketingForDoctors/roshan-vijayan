/**
 * Procedure URLs carry their category, matching the old site's structure
 * (/procedures/body/thigh-lift) so existing search value maps across.
 */
export const CATEGORY_SEGMENTS = ['body', 'face', 'skin', 'other'] as const

export const categorySegment = (category?: string) => {
  const seg = (category || 'other').toLowerCase()
  return (CATEGORY_SEGMENTS as readonly string[]).includes(seg) ? seg : 'other'
}

export const procedurePath = (category: string | undefined, slug: string) =>
  `/procedures/${categorySegment(category)}/${slug}`
