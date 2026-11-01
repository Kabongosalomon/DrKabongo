import type { MetadataRoute } from 'next'
import { getAllPostFiles } from '@/lib/blog'
import { getAllCourses, allCourseLessonPairs } from '@/lib/courses'
import { routing } from '@/i18n/routing'
import { absoluteUrl } from '@/lib/metadata'

function buildEntry(
  path: string,
  lastModified?: Date,
  locales: readonly string[] = routing.locales,
  urlLocale: string = routing.defaultLocale,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(urlLocale, path),
    lastModified: lastModified ?? new Date(),
    changeFrequency: 'monthly',
    priority: path === '' ? 1.0 : 0.8,
    alternates: {
      languages: Object.fromEntries(locales.map((locale) => [locale, absoluteUrl(locale, path)])),
    },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '',
    '/courses',
    '/videos',
    '/speaking',
    '/consulting',
    '/publications',
    '/projects',
    '/blog',
    '/cv',
  ]

  const staticEntries = staticPaths.map((path) => buildEntry(path))

  // One entry per post per language it is really written in; a post is never
  // listed for a language that only sees it through a fallback.
  const postFiles = getAllPostFiles()
  const blogEntries = postFiles.map((post) =>
    buildEntry(
      `/blog/${post.slug}`,
      post.date ? new Date(post.date) : undefined,
      postFiles.filter((other) => other.slug === post.slug).map((other) => other.locale),
      post.locale,
    ),
  )

  const courseEntries = getAllCourses().map((catalog) =>
    buildEntry(`/courses/${catalog.course.id}`),
  )

  const lessonEntries = allCourseLessonPairs().map(({ course, lesson }) =>
    buildEntry(`/courses/${course}/${lesson}`),
  )

  return [...staticEntries, ...blogEntries, ...courseEntries, ...lessonEntries]
}
