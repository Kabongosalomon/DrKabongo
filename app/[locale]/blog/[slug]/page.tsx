import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'

export function generateStaticParams() {
  const posts = getAllPosts()
  return routing.locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

function localePath(locale: string, path: string) {
  return locale === 'en' ? path : `/${locale}${path}`
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'blog' })
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <Link
          href={localePath(locale, '/blog')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('back')}
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold bg-brand/10 text-brand-light border border-brand/20 px-2.5 py-0.5 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-slate-500">
              {post.readingTime} {t('min_read')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            {post.title}
          </h1>

          {post.date && (
            <time className="text-sm text-slate-500">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <article className="prose prose-invert prose-sm sm:prose-base max-w-none">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, rehypeHighlight],
              },
            }}
          />
        </article>
      </div>
    </div>
  )
}
