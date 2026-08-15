'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'

const MENU_ID = 'primary-menu'

export default function Nav() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let frame = 0
    const handler = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8)
        frame = 0
      })
    }
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      window.removeEventListener('scroll', handler)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Close on route change.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Escape to close (returning focus), plus click-outside.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const links = [
    { href: '/videos', label: t('videos') },
    { href: '/speaking', label: t('speaking') },
    { href: '/publications', label: t('publications') },
    { href: '/projects', label: t('projects') },
    { href: '/blog', label: t('blog') },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled || open
          ? 'border-b border-rule bg-paper/95 backdrop-blur-sm'
          : 'border-b border-transparent bg-paper/80 backdrop-blur-sm'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          aria-label={`Dr. Kabongo — ${t('home')}`}
          className="shrink-0 font-serif text-lg font-medium tracking-tight text-ink transition-colors hover:text-accent"
        >
          <span className="md:hidden lg:inline">Dr. Kabongo</span>
          <span className="hidden md:inline lg:hidden">DK</span>
        </Link>

        <div className="hidden items-center gap-3 md:flex lg:gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`text-xs transition-colors lg:text-sm ${
                isActive(href)
                  ? 'font-medium text-ink underline decoration-accent decoration-2 underline-offset-[6px]'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 lg:gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link
            href="/#contact"
            className="hidden shrink-0 items-center rounded-md border border-ink px-2 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-ink hover:text-paper md:inline-flex lg:px-3 lg:text-sm"
          >
            {t('work_with_me')}
          </Link>

          <button
            ref={triggerRef}
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-rule text-ink-2 transition-colors hover:border-ink-3 hover:text-ink md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? t('close_menu') : t('open_menu')}
            aria-expanded={open}
            aria-controls={MENU_ID}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        id={MENU_ID}
        hidden={!open}
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-rule bg-paper px-4 py-3 md:hidden"
      >
        <Link
          href="/"
          aria-current={pathname === '/' ? 'page' : undefined}
          className="block border-b border-rule py-3 text-sm text-ink-2 transition-colors hover:text-ink"
        >
          {t('home')}
        </Link>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? 'page' : undefined}
            className={`block border-b border-rule py-3 text-sm transition-colors ${
              isActive(href) ? 'font-medium text-accent' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {label}
          </Link>
        ))}
        <Link
          href="/#contact"
          className="mt-4 mb-1 flex items-center justify-center rounded-md border border-ink px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          {t('work_with_me')}
        </Link>
      </div>
    </header>
  )
}
