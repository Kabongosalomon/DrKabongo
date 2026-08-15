'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, LOCALE_NAMES, LOCALE_SHORT, LOCALE_FLAG } from '@/i18n/routing'

/**
 * All five locales are always visible — a dropdown hid the fact that the site
 * is multilingual at all, which is the whole point of it.
 */
function useLocaleSwitch() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  return {
    locale,
    switchTo: (next: string) => {
      if (next !== locale) router.push(pathname, { locale: next })
    },
  }
}

/** Compact code row for the desktop header. */
export default function LanguageSwitcher() {
  const { locale, switchTo } = useLocaleSwitch()
  const t = useTranslations('nav')

  return (
    <div
      role="group"
      aria-label={t('language')}
      className="flex shrink-0 items-center gap-0.5 rounded-md border border-rule p-0.5"
    >
      {routing.locales.map((code) => {
        const active = code === locale
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            lang={code}
            title={LOCALE_NAMES[code] ?? code}
            aria-label={LOCALE_NAMES[code] ?? code}
            aria-current={active ? 'true' : undefined}
            className={`rounded-sm px-1.5 py-1 text-[11px] font-medium tracking-wide transition-colors ${
              active ? 'bg-ink text-paper' : 'text-ink-3 hover:text-ink'
            }`}
          >
            <span aria-hidden="true" className="mr-1">
              {LOCALE_FLAG[code]}
            </span>
            {LOCALE_SHORT[code] ?? code.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}

/** Vertical list with native names — used inside the mobile drawer. */
export function LanguageList({ onSelect }: { onSelect?: () => void }) {
  const { locale, switchTo } = useLocaleSwitch()
  const t = useTranslations('nav')

  return (
    <div>
      <p className="eyebrow py-2">{t('language')}</p>
      <ul>
        {routing.locales.map((code) => {
          const active = code === locale
          return (
            <li key={code}>
              <button
                type="button"
                lang={code}
                onClick={() => {
                  switchTo(code)
                  onSelect?.()
                }}
                aria-current={active ? 'true' : undefined}
                className={`flex w-full items-center justify-between gap-3 border-b border-rule py-3 text-left text-sm transition-colors ${
                  active ? 'font-medium text-accent' : 'text-ink-2 hover:text-ink'
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span aria-hidden="true">{LOCALE_FLAG[code]}</span>
                  <span className="min-w-0">{LOCALE_NAMES[code] ?? code}</span>
                </span>
                <span className="shrink-0 text-[11px] text-ink-3">
                  {LOCALE_SHORT[code] ?? code.toUpperCase()}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Horizontal row of native names — the homepage "read this site in" line. */
export function LanguageStrip() {
  const { locale, switchTo } = useLocaleSwitch()
  const t = useTranslations('nav')

  return (
    <div className="border-t border-rule pt-5">
      <p className="eyebrow">{t('read_in')}</p>
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
              <button
                type="button"
                lang={code}
                onClick={() => switchTo(code)}
                aria-current={active ? 'true' : undefined}
                className={`inline-flex min-w-0 items-center gap-1.5 text-sm transition-colors ${
                  active
                    ? 'font-medium text-ink underline decoration-accent decoration-2 underline-offset-4'
                    : 'text-ink-2 hover:text-accent'
                }`}
              >
                <span aria-hidden="true">{LOCALE_FLAG[code]}</span>
                <span className="min-w-0">{LOCALE_NAMES[code] ?? code}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
