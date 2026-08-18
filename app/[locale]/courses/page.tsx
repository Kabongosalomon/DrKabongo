import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing, LOCALE_NAMES } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { alternatesFor } from '@/lib/metadata'
import { getAllCourses, pickLocalized } from '@/lib/courses'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'courses' })
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: alternatesFor(locale, '/courses'),
  }
}

export default async function CoursesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'courses' })
  const courses = getAllCourses()

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
        <p className="eyebrow">{t('section_label')}</p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-balance text-ink sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2">{t('subtitle')}</p>

        {courses.length === 0 ? (
          <p className="mt-14 border-t border-rule pt-6 text-base text-ink-2">{t('no_courses')}</p>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {courses.map((catalog) => {
              const id = catalog.course.id
              const languages = catalog.languages.map((language) => language.code)

              return (
                <article key={id} className="border-t border-rule pt-5">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-3">
                    <span className="eyebrow">{t('section_label')}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t('lesson_count', { count: catalog.lessons.length })}</span>
                  </p>

                  <h2 className="mt-2 font-serif text-lg font-medium text-balance">
                    <Link
                      href={`/courses/${id}`}
                      className="text-ink decoration-accent decoration-1 underline-offset-4 hover:underline"
                    >
                      {pickLocalized(catalog.course.titles, locale)}
                    </Link>
                  </h2>

                  <ul className="mt-3 space-y-1">
                    {catalog.lessons.map((lesson) => (
                      <li key={lesson.id} className="text-sm leading-relaxed text-ink-2">
                        {pickLocalized(lesson.titles, locale)}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-3 text-xs text-ink-3">
                    {t('available_in')}{' '}
                    {languages.map((code) => LOCALE_NAMES[code] ?? code).join(' · ')}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
