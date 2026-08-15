import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { alternatesFor } from '@/lib/metadata'
import { getAllVideos, countByChannel, CHANNEL_KEYS } from '@/lib/videos'
import VideoLibrary from '@/components/VideoLibrary'
import ChannelCard from '@/components/ChannelCard'

export const revalidate = 3600

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'videos' })
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: alternatesFor(locale, '/videos'),
  }
}

export default async function VideosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'videos' })
  const videos = await getAllVideos()
  const counts = countByChannel(videos)
  const empty = videos.length === 0

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
        <p className="eyebrow">{t('section_label')}</p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-balance text-ink sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2">
          {empty ? t('empty_subtitle') : t('subtitle')}
        </p>

        {/*
          Before the first upload the library has nothing to filter, so the page
          becomes an invitation to subscribe rather than an empty grid.
        */}
        {empty ? (
          <section className="mt-12 border-t border-rule pt-10">
            <h2 className="font-serif text-2xl font-medium text-balance text-ink sm:text-3xl">
              {t('empty_title')}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-2">{t('empty_body')}</p>
          </section>
        ) : (
          <VideoLibrary videos={videos} locale={locale} />
        )}

        <section className={empty ? 'mt-12' : 'mt-20 border-t border-rule pt-10'}>
          {!empty && (
            <>
              <h2 className="font-serif text-2xl font-medium text-balance text-ink sm:text-3xl">
                {t('channels_title')}
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-2">
                {t('channels_subtitle')}
              </p>
            </>
          )}

          <div className={`grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 ${empty ? '' : 'mt-8'}`}>
            {CHANNEL_KEYS.map((key) => (
              <ChannelCard
                key={key}
                channelKey={key}
                label={t(`channel_${key}_label`)}
                description={t(`channel_${key}_desc`)}
                videoCount={counts[key]}
                countLabel={t('count', { count: counts[key] })}
                subscribeLabel={t('subscribe')}
                comingSoonLabel={t('coming_soon')}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
