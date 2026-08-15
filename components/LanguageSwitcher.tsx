'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing, LOCALE_NAMES, LOCALE_SHORT, LOCALE_FLAG } from '@/i18n/routing'

const MENU_ID = 'language-menu'

function useLocaleSwitch() {
  const locale = useLocale()
  const pathname = usePathname()
  return { locale, pathname }
}

/** Google-Translate-style glyph: reads as "translate", not as a generic globe. */
function TranslateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
    </svg>
  )
}

/**
 * A compact trigger with a chevron — the affordance that says "there is more
 * behind this". The panel lists every language by its own name so the choice
 * is obvious once opened.
 */
export default function LanguageSwitcher() {
  const { locale, pathname } = useLocaleSwitch()
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`${t('language')} — ${LOCALE_NAMES[locale] ?? locale}`}
        aria-expanded={open}
        aria-controls={MENU_ID}
        aria-haspopup="menu"
        className="flex h-9 items-center gap-1 rounded-md border border-rule pr-1.5 pl-2 text-xs font-medium text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
      >
        <TranslateIcon className="h-4 w-4 shrink-0" />
        <span>{LOCALE_SHORT[locale] ?? locale.toUpperCase()}</span>
        <svg
          className={`h-3 w-3 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <ul
        id={MENU_ID}
        role="menu"
        hidden={!open}
        className="absolute right-0 z-50 mt-2 min-w-48 overflow-hidden rounded-md border border-rule bg-surface py-1 shadow-lg"
      >
        <li className="border-b border-rule px-3 pt-1 pb-2">
          <p className="eyebrow">{t('read_in')}</p>
        </li>
        {routing.locales.map((code) => {
          const active = code === locale
          return (
            <li key={code} role="none">
              <Link
                href={pathname}
                locale={code}
                role="menuitem"
                lang={code}
                onClick={() => setOpen(false)}
                aria-current={active ? 'true' : undefined}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                  active ? 'font-medium text-accent' : 'text-ink-2 hover:bg-raised hover:text-ink'
                }`}
              >
                <span aria-hidden="true">{LOCALE_FLAG[code]}</span>
                <span className="min-w-0 flex-1">{LOCALE_NAMES[code] ?? code}</span>
                <span className="shrink-0 text-[11px] text-ink-3">
                  {LOCALE_SHORT[code] ?? code.toUpperCase()}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Horizontal row of native names — the homepage "read this site in" line. */
export function LanguageStrip() {
  const { locale, pathname } = useLocaleSwitch()
  const t = useTranslations('nav')

  return (
    <div className="border-t border-rule pt-5">
      <p className="eyebrow flex items-center gap-1.5">
        <TranslateIcon className="h-3.5 w-3.5" />
        {t('read_in')}
      </p>
      <ul className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        {routing.locales.map((code, index) => {
          const active = code === locale
          return (
            <li key={code} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-ink-3">
                  ·
                </span>
              )}
              <Link
                href={pathname}
                locale={code}
                lang={code}
                aria-current={active ? 'true' : undefined}
                className={`inline-flex min-w-0 items-center gap-1.5 text-sm transition-colors ${
                  active
                    ? 'font-medium text-ink underline decoration-accent decoration-2 underline-offset-4'
                    : 'text-ink-2 hover:text-accent'
                }`}
              >
                <span aria-hidden="true">{LOCALE_FLAG[code]}</span>
                <span className="min-w-0">{LOCALE_NAMES[code] ?? code}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
