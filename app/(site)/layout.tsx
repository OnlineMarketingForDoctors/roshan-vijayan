import {sanityFetch} from '@/sanity/lib/fetch'
import {siteSettingsQuery, procedureListQuery, beforeAfterQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'
import {buildBAProcedures, type SanityBACase} from '@/sanity/lib/ba'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import BackToTop from '@/components/BackToTop'
import CookieConsent from '@/components/CookieConsent'

export const revalidate = 60

type ProcedureRow = {
  slug: string
  title: string
  category?: string
  overviewImage?: {asset?: unknown}
}

export default async function SiteLayout({children}: {children: React.ReactNode}) {
  const [settings, procedures, baCases] = await Promise.all([
    sanityFetch(siteSettingsQuery, {}, null),
    sanityFetch<ProcedureRow[]>(procedureListQuery, {}, []),
    sanityFetch<SanityBACase[]>(beforeAfterQuery, {}, []),
  ])

  // Build the menu thumbnails here rather than in the header, so the client
  // component only ever receives plain strings.
  const navProcedures = (procedures || []).map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    image: p.overviewImage?.asset
      ? urlFor(p.overviewImage as never).width(560).height(700).quality(70).url()
      : null,
  }))

  // the before & after menu lists the same treatments the gallery groups by
  const baTreatments = buildBAProcedures(baCases).map((p) => ({slug: p.slug, title: p.title}))

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Header settings={settings} procedures={navProcedures} results={baTreatments} />
      <main>{children}</main>
      <Footer settings={settings} />
      <Reveal />
      <BackToTop />
      <CookieConsent />
    </>
  )
}
