import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://drkabongo.com'),
  title: {
    default: 'Salomon Kabongo, PhD — AI Researcher & Engineer',
    template: '%s | Dr. Kabongo',
  },
  description:
    'AI Researcher, Lead Software Engineer at State Farm, and Board Member of the Masakhane Research Foundation. Building AI for Africa and the world.',
  alternates: {
    canonical: 'https://drkabongo.com',
    languages: {
      en: 'https://drkabongo.com',
      fr: 'https://drkabongo.com/fr',
      ln: 'https://drkabongo.com/ln',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://drkabongo.com',
    siteName: 'Dr. Kabongo',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'ln'],
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Salomon Kabongo, PhD — AI Researcher & Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
