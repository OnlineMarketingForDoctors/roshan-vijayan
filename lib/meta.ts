import type {Metadata} from 'next'
import {absoluteUrl} from '@/lib/site'

/** The card shown when a page is shared and has no picture of its own. */
const DEFAULT_IMAGE = '/images/web/og-cover.jpg'
const SITE_NAME = 'RV Plastic Surgery'

/**
 * Canonical, Open Graph and Twitter metadata for one page.
 *
 * Next merges metadata shallowly: a page that declares `openGraph` replaces the
 * layout's wholesale rather than adding to it. So a page cannot simply announce
 * its own og:url — it has to restate the site name, the locale and the card
 * image alongside it, or it silently loses its preview card. Composing all of
 * it here means one place to change those, and no page can lose the card by
 * setting a single field.
 *
 * The canonical and og:url are the same string by construction, which is the
 * point: they disagreed before, every page claiming the homepage's URL.
 */
export function pageMetadata({
  path,
  title,
  description,
  image,
  article,
}: {
  path: string
  title: string
  description?: string
  /** A picture belonging to this page. Absolute, or a path on this site. */
  image?: string
  /** Journal posts are articles; everything else is a page. */
  article?: {published?: string; section?: string}
}): Metadata {
  const url = absoluteUrl(path)
  const own = image ? (image.startsWith('http') ? image : absoluteUrl(image)) : null
  const card = own || absoluteUrl(DEFAULT_IMAGE)

  return {
    title,
    ...(description ? {description} : {}),
    alternates: {canonical: url},
    openGraph: {
      // the fallback card is authored at 1200x630; a page's own picture is not,
      // so its dimensions are left for the consumer to read off the file
      type: article ? 'article' : 'website',
      siteName: SITE_NAME,
      locale: 'en_GB',
      title,
      ...(description ? {description} : {}),
      url,
      images: own
        ? [{url: card, alt: title}]
        : [{url: card, width: 1200, height: 630, alt: SITE_NAME}],
      ...(article?.published ? {publishedTime: article.published} : {}),
      ...(article?.section ? {section: article.section} : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      ...(description ? {description} : {}),
      images: [card],
    },
  }
}
