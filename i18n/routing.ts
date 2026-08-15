import { defineRouting } from 'next-intl/routing'

/**
 * Locale order here is the order shown in the language switcher.
 * `lua` is ISO 639-3 for Luba-Lulua (Tshiluba); the rest are ISO 639-1.
 */
export const routing = defineRouting({
  locales: ['en', 'fr', 'sw', 'ln', 'lua'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  /**
   * Off on purpose. With detection on, next-intl redirects `/` based on the
   * visitor's Accept-Language header and a stored NEXT_LOCALE cookie — so a
   * phone set to French landed on /fr instead of the English homepage.
   * The URL is now the only thing that decides the language.
   */
  localeDetection: false,
})

/** Names are shown in their own language, never translated. */
export const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  sw: 'Kiswahili',
  ln: 'Lingála',
  lua: 'Tshiluba',
}

/** Compact labels for the switcher trigger. */
export const LOCALE_SHORT: Record<string, string> = {
  en: 'EN',
  fr: 'FR',
  sw: 'SW',
  ln: 'LN',
  lua: 'TSH',
}

/**
 * Flags are decoration only — the acronym next to them is what actually
 * identifies the language. That pairing matters: Lingala and Tshiluba share
 * the DRC flag, and Windows renders flag emoji as bare letter pairs ("CD"),
 * so the code is what keeps them distinguishable in both cases.
 * Always paired with an accessible label naming the language.
 */
export const LOCALE_FLAG: Record<string, string> = {
  en: '🇺🇸',
  fr: '🇫🇷',
  sw: '🇹🇿',
  ln: '🇨🇩',
  lua: '🇨🇩',
}
