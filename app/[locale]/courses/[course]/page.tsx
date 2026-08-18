import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing, LOCALE_NAMES } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { alternatesFor } from '@/lib/metadata'
import { getAllCourses, getCourse, lessonLanguages, pickLocalized } from '@/lib/courses'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllCourses().map((catalog) => ({ locale, course: catalog.course.id })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; course: string }>
}) {
  const { locale, course } = await params
  const catalog = getCourse(course)
  if (!catalog) return {}

  const t = await getTranslations({ locale, namespace: 'courses' })
  const title = pickLocalized(catalog.course.titles, locale)

  return {
    title,
    description: t('subtitle'),
    alternates: alternatesFor(locale, `/courses/${course}`),
  }
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ locale: string; course: string }>
}) {
  const { locale, course } = await params
  setRequestLocale(locale)

  const catalog = getCourse(course)
  if (!catalog) notFound()

  const t = await getTranslations({ locale, namespace: 'courses' })

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
        <Link href="/courses" className="link text-sm">
          ← {t('back_to_courses')}
        </Link>

        <p className="eyebrow mt-8">{t('section_label')}</p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-balance text-ink sm:text-5xl">
          {pickLocalized(catalog.course.titles, locale)}
        </h1>

        <p className="mt-4 text-sm text-ink-3">
          {t('available_in')}{' '}
          {catalog.languages.map((language) => LOCALE_NAMES[language.code] ?? language.code).join(' · ')}
        </p>

        <h2 className="mt-14 border-t border-rule pt-6 font-serif text-xl font-medium text-ink">
          {t('lessons')}
        </h2>

        <ol className="mt-6 space-y-6">
          {catalog.lessons.map((lesson, index) => {
            const available = lessonLanguages(course, lesson.id)

            return (
              <li key={lesson.id} className="border-t border-rule pt-5">
                <p className="text-xs text-ink-3">
                  <span className="eyebrow">
                    {t('lesson_number', { number: index + 1 })}
                  </span>
                </p>

                <h3 className="mt-2 font-serif text-lg font-medium text-balance">
                  <Link
                    href={`/courses/${course}/${lesson.id}`}
                    className="text-ink decoration-accent decoration-1 underline-offset-4 hover:underline"
                  >
                    {pickLocalized(lesson.titles, locale)}
                  </Link>
                </h3>

                {available.length > 0 && (
                  <p className="mt-2 text-xs text-ink-3">
                    {available.map((code) => LOCALE_NAMES[code] ?? code).join(' · ')}
                  </p>
                )}

                <p className="mt-3">
                  <Link href={`/courses/${course}/${lesson.id}`} className="link text-sm">
                    {t('start_lesson')} →
                  </Link>
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
