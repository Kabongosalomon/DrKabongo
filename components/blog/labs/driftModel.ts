// The world behind <DriftLab>: customers whose behaviour drifts, and a real
// logistic regression that is either left frozen or retrained on fresh outcomes.
// Pure arithmetic, no imports, so tests/labs.test.mjs can run it directly.
//
// The world is a toy (two features, a boundary that turns a few degrees a
// month). The model is not: the weights are fitted by gradient descent, and
// every accuracy shown is counted on customers the model never trained on.

export interface Customer {
  x: number
  y: number
  /** A fixed personal offset, so people near the boundary aren't perfectly predictable. */
  jitter: number
}

export type Weights = readonly [number, number]

/** Months shown, 0 to 18. */
export const MONTHS = 18
/** How far behaviour turns each month, in degrees. */
export const DRIFT_PER_MONTH = 5
const START_ANGLE = 20
const JITTER = 0.12

/** Fixed seed, so the server and the browser build the same world. */
function generator(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function customers(count: number, seed: number): Customer[] {
  const random = generator(seed)
  const out: Customer[] = []
  while (out.length < count) {
    const x = random() * 2 - 1
    const y = random() * 2 - 1
    if (x * x + y * y > 1) continue
    out.push({ x, y, jitter: (random() * 2 - 1) * JITTER })
  }
  return out
}

/** The customers on screen. The model is only ever scored on these. */
export const SHOWN: readonly Customer[] = customers(200, 11)
/** A separate group whose outcomes are the training data. */
const TRAINING: readonly Customer[] = customers(400, 23)

/** The direction behaviour points in a given month, in degrees. */
export const realityAngle = (month: number) => START_ANGLE + DRIFT_PER_MONTH * month

/** What this customer actually does in a given month: buys, or doesn't. */
export function buys(customer: Customer, month: number): boolean {
  const angle = (realityAngle(month) * Math.PI) / 180
  return Math.cos(angle) * customer.x + Math.sin(angle) * customer.y + customer.jitter > 0
}

/** What the model predicts for this customer. */
export const predictsBuy = (weights: Weights, customer: Customer) =>
  weights[0] * customer.x + weights[1] * customer.y > 0

/**
 * Fit the two weights to one month of outcomes, by gradient descent on the
 * logistic loss. It starts from the weights the model already has, which is
 * what fine-tuning means: keep what you know, adjust it to the new data.
 */
export function train(month: number, from: Weights = [0, 0]): Weights {
  let [a, b] = from
  const rate = 2
  for (let step = 0; step < 400; step++) {
    let gradA = 0
    let gradB = 0
    for (const customer of TRAINING) {
      const p = 1 / (1 + Math.exp(-(a * customer.x + b * customer.y)))
      const error = p - (buys(customer, month) ? 1 : 0)
      gradA += error * customer.x
      gradB += error * customer.y
    }
    a -= (rate * gradA) / TRAINING.length
    b -= (rate * gradB) / TRAINING.length
  }
  return [a, b]
}

/** Percent of the customers on screen the model gets right in a given month. */
export function accuracy(weights: Weights, month: number): number {
  let right = 0
  for (const customer of SHOWN) {
    if (predictsBuy(weights, customer) === buys(customer, month)) right++
  }
  return (100 * right) / SHOWN.length
}

/** The direction the model's weights point, in degrees. Compare with realityAngle. */
export const modelAngle = (weights: Weights) => (Math.atan2(weights[1], weights[0]) * 180) / Math.PI

/** The model as shipped: trained once, on month 0. */
export const SHIPPED: Weights = train(0)

/** The shipped model, never touched again, scored month by month. */
export const FROZEN: readonly number[] = Array.from({ length: MONTHS + 1 }, (_, month) =>
  accuracy(SHIPPED, month),
)

export interface World {
  month: number
  weights: Weights
  /** Accuracy for each month lived so far. */
  history: number[]
  /** The months in which the model was retrained. */
  retrained: number[]
}

export const start = (): World => ({
  month: 0,
  weights: SHIPPED,
  history: [FROZEN[0]],
  retrained: [],
})

/** Retrain on this month's outcomes; this month's score becomes the new model's. */
export function retrain(world: World): World {
  const weights = train(world.month, world.weights)
  return {
    ...world,
    weights,
    history: [...world.history.slice(0, -1), accuracy(weights, world.month)],
    retrained: world.retrained.includes(world.month)
      ? world.retrained
      : [...world.retrained, world.month],
  }
}

/**
 * One month passes. With `auto`, the model is first retrained on the outcomes
 * of the month that just ended, so it always runs one month behind reality.
 */
export function advance(world: World, auto: boolean): World {
  if (world.month >= MONTHS) return world
  const current = auto ? retrain(world) : world
  const month = current.month + 1
  return {
    ...current,
    month,
    history: [...current.history, accuracy(current.weights, month)],
  }
}
