// The sorting game behind <MemoryLab>: six things a business learns, and the two
// places an LLM system can keep them. Pure data and arithmetic, no imports, so
// tests/labs.test.mjs can run it directly.
//
// The token sizes are rough, round figures chosen to show the mechanism. The
// fit of each item to each home follows the published comparisons the post
// cites: retrieval is the better home for facts, training for behaviour that
// has to be learned from many examples.

export type ItemId = 'prices' | 'order' | 'policy' | 'tone' | 'routing' | 'edits'
export type Home = 'context' | 'weights'
export type Fit = 'good' | 'strained' | 'wrong'

export interface Item {
  id: ItemId
  /** Tokens it adds to every single call while it lives in the context. */
  tokens: number
  fit: Record<Home, Fit>
}

export const ITEMS: readonly Item[] = [
  // Facts that change, or that belong to one customer: context is their home.
  { id: 'prices', tokens: 1500, fit: { context: 'good', weights: 'wrong' } },
  { id: 'order', tokens: 300, fit: { context: 'good', weights: 'wrong' } },
  { id: 'policy', tokens: 400, fit: { context: 'good', weights: 'strained' } },
  // Behaviour learned from many examples: only a sample ever fits in a prompt.
  { id: 'tone', tokens: 6000, fit: { context: 'strained', weights: 'good' } },
  { id: 'routing', tokens: 4000, fit: { context: 'strained', weights: 'good' } },
  { id: 'edits', tokens: 3000, fit: { context: 'strained', weights: 'good' } },
]

export type Placement = Record<ItemId, Home>

const everywhere = (home: (item: Item) => Home): Placement =>
  Object.fromEntries(ITEMS.map((item) => [item.id, home(item)])) as Placement

/** Today's default: the weights are frozen, so everything goes in the context. */
export const ALL_CONTEXT: Placement = everywhere(() => 'context')
export const ALL_WEIGHTS: Placement = everywhere(() => 'weights')
/** Each item in the home that suits it. */
export const BY_KIND: Placement = everywhere((item) =>
  item.fit.weights === 'good' ? 'weights' : 'context',
)

/** Tokens re-read on every call: everything that lives in the context. */
export const tokensPerCall = (placement: Placement) =>
  ITEMS.reduce((sum, item) => sum + (placement[item.id] === 'context' ? item.tokens : 0), 0)

/** How many of the six sit in a home that suits them. */
export const wellPlaced = (placement: Placement) =>
  ITEMS.filter((item) => item.fit[placement[item.id]] === 'good').length

export const samePlacement = (a: Placement, b: Placement) =>
  ITEMS.every((item) => a[item.id] === b[item.id])
