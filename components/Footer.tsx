import Link from 'next/link'

type Location = {name?: string; address?: string; note?: string}
type Settings = {
  phone?: string
  email?: string
  gmcNumber?: string
  surgeonName?: string
  credentials?: string
  locations?: Location[]
} | null

const FALLBACK_LOCATIONS: Location[] = [
  {name: 'One Hatfield Hospital', address: '3 Hatfield Avenue, Hatfield, AL10 9UA'},
  {name: 'One Stop Healthcare', address: 'One Medical House, Boundary Way, Hemel Hempstead, HP2 7YU'},
  {name: 'London Skin Clinic', address: '152 London Road, St Albans, AL1 1PQ'},
]

export default function Footer({settings}: {settings: Settings}) {
  const phone = settings?.phone || '01727 221799'
  const email = settings?.email || 'roshanvijayan@gmail.com'
  const gmc = settings?.gmcNumber || '7020524'
  const surgeon = settings?.surgeonName || 'Mr Roshan Vijayan'
  const credentials = settings?.credentials || 'MBBS FRCS(Plast)'
  const locations = settings?.locations?.length ? settings.locations : FALLBACK_LOCATIONS
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="foot-top">
        <div className="foot-brand">
          <img src="/images/logo-white.svg" alt="RV Plastic Surgery" />
          <p>Natural, balanced aesthetic and reconstructive surgery, consultant-led, in Hertfordshire.</p>
        </div>
        <nav className="foot-nav">
          <h5>Explore</h5>
          <Link href="/about">About</Link>
          <Link href="/procedures">Procedures</Link>
          <Link href="/gallery">Before &amp; After</Link>
          <Link href="/locations">Locations</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="foot-contact">
          <h5>Contact</h5>
          <p>{phone}</p>
          <p>{email}</p>
        </div>
        <div className="foot-locations">
          <h5>Locations</h5>
          {locations.map((l, i) => (
            <p key={i}>
              <strong>{l.name}</strong>
              {l.address ? (
                <>
                  <br />
                  {l.address}
                </>
              ) : null}
            </p>
          ))}
        </div>
      </div>
      <div className="foot-bottom">
        <p>
          © {year} RV Plastic Surgery · Leonie Grace Limited · GMC {gmc}
        </p>
        <p>
          {surgeon}, {credentials}
        </p>
      </div>
    </footer>
  )
}
