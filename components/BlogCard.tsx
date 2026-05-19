import Link from 'next/link'
import type { PostMeta } from '@/lib/blog'

interface BlogCardProps {
  post: PostMeta
  locale: string
  readMoreLabel: string
  minReadLabel: string
}

function localePath(locale: string, path: string) {
  return locale === 'en' ? path : `/${locale}${path}`
}

export default function BlogCard({ post, locale, readMoreLabel, minReadLabel }: BlogCardProps) {
  const href = localePath(locale, `/blog/${post.slug}`)

  return (
    <Link
      href={href}
      className="group card-hover block bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition-colors"
    >
      {/* Category + reading time */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold bg-brand/10 text-brand-light border border-brand/20 px-2.5 py-0.5 rounded-full">
          {post.category}
        </span>
        <span className="text-xs text-slate-500">
          {post.readingTime} {minReadLabel}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-white group-hover:text-brand-light transition-colors mb-2 line-clamp-2">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
        {post.excerpt}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <time className="text-xs text-slate-500">
          {post.date
            ? new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : ''}
        </time>
        <span className="text-xs font-semibold text-brand-light group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          {readMoreLabel}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
