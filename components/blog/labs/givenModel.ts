// The toy world behind <GivenLab>: 200 imagined "Suggest a name." conversations.
// Pure data and arithmetic, no imports, so tests/labs.test.mjs can run it.
//
// Counts are chosen so the conditional probabilities are the ones the first lab
// shows: P(Max | puppy) = 34%, P(Max | startup) = 1%, P(Sentinel | startup) = 29%.

export type Context = 'puppy' | 'startup' | 'other'
export type Answer = 'max' | 'sentinel' | 'other'

export interface Dot {
  context: Context
  answer: Answer
}

export const COLUMNS = 20
export const ROWS = 10

/** Conversations per context, then how many of them end in each answer. */
const WORLD: { context: Context; size: number; answers: Record<Answer, number> }[] = [
  { context: 'puppy', size: 50, answers: { max: 17, sentinel: 0, other: 33 } },
  { context: 'startup', size: 100, answers: { max: 1, sentinel: 29, other: 70 } },
  { context: 'other', size: 50, answers: { max: 6, sentinel: 1, other: 43 } },
]

/** Fixed seed, so the server and the browser draw the same scatter. */
function shuffled<T>(items: T[], seed: number): T[] {
  const out = items.slice()
  let state = seed
  for (let i = out.length - 1; i > 0; i--) {
    state = (state * 1664525 + 1013904223) % 4294967296
    const j = state % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * The dots in reading order for a grid that fills column by column, so each
 * context is a vertical band: 5 columns, 10 columns, 5 columns.
 */
export const DOTS: Dot[] = WORLD.flatMap(({ context, answers }, band) => {
  const inBand: Dot[] = (Object.keys(answers) as Answer[]).flatMap((answer) =>
    Array.from({ length: answers[answer] }, () => ({ context, answer })),
  )
  return shuffled(inBand, 7 + band)
})

export type EventId = 'ans-max' | 'ans-sentinel' | 'ctx-puppy' | 'ctx-startup'

export const EVENT_IDS: readonly EventId[] = ['ans-max', 'ans-sentinel', 'ctx-puppy', 'ctx-startup']

export const EVENTS: Record<EventId, (dot: Dot) => boolean> = {
  'ans-max': (dot) => dot.answer === 'max',
  'ans-sentinel': (dot) => dot.answer === 'sentinel',
  'ctx-puppy': (dot) => dot.context === 'puppy',
  'ctx-startup': (dot) => dot.context === 'startup',
}

export interface Count {
  /** Conversations where the condition holds (all of them when there is none). */
  given: number
  /** Of those, how many also have the event. */
  both: number
}

/** Narrow the world to the condition, then count the event inside it. */
export function count(event: EventId, given: EventId | null): Count {
  const inGiven = given ? DOTS.filter(EVENTS[given]) : DOTS
  return { given: inGiven.length, both: inGiven.filter(EVENTS[event]).length }
}

export const percent = ({ given, both }: Count) => (given === 0 ? 0 : (100 * both) / given)
