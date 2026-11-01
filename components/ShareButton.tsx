'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

/**
 * Opens the phone's native share sheet (WhatsApp, etc.) where there is one,
 * and copies the link everywhere else.
 */
export default function ShareButton({ title }: { title: string }) {
  const t = useTranslations('share')
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // Dismissed the share sheet — nothing to do.
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked; the address bar is still right there.
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-1.5 text-sm text-ink-2 transition-colors hover:text-accent"
    >
      <svg
        className="h-3.5 w-3.5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4m4-4v13"
        />
      </svg>
      <span aria-live="polite">{copied ? t('copied') : t('share')}</span>
    </button>
  )
}
