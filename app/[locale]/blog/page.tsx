import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import BlogCard from '@/components/BlogCard'
import { getAllPosts } from '@/lib/blog'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  return { title: t('title'), description: t('subtitle') }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'blog' })
  const posts = getAllPosts()

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <span className="section-label">{t('section_label')}</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">{t('title')}</h1>
          <p className="text-slate-400 text-lg max-w-xl">{t('subtitle')}</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-slate-500">{t('no_posts')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                post={post}
                locale={locale}
                readMoreLabel={t('read_more')}
                minReadLabel={t('min_read')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
