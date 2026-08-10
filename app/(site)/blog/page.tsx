import Link from 'next/link'
import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {blogListQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'

export const metadata: Metadata = {
  title: 'Journal, Insight & Advice | RV Plastic Surgery',
  description:
    'Considered, honest guidance on aesthetic and reconstructive surgery, recovery and aftercare from Mr Roshan Vijayan and his team.',
}

type Post = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  featured?: boolean
  coverImage?: unknown
  plain?: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function fmt(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d.getTime()) ? '' : `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}
function readingTime(plain?: string) {
  const w = plain ? plain.split(/\s+/).filter(Boolean).length : 0
  return w ? `${Math.max(1, Math.round(w / 200))} min read` : ''
}
function cover(img: unknown, w: number, fallback: string) {
  return img ? urlFor(img as never).width(w).quality(82).url() : fallback
}

export default async function BlogPage() {
  const posts = await sanityFetch<Post[]>(blogListQuery, {}, [])

  if (!posts.length) {
    return (
      <section className="section">
        <div className="section-head center reveal">
          <span className="eyebrow">The Journal</span>
          <h1 className="display">Honest insight, thoughtfully written.</h1>
          <p>New articles are on the way. Please check back shortly.</p>
        </div>
      </section>
    )
  }

  const featured = posts.find((p) => p.featured) || posts[0]
  const rest = posts.filter((p) => p._id !== featured._id)

  return (
    <>
      <section className="page-hero">
        <img src="/images/web/lifestyle-laugh.jpg" alt="A woman laughing in warm natural light" />
        <div className="page-hero-veil" />
        <div className="page-hero-inner reveal">
          <span className="eyebrow">The Journal</span>
          <h1 className="display">
            Honest insight,
            <br />
            <em>thoughtfully written.</em>
          </h1>
          <p>
            Considered guidance on surgery, recovery and aftercare, written to inform and reassure,
            never to sell. Knowledge is the first step of any good decision.
          </p>
          <div className="page-hero-actions">
            <Link className="btn btn-pill btn-gold" href="/contact">
              Request a Consultation
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <article className="blog-feature reveal">
          <Link className="bf-link" href={`/blog/${featured.slug}`} style={{display: 'contents'}}>
            <img src={cover(featured.coverImage, 900, '/images/web/blog-choosing.png')} alt={featured.title} />
            <div className="bf-body">
              <span className="post-cat">Editor’s Pick</span>
              <h2 className="display">{featured.title}</h2>
              {featured.excerpt ? <p className="body">{featured.excerpt}</p> : null}
              <p className="post-meta">
                {[fmt(featured.publishedAt), readingTime(featured.plain)].filter(Boolean).join(' · ')}
              </p>
            </div>
          </Link>
        </article>
      </section>

      {rest.length ? (
        <section className="section" style={{paddingTop: 0}}>
          <div className="blog-grid">
            {rest.map((p) => (
              <article className="post-card reveal" key={p._id}>
                <Link className="post-link" href={`/blog/${p.slug}`} style={{display: 'flex', flexDirection: 'column', flex: 1, color: 'inherit'}}>
                  <div className="post-img">
                    <img src={cover(p.coverImage, 600, '/images/web/blog-consultation.png')} alt={p.title} loading="lazy" />
                  </div>
                  <div className="post-body">
                    <span className="post-cat">Journal</span>
                    <h3>{p.title}</h3>
                    <p className="post-excerpt">{p.excerpt || ''}</p>
                    <p className="post-meta">
                      {[fmt(p.publishedAt), readingTime(p.plain)].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
