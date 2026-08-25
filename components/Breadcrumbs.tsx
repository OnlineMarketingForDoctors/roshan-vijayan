import Link from 'next/link'
import {absoluteUrl} from '@/lib/site'

export type Crumb = {name: string; href?: string}

/**
 * The trail at the foot of a page's hero, and the BreadcrumbList that describes
 * it to search engines.
 *
 * Home is added here rather than at every call site, and the last crumb is the
 * page itself: it is not a link, but it is still listed in the structured data,
 * which expects the whole path including the current page.
 *
 * Not used on the homepage — a trail of one is not a trail.
 */
export default function Breadcrumbs({trail}: {trail: Crumb[]}) {
  const items: Crumb[] = [{name: 'Home', href: '/'}, ...trail]

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.href ? {item: absoluteUrl(c.href)} : {}),
    })),
  }

  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          {items.map((c, i) => (
            <li key={`${c.name}-${i}`}>
              {c.href && i < items.length - 1 ? (
                <Link href={c.href}>{c.name}</Link>
              ) : (
                <span aria-current="page">{c.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ld)}} />
    </>
  )
}
