import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { alternatesFor } from '@/lib/metadata'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'

export function generateStaticParams() {
  const posts = getAllPosts()
  return routing.locales.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: alternatesFor(locale, `/blog/${slug}`),
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date || undefined,
      tags: post.tags,
    },
  }
}

/**
 * Wraps tables in a scroll container so a wide table scrolls inside its own box
 * instead of widening the page on narrow viewports.
 */
const mdxComponents = {
  table: (props: React.ComponentPropsWithoutRef<'table'>) => (
    <div className="table-scroll my-6">
      <table {...props} />
    </div>
  ),
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

  const date = post.date ? new Date(post.date) : null

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-2xl px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
        <Link
          href="/blog"
          className="inline-flex min-w-0 items-center gap-1.5 text-sm text-ink-2 transition-colors hover:text-accent"
        >
          <svg
            className="h-3.5 w-3.5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m6-6-6 6 6 6" />
          </svg>
          {t('back')}
        </Link>

        <header className="mt-8 border-b border-rule pb-8">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-3">
            <span className="eyebrow">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>
              {post.readingTime} {t('min_read')}
            </span>
          </p>

          <h1 className="mt-3 font-serif text-3xl leading-tight font-medium text-balance text-ink sm:text-4xl">
            {post.title}
          </h1>

          {date && !Number.isNaN(date.getTime()) && (
            <time dateTime={post.date} className="mt-4 block text-sm text-ink-3">
              {date.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}

          {post.tags.length > 0 && (
            <p className="mt-3 text-xs text-ink-3">{post.tags.map((tag) => `#${tag}`).join(' ')}</p>
          )}
        </header>

        {/* No prose-sm step-down: article text is what people read longest, so it should never sit below the site's 16px baseline, mobile included. */}
        <article className="prose mt-10 max-w-none">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
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
