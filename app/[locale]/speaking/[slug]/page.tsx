import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { absoluteUrl, alternateOpenGraphLocales, alternatesFor, openGraphLocaleFor } from '@/lib/metadata'
import {
  getInteractiveTalkBySlug,
  getInteractiveTalks,
  pickLocalized,
  resolveTalkLanguage,
} from '@/lib/talks'
import LessonViewer from '@/components/edtrace/LessonViewer'
import LanguageNotice from '@/components/edtrace/LanguageNotice'
import PresentTrigger from '@/components/edtrace/PresentTrigger'

export function generateStaticParams() {
  const talks = getInteractiveTalks()
  if (talks.length === 0) {
    // Next.js `output: 'export'` requires at least one static param for dynamic segments.
    // This unlinked placeholder renders a clean 404 shell until a non-draft talk is published.
    return [{ locale: routing.defaultLocale, slug: '__draft__' }]
  }
  return routing.locales.flatMap((locale) =>
    talks.map((talk) => ({ locale, slug: talk.edtrace.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const talk = getInteractiveTalkBySlug(slug)
  if (!talk) return {}

  const title = pickLocalized(talk.edtrace.titles, locale)
  const description = pickLocalized(talk.edtrace.summaries, locale)
  const url = absoluteUrl(locale, `/speaking/${slug}`)

  return {
    title,
    description,
    alternates: alternatesFor(locale, `/speaking/${slug}`),
    openGraph: {
      type: 'article' as const,
      url,
      siteName: 'Dr. Kabongo',
      title,
      description,
      locale: openGraphLocaleFor(locale),
      alternateLocale: alternateOpenGraphLocales(locale),
      ...(talk.poster ? { images: [{ url: talk.poster }] } : {}),
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      ...(talk.poster ? { images: [talk.poster] } : {}),
    },
  }
}

function formatTalkDate(isoDate: string, locale: string) {
  const date = new Date(`${isoDate}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default async function InteractiveTalkPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const talk = getInteractiveTalkBySlug(slug)
  if (!talk) notFound()

  const { edtrace } = talk
  const t = await getTranslations({ locale, namespace: 'speaking' })
  const { language, isFallback, available } = resolveTalkLanguage(edtrace, locale)
  if (!language) notFound()

  const title = pickLocalized(edtrace.titles, locale)
  const summary = pickLocalized(edtrace.summaries, locale)
  const venue = pickLocalized(edtrace.venues, locale)
  const eventTheme = edtrace.eventTheme ? pickLocalized(edtrace.eventTheme, locale) : null

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-5xl px-4 pt-28 sm:px-6 sm:pt-36">
        <Link href="/speaking" className="link text-sm">
          ← {t('back_to_talks')}
        </Link>

        <p className="mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-3">
          <span className="eyebrow text-accent">{t('interactive_badge')}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={talk.date}>{formatTalkDate(talk.date, locale)}</time>
          <span aria-hidden="true">·</span>
          <span>{edtrace.location}</span>
          {edtrace.affiliation && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-ink-2">{edtrace.affiliation}</span>
            </>
          )}
        </p>

        <h1 className="mt-3 font-serif text-3xl font-medium text-balance text-ink sm:text-5xl">
          {title}
        </h1>

        <p className="mt-3 text-sm font-medium text-ink-2">{venue}</p>
        {eventTheme && <p className="mt-1 text-xs italic text-ink-3">{eventTheme}</p>}

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-2">{summary}</p>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <LanguageNotice
            requested={locale}
            shown={language}
            available={available}
            courseId={edtrace.courseId}
            lessonId={edtrace.lessonId}
            isFallback={isFallback}
            basePath={`/speaking/${edtrace.slug}`}
          />
          <div className="flex flex-wrap items-center gap-3">
            {talk.poster && (
              <a
                href={talk.poster}
                target="_blank"
                rel="noopener noreferrer"
                className="link text-xs font-medium"
              >
                {t('poster')} ↗
              </a>
            )}
            <PresentTrigger />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[92rem] px-3 pb-16 sm:px-6 sm:pb-24">
        <LessonViewer
          courseId={edtrace.courseId}
          lessonId={edtrace.lessonId}
          language={language}
          availableLanguages={available}
          minimumStep={0}
        />
      </div>
    </div>
  )
}
