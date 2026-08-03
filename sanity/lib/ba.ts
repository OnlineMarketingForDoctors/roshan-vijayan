import {urlFor} from './image'
import {FALLBACK_BA} from './fallbacks'
import type {BAGroups} from '@/components/BeforeAfter'

type SanityBACase = {
  caption: string
  category?: string
  beforeImage?: unknown
  afterImage?: unknown
}

export function buildBAGroups(cases: SanityBACase[] | null | undefined): BAGroups {
  if (!cases || !cases.length) return FALLBACK_BA
  const groups: BAGroups = {breast: [], body: [], face: []}
  cases.forEach((c) => {
    const key = (c.category || 'Breast').toLowerCase() as keyof BAGroups
    if (!groups[key] || !c.beforeImage || !c.afterImage) return
    groups[key].push({
      caption: c.caption,
      beforeUrl: urlFor(c.beforeImage as never).width(900).quality(82).url(),
      afterUrl: urlFor(c.afterImage as never).width(900).quality(82).url(),
    })
  })
  return groups
}
