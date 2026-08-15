import Image from 'next/image'

/**
 * A tappable link is the primary action — a QR is useless to someone already
 * reading this on their phone. The QR is there for desktop visitors to scan.
 */
export default function CommunityCard({
  name,
  description,
  href,
  cta,
  qr,
  qrAlt,
  icon,
}: {
  name: string
  description: string
  href: string
  cta: string
  qr: string
  /** Must name the destination, not say "QR code". */
  qrAlt: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex gap-5 border-t border-rule pt-5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-ink">
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
          <h3 className="font-serif text-lg font-medium">{name}</h3>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-ink-2">{description}</p>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-3 inline-flex min-w-0 items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent"
        >
          <span className="min-w-0">{cta}</span>
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
        </a>
      </div>

      {/* Scanning a code on the device you are holding is impossible, so the
          QR is desktop-only and the link above carries mobile. */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden shrink-0 sm:block"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={qr}
          alt={qrAlt}
          width={112}
          height={112}
          className="rounded-md border border-rule bg-white p-1.5"
        />
      </a>
    </div>
  )
}
