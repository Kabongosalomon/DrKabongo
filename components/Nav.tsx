'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'

function localePath(locale: string, path: string) {
  return locale === 'en' ? path : `/${locale}${path}`
}

export default function Nav() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { href: localePath(locale, '/blog'), label: t('blog') },
    { href: localePath(locale, '/projects'), label: t('projects') },
    { href: localePath(locale, '/publications'), label: t('publications') },
    { href: localePath(locale, '/cv'), label: t('cv') },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={localePath(locale, '/')}
          className="flex items-center gap-2 font-bold text-white hover:text-brand-light transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-sm font-black">
            SK
          </span>
          <span className="hidden sm:block text-sm">Dr. Kabongo</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: lang switcher + CTA */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href={localePath(locale, '/cv')}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-brand hover:bg-brand-dim text-white px-4 py-2 rounded-full transition-colors"
          >
            CV
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 py-4 space-y-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block text-sm text-slate-300 hover:text-white py-2 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
