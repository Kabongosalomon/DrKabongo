'use client'

import { useEffect, useMemo, useState } from 'react'
import BlogCard from '@/components/BlogCard'
import type { PostMeta } from '@/lib/blog'

interface BlogIndexProps {
  posts: PostMeta[]
  locale: string
  labels: {
    minRead: string
    search: string
    allTopics: string
    topics: string
    sort: string
    newest: string
    oldest: string
    noMatches: string
    clear: string
    showMore: string
  }
}

const PAGE_SIZE = 12

const chip =
  'rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * The post list with a way to find things once there are many: search across
 * title, summary and keywords, a topic (category) filter, a keyword filter set
 * by clicking a #tag on a card, newest/oldest first, and "show more" paging.
 * The filter lives in the URL (?topic=…&tag=…&q=…) so a filtered view can be
 * shared. Without JavaScript the full list is still there, newest first.
 */
export default function BlogIndex({ posts, locale, labels }: BlogIndexProps) {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('')
  const [tag, setTag] = useState('')
  const [oldestFirst, setOldestFirst] = useState(false)
  const [shown, setShown] = useState(PAGE_SIZE)
  const [ready, setReady] = useState(false)

  // Pick up a shared filter from the URL once, after hydration.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setQuery(params.get('q') ?? '')
    setTopic(params.get('topic') ?? '')
    setTag(params.get('tag') ?? '')
    setOldestFirst(params.get('sort') === 'oldest')
    setReady(true)
  }, [])

  // Keep the URL in step with the filter (replace: no history spam).
  useEffect(() => {
    if (!ready) return
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (topic) params.set('topic', topic)
    if (tag) params.set('tag', tag)
    if (oldestFirst) params.set('sort', 'oldest')
    const search = params.toString()
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${search ? `?${search}` : ''}`,
    )
  }, [ready, query, topic, tag, oldestFirst])

  const topics = useMemo(() => {
    const counts = new Map<string, number>()
    for (const post of posts) counts.set(post.category, (counts.get(post.category) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [posts])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const matches = posts.filter((post) => {
      if (topic && post.category !== topic) return false
      if (tag && !post.tags.includes(tag)) return false
      if (!needle) return true
      return [post.title, post.excerpt, post.category, ...post.tags]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
    // Posts arrive newest first; ISO dates compare as strings.
    return oldestFirst ? [...matches].reverse() : matches
  }, [posts, query, topic, tag, oldestFirst])

  const filtering = Boolean(query || topic || tag)
  const clear = () => {
    setQuery('')
    setTopic('')
    setTag('')
    setShown(PAGE_SIZE)
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">{labels.search}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setShown(PAGE_SIZE)
            }}
            placeholder={labels.search}
            className="w-full rounded-md border border-rule bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-ink-3 focus:outline-none"
          />
        </label>
        <label className="flex shrink-0 items-center gap-2 text-xs text-ink-3">
          {labels.sort}
          <select
            value={oldestFirst ? 'oldest' : 'newest'}
            onChange={(event) => setOldestFirst(event.target.value === 'oldest')}
            className="rounded-md border border-rule bg-surface px-2 py-2 text-sm text-ink focus:border-ink-3 focus:outline-none"
          >
            <option value="newest">{labels.newest}</option>
            <option value="oldest">{labels.oldest}</option>
          </select>
        </label>
      </div>

      {topics.length > 1 && (
        <div
          className="mt-4 flex flex-wrap items-center gap-2"
          role="group"
          aria-label={labels.topics}
        >
          <button
            type="button"
            aria-pressed={!topic}
            onClick={() => {
              setTopic('')
              setShown(PAGE_SIZE)
            }}
            className={`${chip} ${
              !topic
                ? 'border-ink bg-ink text-paper'
                : 'border-rule text-ink-2 hover:border-ink-3 hover:text-ink'
            }`}
          >
            {labels.allTopics}
          </button>
          {topics.map(([name, count]) => (
            <button
              key={name}
              type="button"
              aria-pressed={topic === name}
              onClick={() => {
                setTopic(topic === name ? '' : name)
                setShown(PAGE_SIZE)
              }}
              className={`${chip} ${
                topic === name
                  ? 'border-ink bg-ink text-paper'
                  : 'border-rule text-ink-2 hover:border-ink-3 hover:text-ink'
              }`}
            >
              {name} <span className="opacity-60">{count}</span>
            </button>
          ))}
        </div>
      )}

      {tag && (
        <p className="mt-3 text-sm text-ink-2">
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs text-accent">
            #{tag}
          </span>
        </p>
      )}

      {visible.length === 0 ? (
        <div className="mt-10 border-t border-rule pt-6 text-base text-ink-2">
          <p>{labels.noMatches}</p>
          {filtering && (
            <button
              type="button"
              onClick={clear}
              className="mt-2 text-sm text-accent underline-offset-4 hover:underline"
            >
              {labels.clear}
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {visible.slice(0, shown).map((post) => (
              <BlogCard
                key={`${post.locale}/${post.slug}`}
                post={post}
                locale={locale}
                minReadLabel={labels.minRead}
                onTagClick={(name) => {
                  setTag(tag === name ? '' : name)
                  setShown(PAGE_SIZE)
                }}
              />
            ))}
          </div>
          {visible.length > shown && (
            <button
              type="button"
              onClick={() => setShown((count) => count + PAGE_SIZE)}
              className="mt-10 rounded-md border border-rule px-4 py-2 text-sm text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
            >
              {labels.showMore}
            </button>
          )}
        </>
      )}
    </div>
  )
}
