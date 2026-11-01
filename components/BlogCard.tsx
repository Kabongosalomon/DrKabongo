import { Link } from '@/i18n/navigation'
import type { PostMeta } from '@/lib/blog'
import { LOCALE_NAMES } from '@/i18n/routing'

interface BlogCardProps {
  post: PostMeta
  locale: string
  minReadLabel: string
  /** When given (blog index), the post's #keywords become filter buttons; otherwise plain text. */
  onTagClick?: (tag: string) => void
}

export default function BlogCard({ post, locale, minReadLabel, onTagClick }: BlogCardProps) {
  const date = post.date ? new Date(post.date) : null
  // A post shown through a language fallback says which language it is in.
  const otherLanguage = post.locale !== locale ? LOCALE_NAMES[post.locale] : null

  return (
    <article className="flex flex-col border-t border-rule pt-5">
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

      <h3 className="mt-2 font-serif text-lg font-medium text-balance">
        <Link
          href={`/blog/${post.slug}`}
          lang={post.locale}
          className="text-ink decoration-accent decoration-1 underline-offset-4 hover:underline"
        >
          {post.title}
        </Link>
      </h3>

      <p lang={post.locale} className="mt-2 text-sm leading-relaxed text-ink-2 line-clamp-3">
        {post.excerpt}
      </p>

      {/* mt-auto pins tags + date to the card's bottom, so dates line up across a row. */}
      <div className="mt-auto pt-3">
        {post.tags.length > 0 && (
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            {post.tags.map((tag) =>
              onTagClick ? (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagClick(tag)}
                  className="text-xs text-ink-3 underline-offset-4 hover:text-accent hover:underline"
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
    </article>
  )
}
