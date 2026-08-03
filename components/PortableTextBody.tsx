import {PortableText, type PortableTextComponents} from '@portabletext/react'
import {urlFor} from '@/sanity/lib/image'

const components: PortableTextComponents = {
  types: {
    image: ({value}) => {
      if (!value?.asset) return null
      return (
        <figure className="prose-img">
          <img src={urlFor(value).width(1400).quality(82).url()} alt={value.alt || ''} loading="lazy" />
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

export default function PortableTextBody({value}: {value: unknown}) {
  if (!value) return null
  return <PortableText value={value as never} components={components} />
}
