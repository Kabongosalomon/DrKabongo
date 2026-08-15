import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { alternatesFor } from '@/lib/metadata'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'consulting' })
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: alternatesFor(locale, '/consulting'),
  }
}

export default async function ConsultingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'consulting' })
  const tc = await getTranslations({ locale, namespace: 'contact' })

  const areas = [1, 2, 3, 4].map((n) => ({
    title: t(`area_${n}_title`),
    desc: t(`area_${n}_desc`),
  }))

  const formats = [1, 2, 3].map((n) => ({
    title: t(`format_${n}_title`),
    desc: t(`format_${n}_desc`),
  }))

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
        <p className="eyebrow">{t('section_label')}</p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-balance text-ink sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">{t('subtitle')}</p>

        <section className="mt-16">
          <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
            {t('areas_title')}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {areas.map(({ title, desc }) => (
              <div key={title} className="border-t border-rule pt-5">
                <h3 className="font-serif text-lg font-medium text-balance text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
            {t('formats_title')}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {formats.map(({ title, desc }) => (
              <div key={title} className="border-t border-rule pt-5">
                <h3 className="font-serif text-lg font-medium text-balance text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-rule pt-10">
          <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">{t('cta_title')}</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-2">{t('cta_body')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={tc('book_call_url')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-0 items-center rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
            >
              {t('cta_book')}
            </a>
            <a
              href="mailto:kabongosalomon@gmail.com"
              className="inline-flex min-w-0 items-center rounded-md border border-ink px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              {t('cta_email')}
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
