'use client'

import { useState } from 'react'
import {
  CONTEXT_ORDER,
  NAMES,
  NO_CONTEXT,
  distributionFor,
  ranked,
  sample,
  type ContextId,
  type Name,
} from './conditionModel'
import { conditionCopy, labLocale } from './copy'
import { Chip, LabFrame, Step } from './ui'

const ROW = 36 // px; rows are positioned by rank so a re-sort animates
const LIST_HEIGHT = ROW * NAMES.length

const PRESETS: { id: 'none' | 'puppy' | 'startup' | 'conflict'; lines: ContextId[] }[] = [
  { id: 'none', lines: [] },
  { id: 'puppy', lines: ['puppy'] },
  { id: 'startup', lines: ['startup'] },
  { id: 'conflict', lines: ['brand', 'puppy'] },
]

const sameLines = (a: ContextId[], b: ContextId[]) =>
  a.length === b.length && a.every((id) => b.includes(id))

export default function ConditionLab({ locale }: { locale: string }) {
  const t = conditionCopy[labLocale(locale)]
  const [active, setActive] = useState<ContextId[]>(['puppy'])
  const [draws, setDraws] = useState<Name[]>([])

  const distribution = distributionFor(active)
  const order = ranked(distribution)
  // ranked() keeps the catch-all bucket last, so the leader is always a real name.
  const top = order[0]

  function setLines(lines: ContextId[]) {
    setActive(CONTEXT_ORDER.filter((id) => lines.includes(id)))
    setDraws([])
  }

  function toggle(id: ContextId) {
    setLines(active.includes(id) ? active.filter((x) => x !== id) : [...active, id])
  }

  function ask() {
    setDraws(Array.from({ length: 10 }, () => sample(distribution, Math.random())))
  }

  const tally = order
    .map((name) => ({ name, n: draws.filter((d) => d === name).length }))
    .filter(({ n }) => n > 0)

  return (
    <LabFrame eyebrow={t.eyebrow} title={t.title} footnote={t.disclaimer}>
      {/* ── 1. build the condition ── */}
      <div className="space-y-4">
        <Step label={t.buildLabel} hint={t.buildHint} />

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs text-ink-3">{t.presetsLabel}</span>
          {PRESETS.map(({ id, lines }) => (
            <Chip key={id} pressed={sameLines(active, lines)} onClick={() => setLines(lines)}>
              {t.presets[id]}
            </Chip>
          ))}
        </div>

        <ol className="space-y-2">
          {CONTEXT_ORDER.map((id) => {
            const { role, text } = t.contexts[id]
            const on = active.includes(id)
            return (
              <li key={id}>
                <button
                  type="button"
                  aria-pressed={on}
                  aria-label={`${on ? t.removeLine : t.addLine} ${text}`}
                  onClick={() => toggle(id)}
                  className={`block w-full rounded-lg border px-3 py-2.5 text-left transition-colors motion-reduce:transition-none ${
                    on
                      ? 'border-accent bg-accent-soft'
                      : 'border-dashed border-rule bg-surface hover:border-ink-3'
                  }`}
                >
                  <span className="flex items-center justify-between gap-3 text-xs text-ink-3">
                    <span className="eyebrow">{t.roles[role]}</span>
                    <span aria-hidden="true" className="shrink-0">
                      {on ? '✕' : '+'}
                    </span>
                  </span>
                  <span
                    className={`mt-1 block text-base leading-snug ${on ? 'text-ink' : 'text-ink-3'}`}
                  >
                    {text}
                  </span>
                  {!on && <span className="mt-1 block text-xs text-ink-3">{t.notYet}</span>}
                </button>
              </li>
            )
          })}

          {/* The request: always last, always the same, cannot be edited. */}
          <li>
            <div className="rounded-lg border border-ink bg-raised px-3 py-2.5">
              <span className="flex items-center justify-between gap-3 text-xs text-ink-3">
                <span className="eyebrow">{t.roles.now}</span>
                <svg
                  className="h-3.5 w-3.5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  aria-hidden="true"
                >
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
              </span>
              <span className="mt-1 block font-serif text-lg leading-snug text-ink">
                {t.request}
              </span>
              <span className="mt-1 block text-xs text-ink-3">{t.locked}</span>
            </div>
          </li>
        </ol>

        <dl className="grid grid-cols-2 gap-4 border-t border-rule pt-3 text-xs text-ink-3">
          <div>
            <dt>{t.wordsChanged}</dt>
            <dd className="mt-0.5 font-serif text-2xl text-ink tabular-nums">0</dd>
          </div>
          <div>
            <dt>{t.linesAdded}</dt>
            <dd className="mt-0.5 font-serif text-2xl text-accent tabular-nums">{active.length}</dd>
          </div>
        </dl>
      </div>

      {/* ── 2. the probabilities that result ── */}
      <div className="space-y-4">
        <Step label={t.resultLabel} hint={t.resultHint} />

        <ul className="relative" style={{ height: LIST_HEIGHT }} aria-label={t.resultLabel}>
          {/* The leader's row is shaded, like the first row of the original figure. */}
          <li
            aria-hidden="true"
            className="absolute inset-x-0 top-0 rounded-sm bg-raised"
            style={{ height: ROW }}
          />
          {order.map((name, rank) => {
            const p = distribution[name]
            const isOther = name === 'other'
            return (
              <li
                key={name}
                className="absolute inset-x-0 top-0 grid grid-cols-[5.5rem_minmax(0,1fr)_3rem] items-center gap-3 px-2 transition-transform duration-500 ease-out motion-reduce:transition-none sm:grid-cols-[7rem_minmax(0,1fr)_3.25rem]"
                style={{ height: ROW, transform: `translateY(${rank * ROW}px)` }}
              >
                <span
                  className={`truncate leading-none ${
                    isOther ? 'text-sm text-ink-3' : 'font-serif text-base text-ink'
                  }`}
                >
                  {t.names[name]}
                </span>
                <span className="relative block h-3 rounded-sm bg-rule/50">
                  <span
                    className={`absolute inset-y-0 left-0 rounded-sm transition-[width] duration-500 ease-out motion-reduce:transition-none ${
                      isOther ? 'bg-ink-3' : 'bg-accent'
                    }`}
                    style={{ width: `${p}%` }}
                  />
                  {/* Where this name stood with no context at all. */}
                  <span
                    aria-hidden="true"
                    className="absolute -inset-y-1 w-0.5 bg-ink"
                    style={{ left: `calc(${NO_CONTEXT[name]}% - 1px)` }}
                  />
                </span>
                <span className="text-right text-sm text-ink-2 tabular-nums">{t.pct(p)}</span>
              </li>
            )
          })}
        </ul>

        <p className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-3">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2 w-4 rounded-sm bg-accent" />
            {t.legendBar}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="h-3.5 w-0.5 bg-ink" />
            {t.legendTick}
          </span>
        </p>

        <p aria-live="polite" className="font-serif text-lg leading-snug text-ink">
          {active.length === 0
            ? t.flatLine(t.names[top], t.pct(distribution[top]))
            : t.topLine(t.names[top], t.pct(distribution[top]), t.pct(NO_CONTEXT[top]))}
        </p>

        <div className="space-y-3 border-t border-rule pt-4">
          <button
            type="button"
            onClick={ask}
            className="rounded-md border border-ink px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper motion-reduce:transition-none"
          >
            {t.drawButton}
          </button>
          <p className="text-xs leading-relaxed text-ink-3">{t.drawHint}</p>
          {tally.length > 0 && (
            <p aria-live="polite" className="text-sm leading-relaxed text-ink-2">
              <span className="text-ink-3">{t.drawResult} · </span>
              {tally.map(({ name, n }, i) => (
                <span key={name}>
                  {i > 0 && ' · '}
                  <span className="text-ink">{name === 'other' ? t.drawOther : t.names[name]}</span>
                  {' ×'}
                  {n}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </LabFrame>
  )
}
