import type { Metadata } from 'next'
import { SITE_URL, alternatesFor } from '@/lib/metadata'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Salomon Kabongo, PhD — AI Researcher, Educator & Speaker',
    template: '%s | Dr. Kabongo',
  },
  description:
    'AI researcher (NLP, LLMs, knowledge graphs), Lead Software Engineer at State Farm, and former board member of the Masakhane Research Foundation. Teaching AI in English, French and Lingala.',
  alternates: alternatesFor('en'),
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Dr. Kabongo',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'ln'],
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
