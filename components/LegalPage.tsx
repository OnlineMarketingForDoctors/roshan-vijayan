import Breadcrumbs from '@/components/Breadcrumbs'
import {webPageLd} from '@/lib/schema'

/**
 * The shell the three legal pages share: the dark title band, a single column
 * of prose, and the structured data.
 *
 * They are written in the repository rather than the CMS on purpose. This is
 * the text the practice is held to, so a change to it should be a change
 * someone reviewed, not an edit someone made in a hurry.
 */
export default function LegalPage({
  title,
  standfirst,
  updated,
  path,
  description,
  children,
}: {
  title: string
  standfirst: string
  /** When the text last changed, e.g. '27 August 2026'. */
  updated: string
  path: string
  description: string
  children: React.ReactNode
}) {
  return (
    <>
      <section className="page-head">
        <span className="eyebrow">Legal</span>
        <h1 className="display">{title}</h1>
        <p>{standfirst}</p>
        <Breadcrumbs trail={[{name: title}]} />
      </section>

      <section className="section">
        <div className="narrow prose legal-prose">
          <p className="legal-updated">Last updated {updated}</p>
          {children}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageLd({path, name: title, description})),
        }}
      />
    </>
  )
}
