import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { routing } from '@/i18n/routing'

/**
 * Posts live in one folder per language: content/blog/<locale>/<slug>.mdx.
 * The same slug in two folders is the same post in two languages (they share
 * one comment thread); a post that exists in a single folder is shown only in
 * that language.
 */
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

/**
 * What a reader sees when a post has no version in their own language: the
 * language most of that audience reads. English and French have no fallback —
 * a post written in one is never shown on the other's side.
 */
export const BLOG_FALLBACK: Record<string, string | undefined> = {
  sw: 'en',
  ln: 'fr',
  lua: 'fr',
}

export interface PostMeta {
  slug: string
  /** The language this version is written in (its folder name). */
  locale: string
  title: string
  date: string
  excerpt: string
  category: string
  tags: string[]
  readingTime: number
}

export interface Post extends PostMeta {
  content: string
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function readPost(locale: string, slug: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, locale, `${slug}.mdx`), 'utf-8')
  const { data, content } = matter(raw)
  return {
    slug,
    locale,
    title: data.title ?? slug,
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : (data.date ?? ''),
    excerpt: data.excerpt ?? '',
    category: data.category ?? 'General',
    tags: data.tags ?? [],
    readingTime: estimateReadingTime(content),
    content,
  }
}

/** Every post file, by language then slug. Fails loudly on a misplaced file. */
function listFiles(): Array<{ locale: string; slug: string }> {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files: Array<{ locale: string; slug: string }> = []
  for (const entry of fs.readdirSync(BLOG_DIR, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.mdx')) {
      throw new Error(
        `content/blog/${entry.name}: posts live in a folder per language, e.g. content/blog/en/${entry.name}`,
      )
    }
    if (!entry.isDirectory()) continue
    if (!routing.locales.includes(entry.name as (typeof routing.locales)[number])) {
      throw new Error(
        `content/blog/${entry.name}: not a supported language (use one of ${routing.locales.join(', ')})`,
      )
    }
    for (const file of fs.readdirSync(path.join(BLOG_DIR, entry.name))) {
      if (file.endsWith('.mdx'))
        files.push({ locale: entry.name, slug: file.replace(/\.mdx$/, '') })
    }
  }
  return files
}

const newestFirst = (a: PostMeta, b: PostMeta) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)

function withoutContent(post: Post): PostMeta {
  const meta: Partial<Post> = { ...post }
  delete meta.content
  return meta as PostMeta
}

/** The languages to look in, best first: the reader's own, then its fallback. */
function lookupOrder(locale: string): string[] {
  const fallback = BLOG_FALLBACK[locale]
  return fallback ? [locale, fallback] : [locale]
}

/**
 * Posts to list for one language, newest first: those written in it, plus —
 * for languages with a fallback — posts that only exist in the fallback.
 */
export function getPostsForLocale(locale: string): PostMeta[] {
  const files = listFiles()
  const slugs = new Set(files.map((file) => file.slug))
  const posts: PostMeta[] = []
  for (const slug of slugs) {
    const source = lookupOrder(locale).find((candidate) =>
      files.some((file) => file.locale === candidate && file.slug === slug),
    )
    if (source) posts.push(withoutContent(readPost(source, slug)))
  }
  return posts.sort(newestFirst)
}

/** One post for a language, from its own folder or else its fallback's. */
export function getPostForLocale(locale: string, slug: string): Post | null {
  const files = listFiles()
  const source = lookupOrder(locale).find((candidate) =>
    files.some((file) => file.locale === candidate && file.slug === slug),
  )
  return source ? readPost(source, slug) : null
}

/** The languages a post is actually written in (no fallbacks). */
export function getPostLanguages(slug: string): string[] {
  return listFiles()
    .filter((file) => file.slug === slug)
    .map((file) => file.locale)
}

/** Every post file as written, in every language — for the sitemap and feed. */
export function getAllPostFiles(): PostMeta[] {
  return listFiles()
    .map(({ locale, slug }) => withoutContent(readPost(locale, slug)))
    .sort(newestFirst)
}
