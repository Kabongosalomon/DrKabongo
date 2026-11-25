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
} from '@/lib/courses'
import LessonViewer from '@/components/edtrace/LessonViewer'
import LessonVideo from '@/components/edtrace/LessonVideo'
import LanguageNotice from '@/components/edtrace/LanguageNotice'
import PresentTrigger from '@/components/edtrace/PresentTrigger'

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
      <div className="mx-auto max-w-5xl px-4 pt-28 sm:px-6 sm:pt-36">
        <Link href={`/courses/${course}`} className="link text-sm">
          ← {pickLocalized(catalog.course.titles, locale)}
        </Link>

        <p className="eyebrow mt-8">{t('section_label')}</p>
        <h1 className="mt-3 font-serif text-3xl font-medium text-balance text-ink sm:text-4xl">
          {pickLocalized(entry.titles, locale)}
        </h1>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <LanguageNotice
            requested={locale}
            shown={language}
            available={available}
            courseId={course}
            lessonId={lesson}
            isFallback={isFallback}
          />
          <PresentTrigger />
        </div>

        {video && (
          <LessonVideo
            videoId={video.videoId}
            language={video.language}
            lessonLanguage={language}
            title={pickLocalized(entry.titles, locale)}
          />
        )}
      </div>

      {/*
        Wide presentation canvas (`max-w-[92rem]`) so the EdTrace code, visuals,
        and live environment panel have full desktop breathing room even before
        entering 100vw full-screen presentation mode. `minimumStep={0}` keeps
        `def table_of_contents()` reachable at the top of every lesson.
      */}
      <div className="mx-auto mt-10 max-w-[92rem] px-3 pb-16 sm:px-6 sm:pb-24">
        <LessonViewer
          courseId={course}
          lessonId={lesson}
          language={language}
          availableLanguages={available}
          minimumStep={0}
        />
      </div>
    </div>
  )
}
