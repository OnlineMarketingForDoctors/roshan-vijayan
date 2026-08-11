import Link from 'next/link'
import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'About Mr Roshan Vijayan | RV Plastic Surgery',
  description:
    'Mr Roshan Vijayan, Consultant Plastic Surgeon in Hertfordshire — where artistry meets medicine. Eighteen years in medicine, consultant-led, natural results.',
}

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <img src="/images/web/about-hero.png" alt="Mr Roshan Vijayan, Consultant Plastic Surgeon" />
        <div className="page-hero-veil" />
        <div className="page-hero-inner reveal">
          <span className="eyebrow">About Mr Vijayan</span>
          <h1 className="display">
            Where artistry
            <br />
            <em>meets medicine.</em>
          </h1>
          <p>
            A consultant plastic surgeon who treats every operation as a partnership, is honest about
            what is involved, and devoted to a result that looks entirely, naturally you.
          </p>
          <div className="page-hero-actions">
            <Link className="btn btn-pill btn-gold" href="/contact">
              Request a Consultation
            </Link>
            <Link className="btn btn-text light" href="/procedures">
              Explore procedures <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section wm wm-david">
        <div className="feature-row">
          <div className="feature-media reveal">
            <img src="/images/web/doctor-suit.jpg" alt="Mr Roshan Vijayan, Consultant Plastic Surgeon" />
            <img className="sig fm-sign" src="/images/web/signature.png" alt="Signature of Mr Roshan Vijayan" />
          </div>
          <div className="feature-copy reveal">
            <span className="eyebrow">Eighteen Years a Doctor</span>
            <h2 className="display">
              An artist’s eye, a
              <br />
              doctor’s honesty.
            </h2>
            <p>
              Qualified as a doctor in 2008, Mr Vijayan has spent eighteen years in medicine, trained
              extensively across London’s teaching hospitals, and is now in his fifth year as an NHS
              consultant plastic surgeon.
            </p>
            <p>
              Alongside his private practice he holds a wide NHS practice consisting of skin-cancer
              removal and reconstruction, body contouring, hand surgery and complex reconstructive
              work. He has published extensively, presented internationally, and continues to train and
              mentor surgeons.
            </p>
            <ul className="cred-chips">
              <li>BSc (Hons), 2006</li>
              <li>MBBS, 2008</li>
              <li>FRCS (Plast)</li>
              <li>Executive MBA</li>
              <li>PgCert Clinical Education</li>
            </ul>
            <p className="gmc" style={{marginTop: '1.2rem', color: 'var(--gold-deep)', letterSpacing: '.04em'}}>
              GMC Reg. No. 7020524
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-cream center">
        <div className="narrow reveal">
          <span className="eyebrow">Precision · Care · Integrity</span>
          <p className="lead">
            <em>
              “I believe in surgery as a partnership, a shared journey, with honesty about what is
              involved and a result that looks entirely, naturally you.”
            </em>
          </p>
          <p className="body">
            For Mr Vijayan, plastic surgery sits where artistry meets medicine. A creative person at
            heart, he is drawn to studying a problem holistically, taking time, and crafting a result
            that is balanced and proportioned. He is, first and foremost, a doctor, frank about what is
            safe, advisable and truly in your best interests.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="stat-band reveal">
          <div className="stat"><strong>18</strong><span>years in medicine</span></div>
          <div className="stat"><strong>14</strong><span>years a surgeon</span></div>
          <div className="stat"><strong>5th yr</strong><span>as an NHS consultant</span></div>
          <div className="stat"><strong>1,000s</strong><span>of operations performed</span></div>
        </div>
      </section>

      <section className="section">
        <div className="feature-row flip">
          <div className="feature-media reveal">
            <img src="/images/web/robe-window.jpg" alt="A poised woman by a window in soft morning light" />
          </div>
          <div className="feature-copy reveal">
            <span className="eyebrow">A Particular Interest</span>
            <h2 className="display">
              Restoring the body
              <br />
              after change.
            </h2>
            <p>
              Mr Vijayan’s special interest is <strong>body restoration after pregnancy and significant
              weight loss</strong>, refining loose, redundant skin to reveal the physique beneath, and
              restoring the confidence to live fully again.
            </p>
            <p>
              Every plan is studied and drawn up individually, followed by a thorough written summary so
              you can reflect, unhurried, before deciding anything.
            </p>
            <Link className="btn btn-text" href="/procedures">
              Explore procedures <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-ivory2 wm wm-venus">
        <div className="section-head center reveal">
          <span className="eyebrow">The Vijayan Difference</span>
          <h2 className="display">Care that is genuinely personal</h2>
        </div>
        <ul className="tl reveal">
          <li><h4>Early, flexible availability</h4><p>Consultations often within a week or two, with flexible scheduling for surgery itself.</p></li>
          <li><h4>Highly bespoke plans</h4><p>Each plan is studied and drawn up individually, with a thorough written summary after your consultation.</p></li>
          <li><h4>Two-surgeon safety on complex cases</h4><p>For more complex procedures, Mr Vijayan frequently has a senior surgeon assist him, for greater precision, less time under anaesthetic and an added layer of safety.</p></li>
          <li><h4>Consultant-led aftercare</h4><p>Mr Vijayan personally reviews you, answers emails within a day, and calls on day one after surgery, never handed to others.</p></li>
          <li><h4>A second consultation, included</h4><p>Time to recap, ask anything that has surfaced, and confirm, built into the process as standard.</p></li>
        </ul>
      </section>

      <section className="cta-band">
        <img src="/images/web/clinic-interior.jpg" alt="" aria-hidden="true" />
        <div className="cb-inner reveal">
          <span className="eyebrow">Begin</span>
          <h2 className="display">Have a conversation with Mr Vijayan</h2>
          <p>Enquiries are answered personally, usually within a day. There is no pressure, only an honest, expert opinion.</p>
          <Link className="btn btn-pill btn-gold" href="/contact">
            Request a Consultation
          </Link>
        </div>
      </section>
    </>
  )
}
