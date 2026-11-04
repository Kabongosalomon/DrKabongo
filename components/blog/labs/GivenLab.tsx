'use client'

import { useState } from 'react'
import { givenCopy, labLocale } from './copy'
import {
  COLUMNS,
  DOTS,
  EVENTS,
  EVENT_IDS,
  ROWS,
  count,
  percent,
  type EventId,
} from './givenModel'
import { Chip, LabFrame, Step } from './ui'

// Each context is a vertical band of the dot grid: 5, 10 and 5 columns wide.
const BANDS: { id: 'puppy' | 'startup' | 'other'; columns: number }[] = [
  { id: 'puppy', columns: 5 },
  { id: 'startup', columns: 10 },
  { id: 'other', columns: 5 },
]

export default function GivenLab({ locale }: { locale: string }) {
  const t = givenCopy[labLocale(locale)]
  const [event, setEvent] = useState<EventId>('ans-max')
  const [given, setGiven] = useState<EventId | null>('ctx-puppy')

  const forward = count(event, given)
  const flipped = given ? count(given, event) : null
  const differs = flipped && event !== given && Math.round(percent(forward)) !== Math.round(percent(flipped))

  const short = (id: EventId) => t.events[id].short
  const conditionText = given ? t.events[given].long : null

  return (
    <LabFrame eyebrow={t.eyebrow} title={t.title} footnote={t.disclaimer}>
      <p className="text-base leading-relaxed text-ink-2">{t.intro}</p>

      {/* ── the question: A given B ── */}
      <div className="space-y-5">
        <div className="space-y-2">
          <Step label={t.eventLabel} />
          <div role="group" aria-label={t.eventLabel} className="flex flex-wrap gap-2">
            {EVENT_IDS.map((id) => (
              <Chip key={id} pressed={event === id} onClick={() => setEvent(id)}>
                {t.events[id].chip}
              </Chip>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Step label={t.givenLabel} />
          <div role="group" aria-label={t.givenLabel} className="flex flex-wrap gap-2">
            <Chip pressed={given === null} onClick={() => setGiven(null)}>
              {t.givenNone}
            </Chip>
            {EVENT_IDS.map((id) => (
              <Chip key={id} pressed={given === id} onClick={() => setGiven(id)}>
                {t.events[id].given}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* ── the world: 200 dots ── */}
      <div className="space-y-3">
        <div
          aria-hidden="true"
          className="grid gap-x-1 gap-y-1 sm:gap-x-1.5 sm:gap-y-1.5"
          style={{
            gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${ROWS}, auto)`,
            gridAutoFlow: 'column',
          }}
        >
          {DOTS.map((dot, i) => {
            const inGiven = given ? EVENTS[given](dot) : true
            const hit = inGiven && EVENTS[event](dot)
            return (
              <span
                key={i}
                className={`mx-auto block aspect-square w-full max-w-4 rounded-full transition-colors duration-300 motion-reduce:transition-none ${
                  !inGiven ? 'bg-rule/60' : hit ? 'bg-accent' : 'bg-ink-3'
                }`}
              />
            )
          })}
        </div>

        <div
          aria-hidden="true"
          className="grid gap-x-1 text-center text-xs leading-tight text-ink-3 sm:gap-x-1.5"
          style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
        >
          {BANDS.map(({ id, columns }) => (
            <span
              key={id}
              className="border-t border-rule pt-1.5"
              style={{ gridColumn: `span ${columns}` }}
            >
              {t.bands[id]}
            </span>
          ))}
        </div>

        <p className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-3">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-accent" />
            {t.legendHit}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-ink-3" />
            {t.legendRest}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-rule/60" />
            {t.legendOut}
          </span>
        </p>
      </div>

      {/* ── the count ── */}
      <div className="space-y-4 border-t border-rule pt-6">
        <Step label={t.readoutLabel} />

        <div aria-live="polite" className="space-y-3">
          <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-serif text-5xl leading-none text-accent tabular-nums">
              {t.pct(percent(forward))}
            </span>
            <span className="font-mono text-sm text-ink-2">
              P({short(event)}
              {given ? ` | ${short(given)}` : ''}) = {forward.both} ÷ {forward.given}
            </span>
          </p>
          <p className="text-base leading-relaxed text-ink-2">
            {t.sentence(conditionText, forward.given, forward.both, t.events[event].long)}
          </p>
          <p className="text-xs text-ink-3">
            {forward.both === 0 && given && event !== given
              ? t.never
              : given
                ? t.formulaLabel
                : t.noCondition}
          </p>
        </div>

        {flipped && given && event !== given && (
          <div className="rounded-lg border border-rule bg-raised p-4">
            <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <span className="eyebrow">{t.flipLabel}</span>
              <button
                type="button"
                onClick={() => {
                  setEvent(given)
                  setGiven(event)
                }}
                className="rounded-md border border-ink px-3 py-1 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper motion-reduce:transition-none"
              >
                {t.flipButton}
              </button>
            </p>
            <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-serif text-3xl leading-none text-ink tabular-nums">
                {t.pct(percent(flipped))}
              </span>
              <span className="font-mono text-sm text-ink-2">
                P({short(given)} | {short(event)}) = {flipped.both} ÷ {flipped.given}
              </span>
            </p>
            {differs && <p className="mt-3 text-sm leading-relaxed text-ink-2">{t.asymmetry}</p>}
          </div>
        )}
      </div>
    </LabFrame>
  )
}
