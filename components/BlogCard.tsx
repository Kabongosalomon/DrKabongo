import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { PostMeta } from '@/lib/blog'
import { LOCALE_NAMES } from '@/i18n/routing'

interface BlogCardProps {
  post: PostMeta
  locale: string
  minReadLabel: string
  /** When given (blog index), the post's #keywords become filter buttons; otherwise plain text. */
  onTagClick?: (tag: string) => void
  /** The rendered width of the cover, for the browser to pick a file size. */
  coverSizes?: string
  /**
   * The lead card of a list: spans the row, and on wide screens sets a large
   * cover beside the text, so the figure on it can be read without opening the post.
   */
  featured?: boolean
}

/**
 * One post, as one object: the cover and the text share a single frame, a
 * single hover state and a single destination. The title is the only real
 * link; its `after:` layer stretches over the whole card, so a click on the
 * cover, the summary or the empty space opens the post too. Keyword buttons
 * sit above that layer and keep their own action.
 */
export default function BlogCard({
  post,
  locale,
  minReadLabel,
  onTagClick,
  coverSizes = '(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw',
  featured = false,
}: BlogCardProps) {
  const date = post.date ? new Date(post.date) : null
  // A post shown through a language fallback says which language it is in.
  const otherLanguage = post.locale !== locale ? LOCALE_NAMES[post.locale] : null

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-rule bg-surface transition-[border-color,box-shadow] duration-200 hover:border-ink-3 hover:shadow-md focus-within:border-ink-3 motion-reduce:transition-none ${
        featured ? 'sm:col-span-2 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-stretch' : ''
      }`}
    >
      <div
        className={`overflow-hidden border-b border-rule bg-[#fbf9f6] ${featured ? 'lg:flex lg:items-center lg:border-r lg:border-b-0' : ''}`}
      >
        <Image
          src={post.cover}
          alt=""
          width={1200}
          height={630}
          sizes={featured ? '(min-width: 1024px) 600px, 100vw' : coverSizes}
          className="block h-auto w-full transition-transform duration-300 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          priority={featured}
        />
      </div>

      <div className={`flex min-w-0 flex-1 flex-col p-5 ${featured ? 'lg:justify-center lg:p-8' : ''}`}>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-3">
          <span className="eyebrow">{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>
            {post.readingTime} {minReadLabel}
          </span>
          {otherLanguage && (
            <>
              <span aria-hidden="true">·</span>
              <span lang={post.locale} className="rounded-sm bg-raised px-1.5 py-px text-ink-2">
                {otherLanguage}
              </span>
            </>
          )}
        </p>

        <h3
          className={`mt-2 font-serif font-medium text-balance ${featured ? 'text-xl lg:text-2xl' : 'text-lg'}`}
        >
          <Link
            href={`/blog/${post.slug}`}
            lang={post.locale}
            className="text-ink decoration-accent decoration-1 underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0 after:rounded-xl focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent"
          >
            {post.title}
          </Link>
        </h3>

        <p lang={post.locale} className="mt-2 text-sm leading-relaxed text-ink-2 line-clamp-3">
          {post.excerpt}
        </p>

        {/* mt-auto pins tags + date to the card's bottom, so dates line up across a row. */}
        <div className={`pt-3 ${featured ? 'lg:mt-2' : 'mt-auto'}`}>
          {post.tags.length > 0 && (
            <p className="flex flex-wrap gap-x-3 gap-y-1">
              {post.tags.map((tag) =>
                onTagClick ? (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onTagClick(tag)}
                    className="relative z-10 text-xs text-ink-3 underline-offset-4 hover:text-accent hover:underline"
                  >
                    #{tag}
                  </button>
                ) : (
                  <span key={tag} className="text-xs text-ink-3">
                    #{tag}
                  </span>
                ),
              )}
            </p>
          )}

          {date && !Number.isNaN(date.getTime()) && (
            <time dateTime={post.date} className="mt-3 block text-xs text-ink-3">
              {/* UTC: front-matter dates are bare days, which JS parses as UTC midnight. */}
              {date.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC',
              })}
            </time>
          )}
        </div>
      </div>
    </article>
  )
}
