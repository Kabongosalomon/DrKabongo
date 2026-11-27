import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { LOCALE_NAMES, routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { alternatesFor } from '@/lib/metadata'
import { emailEnquiryHref } from '@/lib/contact'
import { type Talk } from '@/content/talks'
import { getInteractiveTalks, getVisibleTalks, pickLocalized, talkLanguages } from '@/lib/talks'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'speaking' })
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: alternatesFor(locale, '/speaking'),
  }
}

function formatDate(value: string, locale: string) {
  const iso = value.length === 7 ? `${value}-01T12:00:00Z` : `${value}T12:00:00Z`
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    timeZone: 'UTC',
    ...(value.length === 7 ? { month: 'long' } : { month: 'long', day: 'numeric' }),
  })
}

function TalkResources({ talk, labels }: { talk: Talk; labels: Record<string, string> }) {
  const resources = [
    talk.edtrace && {
      href: `/speaking/${talk.edtrace.slug}`,
      label: labels.interactive,
      internal: true,
    },
    talk.videoId && {
      href: `https://www.youtube.com/watch?v=${talk.videoId}`,
      label: labels.recording,
      internal: false,
    },
    talk.slides && { href: talk.slides, label: labels.slides, internal: false },
    talk.poster && { href: talk.poster, label: labels.poster, internal: false },
  ].filter(Boolean) as { href: string; label: string; internal: boolean }[]

  if (resources.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
      {resources.map(({ href, label, internal }) =>
        internal ? (
          <Link key={href} href={href} className="link text-sm font-medium">
            {label} →
          </Link>
        ) : (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="link text-sm font-medium"
          >
            {label}
          </a>
        ),
      )}
    </div>
  )
}

export default async function SpeakingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'speaking' })
  const tc = await getTranslations({ locale, namespace: 'contact' })
  const tCourses = await getTranslations({ locale, namespace: 'courses' })

  const interactiveTalks = getInteractiveTalks()
  const archiveTalks = getVisibleTalks().filter((talk) => !talk.featured)

  const topics = [1, 2, 3, 4].map((n) => ({
    title: t(`topic_${n}_title`),
    desc: t(`topic_${n}_desc`),
  }))

  const labels = {
    interactive: t('open_presentation'),
    recording: t('watch_recording'),
    slides: t('slides'),
    poster: t('poster'),
  }
  const enquiryHref = emailEnquiryHref(
    tc('speaking_email_subject'),
    tc('speaking_email_body'),
  )

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
        <p className="eyebrow">{t('section_label')}</p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-balance text-ink sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">{t('subtitle')}</p>

        {/* ── Interactive EdTrace Presentations & Upcoming Keynotes ── */}
        {interactiveTalks.length > 0 && (
          <section className="mt-14">
            <h2 className="eyebrow">{t('presentations_label')}</h2>
            <div className="mt-4 space-y-8">
              {interactiveTalks.map((talk) => {
                const { edtrace } = talk
                const available = talkLanguages(edtrace)
                const title = pickLocalized(edtrace.titles, locale)
                const summary = pickLocalized(edtrace.summaries, locale)
                const venue = pickLocalized(edtrace.venues, locale)
                const themeLine = edtrace.eventTheme
                  ? pickLocalized(edtrace.eventTheme, locale)
                  : null

                return (
                  <article
                    key={edtrace.slug}
                    className="grid grid-cols-1 gap-8 rounded-xl border border-rule bg-surface p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start"
                  >
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-3">
                        <span className="eyebrow text-accent">{t('interactive_badge')}</span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={talk.date}>{formatDate(talk.date, locale)}</time>
                        <span aria-hidden="true">·</span>
                        <span>{edtrace.location}</span>
                      </p>

                      <h3 className="mt-2.5 font-serif text-2xl font-medium text-balance text-ink sm:text-3xl">
                        <Link
                          href={`/speaking/${edtrace.slug}`}
                          className="decoration-accent decoration-1 underline-offset-4 hover:underline"
                        >
                          {title}
                        </Link>
                      </h3>

                      <p className="mt-2 text-sm font-medium text-ink-2">{venue}</p>
                      {themeLine && (
                        <p className="mt-1 text-xs italic text-ink-3">{themeLine}</p>
                      )}

                      <p className="mt-4 text-sm leading-relaxed text-ink-2">{summary}</p>

                      {available.length > 0 && (
                        <p className="mt-4 text-xs text-ink-3">
                          {tCourses('available_in')}{' '}
                          {available.map((code) => LOCALE_NAMES[code] ?? code).join(' · ')}
                          {edtrace.affiliation ? ` · ${edtrace.affiliation}` : ''}
                        </p>
                      )}

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                          href={`/speaking/${edtrace.slug}`}
                          className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90"
                        >
                          {t('open_presentation')} →
                        </Link>
                        <Link
                          href={`/speaking/${edtrace.slug}?animate=1&fullscreen=1`}
                          className="inline-flex items-center gap-2 rounded-md border border-ink px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
                        >
                          {tCourses('present_fullscreen')}
                        </Link>
                        {talk.poster && (
                          <a
                            href={talk.poster}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link text-sm font-medium"
                          >
                            {t('poster')} ↗
                          </a>
                        )}
                      </div>
                    </div>

                    {talk.poster && (
                      <Link
                        href={`/speaking/${edtrace.slug}`}
                        className="group relative mx-auto block aspect-[3/4] w-48 overflow-hidden rounded-lg border border-rule bg-raised sm:mx-0 lg:w-full"
                      >
                        <Image
                          src={talk.poster}
                          alt={venue}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                          sizes="(min-width: 1920px) 290px, (min-width: 1024px) 240px, 192px"
                        />
                      </Link>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Selected Talks, University Lectures & Spotlights ── */}
        <section className="mt-20">
          <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">{t('past_title')}</h2>
          <ul className="mt-8 space-y-8">
            {archiveTalks.map((talk) => (
              <li key={talk.title} className="border-t border-rule pt-5">
                <p className="text-xs text-ink-3">
                  <time dateTime={talk.date}>{formatDate(talk.date, locale)}</time>
                </p>
                <h3 className="mt-1.5 font-serif text-lg font-medium text-balance text-ink">
                  {talk.title}
                </h3>
                <p className="mt-1 text-sm text-ink-2">{talk.venue}</p>
                <TalkResources talk={talk} labels={labels} />
              </li>
            ))}
          </ul>
        </section>

        {/* ── Speaking Topics ── */}
        <section className="mt-20">
          <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
            {t('topics_title')}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {topics.map(({ title, desc }) => (
              <div key={title} className="border-t border-rule pt-5">
                <h3 className="font-serif text-lg font-medium text-balance text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Invite ── */}
        <section id="invite" className="mt-20 scroll-mt-24 border-t border-rule pt-10">
          <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
            {t('invite_title')}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-2">{t('invite_body')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={enquiryHref}
              className="inline-flex min-w-0 items-center rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
            >
              {tc('speaking_cta')}
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
