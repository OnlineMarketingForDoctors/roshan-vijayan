import type {Metadata} from 'next'
import {Fraunces, Jost} from 'next/font/google'
import {SITE_URL, isLive} from '@/lib/site'
import './globals.css'

// what appears when a page is shared on WhatsApp, LinkedIn or Facebook
const OG_IMAGE = '/images/web/og-cover.jpg'

// Load Fraunces as a variable font (no explicit weight) WITH the optical-size
// axis, so large headings render in its high-contrast display shape — matching
// the original design. `font-optical-sizing: auto` (CSS default) applies opsz
// by font-size automatically.
const serif = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-serif',
  display: 'swap',
})

const sans = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

const TITLE = 'RV Plastic Surgery | Mr Roshan Vijayan, Consultant Plastic Surgeon'
const DESCRIPTION =
  'Natural, balanced aesthetic and reconstructive surgery, consultant-led, in Hertfordshire, by Mr Roshan Vijayan, MBBS FRCS(Plast).'

// The live site invites indexing; a preview refuses it. Stated either way
// rather than left to the absence of a tag, so the intent is legible in the
// markup and a preview can never be mistaken for the real thing.
export const metadata: Metadata = {
  // resolves the relative image paths below, and every page's canonical link
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: {icon: '/favicon.svg'},
  robots: isLive ? {index: true, follow: true} : {index: false, follow: false},
  openGraph: {
    type: 'website',
    siteName: 'RV Plastic Surgery',
    locale: 'en_GB',
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    images: [{url: OG_IMAGE, width: 1200, height: 630, alt: 'RV Plastic Surgery'}],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
