import { setRequestLocale, getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import {
  absoluteUrl,
  alternateOpenGraphLocales,
  alternatesFor,
  openGraphLocaleFor,
} from '@/lib/metadata'
import { emailEnquiryHref } from '@/lib/contact'
import { getAllVideos, countByChannel, CHANNEL_KEYS } from '@/lib/videos'
import { getAllPosts } from '@/lib/blog'
import { COMMUNITY } from '@/content/community'
import { LanguageStrip } from '@/components/LanguageSwitcher'
import VideoCard from '@/components/VideoCard'
import ChannelCard from '@/components/ChannelCard'
import CommunityCard from '@/components/CommunityCard'
import BlogCard from '@/components/BlogCard'
import ArrowLink from '@/components/ArrowLink'

export const revalidate = 3600

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })
  const title = `${t('name')} — ${t('eyebrow')}`
  const description = t('description')

  return {
    title,
    description,
    alternates: alternatesFor(locale),
    openGraph: {
      type: 'website' as const,
      url: absoluteUrl(locale),
      siteName: 'Dr. Kabongo',
      title,
      description,
      locale: openGraphLocaleFor(locale),
      alternateLocale: alternateOpenGraphLocales(locale),
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
    },
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, tv, ta, ts, tsp, tco, tb, tc] = await Promise.all([
    getTranslations({ locale, namespace: 'hero' }),
    getTranslations({ locale, namespace: 'videos' }),
    getTranslations({ locale, namespace: 'about' }),
    getTranslations({ locale, namespace: 'stats' }),
    getTranslations({ locale, namespace: 'speaking' }),
    getTranslations({ locale, namespace: 'consulting' }),
    getTranslations({ locale, namespace: 'blog' }),
    getTranslations({ locale, namespace: 'contact' }),
  ])

  const videos = await getAllVideos()
  const [featured, ...rest] = videos
  const recent = rest.slice(0, 6)
  const counts = countByChannel(videos)

  const posts = getAllPosts().slice(0, 3)

  const figures = ts.raw('items') as Array<{
    value: string
    label: string
    detail: string
  }>
  const researchItems = ta.raw('research_items') as Array<{
    title: string
    description: string
  }>

  const now = [t('now_role'), t('now_phd'), t('now_darakili')]

  const topics = [1, 2, 3, 4].map((n) => ({
    title: tsp(`topic_${n}_title`),
    desc: tsp(`topic_${n}_desc`),
  }))

  const speakingHref = emailEnquiryHref(
    tc('speaking_email_subject'),
    tc('speaking_email_body'),
  )
  const advisoryHref = emailEnquiryHref(
    tc('advisory_email_subject'),
    tc('advisory_email_body'),
  )

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
          <div className="min-w-0 order-2 lg:order-1">
            <p className="eyebrow">{t('eyebrow')}</p>
            <h1 className="mt-3 font-serif text-4xl leading-[1.08] font-medium text-balance text-ink sm:text-5xl">
              {t('name')}
            </h1>
            <p className="mt-5 max-w-xl font-serif text-xl leading-snug text-balance text-ink-2 sm:text-2xl">
              {t('lede')}
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-2">{t('description')}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/videos"
                className="inline-flex min-w-0 items-center gap-2 rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
              >
                {t('cta_videos')}
              </Link>
              <a
                href="#research"
                className="inline-flex min-w-0 items-center gap-2 rounded-md border border-ink px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                {t('cta_work')}
              </a>
            </div>
          </div>

          <div className="order-1 w-40 shrink-0 sm:w-48 lg:order-2 lg:w-full">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg border border-rule bg-raised">
              <Image
                src="/images/dr-kabongo.jpg"
                alt={t('portrait_alt')}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 256px, 192px"
                priority
              />
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <dl className="border-t border-rule pt-5">
            <dt className="eyebrow">{t('now_label')}</dt>
            <dd className="mt-2">
              <ul className="space-y-1.5">
                {now.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-ink-2">
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </dl>

          <LanguageStrip />
        </div>
      </section>

      {/* ─── RESEARCH & ENGINEERING ─── */}
      <section id="research" className="scroll-mt-24 border-t border-rule bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="eyebrow">{ta('section_label')}</p>
          <h2 className="mt-2 max-w-3xl font-serif text-3xl font-medium text-balance text-ink sm:text-4xl">
            {ta('title')}
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <div className="min-w-0 space-y-4 text-base leading-relaxed text-ink-2">
              <p>{ta('bio1')}</p>
              <p>{ta('bio2')}</p>
              <p>{ta('bio3')}</p>
              <p>{ta('darakili')}</p>
              <p className="border-l-2 border-accent pl-4 font-serif text-lg leading-relaxed text-ink">
                {ta('closing')}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                <ArrowLink href="/publications">{ta('see_publications')}</ArrowLink>
                <ArrowLink href="/projects">{ta('see_projects')}</ArrowLink>
                <ArrowLink href="/cv">{ta('read_cv')}</ArrowLink>
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="eyebrow">{ta('research_title')}</h3>
              <ul className="mt-3 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-1">
                {researchItems.map(({ title, description }) => (
                  <li key={title} className="border-t border-rule py-3">
                    <h4 className="font-serif text-base text-ink">{title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">{description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 border-t border-rule pt-10">
            <h3 className="eyebrow">{ta('figures_label')}</h3>
            <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {figures.map(({ value, label, detail }) => (
                <div key={`${value}-${label}`} className="border-t border-rule pt-3">
                  <dt className="font-serif text-lg leading-snug text-balance text-ink">{value}</dt>
                  <dd className="mt-1 text-sm font-medium text-ink-2">{label}</dd>
                  <dd className="mt-1 text-xs leading-relaxed text-ink-3">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ─── VIDEOS ─── */}
      {videos.length > 0 && (
        <section className="border-t border-rule">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="eyebrow">{tv('section_label')}</p>
                <h2 className="mt-2 font-serif text-3xl font-medium text-balance text-ink sm:text-4xl">
                  {tv('home_title')}
                </h2>
              </div>
              <ArrowLink href="/videos">{tv('all_videos')}</ArrowLink>
            </div>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2">
              {tv('home_subtitle')}
            </p>

            {featured && (
              <div className="mt-10 max-w-3xl">
                <p className="eyebrow mb-3">{tv('featured')}</p>
                <VideoCard video={featured} locale={locale} featured priority />
              </div>
            )}

            {recent.length > 0 && (
              <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((video) => (
                  <VideoCard key={video.id} video={video} locale={locale} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── CHANNELS ─── */}
      <section className="border-t border-rule bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="eyebrow">{tv('channels_label')}</p>
          <h2 className="mt-2 max-w-2xl font-serif text-3xl font-medium text-balance text-ink sm:text-4xl">
            {tv('channels_title')}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2">
            {tv('channels_subtitle')}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CHANNEL_KEYS.map((key) => (
              <ChannelCard
                key={key}
                channelKey={key}
                label={tv(`channel_${key}_label`)}
                description={tv(`channel_${key}_desc`)}
                videoCount={counts[key]}
                countLabel={tv('count', { count: counts[key] })}
                subscribeLabel={tv('subscribe')}
                comingSoonLabel={tv('coming_soon')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── SPEAKING ─── */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow">{tsp('section_label')}</p>
              <h2 className="mt-2 font-serif text-3xl font-medium text-balance text-ink sm:text-4xl">
                {tsp('home_title')}
              </h2>
            </div>
            <ArrowLink href="/speaking">{tsp('invite_title')}</ArrowLink>
          </div>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2">
            {tsp('home_subtitle')}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map(({ title, desc }) => (
              <div key={title} className="border-t border-rule pt-5">
                <h3 className="font-serif text-lg font-medium text-balance text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WRITING ─── */}
      {posts.length > 0 && (
        <section className="border-t border-rule bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="eyebrow">{tb('section_label')}</p>
                <h2 className="mt-2 font-serif text-3xl font-medium text-balance text-ink sm:text-4xl">
                  {tb('home_title')}
                </h2>
              </div>
              <ArrowLink href="/blog">{tb('all_posts')}</ArrowLink>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  locale={locale}
                  minReadLabel={tb('min_read')}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── WORK WITH ME ─── */}
      <section id="contact" className="scroll-mt-24 border-t border-rule">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="eyebrow">{tc('section_label')}</p>
          <h2 className="mt-2 max-w-2xl font-serif text-3xl font-medium text-balance text-ink sm:text-4xl">
            {tc('title')}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2">{tc('subtitle')}</p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <article className="border-t border-rule pt-5">
              <h3 className="font-serif text-xl font-medium text-ink">{tc('speaking_title')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{tc('speaking_body')}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href={speakingHref}
                  className="inline-flex min-w-0 items-center rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90"
                >
                  {tc('speaking_cta')}
                </a>
                <ArrowLink href="/speaking">{tsp('topics_title')}</ArrowLink>
              </div>
            </article>

            <article className="border-t border-rule pt-5">
              <h3 className="font-serif text-xl font-medium text-ink">{tc('advisory_title')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{tc('advisory_body')}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href={advisoryHref}
                  className="inline-flex min-w-0 items-center rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90"
                >
                  {tc('advisory_cta')}
                </a>
                <ArrowLink href="/consulting">{tco('areas_title')}</ArrowLink>
              </div>
            </article>
          </div>

          {/* Community */}
          <div className="mt-16">
            <h3 className="font-serif text-2xl font-medium text-balance text-ink">
              {tc('community_title')}
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-2">
              {tc('community_subtitle')}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {COMMUNITY.map(({ key, href, qr }) => (
                <CommunityCard
                  key={key}
                  name={tc(`community_${key}_name`)}
                  description={tc(`community_${key}_desc`)}
                  href={href}
                  cta={tc(`community_${key}_cta`)}
                  qr={qr}
                  qrAlt={tc(`community_${key}_qr_alt`)}
                  icon={
                    key === 'whatsapp' ? (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.334-.956 2.42-2.157 2.42Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.334-.946 2.42-2.157 2.42Z" />
                      </svg>
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
