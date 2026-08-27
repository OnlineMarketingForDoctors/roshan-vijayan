import {existsSync} from 'node:fs'
import {join} from 'node:path'
import Link from 'next/link'
import {locationSummaries} from '@/lib/locations'
import CookieSettingsLink from '@/components/CookieSettingsLink'

/**
 * The credit mark, shown beside the link when the file is present.
 *
 * Checked here rather than assumed: this renders on every page, and a footer
 * with a broken image in it is worse than one with none. Drop the artwork at
 * public/images/logos/omd.svg (or .png, .webp) and it appears.
 */
const OMD_LOGO = ['omd.svg', 'omd.webp', 'omd.png']
  .map((f) => `/images/logos/${f}`)
  .find((f) => existsSync(join(process.cwd(), 'public', f)))

type Location = {name?: string; address?: string; note?: string}
type Settings = {
  phone?: string
  email?: string
  gmcNumber?: string
  locations?: Location[]
} | null

const FALLBACK_LOCATIONS: Location[] = locationSummaries()

export default function Footer({settings}: {settings: Settings}) {
  const phone = settings?.phone || '01727 221799'
  const email = settings?.email || 'enquiries@vijayan.co.uk'
  const gmc = settings?.gmcNumber || '7020524'
  const locations = settings?.locations?.length ? settings.locations : FALLBACK_LOCATIONS
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="foot-top">
        <div className="foot-brand">
          <img src="/images/logo-white.svg" alt="RV Plastic Surgery" decoding="async" loading="lazy" />
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
          <Link href="/sitemap">Sitemap</Link>
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
      <nav className="foot-legal" aria-label="Legal">
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/terms-and-conditions">Terms and Conditions</Link>
        <Link href="/cookies-policy">Cookies Policy</Link>
        <CookieSettingsLink />
      </nav>
      <div className="foot-bottom">
        <p>
          © {year} RV Plastic Surgery · Leonie Grace Limited · GMC {gmc}
        </p>
        <p className="foot-credit">
          {OMD_LOGO ? (
            <img src={OMD_LOGO} alt="Online Marketing For Doctors" loading="lazy" decoding="async" />
          ) : null}
          <span>
            Powered by{' '}
            <a
              href="https://onlinemarketingfordoctors.com/"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              Online Marketing For Doctors
            </a>
          </span>
        </p>
      </div>
    </footer>
  )
}
