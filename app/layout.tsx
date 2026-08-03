import type {Metadata} from 'next'
import {Fraunces, Jost} from 'next/font/google'
import './globals.css'

const serif = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600'],
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
