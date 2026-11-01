import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { Link, redirect } from '@/i18n/navigation'
import { LOCALE_NAMES } from '@/i18n/routing'
import { SITE_URL, absoluteUrl, alternatesFor } from '@/lib/metadata'
import { getPostForLocale, getPostLanguages, getPostsForLocale } from '@/lib/blog'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import BlogComments from '@/components/BlogComments'
import ShareButton from '@/components/ShareButton'
import Subscribe from '@/components/Subscribe'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPostsForLocale(locale).map((post) => ({ locale, slug: post.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const post = getPostForLocale(locale, slug)
  if (!post) return {}
  // Shown through a language fallback: the original is the one to index.
  const isFallback = post.locale !== locale
  return {
    title: post.title,
    description: post.excerpt,
    robots: isFallback ? { index: false } : undefined,
    alternates: {
      ...(isFallback
        ? { canonical: absoluteUrl(post.locale, `/blog/${slug}`) }
        : alternatesFor(locale, `/blog/${slug}`, getPostLanguages(slug))),
      types: { 'application/rss+xml': `${SITE_URL}/feed.xml` },
    },
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
  const tc = await getTranslations({ locale, namespace: 'comments' })
  const post = getPostForLocale(locale, slug)
  if (!post) {
    // Exists, but not in this language (e.g. switched language on an
    // English-only post): send them to this language's own list.
    if (getPostLanguages(slug).length > 0) redirect({ href: '/blog', locale })
    notFound()
  }
  const fallbackLanguage = post.locale !== locale ? LOCALE_NAMES[post.locale] : null

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

        {fallbackLanguage && (
          <p className="mt-6 rounded-md border border-rule bg-raised px-3 py-2 text-sm text-ink-2">
            {t('fallback_notice', { language: fallbackLanguage })}
          </p>
        )}

        <header className="mt-8 border-b border-rule pb-8">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-3">
            <span className="eyebrow">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>
              {post.readingTime} {t('min_read')}
            </span>
          </p>

          <h1
            lang={post.locale}
            className="mt-3 font-serif text-3xl leading-tight font-medium text-balance text-ink sm:text-4xl"
          >
            {post.title}
          </h1>

          {date && !Number.isNaN(date.getTime()) && (
            <time dateTime={post.date} className="mt-4 block text-sm text-ink-3">
              {/* UTC: front-matter dates are bare days, parsed as UTC midnight —
                  in a reader's local zone west of UTC they'd show the day before. */}
              {date.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC',
              })}
            </time>
          )}

          {post.tags.length > 0 && (
            <p className="mt-3 text-xs text-ink-3">{post.tags.map((tag) => `#${tag}`).join(' ')}</p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <ShareButton title={post.title} />
            <a
              href="#comments"
              className="inline-flex items-center gap-1.5 text-sm text-ink-2 transition-colors hover:text-accent"
            >
              <svg
                className="h-3.5 w-3.5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"
                />
              </svg>
              {tc('join')}
            </a>
          </div>
        </header>

        {/* No prose-sm step-down: article text is what people read longest, so it should never sit below the site's 16px baseline, mobile included. */}
        <article lang={post.locale} className="prose mt-10 max-w-none">
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

        <div className="mt-16">
          <Subscribe emailEnabled={Boolean(process.env.KIT_API_KEY && process.env.KIT_FORM_ID)} />
        </div>

        <BlogComments slug={post.slug} locale={locale} />
      </div>
    </div>
  )
}
