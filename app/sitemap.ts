import type {MetadataRoute} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {procedureSlugsQuery, blogSlugsQuery, beforeAfterQuery} from '@/sanity/lib/queries'
import {buildBAProcedures, type SanityBACase} from '@/sanity/lib/ba'
import {absoluteUrl} from '@/lib/site'

/**
 * /sitemap.xml — every page a search engine should know about.
 *
 * Procedure and blog URLs come from Sanity rather than a list kept by hand, so
 * publishing a procedure puts it in the sitemap without anyone remembering to.
 * If the CMS is unreachable the static pages are still listed: a short sitemap
 * is recoverable, a build failure at go-live is not.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const STATIC: {path: string; priority: number}[] = [
    {path: '/', priority: 1},
    {path: '/about/', priority: 0.8},
    {path: '/procedures/', priority: 0.9},
    {path: '/gallery/', priority: 0.8},
    {path: '/locations/', priority: 0.7},
    {path: '/blog/', priority: 0.6},
    {path: '/contact/', priority: 0.9},
    {path: '/sitemap/', priority: 0.2},
    {path: '/privacy-policy/', priority: 0.2},
    {path: '/terms-and-conditions/', priority: 0.2},
    {path: '/cookies-policy/', priority: 0.2},
    // /thank-you-contact/ is deliberately absent: it is the form's landing
    // page, carries a noindex tag, and should not be offered to crawlers
  ]

  const [procedures, posts, baCases] = await Promise.all([
    sanityFetch<{slug: string; category?: string}[]>(procedureSlugsQuery, {}, []),
    sanityFetch<{slug: string}[]>(blogSlugsQuery, {}, []),
    sanityFetch<SanityBACase[]>(beforeAfterQuery, {}, []),
  ])

  return [
    ...STATIC.map(({path, priority}) => ({url: absoluteUrl(path), priority})),
    ...procedures
      // a procedure with no category has no URL to link to
      .filter((p) => p.category && p.slug)
      .map((p) => ({
        url: absoluteUrl(`/procedures/${p.category!.toLowerCase()}/${p.slug}/`),
        priority: 0.8,
      })),
    ...buildBAProcedures(baCases).map((p) => ({
      url: absoluteUrl(`/gallery/${p.slug}/`),
      priority: 0.7,
    })),
    ...posts
      .filter((p) => p.slug)
      .map((p) => ({url: absoluteUrl(`/blog/${p.slug}/`), priority: 0.5})),
  ]
}
