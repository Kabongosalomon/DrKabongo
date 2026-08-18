import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { alternatesFor } from '@/lib/metadata'
import {
  allCourseLessonPairs,
  getCourse,
  getLesson,
  pickLocalized,
  resolveLessonLanguage,
  resolveLessonVideo,
  traceUrl,
} from '@/lib/courses'
import LessonViewer from '@/components/edtrace/LessonViewer'
import LessonVideo from '@/components/edtrace/LessonVideo'
import LanguageNotice from '@/components/edtrace/LanguageNotice'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    allCourseLessonPairs().map(({ course, lesson }) => ({ locale, course, lesson })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; course: string; lesson: string }>
}) {
  const { locale, course, lesson } = await params
  const catalog = getCourse(course)
  const entry = catalog && getLesson(catalog, lesson)
  if (!catalog || !entry) return {}

  return {
    title: pickLocalized(entry.titles, locale),
    description: pickLocalized(catalog.course.titles, locale),
    alternates: alternatesFor(locale, `/courses/${course}/${lesson}`),
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; course: string; lesson: string }>
}) {
  const { locale, course, lesson } = await params
  setRequestLocale(locale)

  const catalog = getCourse(course)
  const entry = catalog && getLesson(catalog, lesson)
  if (!catalog || !entry) notFound()

  const t = await getTranslations({ locale, namespace: 'courses' })
  const { language, isFallback, available } = resolveLessonLanguage(course, lesson, locale)

  // A catalog entry with no trace in any language is a broken sync, not a 404
  // the visitor can act on — but there is nothing to render either.
  if (!language) notFound()

  const video = resolveLessonVideo(course, lesson, language)

  return (
    <div className="min-h-dvh">
      {/*
        Wider than the reading pages: the viewer runs its own two-column
        present-mode layout (prose beside the live environment panel) and
        collapses to one column itself below 1250px.
      */}
      <div className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
        <Link href={`/courses/${course}`} className="link text-sm">
          ← {pickLocalized(catalog.course.titles, locale)}
        </Link>

        <p className="eyebrow mt-8">{t('section_label')}</p>
        <h1 className="mt-3 font-serif text-3xl font-medium text-balance text-ink sm:text-4xl">
          {pickLocalized(entry.titles, locale)}
        </h1>

        <LanguageNotice
          requested={locale}
          shown={language}
          available={available}
          courseId={course}
          lessonId={lesson}
          isFallback={isFallback}
        />

        {video && (
          <LessonVideo
            videoId={video.videoId}
            language={video.language}
            lessonLanguage={language}
            title={pickLocalized(entry.titles, locale)}
          />
        )}

        <div className="edtrace-host mt-10">
          <LessonViewer
            traceUrl={traceUrl(course, language, lesson)}
            minimumStep={entry.default_step ?? 0}
          />
        </div>
      </div>
    </div>
  )
}
