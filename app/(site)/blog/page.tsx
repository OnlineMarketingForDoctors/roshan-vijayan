import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import {webPageLd} from '@/lib/schema'
import {pageMetadata} from '@/lib/meta'
import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {blogListQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'

export const metadata: Metadata = pageMetadata({
  path: '/blog/',
  title: 'Journal, Insight & Advice | RV Plastic Surgery',
  description:
    'Considered, honest guidance on aesthetic and reconstructive surgery, recovery and aftercare from Mr Roshan Vijayan and his team.',
  image: '/images/web/lifestyle-laugh.webp',
})

type Post = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  featured?: boolean
  coverImage?: unknown
  plain?: string
  category?: string
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

export default async function BlogPage({searchParams}: {searchParams?: Promise<{category?: string}>}) {
  const all = await sanityFetch<Post[]>(blogListQuery, {}, [])

  // the sidebar links here with ?category=, so the listing narrows to match
  const active = (await searchParams)?.category
  const posts = active ? all.filter((p) => p.category === active) : all

  if (!posts.length) {
    return (
      <section className="section">
        <div className="section-head center reveal">
          <span className="eyebrow">The Journal</span>
          <h1 className="display">Honest insight, thoughtfully written.</h1>
          {active ? (
            <p>
              Nothing filed under “{active}” yet. <Link href="/blog">See every article</Link>.
            </p>
          ) : (
            <p>New articles are on the way. Please check back shortly.</p>
          )}
        </div>
      </section>
    )
  }

  const featured = posts.find((p) => p.featured) || posts[0]
  const rest = posts.filter((p) => p._id !== featured._id)

  const categories = [...new Set(all.map((p) => p.category).filter(Boolean))] as string[]

  return (
    <>
      <section className="page-hero">
        <picture>
          <source media="(max-width: 640px)" srcSet="/images/web/lifestyle-laugh-tall.webp" />
          <img src="/images/web/lifestyle-laugh.webp" alt="A woman laughing in warm natural light" decoding="async" fetchPriority="high" />
        </picture>
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
          <Breadcrumbs trail={[{name: 'Journal', href: '/blog'}]} />
        </div>
      </section>

      {categories.length ? (
        <section className="section" style={{paddingBottom: 0}}>
          <nav className="blog-filters reveal" aria-label="Filter by category">
            <Link href="/blog" className={active ? undefined : 'is-active'}>
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/blog/?category=${encodeURIComponent(c)}`}
                className={active === c ? 'is-active' : undefined}
              >
                {c}
              </Link>
            ))}
          </nav>
        </section>
      ) : null}

      <section className="section">
        <article className="blog-feature reveal">
          <Link className="bf-link" href={`/blog/${featured.slug}`} style={{display: 'contents'}}>
            <img src={cover(featured.coverImage, 900, '/images/web/blog-choosing.webp')} alt={featured.title} decoding="async" loading="lazy" />
            <div className="bf-body">
              <span className="post-cat">{active || 'Editor’s Pick'}</span>
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
                    <img src={cover(p.coverImage, 600, '/images/web/blog-consultation.webp')} alt={p.title} loading="lazy" decoding="async" />
                  </div>
                  <div className="post-body">
                    <span className="post-cat">{p.category || 'Journal'}</span>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageLd({
              path: '/blog/',
              name: 'Journal',
              description: metadata.description as string,
            }),
          ),
        }}
      />
    </>
  )
}
