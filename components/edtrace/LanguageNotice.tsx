'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LOCALE_NAMES, LOCALE_SHORT } from '@/i18n/routing'

interface LanguageNoticeProps {
  /** The locale the visitor is browsing in. */
  requested: string
  /** The language actually being served — differs from `requested` on fallback. */
  shown: string
  /** Every language this lesson exists in, in site-locale order. */
  available: string[]
  courseId: string
  lessonId: string
  isFallback: boolean
}

/**
 * Explains a language substitution and offers the way out of it.
 *
 * Courses are authored in four languages while the site carries five, so a
 * Swahili reader is always served French here. Saying so — and showing which
 * languages the lesson *does* exist in — is the difference between a
 * deliberate fallback and a page that looks broken.
 */
export default function LanguageNotice({
  requested,
  shown,
  available,
  courseId,
  lessonId,
  isFallback,
}: LanguageNoticeProps) {
  const t = useTranslations('courses')
  const [dismissed, setDismissed] = useState(false)

  if (available.length === 0) return null

  return (
    <div className="mt-8">
      {isFallback && !dismissed && (
        <div className="flex items-start gap-3 rounded-lg border border-rule bg-accent-soft/60 px-4 py-3">
          <p className="min-w-0 flex-1 text-sm leading-relaxed text-ink-2">
            {t('fallback_notice', {
              requested: LOCALE_NAMES[requested] ?? requested,
              shown: LOCALE_NAMES[shown] ?? shown,
            })}
          </p>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label={t('dismiss')}
            className="-m-1 shrink-0 rounded p-1 text-ink-3 transition-colors hover:text-ink"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="eyebrow shrink-0">{t('available_in')}</span>
        <div className="flex flex-wrap gap-2">
          {available.map((lang) => {
            const active = lang === shown
            return (
              <Link
                key={lang}
                href={`/courses/${courseId}/${lessonId}`}
                locale={lang}
                aria-current={active ? 'true' : undefined}
                title={LOCALE_NAMES[lang] ?? lang}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                  active
                    ? 'border-accent bg-accent-soft text-ink'
                    : 'border-rule text-ink-2 hover:border-ink-3 hover:text-ink'
                }`}
              >
                {LOCALE_SHORT[lang] ?? lang.toUpperCase()}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
