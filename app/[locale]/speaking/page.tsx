import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { alternatesFor } from '@/lib/metadata'
import { emailEnquiryHref } from '@/lib/contact'
import { TALKS, type Talk } from '@/content/talks'

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
  const iso = value.length === 7 ? `${value}-01` : value
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    ...(value.length === 7 ? { month: 'long' } : { month: 'long', day: 'numeric' }),
  })
}

function TalkResources({ talk, labels }: { talk: Talk; labels: Record<string, string> }) {
  const resources = [
    talk.videoId && {
      href: `https://www.youtube.com/watch?v=${talk.videoId}`,
      label: labels.recording,
    },
    talk.slides && { href: talk.slides, label: labels.slides },
    talk.poster && { href: talk.poster, label: labels.poster },
  ].filter(Boolean) as { href: string; label: string }[]

  if (resources.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
      {resources.map(({ href, label }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="link text-sm font-medium"
        >
          {label}
        </a>
      ))}
    </div>
  )
}

export default async function SpeakingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'speaking' })
  const tc = await getTranslations({ locale, namespace: 'contact' })

  const topics = [1, 2, 3, 4].map((n) => ({
    title: t(`topic_${n}_title`),
    desc: t(`topic_${n}_desc`),
  }))

  const labels = {
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

        {/* Topics */}
        <section className="mt-16">
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

        {/* Past talks */}
        <section className="mt-20">
          <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">{t('past_title')}</h2>
          <ul className="mt-8 space-y-8">
            {TALKS.map((talk) => (
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

        {/* Invite */}
        <section className="mt-20 border-t border-rule pt-10">
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
