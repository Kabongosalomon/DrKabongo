'use client'

import { useTranslations } from 'next-intl'

export const EDTRACE_PRESENT_EVENT = 'edtrace:present-fullscreen'

/**
 * Top-of-page button that launches the lesson's EdTrace viewer directly into
 * full-screen presentation mode without scrolling past the recorded video.
 *
 * Dispatches synchronously so the browser's transient user-activation token is
 * still live when `LessonViewer` calls `element.requestFullscreen()`.
 */
export default function PresentTrigger() {
  const t = useTranslations('courses')

  const launchPresentation = () => {
    window.dispatchEvent(new CustomEvent(EDTRACE_PRESENT_EVENT))
  }

  return (
    <button
      type="button"
      onClick={launchPresentation}
      className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-ink bg-ink px-3 py-1.5 text-xs font-medium text-paper transition-opacity hover:opacity-90"
    >
      <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
        />
      </svg>
      <span>{t('present_fullscreen')}</span>
    </button>
  )
}
