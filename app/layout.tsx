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

const GTM_ID = 'GTM-M3VTZ7PH'

/**
 * Google Tag Manager, written into the markup rather than loaded through
 * next/script, so it sits as high in the <head> as it can and runs before
 * anything else on the page. It is one <script> tag either way; putting it here
 * is what keeps it first.
 */
const GTM = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`

const TITLE = 'RV Plastic Surgery | Mr Roshan Vijayan, Consultant Plastic Surgeon'
const DESCRIPTION =
  'Natural, balanced aesthetic and reconstructive surgery, consultant-led, in Hertfordshire, by Mr Roshan Vijayan, MBBS FRCS(Plast).'

// Until go-live, keep search engines out of the staging URL. Flip the switch
// by setting NEXT_PUBLIC_SITE_LIVE=true in Vercel when the real domain goes live.
export const metadata: Metadata = {
  // resolves the relative image paths below, and every page's canonical link
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: {icon: '/favicon.svg'},
  robots: isLive ? undefined : {index: false, follow: false},
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
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{__html: GTM}} />
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  )
}
