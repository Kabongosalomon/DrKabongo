import type { Metadata } from 'next'
import { SITE_URL, alternateOpenGraphLocales, alternatesFor } from '@/lib/metadata'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Salomon Kabongo, PhD — AI Researcher, Engineer & Educator',
    template: '%s | Dr. Kabongo',
  },
  description:
    'AI researcher, engineer and educator working across foundation models, multimodal AI, document intelligence and African-language technology. Teaching in English, French, Lingala, Tshiluba and Swahili.',
  alternates: alternatesFor('en'),
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Dr. Kabongo',
    locale: 'en_US',
    alternateLocale: alternateOpenGraphLocales('en'),
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@SalomonKabongo',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

// The real document shell lives in app/[locale]/layout.tsx.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
