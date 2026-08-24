import Link from 'next/link'
import type {Metadata} from 'next'
import {absoluteUrl} from '@/lib/site'
import {sanityFetch} from '@/sanity/lib/fetch'
import {procedureListQuery} from '@/sanity/lib/queries'
import {procedurePath} from '@/lib/procedurePath'
import {SERVICE_TAGS, type ServiceTag} from '@/lib/serviceCategories'

export const metadata: Metadata = {
  alternates: {canonical: absoluteUrl('/procedures/')},
  title: 'Procedures | RV Plastic Surgery',
  description:
    'Aesthetic and reconstructive procedures by Mr Roshan Vijayan, Consultant Plastic Surgeon in Hertfordshire — body, breast, face & eyes, and skin & reconstruction.',
}

/** A pill in a category band — see lib/serviceCategories. */
type Tag = ServiceTag

type Category = {
  id: string
  eyebrow: string
  tag: string
  heading: React.ReactNode
  body: string
  img: string
  alt: string
  tags: Tag[]
  cta: string
  flip?: boolean
  bg?: boolean
}

const CATEGORIES: Category[] = [
  {
    id: 'body',
    eyebrow: 'Body Contouring',
    tag: 'Body',
    heading: (<>Reveal the<br />physique beneath.</>),
    body: 'A particular focus of the practice: restoring the body after pregnancy or significant weight loss by refining loose, redundant skin and re-defining a natural, proportioned shape.',
    img: '/images/web/body-contour.jpg',
    alt: 'Body contouring surgery',
    tags: SERVICE_TAGS.body,
    cta: 'Enquire about body surgery',
  },
  {
    id: 'breast',
    eyebrow: 'Breast Surgery',
    tag: 'Breast',
    heading: (<>Proportion,<br />comfort, balance.</>),
    body: 'From reduction and uplift to augmentation and reconstruction, Mr Vijayan plans breast surgery around your frame and your wishes, for results that feel as natural as they look.',
    img: '/images/web/decolletage.jpg',
    alt: 'Breast surgery',
    tags: SERVICE_TAGS.breast,
    cta: 'Enquire about breast surgery',
    flip: true,
    bg: true,
  },
  {
    id: 'face',
    eyebrow: 'Face & Eyes',
    tag: 'Face & Eyes',
    heading: (<>Refreshed, never<br />rearranged.</>),
    body: 'Facial and eyelid surgery designed to soften the signs of time while keeping every feature unmistakably yours, subtle, rested and naturally in keeping with your face.',
    img: '/images/web/face-portrait.jpg',
    alt: 'Facial aesthetic surgery',
    tags: SERVICE_TAGS.face,
    cta: 'Enquire about facial surgery',
  },
  {
    id: 'skin',
    eyebrow: 'Skin & Reconstruction',
    tag: 'Skin & Reconstruction',
    heading: (<>Expert care for<br />skin and lesions.</>),
    body: 'From mole and lesion checks to skin-cancer removal and reconstructive work, Mr Vijayan brings reconstructive precision to results that heal discreetly and beautifully.',
    img: '/images/web/proc-skin.png',
    alt: 'Skin and reconstructive surgery',
    tags: SERVICE_TAGS.skin,
    cta: 'Enquire about skin surgery',
    flip: true,
    bg: true,
  },
]

const STEPS = [
  ['01', 'Enquiry', 'A simple message or call to begin the conversation.'],
  ['02', 'First consultation', '20–30 unhurried minutes to listen, assess and explore your goals.'],
  ['03', 'Written plan', 'A thorough letter summarising the approach, recovery and risks.'],
  ['04', 'Second consultation', 'Included as standard, to recap, answer questions and confirm.'],
  ['05', 'Surgery', 'Performed by Mr Vijayan with a senior surgical assistant.'],
  ['06', 'Aftercare', 'A day-one call and unlimited, consultant-led follow-up.'],
]

type ProcedureRow = {slug: string; category?: string}

export default async function ProceduresPage() {
  // Resolve the pills against what is actually published, so a pill only ever
  // links to a page that exists, and picks up that page's category segment.
  const procedures = await sanityFetch<ProcedureRow[]>(procedureListQuery, {}, [])
  const paths = new Map<string, string>(
    (procedures || []).map((p) => [p.slug, procedurePath(p.category, p.slug)]),
  )

  return (
    <>
      <section className="page-hero">
        <img src="/images/web/procedures-hero.png" alt="Serene woman in ivory silk by a window" />
        <div className="page-hero-veil" />
        <div className="page-hero-inner reveal">
          <span className="eyebrow">Signature Procedures</span>
          <h1 className="display">
            Considered surgery,
            <br />
            <em>beautifully balanced.</em>
          </h1>
          <p>
            Whether you are restoring your body after weight loss or pregnancy, refining your shape, or
            seeking expert facial, eyelid and skin-cancer reconstruction, every plan is drawn up
            individually, with Mr Vijayan’s artistry and consultant-led care at its heart.
          </p>
          <div className="page-hero-actions">
            <Link className="btn btn-pill btn-gold" href="/contact">
              Request a Consultation
            </Link>
            <a className="btn btn-text light" href="#body">
              Browse procedures <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      <section className="section center">
        <div className="narrow reveal">
          <span className="eyebrow">An Individual Plan, Every Time</span>
          <p className="lead">
            No two bodies, faces or goals are the same, so no two plans are. Mr Vijayan studies each
            case holistically and explains, honestly, what surgery can and cannot achieve.
          </p>
        </div>
      </section>

      {CATEGORIES.map((c) => (
        <section className={`section${c.bg ? ' bg-ivory2' : ''}`} id={c.id} key={c.id}>
          <div className={`feature-row${c.flip ? ' flip' : ''}`}>
            <div className="feature-media reveal">
              <img src={c.img} alt={c.alt} />
              <span className="fm-tag">{c.tag}</span>
            </div>
            <div className="feature-copy reveal">
              <span className="eyebrow">{c.eyebrow}</span>
              <h2 className="display">{c.heading}</h2>
              <p>{c.body}</p>
              <ul className="proc-tags">
                {c.tags.map((t) => {
                  const href = t.slug ? paths.get(t.slug) : undefined
                  return (
                    <li key={t.label}>
                      {href ? <Link href={href}>{t.label}</Link> : <span>{t.label}</span>}
                    </li>
                  )
                })}
              </ul>
              <Link className="btn btn-text" href="/contact">
                {c.cta} <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </section>
      ))}

      <section className="section bg-cream">
        <div className="section-head center reveal">
          <span className="eyebrow">A Shared Journey</span>
          <h2 className="display">What to expect</h2>
        </div>
        <ol className="steps reveal">
          {STEPS.map(([no, h, p]) => (
            <li key={no}>
              <span className="step-no">{no}</span>
              <h4>{h}</h4>
              <p>{p}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="cta-band">
        <img src="/images/web/instruments.jpg" alt="" aria-hidden="true" />
        <div className="cb-inner reveal">
          <span className="eyebrow">Begin</span>
          <h2 className="display">Not sure which procedure is right?</h2>
          <p>
            That is exactly what a consultation is for. Tell Mr Vijayan what you’d like to achieve and
            he’ll give you an honest, expert view.
          </p>
          <Link className="btn btn-pill btn-gold" href="/contact">
            Request a Consultation
          </Link>
        </div>
      </section>
    </>
  )
}
