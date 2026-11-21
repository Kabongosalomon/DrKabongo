import type { Metadata } from 'next'
import { routing } from '../i18n/routing'

export const SITE_URL = 'https://drkabongo.com'

/**
 * True only on the live production deployment (`main` → drkabongo.com).
 * Any Vercel preview branch (`dev` → dev.drkabongo.com) sets
 * `VERCEL_ENV="preview"` and/or `VERCEL_GIT_COMMIT_REF="dev"`, which must
 * never be indexed by search engines.
 */
export const IS_PRODUCTION_DEPLOYMENT =
  (process.env.VERCEL_ENV ?? 'production') === 'production' &&
  process.env.VERCEL_GIT_COMMIT_REF !== 'dev'

export const NOINDEX_ROBOTS: NonNullable<Metadata['robots']> = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
}

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

/**
 * Canonical + hreflang block, previously duplicated across 5 pages. `locales`
 * limits the hreflang list to the languages a page really exists in (blog
 * posts are not translated into every language).
 */
export function alternatesFor(
  locale: string,
  path = '',
  locales: readonly string[] = routing.locales,
) {
  return {
    canonical: absoluteUrl(locale, path),
    languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(l, path)])) as Record<
      string,
      string
    >,
  }
}
