import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  /**
   * Static export (`out/`) hosted on AWS S3 + CloudFront (matching DarAkili).
   * Clean URLs, `as-needed` locale routing (`/` -> `/en.html`), `www` redirect,
   * and `X-Robots-Tag: noindex` on `dev` are handled at the edge by the
   * CloudFront Function & Response Headers Policy in `infrastructure/`.
   */
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  /**
   * `vega-canvas` ships a Node build that optionally requires the native
   * `canvas` package for server-side rendering. It reaches the bundle through
   * the EdTrace viewer's lazy plot chunk, which only ever runs in a browser
   * against the DOM canvas, so the dependency is unreachable — without this
   * alias every build logs a "Can't resolve 'canvas'" warning for it.
   */
  webpack: (config) => {
    config.resolve.alias = { ...config.resolve.alias, canvas: false }
    return config
  },
}

export default withNextIntl(nextConfig)
