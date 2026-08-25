import Link from 'next/link'
import {urlFor} from '@/sanity/lib/image'

export type SidebarPost = {
  title: string
  slug: string
  publishedAt?: string
  coverImage?: unknown
  category?: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fmt = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d.getTime()) ? '' : `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/** Posts have no cover yet, so the thumbnail falls back to a repository image. */
const FALLBACKS = [
  '/images/web/blog-breast.webp',
  '/images/web/blog-recovery.webp',
  '/images/web/blog-facial.webp',
  '/images/web/blog-consultation.webp',
  '/images/web/blog-scar.webp',
  '/images/web/blog-choosing.webp',
]

const thumb = (img: unknown, i: number) =>
  img ? urlFor(img as never).width(220).height(150).quality(78).url() : FALLBACKS[i % FALLBACKS.length]

export const categoryHref = (name: string) => `/blog/?category=${encodeURIComponent(name)}`

export default function BlogSidebar({
  categories,
  related,
  activeCategory,
}: {
  categories: {name: string; count: number}[]
  related: SidebarPost[]
  activeCategory?: string
}) {
  return (
    <aside className="bp-side" aria-label="More from the journal">
      {categories.length ? (
        <section className="side-card">
          <h3 className="side-title">Categories</h3>
          <ul className="side-cats">
            {categories.map((c) => (
              <li key={c.name}>
                <Link
                  href={categoryHref(c.name)}
                  className={c.name === activeCategory ? 'is-active' : undefined}
                >
                  <span>{c.name}</span>
                  <em>{c.count}</em>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {related.length ? (
        <section className="side-card">
          <h3 className="side-title">Continue reading</h3>
          <ul className="side-posts">
            {related.map((p, i) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`}>
                  <span className="sp-thumb">
                    <img src={thumb(p.coverImage, i)} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                  </span>
                  <span className="sp-copy">
                    <span className="sp-title">{p.title}</span>
                    {p.publishedAt ? <span className="sp-date">{fmt(p.publishedAt)}</span> : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* The gallery is the strongest thing a reader can be sent to next. The
          backdrop is deliberately a texture rather than a patient photograph:
          those belong in the gallery, in context, not as decoration repeated
          beside every article. */}
      <section className="side-banner">
        <img src="/images/web/silk-texture.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <div className="sb-inner">
          <span className="eyebrow">Results</span>
          <h3>Before &amp; After</h3>
          <p>Real patients, photographed under consistent conditions.</p>
          <Link className="btn btn-pill btn-gold" href="/gallery">
            View the gallery
          </Link>
        </div>
      </section>
    </aside>
  )
}
