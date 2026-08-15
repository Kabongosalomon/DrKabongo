import { Link } from '@/i18n/navigation'
import type { PostMeta } from '@/lib/blog'

interface BlogCardProps {
  post: PostMeta
  locale: string
  minReadLabel: string
}

export default function BlogCard({ post, locale, minReadLabel }: BlogCardProps) {
  const date = post.date ? new Date(post.date) : null

  return (
    <article className="border-t border-rule pt-5">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-3">
        <span className="eyebrow">{post.category}</span>
        <span aria-hidden="true">·</span>
        <span>
          {post.readingTime} {minReadLabel}
        </span>
      </p>

      <h3 className="mt-2 font-serif text-lg font-medium text-balance">
        <Link
          href={`/blog/${post.slug}`}
          className="text-ink decoration-accent decoration-1 underline-offset-4 hover:underline"
        >
          {post.title}
        </Link>
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-ink-2 line-clamp-3">{post.excerpt}</p>

      {date && !Number.isNaN(date.getTime()) && (
        <time dateTime={post.date} className="mt-3 block text-xs text-ink-3">
          {date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
      )}
    </article>
  )
}
