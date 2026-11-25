import type { MetadataRoute } from 'next'
import { IS_DEV_DEPLOYMENT } from '@/lib/metadata'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  if (IS_DEV_DEPLOYMENT) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://drkabongo.com/sitemap.xml',
  }
}
