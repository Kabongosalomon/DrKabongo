'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import './vendor/viewer.css'

/**
 * `ssr: false` is load-bearing, not an optimization. The vendored viewer's
 * `useIsCompactViewport` reads `window.matchMedia` in a `useState` initializer,
 * so a server render resolves it to `false` while a phone's first client render
 * resolves it to `true` — a hydration mismatch on exactly the devices this page
 * exists to serve. The viewer fetches its trace client-side regardless, so
 * nothing indexable is lost; the lesson's title and description are rendered
 * server-side by the page above this component.
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
 * Present mode is the default on the website: single-column, large type, and
 * the reading layout the lessons were designed around.
 *
 * `animate` is deliberately OFF here, unlike the local presenting shell. It is
 * the only thing that cloaks content: the viewer marks every line whose reveal
 * step is ahead of the current step as `.cloaked`, and present mode gives that
 * class `display: none`. Live, that turns a 1200-step lesson into a nearly
 * empty page you have to arrow through. A reader arriving from search wants
 * the whole lesson on the page, scrollable, so this defaults to the full
 * document; stepping still works and still moves the highlight and the
 * environment panel for anyone who wants to walk the execution.
 */
const DEFAULTS: ViewState = {
  step: null,
  source: null,
  line: null,
  raw: false,
  animate: false,
  present: true,
  hideEnv: false,
  showNotes: false,
}

function flag(params: URLSearchParams, key: keyof ViewState, fallback: boolean): boolean {
  return params.has(key) ? params.get(key) === '1' : fallback
}

function parseSearch(search: string): ViewState {
  const params = new URLSearchParams(search)
  return {
    step: parseInt(params.get('step') ?? '', 10) || null,
    source: params.get('source'),
    line: parseInt(params.get('line') ?? '', 10) || null,
    raw: flag(params, 'raw', DEFAULTS.raw),
    animate: flag(params, 'animate', DEFAULTS.animate),
    present: flag(params, 'present', DEFAULTS.present),
    hideEnv: flag(params, 'hideEnv', DEFAULTS.hideEnv),
    showNotes: flag(params, 'showNotes', DEFAULTS.showNotes),
  }
}

/** Only non-default values reach the URL, so a shared link stays readable. */
function buildSearch(state: ViewState): string {
  const params = new URLSearchParams()
  if (state.source) params.set('source', state.source)
  if (state.line !== null) params.set('line', String(state.line))
  if (state.step !== null) params.set('step', String(state.step))
  for (const key of ['raw', 'animate', 'present', 'hideEnv', 'showNotes'] as const) {
    if (state[key] !== DEFAULTS[key]) params.set(key, state[key] ? '1' : '0')
  }
  return params.toString()
}

interface LessonViewerProps {
  traceUrl: string
  /** Steps below this are hidden setup work; comes from the catalog. */
  minimumStep?: number
}

export default function LessonViewer({ traceUrl, minimumStep = 0 }: LessonViewerProps) {
  const [state, setState] = useState<ViewState>(() =>
    typeof window === 'undefined' ? DEFAULTS : parseSearch(window.location.search),
  )

  useEffect(() => {
    const onPopState = () => setState(parseSearch(window.location.search))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const updateState = useCallback((patch: Partial<ViewState>) => {
    setState((previous) => {
      const next = { ...previous }
      for (const [key, value] of Object.entries(patch)) {
        const field = key as keyof ViewState
        // The viewer clears a field by sending null; restore this host's default.
        ;(next as Record<string, unknown>)[field] = value === null ? DEFAULTS[field] : value
      }
      return next
    })
  }, [])

  /**
   * Mirror view state into the URL, after commit rather than during render.
   *
   * A `setState` updater has to stay pure: it runs in the render phase, and
   * touching `window.history` there makes Next's Router observe a history
   * change while this component is still rendering ("Cannot update a component
   * (`Router`) while rendering a different component"). Doing it in an effect
   * keeps the updater pure and the router update in the commit phase.
   *
   * `replaceState` rather than the Next router or `pushState`: stepping fires on
   * every arrow-key press, so a router navigation per step would mean a server
   * round-trip each time, and pushing would bury the back button under hundreds
   * of single steps. The first run is skipped so the URL a visitor arrived on is
   * left exactly as they found it.
   */
  const hasSyncedUrl = useRef(false)
  useEffect(() => {
    if (!hasSyncedUrl.current) {
      hasSyncedUrl.current = true
      return
    }
    const search = buildSearch(state)
    window.history.replaceState(
      null,
      '',
      search ? `${window.location.pathname}?${search}` : window.location.pathname,
    )
  }, [state])

  /**
   * Traces reference their media relatively (`images/<course>/<lang>/x.webp`)
   * because the studio has no idea where a host will mount them.
   */
  const resolveAsset = useCallback(
    (assetPath: string) =>
      /^(https?:)?\/\//.test(assetPath)
        ? assetPath
        : `/edtrace/${assetPath.replace(/^\/+/, '')}`,
    [],
  )

  return (
    <TraceViewer
      traceUrl={traceUrl}
      viewState={state}
      onViewStateChange={updateState}
      resolveAsset={resolveAsset}
      minimumStep={minimumStep}
      // The site's own heading and LanguageSwitcher already carry both of these.
      showIdentity={false}
      showLanguageSelector={false}
      /*
       * Never fires: the viewer only calls this from the language selector we
       * just disabled. Changing language here is a route change (the locale
       * decides which trace the page loads), so it belongs to the site's
       * LanguageSwitcher and the lesson's own language chips, not to the
       * viewer's internal state.
       */
      onLanguageChange={() => {}}
    />
  )
}
