import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import {webPageLd} from '@/lib/schema'
import type {Metadata} from 'next'
import {absoluteUrl} from '@/lib/site'
import {sanityFetch} from '@/sanity/lib/fetch'
import {procedureListQuery, blogIndexQuery, beforeAfterQuery} from '@/sanity/lib/queries'
import {buildBAProcedures, type SanityBACase} from '@/sanity/lib/ba'
import {procedurePath, categorySegment} from '@/lib/procedurePath'

export const metadata: Metadata = {
  alternates: {canonical: absoluteUrl('/sitemap/')},
  title: 'Sitemap | RV Plastic Surgery',
  description:
    'Every page on the RV Plastic Surgery website in one place — procedures, before and after results, locations and the full journal archive.',
}

type Procedure = {_id: string; title: string; slug: string; category?: string}
type Post = {_id: string; title: string; slug: string; category?: string}

// The pages a reader would look for. /thank-you-contact is left out on
// purpose — it is where the form lands, not somewhere to navigate to.
const PAGES = [
  {href: '/', label: 'Home'},
  {href: '/about', label: 'About Mr Vijayan'},
  {href: '/procedures', label: 'Procedures'},
  {href: '/gallery', label: 'Before & After'},
  {href: '/locations', label: 'Locations'},
  {href: '/blog', label: 'Journal'},
  {href: '/contact', label: 'Contact'},
]

/** Headings for the URL segment each procedure category maps to. */
const AREAS: {seg: string; title: string}[] = [
  {seg: 'body', title: 'Body'},
  {seg: 'face', title: 'Face & Eyes'},
  {seg: 'skin', title: 'Skin & Reconstruction'},
  {seg: 'other', title: 'Other Procedures'},
]

export default async function SitemapPage() {
  const [procedures, posts, baCases] = await Promise.all([
    sanityFetch<Procedure[]>(procedureListQuery, {}, []),
    sanityFetch<Post[]>(blogIndexQuery, {}, []),
    sanityFetch<SanityBACase[]>(beforeAfterQuery, {}, []),
  ])
  const results = buildBAProcedures(baCases)

  const areas = AREAS.map((a) => ({
    ...a,
    items: procedures.filter((p) => p.slug && categorySegment(p.category) === a.seg),
  })).filter((a) => a.items.length)

  // journal categories in the order they first appear, so a new one needs no code
  const categories = posts.reduce<string[]>(
    (acc, p) => (p.category && !acc.includes(p.category) ? [...acc, p.category] : acc),
    [],
  )
  const uncategorised = posts.filter((p) => !p.category)

  return (
    <>
      <section className="page-head">
        <span className="eyebrow">Sitemap</span>
        <h1 className="display">Everything, in one place.</h1>
        <p>
          Every page on this site. If you are looking for something specific and cannot find it,
          please <Link href="/contact">get in touch</Link> — we are happy to point you to it.
        </p>
        <Breadcrumbs trail={[{name: 'Sitemap', href: '/sitemap'}]} />
      </section>

      <section className="section">
        {/* deliberately not .reveal: the scroll-reveal observer needs 12% of an
            element in view, and this list is several screens tall, so it would
            never trip — on a phone it never exceeded 9%, leaving the page blank */}
        <div className="sitemap narrow">
          <section className="sitemap-block">
            <h2>Pages</h2>
            <ul className="sitemap-list">
              {PAGES.map((p) => (
                <li key={p.href}>
                  <Link href={p.href}>{p.label}</Link>
                </li>
              ))}
            </ul>
          </section>

          {areas.length ? (
            <section className="sitemap-block">
              <h2>Procedures</h2>
              {areas.map((a) => (
                <div className="sitemap-group" key={a.seg}>
                  <h3>{a.title}</h3>
                  <ul className="sitemap-list">
                    {a.items.map((p) => (
                      <li key={p._id}>
                        <Link href={procedurePath(p.category, p.slug)}>{p.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ) : null}

          {results.length ? (
            <section className="sitemap-block">
              <h2>Before &amp; After</h2>
              <ul className="sitemap-list">
                {results.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/gallery/${r.slug}`}>{r.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {posts.length ? (
            <section className="sitemap-block">
              <h2>Journal</h2>
              {categories.map((c) => (
                <div className="sitemap-group" key={c}>
                  <h3>
                    <Link href={`/blog/?category=${encodeURIComponent(c)}`}>{c}</Link>
                  </h3>
                  <ul className="sitemap-list">
                    {posts
                      .filter((p) => p.category === c)
                      .map((p) => (
                        <li key={p._id}>
                          <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
              {uncategorised.length ? (
                <div className="sitemap-group">
                  <h3>More articles</h3>
                  <ul className="sitemap-list">
                    {uncategorised.map((p) => (
                      <li key={p._id}>
                        <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          <p className="sitemap-note">
            Search engines read <a href="/sitemap.xml">/sitemap.xml</a>, which lists the same pages
            in machine-readable form.
          </p>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageLd({
              path: '/sitemap/',
              name: 'Sitemap',
              description: metadata.description as string,
            }),
          ),
        }}
      />
    </>
  )
}
