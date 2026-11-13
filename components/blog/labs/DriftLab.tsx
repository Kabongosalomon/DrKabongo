'use client'

import { useEffect, useState } from 'react'
import { driftCopy, labLocale } from './copy'
import {
  FROZEN,
  MONTHS,
  SHOWN,
  advance,
  buys,
  modelAngle,
  predictsBuy,
  realityAngle,
  retrain,
  start,
  type World,
} from './driftModel'
import { LabFrame, Step } from './ui'

const TICK_MS = 850

// The accuracy chart, in its own SVG units.
const CHART = { width: 360, height: 150, left: 34, right: 350, top: 12, bottom: 126 }
const FLOOR = 40 // percent at the bottom of the chart
const chartX = (month: number) => CHART.left + ((CHART.right - CHART.left) * month) / MONTHS
const chartY = (percent: number) =>
  CHART.bottom - ((CHART.bottom - CHART.top) * (percent - FLOOR)) / (100 - FLOOR)
const path = (values: readonly number[]) =>
  values.map((value, month) => `${chartX(month)},${chartY(value)}`).join(' ')

const buttonClass =
  'rounded-md border border-ink px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:border-rule disabled:text-ink-3 disabled:hover:bg-transparent disabled:hover:text-ink-3 motion-reduce:transition-none'

export default function DriftLab({ locale }: { locale: string }) {
  const t = driftCopy[labLocale(locale)]
  const [world, setWorld] = useState<World>(start)
  const [playing, setPlaying] = useState(false)
  const [auto, setAuto] = useState(false)
  // Set by a manual retrain, cleared when time moves on: drives the status line.
  const [jump, setJump] = useState<{ from: number; to: number } | null>(null)

  const atEnd = world.month >= MONTHS

  useEffect(() => {
    if (!playing || atEnd) return
    const timer = setInterval(() => {
      setJump(null)
      setWorld((current) => advance(current, auto))
    }, TICK_MS)
    return () => clearInterval(timer)
  }, [playing, auto, atEnd])

  function reset() {
    setWorld(start())
    setPlaying(false)
    setJump(null)
  }

  function togglePlay() {
    if (atEnd) {
      setWorld(start())
      setJump(null)
      setPlaying(true)
    } else {
      setPlaying(!playing)
    }
  }

  function retrainNow() {
    const from = world.history[world.history.length - 1]
    const next = retrain(world)
    setWorld(next)
    setJump({ from, to: next.history[next.history.length - 1] })
  }

  const now = world.history[world.history.length - 1]
  const frozenNow = FROZEN[world.month]
  const lost = Math.round(FROZEN[0] - now)

  const status = jump
    ? t.status.retrained(t.pct(jump.from), t.pct(jump.to))
    : atEnd
      ? t.status.end(t.pct(now), t.pct(frozenNow))
      : auto && world.month > 0
        ? t.status.auto
        : lost >= 1
          ? t.status.drifting(lost)
          : t.status.start

  return (
    <LabFrame eyebrow={t.eyebrow} title={t.title} footnote={t.disclaimer}>
      <p className="text-base leading-relaxed text-ink-2">{t.intro}</p>

      <div className="grid gap-8 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:gap-6">
        {/* ── 1. the customers and the two lines ── */}
        <div className="space-y-3">
          <Step label={t.worldLabel} hint={t.worldHint} />

          <svg viewBox="-106 -106 212 212" className="mx-auto block w-full max-w-72" aria-hidden="true">
            <circle r="100" className="fill-raised stroke-rule" strokeWidth="1" />

            {/* The model: the half it calls "buys", and its line. */}
            <g
              className="transition-transform duration-700 ease-out motion-reduce:transition-none"
              style={{
                transform: `rotate(${-modelAngle(world.weights)}deg)`,
                transformOrigin: '0px 0px',
              }}
            >
              <path d="M0,-100 A100,100 0 0 1 0,100 Z" className="fill-accent-soft" />
              <line y1="-100" y2="100" className="stroke-ink" strokeWidth="2" />
            </g>

            {/* Reality: where the line really is this month. */}
            <g
              className="transition-transform duration-700 ease-out motion-reduce:transition-none"
              style={{
                transform: `rotate(${-realityAngle(world.month)}deg)`,
                transformOrigin: '0px 0px',
              }}
            >
              <line
                y1="-104"
                y2="104"
                className="stroke-accent"
                strokeWidth="2"
                strokeDasharray="5 4"
              />
            </g>

            {SHOWN.map((customer, i) => {
              const actual = buys(customer, world.month)
              const wrong = predictsBuy(world.weights, customer) !== actual
              return (
                <circle
                  key={i}
                  cx={customer.x * 96}
                  cy={-customer.y * 96}
                  r={wrong ? 4 : 2.6}
                  strokeWidth={wrong ? 1.6 : 0}
                  className={`stroke-ink transition-[fill,r] duration-500 motion-reduce:transition-none ${
                    actual ? 'fill-accent' : 'fill-ink-3'
                  }`}
                />
              )
            })}
          </svg>

          <ul className="space-y-1 text-xs text-ink-3">
            <li className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-accent" />
                {t.legendBuys}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-ink-3" />
                {t.legendNot}
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-3 w-3 shrink-0 rounded-full border-2 border-ink bg-ink-3"
              />
              {t.legendWrong}
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-0.5 w-4 shrink-0 bg-ink" />
              {t.legendModel}
            </li>
            <li className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="w-4 shrink-0 border-t-2 border-dashed border-accent"
              />
              {t.legendReality}
            </li>
          </ul>
        </div>

        {/* ── 2. the score ── */}
        <div className="space-y-4">
          <Step label={t.scoreLabel} />

          <p className="eyebrow text-ink-2 tabular-nums">{t.month(world.month, MONTHS)}</p>

          <dl className="grid grid-cols-3 gap-3 text-xs text-ink-3">
            <div>
              <dt>{t.accuracyNow}</dt>
              <dd className="mt-0.5 font-serif text-4xl leading-none text-accent tabular-nums">
                {t.pct(now)}
              </dd>
            </div>
            <div>
              <dt>{t.frozenWouldBe}</dt>
              <dd className="mt-0.5 font-serif text-2xl text-ink-2 tabular-nums">
                {t.pct(frozenNow)}
              </dd>
            </div>
            <div>
              <dt>{t.retrainCount}</dt>
              <dd className="mt-0.5 font-serif text-2xl text-ink-2 tabular-nums">
                {world.retrained.length}
              </dd>
            </div>
          </dl>

          <figure>
            <figcaption className="text-xs text-ink-3">{t.chartLabel}</figcaption>
            <svg
              viewBox={`0 0 ${CHART.width} ${CHART.height}`}
              className="mt-1 block w-full"
              aria-hidden="true"
            >
              {[50, 75, 100].map((percent) => (
                <g key={percent}>
                  <line
                    x1={CHART.left}
                    x2={CHART.right}
                    y1={chartY(percent)}
                    y2={chartY(percent)}
                    className="stroke-rule"
                    strokeWidth="1"
                  />
                  <text
                    x={CHART.left - 6}
                    y={chartY(percent) + 4}
                    textAnchor="end"
                    className="fill-ink-3 text-[11px] tabular-nums"
                  >
                    {percent}
                  </text>
                </g>
              ))}
              {[0, 6, 12, 18].map((month) => (
                <text
                  key={month}
                  x={chartX(month)}
                  y={CHART.height - 6}
                  textAnchor="middle"
                  className="fill-ink-3 text-[11px] tabular-nums"
                >
                  {month}
                </text>
              ))}
              <polyline
                points={path(FROZEN.slice(0, world.month + 1))}
                fill="none"
                className="stroke-ink-3"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <polyline
                points={path(world.history)}
                fill="none"
                className="stroke-accent"
                strokeWidth="2.25"
                strokeLinejoin="round"
              />
              {world.retrained.map((month) => (
                <circle
                  key={month}
                  cx={chartX(month)}
                  cy={chartY(world.history[month])}
                  r="3"
                  className="fill-surface stroke-accent"
                  strokeWidth="1.5"
                />
              ))}
              <circle
                cx={chartX(world.month)}
                cy={chartY(now)}
                r="3.5"
                className="fill-accent"
              />
            </svg>
            <p className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-3">
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="h-0.5 w-4 bg-accent" />
                {t.chartYours}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="w-4 border-t-2 border-dashed border-ink-3" />
                {t.chartFrozen}
              </span>
            </p>
          </figure>

          <p aria-live="polite" className="font-serif text-lg leading-snug text-ink">
            {status}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-rule pt-5">
        <button type="button" onClick={togglePlay} className={buttonClass}>
          {atEnd ? t.replay : playing ? t.pause : t.play}
        </button>
        <button
          type="button"
          onClick={retrainNow}
          disabled={world.month === 0}
          className={buttonClass}
        >
          {t.retrain}
        </button>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink-2">
          <input
            type="checkbox"
            checked={auto}
            onChange={(event) => setAuto(event.target.checked)}
            className="h-4 w-4 accent-(--accent)"
          />
          {t.auto}
        </label>
        <button
          type="button"
          onClick={reset}
          className="text-sm text-ink-3 underline underline-offset-4 transition-colors hover:text-ink"
        >
          {t.reset}
        </button>
      </div>
    </LabFrame>
  )
}
