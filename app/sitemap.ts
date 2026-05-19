import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

const BASE_URL = 'https://drkabongo.com'
const LOCALES = ['en', 'fr', 'ln'] as const

function localeUrl(locale: string, path: string): string {
  const prefix = locale === 'en' ? '' : `/${locale}`
  return `${BASE_URL}${prefix}${path}`
}

function buildEntry(path: string, lastModified?: Date): MetadataRoute.Sitemap[number] {
  return {
    url: localeUrl('en', path),
    lastModified: lastModified ?? new Date(),
    changeFrequency: 'monthly',
    priority: path === '' ? 1.0 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((locale) => [locale, localeUrl(locale, path)])
      ),
    },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/cv', '/blog', '/projects', '/publications']

  const staticEntries = staticPaths.map((path) => buildEntry(path))

  const posts = getAllPosts()
  const blogEntries = posts.map((post) =>
    buildEntry(`/blog/${post.slug}`, post.date ? new Date(post.date) : undefined)
  )

  return [...staticEntries, ...blogEntries]
}
