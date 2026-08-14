import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import {absoluteUrl} from '@/lib/site'
import {sanityFetch} from '@/sanity/lib/fetch'
import {client} from '@/sanity/lib/client'
import {blogPostQuery, blogSlugsQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'
import PortableTextBody from '@/components/PortableTextBody'

type Params = {params: Promise<{slug: string}>}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function fmt(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d.getTime()) ? '' : `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<{slug: string}[]>(blogSlugsQuery)
    return (slugs || []).map((s) => ({slug: s.slug}))
  } catch {
    return []
  }
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {slug} = await params
  const p = await sanityFetch<any>(blogPostQuery, {slug}, null)
  if (!p) return {}
  return {
    alternates: {canonical: absoluteUrl(`/blog/${slug}/`)},
    title: `${p.title} | RV Plastic Surgery`,
    description: p.excerpt || undefined,
  }
}

export default async function BlogPostPage({params}: Params) {
  const {slug} = await params
  const p = await sanityFetch<any>(blogPostQuery, {slug}, null)
  if (!p) notFound()

  return (
    <>
      <article className="blog-post-wrap">
        <div className="bp-head reveal">
          <Link className="bp-back" href="/blog">
            ← The Journal
          </Link>
          <h1 className="display">{p.title}</h1>
          {p.publishedAt ? <p className="bp-meta">{fmt(p.publishedAt)}</p> : null}
        </div>
        {p.coverImage ? (
          <div className="bp-cover">
            <img src={urlFor(p.coverImage).width(1600).quality(82).url()} alt={p.title} />
          </div>
        ) : null}
        <div className="bp-body prose reveal">
          <PortableTextBody value={p.body} />
        </div>
      </article>

      <section className="cta-band">
        <img src="/images/web/silk-texture.jpg" alt="" aria-hidden="true" />
        <div className="cb-inner reveal">
          <span className="eyebrow">Begin</span>
          <h2 className="display">Have a question of your own?</h2>
          <p>The best answers are personal. Ask Mr Vijayan directly, enquiries are answered within a day.</p>
          <Link className="btn btn-pill btn-gold" href="/contact">
            Request a Consultation
          </Link>
        </div>
      </section>
    </>
  )
}
