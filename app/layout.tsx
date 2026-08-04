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

export const metadata: Metadata = {
  title: 'RV Plastic Surgery | Mr Roshan Vijayan, Consultant Plastic Surgeon',
  description:
    'Natural, balanced aesthetic and reconstructive surgery, consultant-led, in Hertfordshire, by Mr Roshan Vijayan, MBBS FRCS(Plast).',
  icons: {icon: '/favicon.svg'},
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
