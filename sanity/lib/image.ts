import imageUrlBuilder from '@sanity/image-url'
import type {Image} from 'sanity'
import {client} from './client'

const builder = imageUrlBuilder(client)

/**
 * A URL for an image held in Sanity.
 *
 * `auto('format')` lets the CDN answer with WebP (or AVIF) when the browser
 * says it can read it, and the original format when it cannot — the same
 * picture, roughly a third of the bytes, with no fallback markup to maintain.
 * Every call site chains .width()/.quality() onto this, and those still apply.
 */
export function urlFor(source: Image | string) {
  return builder.image(source).auto('format')
}
