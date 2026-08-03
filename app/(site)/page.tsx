import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/fetch'
import {reviewsQuery, beforeAfterQuery, siteSettingsQuery} from '@/sanity/lib/queries'
import {FALLBACK_REVIEWS} from '@/sanity/lib/fallbacks'
import {buildBAGroups} from '@/sanity/lib/ba'
import ReviewsCarousel, {type Review} from '@/components/ReviewsCarousel'
import BeforeAfter from '@/components/BeforeAfter'
import ServicesCarousel from '@/components/ServicesCarousel'
import ContactForm from '@/components/ContactForm'

type Settings = {reviewScore?: string; reviewCount?: number; reviewSource?: string} | null

export default async function Home() {
  const [reviews, baCases, settings] = await Promise.all([
    sanityFetch<Review[]>(reviewsQuery, {}, []),
    sanityFetch<unknown[]>(beforeAfterQuery, {}, []),
    sanityFetch<Settings>(siteSettingsQuery, {}, null),
  ])

  const reviewList = reviews.length ? reviews : FALLBACK_REVIEWS
  const groups = buildBAGroups(baCases as never)

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-media">
          <img src="/images/web/hero-woman.jpg" alt="A poised, confident woman in champagne silk" />
          <div className="hero-veil" />
        </div>
        <div className="hero-inner">
          <div className="hero-copy reveal">
            <span className="eyebrow">Consultant Plastic Surgeon · Hertfordshire</span>
            <h1 className="display">
              The quiet art of
              <br />
              <em>looking like yourself</em>
              <br />
              again.
            </h1>
            <p className="hero-sub">
              Mr Roshan Vijayan specialises in natural, beautifully balanced body contouring and
              aesthetic surgery, restoring confidence with safe, tried-and-tested technique, expertly
              executed.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-pill btn-gold" href="/contact">
                Request a Consultation
              </Link>
              <Link className="btn btn-text" href="/procedures">
                Explore procedures <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
        <ul className="usp" aria-label="Why patients choose Mr Vijayan">
          <li><span className="usp-no">01</span>Consultant-led care, first call to final review</li>
          <li><span className="usp-no">02</span>Your second consultation, included</li>
          <li><span className="usp-no">03</span>Unlimited aftercare at no extra cost</li>
          <li><span className="usp-no">04</span>Appointments often within two weeks</li>
          <li><span className="usp-no">05</span>Honest, no-pressure advice, always</li>
          <li><span className="usp-no">06</span>Two-surgeon safety on more complex cases</li>
        </ul>
      </section>

      {/* REVIEWS */}
      <ReviewsCarousel
        reviews={reviewList}
        reviewScore={settings?.reviewScore || '5.0'}
        reviewCount={settings?.reviewCount ?? 45}
        reviewSource={settings?.reviewSource || 'iWantGreatCare'}
      />

      {/* PHILOSOPHY */}
      <section className="philosophy" id="ethos">
        <div className="blob blob-1" aria-hidden="true" />
        <div className="phil-portrait reveal">
          <img src="/images/web/doctor-suit.jpg" alt="Mr Roshan Vijayan, Consultant Plastic Surgeon" />
          <img className="phil-sign" src="/images/web/signature.png" alt="Signature of Mr Roshan Vijayan" />
        </div>
        <div className="phil-copy reveal">
          <span className="eyebrow">Meet Mr Vijayan</span>
          <p className="lead-quote display">
            <em>
              “I believe in surgery as a partnership, a shared journey, with honesty about what is
              involved and a result that looks entirely, naturally you.”
            </em>
          </p>
          <p>
            For Mr Vijayan, plastic surgery sits where artistry meets medicine. An artistic eye,
            meticulous attention to detail and a holistic, unhurried approach shape every plan he
            creates. He is, first and foremost, a doctor, frank about what is safe, advisable and
            truly in your best interests.
          </p>
          <p>
            His particular interest is <strong>body restoration after pregnancy and weight loss</strong>:
            refining loose, redundant skin to reveal the physique beneath, and restoring the confidence
            to live fully again.
          </p>
          <Link className="btn btn-text" href="/about">
            More about Mr Vijayan <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      {/* RESULTS */}
      <section className="results" id="gallery">
        <div className="results-head reveal">
          <span className="eyebrow">Before &amp; After</span>
          <h2 className="display">
            Results that <em>speak softly.</em>
          </h2>
          <p>
            Real outcomes from real patients, natural, balanced and beautifully healed. Drag the
            handle on each case to reveal the journey, before and after.
          </p>
        </div>
        <BeforeAfter groups={groups} />
      </section>

      {/* SERVICES */}
      <section className="services" id="procedures">
        <div className="svc-intro reveal">
          <span className="eyebrow">Signature Procedures</span>
          <h2 className="display">
            Our main
            <br />
            <em>services</em>
          </h2>
          <p>
            Whether you are restoring your body after weight loss or pregnancy, refining your shape, or
            seeking expert facial, eyelid and skin-cancer reconstruction, every plan is studied and
            drawn up individually, with Mr Vijayan’s artistry, honesty and consultant-led care at its
            heart.
          </p>
          <Link className="btn btn-text" href="/procedures">
            View all services <span className="arrow">→</span>
          </Link>
        </div>
        <ServicesCarousel />
      </section>

      {/* THE DIFFERENCE */}
      <section className="difference" id="difference">
        <div className="diff-media reveal">
          <img src="/images/web/doctor-scrubs.jpg" alt="Mr Roshan Vijayan in surgical scrubs" />
        </div>
        <div className="diff-copy">
          <span className="eyebrow">The Vijayan Difference</span>
          <h2 className="display">
            Surgery that is <em>safer,</em> care that is <em>personal.</em>
          </h2>
          <ul className="diff-list">
            <li className="reveal">
              <span>Consultant-led aftercare</span>
              <p>
                Mr Vijayan personally reviews you, answers your emails within a day, and calls on day
                one after surgery, never handed to others.
              </p>
            </li>
            <li className="reveal">
              <span>Highly bespoke plans</span>
              <p>
                Each plan is studied and drawn up individually, with a thorough written summary after
                your consultation.
              </p>
            </li>
            <li className="reveal">
              <span>Early, flexible availability</span>
              <p>Consultations often within a week or two, with flexible scheduling for surgery.</p>
            </li>
            <li className="reveal">
              <span>Two-surgeon safety on complex cases</span>
              <p>
                For more complex procedures, Mr Vijayan operates alongside a second consultant surgeon,
                for greater precision, less time under anaesthetic and an added layer of safety.
              </p>
            </li>
          </ul>
          <img className="sig diff-sign" src="/images/web/signature.png" alt="Signature of Mr Roshan Vijayan" />
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="blob blob-2" aria-hidden="true" />
        <div className="about-copy reveal">
          <span className="eyebrow">About Mr Vijayan</span>
          <h2 className="display">
            Eighteen years a doctor.
            <br />
            <em>An artist’s eye.</em>
          </h2>
          <p>
            Qualified in London in 2008 with a first-class intercalated degree in Endocrinology,
            Mr Vijayan trained across more than twenty teaching hospitals, among them the Queen
            Victoria, Royal London, Royal Free, Chelsea &amp; Westminster and Guy’s &amp; St Thomas’.
            Now in his fifth year as an NHS consultant, he has published widely, presented
            internationally, and visited leading units in South Korea and Taiwan.
          </p>
          <p>
            A creative person at heart, he is drawn to the artistry of plastic surgery: studying a
            problem holistically, taking time, and crafting a result that is natural and proportioned.
          </p>
          <ul className="creds">
            <li>BSc (Hons) Endocrinology</li>
            <li>MBBS, Imperial College London</li>
            <li>MRCS (Eng)</li>
            <li>FRCS (Plast)</li>
            <li>Executive MBA</li>
            <li>PgCert Clinical Education</li>
          </ul>
          <p className="gmc">GMC Reg. No. 7020524</p>
        </div>
        <div className="about-media reveal">
          <img src="/images/web/consultation.jpg" alt="Mr Vijayan in consultation with a patient" />
          <div className="about-stat">
            <strong>20–30</strong>
            <span>minutes, unhurried, every first consultation</span>
          </div>
        </div>
      </section>

      {/* ACCREDITATIONS */}
      <section className="accred">
        <p className="accred-label reveal">Registered &amp; accredited</p>
        <div className="logo-row memberships reveal">
          <img src="/images/logos/gmc.webp" alt="General Medical Council" />
          <img src="/images/logos/rcs.webp" alt="Royal College of Surgeons" />
          <img src="/images/logos/bapras.webp" alt="BAPRAS" />
          <img src="/images/logos/baaps.webp" alt="BAAPS" />
        </div>
        <p className="accred-label reveal">Recognised by leading insurers</p>
        <div className="logo-row insurers reveal">
          <img src="/images/logos/bupa.webp" alt="Bupa" />
          <img src="/images/logos/axa.webp" alt="AXA Health" />
          <img src="/images/logos/aviva.webp" alt="Aviva" />
          <img src="/images/logos/vitality.webp" alt="Vitality" />
          <img src="/images/logos/wpa.webp" alt="WPA" />
          <img src="/images/logos/aetna.webp" alt="Aetna" />
        </div>
      </section>

      {/* JOURNEY */}
      <section className="journey">
        <header className="journey-head reveal">
          <span className="eyebrow">A Shared Journey</span>
          <h2 className="display">What to expect</h2>
        </header>
        <ol className="steps">
          <li className="reveal"><span className="step-no">01</span><h4>Enquiry</h4><p>A simple message or call to begin the conversation.</p></li>
          <li className="reveal"><span className="step-no">02</span><h4>First consultation</h4><p>20–30 unhurried minutes to listen, assess and explore your goals.</p></li>
          <li className="reveal"><span className="step-no">03</span><h4>Written plan</h4><p>A thorough letter summarising the approach, recovery and risks.</p></li>
          <li className="reveal"><span className="step-no">04</span><h4>Second consultation</h4><p>Included as standard, to recap, answer questions and confirm.</p></li>
          <li className="reveal"><span className="step-no">05</span><h4>Surgery</h4><p>Performed by Mr Vijayan with a senior surgical assistant.</p></li>
          <li className="reveal"><span className="step-no">06</span><h4>Aftercare</h4><p>A day-one call and unlimited, consultant-led follow-up.</p></li>
        </ol>
      </section>

      {/* LOCATIONS */}
      <section className="locations" id="locations">
        <div className="loc-media reveal">
          <img src="/images/web/clinic-interior.jpg" alt="A calm, luxurious clinic interior" />
        </div>
        <div className="loc-copy reveal">
          <span className="eyebrow">Locations</span>
          <h2 className="display">
            Across <em>Hertfordshire.</em>
          </h2>
          <ul className="loc-list">
            <li><h4>One Hatfield Hospital</h4><p>3 Hatfield Avenue, Hatfield, AL10 9UA</p></li>
            <li><h4>One Stop Healthcare</h4><p>One Medical House, Boundary Way, Hemel Hempstead, HP2 7YU</p></li>
            <li><h4>London Skin Clinic</h4><p>152 London Road, St Albans, AL1 1PQ</p></li>
            <li><h4>Lister Hospital</h4><p>Coreys Mill Lane, Stevenage, SG1 4AB · NHS</p></li>
          </ul>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <div className="contact-inner">
          <div className="contact-copy reveal">
            <span className="eyebrow">Begin</span>
            <h2 className="display">
              Request a
              <br />
              <em>consultation.</em>
            </h2>
            <p>
              Tell Mr Vijayan a little about what you’d like to achieve. Enquiries are answered
              personally, usually within a day.
            </p>
            <ul className="contact-meta">
              <li><span>Call</span> 01727 221799</li>
              <li><span>Email</span> roshanvijayan@gmail.com</li>
              <li><span>Practice</span> Leonie Grace Ltd · One Hatfield Hospital</li>
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  )
}
