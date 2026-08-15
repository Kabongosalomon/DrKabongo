import { routing } from '@/i18n/routing'

export const SITE_URL = 'https://drkabongo.com'

export const OPEN_GRAPH_LOCALES: Record<string, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  sw: 'sw_TZ',
  ln: 'ln_CD',
  lua: 'lua_CD',
}

export function openGraphLocaleFor(locale: string) {
  return OPEN_GRAPH_LOCALES[locale] ?? locale
}

export function alternateOpenGraphLocales(locale: string) {
  return routing.locales
    .filter((candidate) => candidate !== locale)
    .map(openGraphLocaleFor)
}

/**
 * Absolute URL for a route in a given locale. `localePrefix` is `as-needed`,
 * so the default locale is unprefixed.
 */
export function absoluteUrl(locale: string, path = '') {
  const clean = path === '/' ? '' : path
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
  return `${SITE_URL}${prefix}${clean}`
}

/** Canonical + hreflang block, previously duplicated across 5 pages. */
export function alternatesFor(locale: string, path = '') {
  return {
    canonical: absoluteUrl(locale, path),
    languages: Object.fromEntries(
      routing.locales.map((l) => [l, absoluteUrl(l, path)]),
    ) as Record<string, string>,
  }
}
