import Link from 'next/link'

/**
 * Catches URLs that never matched a locale segment, so it renders outside
 * `app/[locale]/layout.tsx` and has to supply its own document shell.
 */
export default function RootNotFound() {
  return (
    <html lang="en" data-theme="light">
      <body className="bg-paper text-ink">
        <div className="mx-auto max-w-2xl px-6 py-32">
          <p className="eyebrow">404</p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-ink">Page not found</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-2">
            That page has moved or never existed.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            Go to the homepage
          </Link>
        </div>
      </body>
    </html>
  )
}
