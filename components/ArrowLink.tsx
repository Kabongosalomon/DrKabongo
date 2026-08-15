import { Link } from '@/i18n/navigation'

/** Small forward link used under section headings. */
export default function ArrowLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group inline-flex min-w-0 items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent"
    >
      <span className="min-w-0">{children}</span>
      <svg
        className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </Link>
  )
}
