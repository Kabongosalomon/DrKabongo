'use client'

import { useState } from 'react'
import { labLocale, memoryCopy } from './copy'
import {
  ALL_CONTEXT,
  ALL_WEIGHTS,
  BY_KIND,
  ITEMS,
  samePlacement,
  tokensPerCall,
  wellPlaced,
  type Fit,
  type Home,
  type Placement,
} from './memoryModel'
import { Chip, LabFrame, Step } from './ui'

const PRESETS = [
  { id: 'allContext', placement: ALL_CONTEXT },
  { id: 'allWeights', placement: ALL_WEIGHTS },
  { id: 'byKind', placement: BY_KIND },
] as const

const HOMES: readonly Home[] = ['context', 'weights']
const MOST_TOKENS = tokensPerCall(ALL_CONTEXT)

const FIT_MARK: Record<Fit, string> = { good: '✓', strained: '△', wrong: '✕' }
const FIT_CLASS: Record<Fit, string> = {
  good: 'border-accent bg-accent-soft text-ink',
  strained: 'border-dashed border-ink-3 bg-surface text-ink-2',
  wrong: 'border-ink bg-raised text-ink',
}

export default function MemoryLab({ locale }: { locale: string }) {
  const t = memoryCopy[labLocale(locale)]
  const [placement, setPlacement] = useState<Placement>(ALL_CONTEXT)

  const tokens = tokensPerCall(placement)
  const placed = wellPlaced(placement)
  const preset = PRESETS.find((candidate) => samePlacement(placement, candidate.placement))

  return (
    <LabFrame eyebrow={t.eyebrow} title={t.title} footnote={t.disclaimer}>
      <p className="text-base leading-relaxed text-ink-2">{t.intro}</p>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs text-ink-3">{t.presetsLabel}</span>
        {PRESETS.map((candidate) => (
          <Chip
            key={candidate.id}
            pressed={preset?.id === candidate.id}
            onClick={() => setPlacement(candidate.placement)}
          >
            {t.presets[candidate.id]}
          </Chip>
        ))}
      </div>

      {/* ── the two memories, and what is in each ── */}
      <div className="grid grid-cols-2 gap-3">
        {HOMES.map((home) => {
          const inside = ITEMS.filter((item) => placement[item.id] === home)
          return (
            <div key={home} className="rounded-lg border border-rule bg-raised p-3">
              <p className="eyebrow text-ink-2">{t.homes[home].name}</p>
              <p className="mt-0.5 text-xs leading-snug text-ink-3">{t.homes[home].note}</p>
              <ul className="mt-3 flex min-h-24 flex-wrap content-start gap-1.5">
                {inside.length === 0 && <li className="text-xs text-ink-3">{t.empty}</li>}
                {inside.map((item) => (
                  <li
                    key={item.id}
                    className={`rounded border px-2 py-1 text-xs leading-tight ${FIT_CLASS[item.fit[home]]}`}
                  >
                    <span aria-hidden="true">{FIT_MARK[item.fit[home]]} </span>
                    {t.items[item.id].short}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* ── what this arrangement costs ── */}
      <div aria-live="polite" className="space-y-4">
        <dl className="grid grid-cols-2 gap-4 text-xs text-ink-3">
          <div>
            <dt>{t.tokensLabel}</dt>
            <dd className="mt-0.5 font-serif text-3xl leading-none text-accent tabular-nums">
              {t.number(tokens)}{' '}
              <span className="font-sans text-xs text-ink-3">{t.tokensUnit}</span>
            </dd>
          </div>
          <div>
            <dt>{t.placedLabel}</dt>
            <dd className="mt-0.5 font-serif text-3xl leading-none text-ink tabular-nums">
              {t.placedOf(placed, ITEMS.length)}
            </dd>
          </div>
        </dl>
        <div aria-hidden="true" className="h-3 rounded-sm bg-rule/50">
          <div
            className="h-full rounded-sm bg-accent transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${(100 * tokens) / MOST_TOKENS}%` }}
          />
        </div>
        <p className="font-serif text-lg leading-snug text-ink">
          {t.summary[preset?.id ?? 'mixed']}
        </p>
      </div>

      {/* ── the six lessons ── */}
      <div className="space-y-3 border-t border-rule pt-6">
        <Step label={t.itemsLabel} />
        <ul className="space-y-3">
          {ITEMS.map((item) => {
            const home = placement[item.id]
            const fit = item.fit[home]
            const copy = t.items[item.id]
            return (
              <li key={item.id} className="rounded-lg border border-rule p-3">
                <p className="font-serif text-base leading-snug text-ink">{copy.name}</p>
                <div
                  role="group"
                  aria-label={copy.name}
                  className="mt-2 flex flex-wrap items-center gap-2"
                >
                  {HOMES.map((option) => (
                    <Chip
                      key={option}
                      pressed={home === option}
                      onClick={() => setPlacement({ ...placement, [item.id]: option })}
                    >
                      {t.homes[option].name}
                    </Chip>
                  ))}
                  <span
                    className={`ml-auto rounded border px-2 py-0.5 text-xs ${FIT_CLASS[fit]}`}
                  >
                    <span aria-hidden="true">{FIT_MARK[fit]} </span>
                    {t.fit[fit]}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{copy.verdict[home]}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </LabFrame>
  )
}
