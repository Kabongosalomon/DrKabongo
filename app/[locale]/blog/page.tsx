import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SITE_URL, alternatesFor } from '@/lib/metadata'
import BlogIndex from '@/components/BlogIndex'
import Subscribe from '@/components/Subscribe'
import { getPostsForLocale } from '@/lib/blog'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      ...alternatesFor(locale, '/blog'),
      types: { 'application/rss+xml': `${SITE_URL}/feed.xml` },
    },
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'blog' })
  const posts = getPostsForLocale(locale)

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
        <p className="eyebrow">{t('section_label')}</p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-balance text-ink sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2">{t('subtitle')}</p>

        <div className="mt-10 max-w-2xl">
          <Subscribe emailEnabled={Boolean(process.env.KIT_API_KEY && process.env.KIT_FORM_ID)} />
        </div>

        {posts.length === 0 ? (
          <p className="mt-14 border-t border-rule pt-6 text-base text-ink-2">{t('no_posts')}</p>
        ) : (
          <div className="mt-14">
            <BlogIndex
              posts={posts}
              locale={locale}
              labels={{
                minRead: t('min_read'),
                search: t('search'),
                allTopics: t('all_topics'),
                topics: t('topics'),
                sort: t('sort'),
                newest: t('newest'),
                oldest: t('oldest'),
                noMatches: t('no_matches'),
                clear: t('clear_filters'),
                showMore: t('show_more'),
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
