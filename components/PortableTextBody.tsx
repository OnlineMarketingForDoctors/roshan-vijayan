import {PortableText, type PortableTextComponents} from '@portabletext/react'
import {urlFor} from '@/sanity/lib/image'

const components: PortableTextComponents = {
  types: {
    image: ({value}) => {
      if (!value?.asset) return null
      return (
        <figure className="prose-img">
          <img src={urlFor(value).width(1400).quality(82).url()} alt={value.alt || ''} loading="lazy" />
          {value.caption ? <figcaption>{value.caption}</figcaption> : null}
        </figure>
      )
    },
  },
  marks: {
    link: ({value, children}) => {
      const href = value?.href || '#'
      const ext = /^https?:/.test(href)
      return (
        <a href={href} {...(ext ? {target: '_blank', rel: 'noopener'} : {})}>
          {children}
        </a>
      )
    },
  },
}

/**
 * Renders portable text, and tolerates a plain string.
 *
 * The procedure fields that carry prose were plain text before they were given
 * link support, and the seed scripts still write strings, so a value can arrive
 * as either. A string renders as the single paragraph it always was.
 */
export default function PortableTextBody({value}: {value: unknown}) {
  if (!value) return null
  if (typeof value === 'string') return <p>{value}</p>
  return <PortableText value={value as never} components={components} />
}

/** Flattens portable text to plain text, for meta descriptions and JSON-LD. */
export function toPlain(value: unknown): string {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''
  return value
    .filter((b) => (b as {_type?: string})?._type === 'block')
    .map((b) =>
      ((b as {children?: {text?: string}[]}).children || [])
        .map((c) => c.text || '')
        .join(''),
    )
    .join(' ')
    .trim()
}
