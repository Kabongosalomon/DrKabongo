import { getAllPosts } from '@/lib/blog'
import { SITE_URL, absoluteUrl } from '@/lib/metadata'
import { routing } from '@/i18n/routing'

/**
 * RSS 2.0 feed of the blog, built at deploy time.
 *
 * For readers who follow blogs in a feed reader. Email subscribers are
 * notified separately, by .github/workflows/notify-subscribers.yml.
 * Items carry the excerpt, not the full post, so readers come to the site,
 * where the comments are.
 */
export const dynamic = 'force-static'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function GET() {
  const posts = getAllPosts()
  const feedUrl = `${SITE_URL}/feed.xml`

  const items = posts
    .map((post) => {
      const url = absoluteUrl(routing.defaultLocale, `/blog/${post.slug}`)
      const date = post.date ? new Date(post.date) : null
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        date && !Number.isNaN(date.getTime()) ? `      <pubDate>${date.toUTCString()}</pubDate>` : '',
        `      <description>${escapeXml(post.excerpt)}</description>`,
        `      <category>${escapeXml(post.category)}</category>`,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dr. Kabongo — Writing</title>
    <link>${absoluteUrl(routing.defaultLocale, '/blog')}</link>
    <description>Notes on AI research, programming and the road here, by Salomon Kabongo.</description>
    <language>en</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
