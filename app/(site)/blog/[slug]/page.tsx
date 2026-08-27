import Link from 'next/link'
import {notFound} from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import {articleLd} from '@/lib/schema'
import {pageMetadata} from '@/lib/meta'
import type {Metadata} from 'next'
import {absoluteUrl} from '@/lib/site'
import {sanityFetch} from '@/sanity/lib/fetch'
import {client} from '@/sanity/lib/client'
import {
  blogPostQuery,
  blogSlugsQuery,
  blogCategoriesQuery,
  relatedPostsQuery,
} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'
import PortableTextBody from '@/components/PortableTextBody'
import BlogSidebar, {type SidebarPost} from '@/components/BlogSidebar'

type Params = {params: Promise<{slug: string}>}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function fmt(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d.getTime()) ? '' : `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/**
 * The hero is full bleed, so it always needs a picture. Posts imported from the
 * old blog have no cover yet, and a hero with a hole in it is worse than one
 * with a stock image, so it falls back to a repository file chosen from the
 * slug — stable per post rather than changing between renders.
 */
const HERO_FALLBACKS = [
  '/images/web/blog-breast.webp',
  '/images/web/blog-recovery.webp',
  '/images/web/blog-facial.webp',
  '/images/web/blog-consultation.webp',
  '/images/web/blog-scar.webp',
  '/images/web/blog-choosing.webp',
]
const fallbackFor = (slug: string) => {
  let n = 0
  for (const ch of slug) n = (n + ch.charCodeAt(0)) % HERO_FALLBACKS.length
  return HERO_FALLBACKS[n]
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
  return pageMetadata({
    path: `/blog/${slug}/`,
    title: `${p.title} | RV Plastic Surgery`,
    description: p.excerpt || undefined,
    image: p.coverImage ? urlFor(p.coverImage).width(1200).quality(80).url() : undefined,
    article: {published: p.publishedAt || undefined, section: p.category || undefined},
  })
}

export default async function BlogPostPage({params}: Params) {
  const {slug} = await params
  const p = await sanityFetch<any>(blogPostQuery, {slug}, null)
  if (!p) notFound()

  const [cats, related] = await Promise.all([
    sanityFetch<{category?: string}[]>(blogCategoriesQuery, {}, []),
    sanityFetch<{sameCategory: SidebarPost[]; recent: SidebarPost[]}>(
      relatedPostsQuery,
      {slug, category: p.category ?? null},
      {sameCategory: [], recent: []},
    ),
  ])

  const counts = new Map<string, number>()
  for (const c of cats) if (c.category) counts.set(c.category, (counts.get(c.category) || 0) + 1)
  const categories = [...counts]
    .map(([name, count]) => ({name, count}))
    .sort((a, b) => b.count - a.count)

  // same category first, topped up with recent posts when that is a short list
  const seen = new Set<string>()
  const sidebarPosts = [...(related.sameCategory || []), ...(related.recent || [])]
    .filter((r) => r && r.slug !== slug && !seen.has(r.slug) && seen.add(r.slug))
    .slice(0, 4)

  const heroSrc = p.coverImage
    ? urlFor(p.coverImage).width(2000).quality(80).url()
    : fallbackFor(slug)

  return (
    <>
      <section className="page-hero bp-hero">
        <img src={heroSrc} alt={p.title} decoding="async" fetchPriority="high" />
        <div className="page-hero-veil" />
        <div className="page-hero-inner reveal">
          <Link className="bp-back" href="/blog">
            ← The Journal
          </Link>
          <h1 className="display">{p.title}</h1>
          <p className="bp-meta">
            {p.category ? <span className="bp-cat">{p.category}</span> : null}
            {p.publishedAt ? <span>{fmt(p.publishedAt)}</span> : null}
          </p>
          <Breadcrumbs trail={[{name: 'Journal', href: '/blog'}, {name: p.title}]} />
        </div>
      </section>

      <div className="bp-layout">
        <article className="bp-main">
          {p.excerpt ? <p className="bp-standfirst reveal">{p.excerpt}</p> : null}
          <div className="bp-body prose reveal">
            <PortableTextBody value={p.body} />
          </div>
        </article>

        <BlogSidebar categories={categories} related={sidebarPosts} activeCategory={p.category} />
      </div>

      <section className="cta-band">
        <img src="/images/web/silk-texture.webp" alt="" aria-hidden="true" decoding="async" loading="lazy" />
        <div className="cb-inner reveal">
          <span className="eyebrow">Begin</span>
          <h2 className="display">Have a question of your own?</h2>
          <p>The best answers are personal. Ask Mr Vijayan directly, enquiries are answered within a day.</p>
          <Link className="btn btn-pill btn-gold" href="/contact">
            Request a Consultation
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleLd({
              path: `/blog/${slug}/`,
              title: p.title,
              description: p.excerpt || undefined,
              image: heroSrc.startsWith('http') ? heroSrc : absoluteUrl(heroSrc),
              published: p.publishedAt || undefined,
              section: p.category || undefined,
            }),
          ),
        }}
      />
    </>
  )
}
