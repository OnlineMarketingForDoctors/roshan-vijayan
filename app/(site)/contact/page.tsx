import Link from 'next/link'
import type {Metadata} from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Request a Consultation | RV Plastic Surgery',
  description:
    'Request a consultation with Mr Roshan Vijayan, Consultant Plastic Surgeon in Hertfordshire. Enquiries answered personally, usually within a day.',
}

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <img src="/images/web/consultation.jpg" alt="An unhurried consultation" />
        <div className="page-hero-veil" />
        <div className="page-hero-inner reveal">
          <span className="eyebrow">Begin</span>
          <h1 className="display">
            Request a
            <br />
            <em>consultation.</em>
          </h1>
          <p>
            Tell Mr Vijayan a little about what you’d like to achieve. Enquiries are answered
            personally, usually within a day, with no pressure, only an honest, expert opinion.
          </p>
        </div>
      </section>

      <section className="contact">
        <div className="contact-inner">
          <div className="contact-copy reveal">
            <span className="eyebrow">Get in Touch</span>
            <h2 className="display">
              A conversation,
              <br />
              <em>to begin with.</em>
            </h2>
            <p>
              Every first consultation is 20–30 unhurried minutes, time to listen, assess and explore
              your goals before anything is decided.
            </p>
            <ul className="contact-meta">
              <li><span>Call</span> 01727 221799</li>
              <li><span>Email</span> roshanvijayan@gmail.com</li>
              <li><span>Practice</span> Leonie Grace Ltd · One Hatfield Hospital</li>
              <li><span>Hours</span> Mon–Fri, 9am–5pm</li>
            </ul>
          </div>
          <ContactForm withLocation />
        </div>
      </section>

      <section className="section bg-ivory2 center">
        <div className="section-head center reveal">
          <span className="eyebrow">Where to Find Us</span>
          <h2 className="display">Four Hertfordshire settings</h2>
          <p>Choose whichever is most convenient, we’ll do the rest.</p>
        </div>
        <div className="stat-band reveal">
          <div className="stat"><strong style={{fontSize: '1.4rem'}}>One Hatfield</strong><span>3 Hatfield Avenue, Hatfield, AL10 9UA</span></div>
          <div className="stat"><strong style={{fontSize: '1.4rem'}}>One Stop Healthcare</strong><span>Boundary Way, Hemel Hempstead, HP2 7YU</span></div>
          <div className="stat"><strong style={{fontSize: '1.4rem'}}>London Skin Clinic</strong><span>152 London Road, St Albans, AL1 1PQ</span></div>
          <div className="stat"><strong style={{fontSize: '1.4rem'}}>Lister Hospital</strong><span>Coreys Mill Lane, Stevenage, SG1 4AB · NHS</span></div>
        </div>
        <p style={{marginTop: '2rem'}}>
          <Link className="btn btn-text" href="/locations">
            View all locations <span className="arrow">→</span>
          </Link>
        </p>
      </section>
    </>
  )
}
