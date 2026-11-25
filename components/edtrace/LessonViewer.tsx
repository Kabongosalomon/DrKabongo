'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import './vendor/viewer.css'
import './edtrace-host.css'
import { EDTRACE_PRESENT_EVENT } from './PresentTrigger'
import {
  extractTableOfContents,
  findActiveTocEntry,
  getNavigableSteps,
  resolveCurrentStepIndex,
  resolveLineClickStep,
  type TraceData,
} from './tocModel'

/**
 * `ssr: false` is load-bearing, not an optimization. The vendored viewer's
 * `useIsCompactViewport` reads `window.matchMedia` in a `useState` initializer,
 * so a server render resolves it to `false` while a phone's first client render
 * resolves it to `true` — a hydration mismatch on mobile devices.
 */
const TraceViewer = dynamic(() => import('./vendor/index.js').then((m) => m.TraceViewer), {
  ssr: false,
  loading: () => <div className="min-h-[60vh]" aria-busy="true" />,
})

interface ViewState {
  step: number | null
  source: string | null
  line: number | null
  raw: boolean
  animate: boolean
  present: boolean
  hideEnv: boolean
  showNotes: boolean
}

/**
 * Match local EdTrace Studio defaults (`present: false`, starting at
 * `def table_of_contents()`). Upcoming content is veiled with opacity rather
 * than hidden when `animate` is enabled, and the presenter can enter full
 * screen or switch between classic and slide layouts at any time.
 */
const DEFAULTS: ViewState = {
  step: null,
  source: null,
  line: null,
  raw: false,
  animate: false,
  present: false,
  hideEnv: false,
  showNotes: false,
}

function flag(params: URLSearchParams, key: string, fallback: boolean): boolean {
  return params.has(key) ? params.get(key) === '1' : fallback
}

interface ParsedUrlState {
  view: ViewState
  fullscreen: boolean
  lang: string | null
}

function parseSearch(search: string): ParsedUrlState {
  const params = new URLSearchParams(search)
  const rawStep = params.get('step')
  const parsedStep = rawStep !== null && rawStep !== '' ? Number.parseInt(rawStep, 10) : Number.NaN
  const rawLine = params.get('line')
  const parsedLine = rawLine !== null && rawLine !== '' ? Number.parseInt(rawLine, 10) : Number.NaN

  return {
    view: {
      step: Number.isSafeInteger(parsedStep) ? parsedStep : null,
      source: params.get('source'),
      line: Number.isSafeInteger(parsedLine) ? parsedLine : null,
      raw: flag(params, 'raw', DEFAULTS.raw),
      animate: flag(params, 'animate', DEFAULTS.animate),
      present: flag(params, 'present', DEFAULTS.present),
      hideEnv: flag(params, 'hideEnv', DEFAULTS.hideEnv),
      showNotes: flag(params, 'showNotes', DEFAULTS.showNotes),
    },
    fullscreen: flag(params, 'fullscreen', false),
    lang: params.get('lang'),
  }
}

/** Only non-default values reach the URL, so a shared link stays readable. */
function buildSearch(
  state: ViewState,
  fullscreen: boolean,
  activeLanguage: string,
  initialLanguage: string,
): string {
  const params = new URLSearchParams()
  if (activeLanguage && activeLanguage !== initialLanguage) {
    params.set('lang', activeLanguage)
  }
  if (state.source) params.set('source', state.source)
  if (state.line !== null) params.set('line', String(state.line))
  if (state.step !== null) params.set('step', String(state.step))
  for (const key of ['raw', 'animate', 'present', 'hideEnv', 'showNotes'] as const) {
    if (state[key] !== DEFAULTS[key]) params.set(key, state[key] ? '1' : '0')
  }
  if (fullscreen) params.set('fullscreen', '1')
  return params.toString()
}

type FullscreenCapableElement = HTMLDivElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}

type FullscreenCapableDocument = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}

function getNativeFullscreenElement(): Element | null {
  if (typeof document === 'undefined') return null
  const doc = document as FullscreenCapableDocument
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

interface LessonViewerProps {
  courseId: string
  lessonId: string
  language: string
  availableLanguages?: string[]
  /** Optional lower step bound; defaults to 0 so `table_of_contents()` is reachable. */
  minimumStep?: number
}

export default function LessonViewer({
  courseId,
  lessonId,
  language,
  availableLanguages = [],
  minimumStep = 0,
}: LessonViewerProps) {
  const t = useTranslations('courses')
  const tTheme = useTranslations('theme')

  // Initialize to SSR-safe defaults so server HTML and first client render always match,
  // then hydrate query-string parameters (`?step=...&animate=1&fullscreen=1&lang=...`) on mount.
  const [state, setState] = useState<ViewState>(DEFAULTS)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [activeLanguage, setActiveLanguage] = useState<string>(language)
  const [hasHydratedUrl, setHasHydratedUrl] = useState(false)

  useEffect(() => {
    const parsed = parseSearch(window.location.search)
    setState(parsed.view)
    setIsFullscreen(parsed.fullscreen)
    if (parsed.lang && availableLanguages.includes(parsed.lang)) {
      setActiveLanguage(parsed.lang)
    }
    setHasHydratedUrl(true)
    // Run once on initial client mount to avoid SSR hydration mismatches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [trace, setTrace] = useState<TraceData | null>(null)
  const [tocOpen, setTocOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const hostRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const tocAnchorRef = useRef<HTMLDivElement>(null)
  const shortcutsAnchorRef = useRef<HTMLDivElement>(null)
  const hasUserSteppedRef = useRef(false)

  // Keep activeLanguage synced if the visitor navigates via next-intl's locale links.
  useEffect(() => {
    setActiveLanguage(language)
  }, [language])

  const activeTraceUrl = `/edtrace/traces/${courseId}/${activeLanguage}/${lessonId}.json`

  // Sync current theme state for the in-toolbar theme toggle.
  useEffect(() => {
    const syncTheme = () => {
      const attr = document.documentElement.getAttribute('data-theme')
      setTheme(attr === 'dark' ? 'dark' : 'light')
    }
    syncTheme()
    const observer = new MutationObserver(syncTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Ignore storage failures in private browsing.
    }
    setTheme(next)
  }, [theme])

  // Measure sticky toolbar height so `.edtrace-viewer .header` parks directly below it.
  useEffect(() => {
    const toolbar = toolbarRef.current
    const host = hostRef.current
    if (!toolbar || !host || typeof ResizeObserver === 'undefined') return

    const updateHeight = () => {
      host.style.setProperty('--et-toolbar-height', `${toolbar.offsetHeight}px`)
    }
    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(toolbar)
    return () => observer.disconnect()
  }, [])

  // Fetch trace JSON (shares browser HTTP cache with TraceViewer) to power TOC & line clicks.
  useEffect(() => {
    let cancelled = false
    setTrace(null)
    fetch(activeTraceUrl)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: TraceData | null) => {
        if (!cancelled && data) setTrace(data)
      })
      .catch(() => {
        // TraceViewer renders its own error UI if fetching fails.
      })
    return () => {
      cancelled = true
    }
  }, [activeTraceUrl])

  useEffect(() => {
    const onPopState = () => {
      const parsed = parseSearch(window.location.search)
      setState(parsed.view)
      setIsFullscreen(parsed.fullscreen)
      if (parsed.lang && availableLanguages.includes(parsed.lang)) {
        setActiveLanguage(parsed.lang)
      } else {
        setActiveLanguage(language)
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [availableLanguages, language])

  const updateState = useCallback((patch: Partial<ViewState>) => {
    hasUserSteppedRef.current = true
    setState((previous) => {
      const next = { ...previous }
      for (const [key, value] of Object.entries(patch)) {
        const field = key as keyof ViewState
        ;(next as Record<string, unknown>)[field] = value === null ? DEFAULTS[field] : value
      }
      return next
    })
  }, [])

  const jumpToStep = useCallback(
    (stepIndex: number) => {
      updateState({ step: stepIndex, source: null, line: null })
      setTocOpen(false)
    },
    [updateState],
  )

  // Mirror view state into the URL without server round-trips (only after initial URL hydration).
  useEffect(() => {
    if (!hasHydratedUrl) return
    const search = buildSearch(state, isFullscreen, activeLanguage, language)
    window.history.replaceState(
      null,
      '',
      search ? `${window.location.pathname}?${search}` : window.location.pathname,
    )
  }, [hasHydratedUrl, state, isFullscreen, activeLanguage, language])

  // Native Fullscreen API synchronization + body scroll lock for viewport fallback.
  const enterFullscreen = useCallback((withAnimate = false) => {
    setIsFullscreen(true)
    if (withAnimate) {
      setState((prev) => ({ ...prev, animate: true }))
    }
    const elem = hostRef.current as FullscreenCapableElement | null
    if (!elem || getNativeFullscreenElement() === elem) return
    try {
      if (typeof elem.requestFullscreen === 'function') {
        void elem.requestFullscreen().catch(() => {
          // Falls back cleanly to `.edtrace-host.is-fullscreen` fixed viewport mode.
        })
      } else if (typeof elem.webkitRequestFullscreen === 'function') {
        void elem.webkitRequestFullscreen()
      }
    } catch {
      // Viewport CSS fallback remains active.
    }
  }, [])

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false)
    const doc = document as FullscreenCapableDocument
    if (!getNativeFullscreenElement()) return
    try {
      if (typeof doc.exitFullscreen === 'function') {
        void doc.exitFullscreen().catch(() => {})
      } else if (typeof doc.webkitExitFullscreen === 'function') {
        void doc.webkitExitFullscreen()
      }
    } catch {
      // Ignore if already exited.
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      enterFullscreen(false)
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen])

  useEffect(() => {
    const onFullscreenChange = () => {
      const nativeElem = getNativeFullscreenElement()
      if (!nativeElem) {
        setIsFullscreen(false)
      } else if (nativeElem === hostRef.current) {
        setIsFullscreen(true)
      }
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
    }
  }, [])

  // Lock background page scroll while in fullscreen overlay mode.
  useEffect(() => {
    if (!isFullscreen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isFullscreen])

  // Listen for top-of-page "Present Full Screen" trigger button.
  useEffect(() => {
    const onPresentEvent = () => {
      enterFullscreen(true)
    }
    window.addEventListener(EDTRACE_PRESENT_EVENT, onPresentEvent)
    return () => window.removeEventListener(EDTRACE_PRESENT_EVENT, onPresentEvent)
  }, [enterFullscreen])

  // Close popovers when clicking outside.
  useEffect(() => {
    if (!tocOpen && !shortcutsOpen) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (tocOpen && !tocAnchorRef.current?.contains(target)) {
        setTocOpen(false)
      }
      if (shortcutsOpen && !shortcutsAnchorRef.current?.contains(target)) {
        setShortcutsOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [tocOpen, shortcutsOpen])

  const navigableSteps = useMemo(
    () => getNavigableSteps(trace, minimumStep),
    [trace, minimumStep],
  )
  const currentStepIndex = useMemo(
    () => resolveCurrentStepIndex(trace, state, minimumStep),
    [trace, state, minimumStep],
  )
  const currentVisiblePos = useMemo(
    () => (currentStepIndex !== null ? navigableSteps.indexOf(currentStepIndex) : -1),
    [navigableSteps, currentStepIndex],
  )
  const toc = useMemo(
    () => extractTableOfContents(trace, state.raw, minimumStep),
    [trace, state.raw, minimumStep],
  )
  const activeTocEntry = useMemo(
    () => findActiveTocEntry(toc, currentStepIndex),
    [toc, currentStepIndex],
  )

  const currentPath = useMemo(() => {
    if (!trace?.steps?.length) return ''
    const step = currentStepIndex !== null ? trace.steps[currentStepIndex] : trace.steps[0]
    const stack = step?.stack
    return stack?.[stack.length - 1]?.path ?? Object.keys(trace.files ?? {})[0] ?? ''
  }, [trace, currentStepIndex])

  // Decorate `def table_of_contents()` lines and hide orphan line numbers on blank/rendering lines
  // without modifying vendor code.
  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const tocCallLines = new Map(
      toc.entries
        .filter((entry) => entry.tocLineNumber !== null)
        .map((entry) => [entry.tocLineNumber!, entry]),
    )

    const applyLineMarkers = () => {
      const lineNodes = host.querySelectorAll<HTMLElement>('.edtrace-viewer .line')
      lineNodes.forEach((lineNode) => {
        const numSpan = lineNode.querySelector('.line-number')
        const lineNum = numSpan ? Number.parseInt(numSpan.textContent ?? '', 10) : Number.NaN
        lineNode.classList.remove(
          'et-toc-header-line',
          'et-toc-call-line',
          'et-toc-active-section',
          'et-empty-line',
          'et-rendering-line',
        )

        const contentSpan = numSpan?.nextElementSibling
        const hasRenderings = Boolean(lineNode.querySelector('.renderings'))
        if (hasRenderings) {
          lineNode.classList.add('et-rendering-line')
        } else if ((contentSpan?.textContent?.trim() ?? '') === '') {
          lineNode.classList.add('et-empty-line')
        }

        if (!toc.header || !Number.isSafeInteger(lineNum) || currentPath !== toc.header.path) return

        if (lineNum === toc.header.lineNumber) {
          lineNode.classList.add('et-toc-header-line')
          return
        }
        const entry = tocCallLines.get(lineNum)
        if (entry) {
          lineNode.classList.add('et-toc-call-line')
          if (activeTocEntry?.index === entry.index) {
            lineNode.classList.add('et-toc-active-section')
          }
        }
      })
    }

    applyLineMarkers()
    const observer = new MutationObserver(applyLineMarkers)
    observer.observe(host, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [toc, activeTocEntry, currentPath, state.raw, state.animate, state.present])

  // Keep the highlighted line clear of the sticky presentation bars when stepping.
  useEffect(() => {
    if (!hasUserSteppedRef.current && state.step === null && state.line === null) return
    const host = hostRef.current
    if (!host) return

    const currentLineEl = host.querySelector<HTMLElement>('.edtrace-viewer .current-line')
    const viewerHeaderEl = host.querySelector<HTMLElement>('.edtrace-viewer .header')
    if (!currentLineEl) return

    const topCeiling = (viewerHeaderEl?.getBoundingClientRect().bottom ?? 96) + 16
    const bottomFloor = window.innerHeight - 56
    const rect = currentLineEl.getBoundingClientRect()

    if (rect.top < topCeiling || rect.bottom > bottomFloor) {
      const dist = Math.min(Math.abs(rect.top - topCeiling), Math.abs(rect.bottom - bottomFloor))
      currentLineEl.scrollIntoView({
        behavior: dist <= 180 ? 'smooth' : 'instant',
        block: 'center',
      })
    }
  }, [currentStepIndex, state.step, state.line])

  // Presentation keyboard & wireless presenter-remote shortcuts (non-overlapping with TraceViewer).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return

      const target = event.target as HTMLElement | null
      const tagName = target?.tagName ?? ''
      const isInteractiveControl =
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT' ||
        target?.isContentEditable

      if (event.key === 'Escape') {
        if (tocOpen) {
          setTocOpen(false)
          event.preventDefault()
          return
        }
        if (shortcutsOpen) {
          setShortcutsOpen(false)
          event.preventDefault()
          return
        }
        if (isFullscreen && !getNativeFullscreenElement()) {
          exitFullscreen()
          event.preventDefault()
        }
        return
      }

      if (isInteractiveControl) return

      if (event.key === 'f' || event.key === 'F') {
        toggleFullscreen()
        event.preventDefault()
        return
      }
      if (event.key === 't' || event.key === 'T') {
        setTocOpen((open) => !open)
        setShortcutsOpen(false)
        event.preventDefault()
        return
      }
      if (event.key === 'p' || event.key === 'P') {
        updateState({ present: !state.present })
        event.preventDefault()
        return
      }
      if (event.key === '?') {
        setShortcutsOpen((open) => !open)
        setTocOpen(false)
        event.preventDefault()
        return
      }

      if (navigableSteps.length === 0) return

      // Presenter clicker & keyboard navigation: Space / PageDown / PageUp / Home / End.
      if (
        event.key === 'PageDown' ||
        (event.key === ' ' && !event.shiftKey && tagName !== 'BUTTON' && tagName !== 'A' && tagName !== 'VIDEO')
      ) {
        const nextPos = Math.min(currentVisiblePos + 1, navigableSteps.length - 1)
        if (nextPos >= 0 && navigableSteps[nextPos] !== currentStepIndex) {
          jumpToStep(navigableSteps[nextPos])
        }
        event.preventDefault()
      } else if (
        event.key === 'PageUp' ||
        (event.key === ' ' && event.shiftKey && tagName !== 'BUTTON' && tagName !== 'A' && tagName !== 'VIDEO')
      ) {
        const prevPos = Math.max(currentVisiblePos - 1, 0)
        if (navigableSteps[prevPos] !== currentStepIndex) {
          jumpToStep(navigableSteps[prevPos])
        }
        event.preventDefault()
      } else if (event.key === 'Home') {
        jumpToStep(navigableSteps[0])
        event.preventDefault()
      } else if (event.key === 'End') {
        jumpToStep(navigableSteps[navigableSteps.length - 1])
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    tocOpen,
    shortcutsOpen,
    isFullscreen,
    exitFullscreen,
    toggleFullscreen,
    updateState,
    state.present,
    navigableSteps,
    currentVisiblePos,
    currentStepIndex,
    jumpToStep,
  ])

  // Intercept line-number clicks and `table_of_contents()` code clicks in capture phase.
  const handleViewerClickCapture = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!trace) return
      const target = event.target as HTMLElement | null
      if (!target) return

      // Never hijack toolbar controls, links, videos, selects, or draggable env panels.
      if (
        target.closest(
          '.edtrace-toolbar, .header, .env-panel, .mobile-control-bar, a, button, select, video, iframe',
        )
      ) {
        return
      }

      // Respect text selection drags.
      if (typeof window !== 'undefined' && (window.getSelection()?.toString().length ?? 0) > 0) {
        return
      }

      const lineNumberEl = target.closest('.line-number')
      if (lineNumberEl) {
        const lineNumber = Number.parseInt(lineNumberEl.textContent ?? '', 10)
        if (Number.isSafeInteger(lineNumber) && currentPath) {
          const resolved = resolveLineClickStep(
            trace,
            currentPath,
            lineNumber,
            currentStepIndex,
            minimumStep,
          )
          if (resolved !== null) {
            event.stopPropagation()
            event.preventDefault()
            jumpToStep(resolved)
          }
        }
        return
      }

      const lineEl = target.closest('.line')
      if (!lineEl || !toc.header || currentPath !== toc.header.path) return

      const numSpan = lineEl.querySelector('.line-number')
      const lineNumber = numSpan ? Number.parseInt(numSpan.textContent ?? '', 10) : Number.NaN
      if (!Number.isSafeInteger(lineNumber)) return

      if (lineNumber === toc.header.lineNumber) {
        event.stopPropagation()
        jumpToStep(toc.header.stepIndex)
        return
      }

      const tocEntry = toc.entries.find((entry) => entry.tocLineNumber === lineNumber)
      if (tocEntry) {
        event.stopPropagation()
        jumpToStep(tocEntry.sectionStepIndex)
      }
    },
    [trace, currentPath, currentStepIndex, minimumStep, toc, jumpToStep],
  )

  const resolveAsset = useCallback(
    (assetPath: string) =>
      /^(https?:)?\/\//.test(assetPath)
        ? assetPath
        : `/edtrace/${assetPath.replace(/^\/+/, '')}`,
    [],
  )

  const handleLanguageChange = useCallback((nextLanguage: string) => {
    setActiveLanguage(nextLanguage)
  }, [])

  const stepPrev = () => {
    if (currentVisiblePos > 0) jumpToStep(navigableSteps[currentVisiblePos - 1])
  }
  const stepNext = () => {
    if (currentVisiblePos >= 0 && currentVisiblePos < navigableSteps.length - 1) {
      jumpToStep(navigableSteps[currentVisiblePos + 1])
    }
  }

  return (
    <div
      ref={hostRef}
      className={`edtrace-host${isFullscreen ? ' is-fullscreen' : ''}`}
      onClickCapture={handleViewerClickCapture}
    >
      <div ref={toolbarRef} className="edtrace-toolbar" role="toolbar" aria-label={t('presentation_controls')}>
        <div className="edtrace-toolbar-group">
          {toc.entries.length > 0 && (
            <div ref={tocAnchorRef} className="edtrace-popover-anchor">
              <button
                type="button"
                className="edtrace-btn"
                aria-expanded={tocOpen}
                aria-haspopup="dialog"
                onClick={() => {
                  setTocOpen((open) => !open)
                  setShortcutsOpen(false)
                }}
                title={`${t('table_of_contents')} [T]`}
              >
                <svg
                  className="h-3.5 w-3.5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h10" />
                </svg>
                <span className="max-w-[200px] truncate sm:max-w-[280px]">
                  {activeTocEntry
                    ? `${activeTocEntry.index}/${toc.entries.length} · ${activeTocEntry.displayName}()`
                    : t('table_of_contents')}
                </span>
                <span className="edtrace-kbd edtrace-hide-mobile">T</span>
              </button>

              {tocOpen && (
                <div className="edtrace-toc-popover" role="dialog" aria-label={t('table_of_contents')}>
                  {toc.header && (
                    <button
                      type="button"
                      className={`edtrace-toc-item mb-1 border-b border-rule pb-2 ${
                        !activeTocEntry ? 'is-active' : ''
                      }`}
                      onClick={() => jumpToStep(toc.header!.stepIndex)}
                    >
                      <span className="edtrace-toc-item-code">
                        def {toc.header.displayName}()
                      </span>
                      <span className="edtrace-toc-item-heading">{t('toc_overview')}</span>
                    </button>
                  )}

                  {toc.entries.map((entry) => {
                    const isActive = activeTocEntry?.index === entry.index
                    return (
                      <div key={`${entry.index}-${entry.functionName}`}>
                        <button
                          type="button"
                          className={`edtrace-toc-item ${isActive ? 'is-active' : ''}`}
                          onClick={() => jumpToStep(entry.sectionStepIndex)}
                        >
                          <span className="edtrace-toc-item-code">
                            {entry.index}. {entry.codeLabel}
                          </span>
                          {entry.heading && (
                            <span className="edtrace-toc-item-heading">{entry.heading}</span>
                          )}
                        </button>

                        {entry.subSections.length > 0 && (
                          <div className="edtrace-toc-sublist">
                            {entry.subSections.map((sub) => {
                              const subActive =
                                currentStepIndex !== null && currentStepIndex === sub.stepIndex
                              return (
                                <button
                                  key={`${sub.stepIndex}-${sub.lineNumber}`}
                                  type="button"
                                  className={`edtrace-toc-subitem ${subActive ? 'is-active' : ''}`}
                                  onClick={() => jumpToStep(sub.stepIndex)}
                                >
                                  {sub.title}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {navigableSteps.length > 0 && (
            <>
              <button
                type="button"
                className="edtrace-btn edtrace-hide-mobile"
                onClick={() => jumpToStep(navigableSteps[0])}
                disabled={currentVisiblePos <= 0}
                title={`${t('restart_lesson')} [Home]`}
                aria-label={t('restart_lesson')}
              >
                ⏮
              </button>
              <button
                type="button"
                className="edtrace-btn edtrace-hide-mobile"
                onClick={stepPrev}
                disabled={currentVisiblePos <= 0}
                title="← / PageUp"
                aria-label="Previous step"
              >
                ‹
              </button>
              <span className="edtrace-step-pill">
                {currentVisiblePos >= 0 ? currentVisiblePos + 1 : 1} / {navigableSteps.length}
              </span>
              <button
                type="button"
                className="edtrace-btn edtrace-hide-mobile"
                onClick={stepNext}
                disabled={currentVisiblePos >= navigableSteps.length - 1}
                title="→ / Space / PageDown"
                aria-label="Next step"
              >
                ›
              </button>
            </>
          )}
        </div>

        <div className="edtrace-toolbar-group">
          <button
            type="button"
            className="edtrace-btn"
            aria-pressed={state.animate}
            onClick={() => updateState({ animate: !state.animate })}
            title={`${t('veil_upcoming')} [A]`}
          >
            <span aria-hidden="true">{state.animate ? '⛅️' : '☀️'}</span>
            <span className="edtrace-hide-mobile">{t('veil_upcoming')}</span>
          </button>

          <button
            type="button"
            className="edtrace-btn edtrace-hide-mobile"
            aria-pressed={state.present}
            onClick={() => updateState({ present: !state.present })}
            title={`${t('slide_layout')} [P]`}
          >
            <span>{t('slide_layout')}</span>
          </button>

          <button
            type="button"
            className="edtrace-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? tTheme('to_light') : tTheme('to_dark')}
            aria-label={theme === 'dark' ? tTheme('to_light') : tTheme('to_dark')}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div ref={shortcutsAnchorRef} className="edtrace-popover-anchor edtrace-hide-mobile">
            <button
              type="button"
              className="edtrace-btn"
              aria-expanded={shortcutsOpen}
              onClick={() => {
                setShortcutsOpen((open) => !open)
                setTocOpen(false)
              }}
              title={t('shortcuts')}
              aria-label={t('shortcuts')}
            >
              ?
            </button>
            {shortcutsOpen && (
              <div className="edtrace-shortcuts-popover" role="dialog" aria-label={t('shortcuts')}>
                <p className="mb-2 text-xs font-semibold tracking-wide text-ink uppercase">
                  {t('shortcuts')}
                </p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs text-ink-2">
                  <dt className="font-mono text-ink">→ / Space / l</dt>
                  <dd>{t('shortcut_next')}</dd>
                  <dt className="font-mono text-ink">← / h</dt>
                  <dd>{t('shortcut_prev')}</dd>
                  <dt className="font-mono text-ink">Shift+→ / j</dt>
                  <dd>{t('shortcut_step_over')}</dd>
                  <dt className="font-mono text-ink">u</dt>
                  <dd>{t('shortcut_step_out')}</dd>
                  <dt className="font-mono text-ink">[ / ]</dt>
                  <dd>{t('shortcut_updates')}</dd>
                  <dt className="font-mono text-ink">T</dt>
                  <dd>{t('table_of_contents')}</dd>
                  <dt className="font-mono text-ink">A</dt>
                  <dd>{t('veil_upcoming')}</dd>
                  <dt className="font-mono text-ink">P</dt>
                  <dd>{t('slide_layout')}</dd>
                  <dt className="font-mono text-ink">R / E / N</dt>
                  <dd>{t('shortcut_toggles')}</dd>
                  <dt className="font-mono text-ink">F / Esc</dt>
                  <dd>{t('present_fullscreen')}</dd>
                </dl>
              </div>
            )}
          </div>

          {!isFullscreen ? (
            <>
              <button
                type="button"
                className="edtrace-btn"
                onClick={() => enterFullscreen(false)}
                title={`${t('fullscreen')} [F]`}
                aria-label={t('fullscreen')}
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
                <span className="edtrace-kbd edtrace-hide-mobile">F</span>
              </button>
              <button
                type="button"
                className="edtrace-btn edtrace-btn-primary"
                onClick={() => enterFullscreen(true)}
                title={t('present_fullscreen')}
              >
                <span aria-hidden="true">▶</span>
                <span>{t('present_button')}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="edtrace-btn edtrace-btn-primary"
              onClick={exitFullscreen}
              title={`${t('exit_fullscreen')} [Esc]`}
            >
              <span>{t('exit_fullscreen')}</span>
              <span className="edtrace-kbd">Esc</span>
            </button>
          )}
        </div>
      </div>

      <TraceViewer
        traceUrl={activeTraceUrl}
        viewState={state}
        onViewStateChange={updateState}
        resolveAsset={resolveAsset}
        minimumStep={minimumStep}
        showIdentity={true}
        showLanguageSelector={true}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  )
}
