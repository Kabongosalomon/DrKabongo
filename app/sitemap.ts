import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { routing } from '@/i18n/routing'
import { absoluteUrl } from '@/lib/metadata'

function buildEntry(path: string, lastModified?: Date): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(routing.defaultLocale, path),
    lastModified: lastModified ?? new Date(),
    changeFrequency: 'monthly',
    priority: path === '' ? 1.0 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, absoluteUrl(locale, path)]),
      ),
    },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '',
    '/videos',
    '/speaking',
    '/consulting',
    '/publications',
    '/projects',
    '/blog',
    '/cv',
  ]

  const staticEntries = staticPaths.map((path) => buildEntry(path))

  const blogEntries = getAllPosts().map((post) =>
    buildEntry(`/blog/${post.slug}`, post.date ? new Date(post.date) : undefined),
  )

  return [...staticEntries, ...blogEntries]
}
