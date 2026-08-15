import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function LocaleNotFound() {
  const t = useTranslations('notfound')

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-2xl px-4 pt-32 pb-24 sm:px-6 sm:pt-44">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-balance text-ink sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-2">{t('description')}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex min-w-0 items-center rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            {t('home')}
          </Link>
          <Link
            href="/videos"
            className="inline-flex min-w-0 items-center rounded-md border border-ink px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            {t('videos')}
          </Link>
        </div>
      </div>
    </div>
  )
}
