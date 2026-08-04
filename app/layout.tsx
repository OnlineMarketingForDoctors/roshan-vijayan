import type {Metadata} from 'next'
import {Fraunces, Jost} from 'next/font/google'
import './globals.css'

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

// Until go-live, keep search engines out of the staging URL. Flip the switch
// by setting NEXT_PUBLIC_SITE_LIVE=true in Vercel when the real domain goes live.
const isLive = process.env.NEXT_PUBLIC_SITE_LIVE === 'true'

export const metadata: Metadata = {
  title: 'RV Plastic Surgery | Mr Roshan Vijayan, Consultant Plastic Surgeon',
  description:
    'Natural, balanced aesthetic and reconstructive surgery, consultant-led, in Hertfordshire, by Mr Roshan Vijayan, MBBS FRCS(Plast).',
  icons: {icon: '/favicon.svg'},
  robots: isLive ? undefined : {index: false, follow: false},
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
