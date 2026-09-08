import {PortableText, type PortableTextComponents} from '@portabletext/react'
import {urlFor} from '@/sanity/lib/image'

const components: PortableTextComponents = {
  types: {
    image: ({value}) => {
      if (!value?.asset) return null
      return (
        <figure className="prose-img">
          <img src={urlFor(value).width(1400).quality(82).url()} alt={value.alt || ''} loading="lazy" decoding="async" />
          {value.caption ? <figcaption>{value.caption}</figcaption> : null}
        </figure>
      )
    },
    /* Portable text has no table, so this renders the proseTable object. The
       first cell of a row is its heading, and every other cell carries the
       column it sits under, which a phone shows as a label once the columns
       are too narrow to keep side by side. */
    proseTable: ({value}) => {
      const columns: string[] = Array.isArray(value?.columns) ? value.columns : []
      const rows: {cells?: string[]}[] = Array.isArray(value?.rows) ? value.rows : []
      if (!columns.length && !rows.length) return null
      const titleId = value?.title ? `tbl-${value._key || 'x'}` : undefined
      return (
        <figure className="prose-table">
          {value.title ? <figcaption id={titleId}>{value.title}</figcaption> : null}
          <div className="pt-scroll">
            <table {...(titleId ? {'aria-labelledby': titleId} : {})}>
              {columns.length ? (
                <thead>
                  <tr>
                    {columns.map((c, i) => (
                      <th key={i} scope="col">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    {(r?.cells || []).map((c, j) =>
                      j === 0 ? (
                        <th key={j} scope="row">
                          {c}
                        </th>
                      ) : (
                        <td key={j} data-label={columns[j] || undefined}>
                          {c}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      )
    },
  },
  marks: {
    // A link out of the site opens in its own tab and is not an endorsement:
    // nofollow keeps this site's ranking to itself, noopener/noreferrer keep
    // the new tab from reaching back into this one.
    link: ({value, children}) => {
      const href = value?.href || '#'
      const ext = /^https?:/.test(href)
      return (
        <a
          href={href}
          {...(ext ? {target: '_blank', rel: 'nofollow noopener noreferrer'} : {})}
        >
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
