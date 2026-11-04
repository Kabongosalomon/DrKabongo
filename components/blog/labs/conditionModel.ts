// The toy model behind <ConditionLab>. Pure data and arithmetic, no imports, so
// tests/labs.test.mjs can run it directly.
//
// Not a real model. Each entry is a hand-written distribution over a handful of
// names, in percent. The "none" row is the model with nothing to go on. Every
// other row is that same model after reading one extra line of conversation.
// The puppy and startup rows are the numbers in the post's original figure.

export type Name =
  | 'max'
  | 'bella'
  | 'sunny'
  | 'nova'
  | 'alex'
  | 'sentinel'
  | 'bastion'
  | 'cipher'
  | 'other'

export const NAMES: readonly Name[] = [
  'max',
  'bella',
  'sunny',
  'nova',
  'alex',
  'sentinel',
  'bastion',
  'cipher',
  'other',
]

export type ContextId = 'brand' | 'puppy' | 'startup'

/** Conversation order: the hidden system line comes before what the user said. */
export const CONTEXT_ORDER: readonly ContextId[] = ['brand', 'puppy', 'startup']

//                       max   bella sunny nova  alex  sentinel bastion cipher other
const BASELINE: number[] = [12, 8, 6, 10, 11, 2, 2, 3, 46]

const ALONE: Record<ContextId, number[]> = {
  puppy: [34, 27, 15, 2, 3, 0.5, 0.5, 0.3, 17.7],
  startup: [1, 0.4, 0.4, 6, 1.5, 29, 22, 14, 25.7],
  brand: [1, 0.5, 2, 20, 3, 12, 8, 9, 44.5],
}

export type Distribution = Record<Name, number>

function toDistribution(values: number[]): Distribution {
  return Object.fromEntries(NAMES.map((name, i) => [name, values[i]])) as Distribution
}

/** What the model says with nothing before the request. */
export const NO_CONTEXT: Distribution = toDistribution(BASELINE)

/**
 * The distribution after reading the given context lines.
 *
 * Each line multiplies a name's odds by how much that line, read alone, moved
 * it (alone / baseline), then everything is renormalised to 100. One line
 * reproduces its own row exactly. Lines that agree sharpen each other, and
 * lines that disagree leave a flat, hedged distribution. The same effect, in
 * miniature, as a real model reading a longer prompt.
 */
export function distributionFor(active: readonly ContextId[]): Distribution {
  const weights = BASELINE.map((base, i) =>
    active.reduce((product, id) => product * (ALONE[id][i] / base), base),
  )
  const total = weights.reduce((sum, w) => sum + w, 0)
  return toDistribution(weights.map((w) => (100 * w) / total))
}

/** One random draw from a distribution: what asking the model once looks like. */
export function sample(distribution: Distribution, random: number): Name {
  let remaining = random * 100
  for (const name of NAMES) {
    remaining -= distribution[name]
    if (remaining < 0) return name
  }
  return 'other'
}

/** Names ranked most likely first. "other" always stays last: it's a bucket, not a name. */
export function ranked(distribution: Distribution): Name[] {
  const names: Name[] = NAMES.filter((n) => n !== 'other')
  return [...names.sort((a, b) => distribution[b] - distribution[a]), 'other']
}
