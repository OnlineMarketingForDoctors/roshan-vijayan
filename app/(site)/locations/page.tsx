import Link from 'next/link'
import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Locations | RV Plastic Surgery',
  description:
    'Mr Roshan Vijayan consults across four trusted private and NHS settings in Hertfordshire.',
}

const CARDS = [
  {
    img: '/images/web/loc-hatfield.png',
    tag: 'Private · Main Practice',
    name: 'One Hatfield Hospital',
    addr: '3 Hatfield Avenue, Hatfield, AL10 9UA',
    desc: 'A modern private hospital and the home of Mr Vijayan’s main practice, Leonie Grace Ltd, with on-site theatres, imaging and overnight care.',
    map: 'https://www.google.com/maps/search/?api=1&query=One+Hatfield+Hospital+AL10+9UA',
  },
  {
    img: '/images/web/loc-osd.png',
    tag: 'Private',
    name: 'One Stop Healthcare',
    addr: 'One Medical House, Boundary Way, Hemel Hempstead, HP2 7YU',
    desc: 'A contemporary private outpatient and diagnostic centre, ideal for consultations and minor procedures in west Hertfordshire.',
    map: 'https://www.google.com/maps/search/?api=1&query=One+Stop+Healthcare+Hemel+Hempstead+HP2+7YU',
  },
  {
    img: '/images/web/loc-london.png',
    tag: 'Private · Skin',
    name: 'London Skin Clinic',
    addr: '152 London Road, St Albans, AL1 1PQ',
    desc: 'An elegant St Albans clinic for skin assessments, mole and lesion checks and minor skin surgery in a discreet setting.',
    map: 'https://www.google.com/maps/search/?api=1&query=152+London+Road+St+Albans+AL1+1PQ',
  },
  {
    img: '/images/web/consultation.jpg',
    tag: 'NHS',
    name: 'Lister Hospital',
    addr: 'Coreys Mill Lane, Stevenage, SG1 4AB',
    desc: 'Mr Vijayan’s NHS base, where he serves as a consultant plastic surgeon within the East and North Hertfordshire NHS Trust.',
    map: 'https://www.google.com/maps/search/?api=1&query=Lister+Hospital+Stevenage+SG1+4AB',
  },
]

export default function LocationsPage() {
  return (
    <>
      <section className="page-hero">
        <img src="/images/web/clinic-interior.jpg" alt="A calm, luxurious clinic interior" />
        <div className="page-hero-veil" />
        <div className="page-hero-inner reveal">
          <span className="eyebrow">Locations</span>
          <h1 className="display">
            Consulting across
            <br />
            <em>Hertfordshire.</em>
          </h1>
          <p>
            Mr Vijayan sees patients at four trusted private and NHS settings, each calm, modern and
            easy to reach, with consultations often available within a week or two.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="loc-cards">
          {CARDS.map((c) => (
            <article className="loc-card reveal" key={c.name}>
              <div className="loc-img">
                <img src={c.img} alt={c.name} />
              </div>
              <div className="loc-info">
                <span className="loc-tag">{c.tag}</span>
                <h3>{c.name}</h3>
                <p className="loc-addr">{c.addr}</p>
                <p className="loc-addr">{c.desc}</p>
                <div className="loc-link">
                  <a className="btn btn-text" href={c.map} target="_blank" rel="noopener">
                    Get directions <span className="arrow">→</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <img src="/images/web/clinic-interior.jpg" alt="" aria-hidden="true" />
        <div className="cb-inner reveal">
          <span className="eyebrow">Begin</span>
          <h2 className="display">Find a time that suits you</h2>
          <p>Tell us where is most convenient and we’ll arrange your consultation, often within a week or two.</p>
          <Link className="btn btn-pill btn-gold" href="/contact">
            Request a Consultation
          </Link>
        </div>
      </section>
    </>
  )
}
