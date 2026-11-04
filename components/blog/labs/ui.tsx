import type { ReactNode } from 'react'

/**
 * The box both labs live in. `not-prose` keeps the article's typography rules
 * (list bullets, link underlines, image borders) off the controls inside it.
 */
export function LabFrame({
  eyebrow,
  title,
  footnote,
  children,
}: {
  eyebrow: string
  title: string
  footnote: string
  children: ReactNode
}) {
  return (
    <section
      aria-label={title}
      className="not-prose my-10 overflow-hidden rounded-lg border border-rule bg-surface"
    >
      <header className="border-b border-rule px-4 py-4 sm:px-6">
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="mt-1 font-serif text-xl leading-snug font-medium text-balance text-ink sm:text-2xl">
          {title}
        </h3>
      </header>
      <div className="space-y-8 px-4 py-6 sm:px-6">{children}</div>
      <p className="border-t border-rule bg-raised px-4 py-3 text-xs leading-relaxed text-ink-3 sm:px-6">
        {footnote}
      </p>
    </section>
  )
}

/** A step heading inside a lab: small caps label, optional one-line hint. */
export function Step({ label, hint }: { label: string; hint?: string }) {
  return (
    <div>
      <p className="eyebrow text-ink-2">{label}</p>
      {hint && <p className="mt-1 text-sm leading-relaxed text-ink-3">{hint}</p>}
    </div>
  )
}

/** A pill toggle. `pressed` is the selected state, announced to screen readers. */
export function Chip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`min-w-0 rounded-full border px-3 py-1.5 text-left text-sm leading-snug transition-colors motion-reduce:transition-none ${
        pressed
          ? 'border-accent bg-accent-soft text-ink'
          : 'border-rule bg-surface text-ink-2 hover:border-ink-3 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
