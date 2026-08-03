import {sanityFetch} from '@/sanity/lib/fetch'
import {siteSettingsQuery, procedureListQuery} from '@/sanity/lib/queries'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'

export const revalidate = 60

export default async function SiteLayout({children}: {children: React.ReactNode}) {
  const [settings, procedures] = await Promise.all([
    sanityFetch(siteSettingsQuery, {}, null),
    sanityFetch<{slug: string; title: string}[]>(procedureListQuery, {}, []),
  ])

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Header settings={settings} procedures={procedures || []} />
      <main>{children}</main>
      <Footer settings={settings} />
      <Reveal />
    </>
  )
}
