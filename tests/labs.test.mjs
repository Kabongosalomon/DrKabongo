// The blog posts quote numbers that their interactive labs must reproduce. Run: `npm run test:labs`.

import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import {
  CONTEXT_ORDER,
  NAMES,
  NO_CONTEXT,
  distributionFor,
  ranked,
  sample,
} from '../components/blog/labs/conditionModel.ts'
import { DOTS, count, percent } from '../components/blog/labs/givenModel.ts'
import {
  FROZEN,
  MONTHS,
  SHIPPED,
  SHOWN,
  advance,
  modelAngle,
  realityAngle,
  retrain,
  start,
} from '../components/blog/labs/driftModel.ts'
import {
  ALL_CONTEXT,
  ALL_WEIGHTS,
  BY_KIND,
  ITEMS,
  tokensPerCall,
  wellPlaced,
} from '../components/blog/labs/memoryModel.ts'

const sum = (distribution) => NAMES.reduce((total, name) => total + distribution[name], 0)

describe('ConditionLab model', () => {
  test('every combination of context lines is a probability distribution', () => {
    const subsets = [[], ...CONTEXT_ORDER.map((id) => [id])]
    subsets.push(['brand', 'puppy'], ['puppy', 'startup'], ['brand', 'startup'], [...CONTEXT_ORDER])
    for (const active of subsets) {
      assert.ok(Math.abs(sum(distributionFor(active)) - 100) < 1e-9, active.join('+'))
    }
  })

  test('no context at all is the baseline', () => {
    assert.deepEqual(distributionFor([]), NO_CONTEXT)
  })

  test('the puppy line gives the first bar of the figure: Max 34%, Bella 27%, Sunny 15%', () => {
    const d = distributionFor(['puppy'])
    assert.equal(Math.round(d.max), 34)
    assert.equal(Math.round(d.bella), 27)
    assert.equal(Math.round(d.sunny), 15)
    assert.ok(d.sentinel < 1 && d.bastion < 1)
  })

  test('the startup line gives the second bar: Max 1%, Sentinel 29%, Bastion 22%', () => {
    const d = distributionFor(['startup'])
    assert.equal(Math.round(d.max), 1)
    assert.equal(Math.round(d.sentinel), 29)
    assert.equal(Math.round(d.bastion), 22)
  })

  test('with nothing to go on the answer is generic: no name above 15%', () => {
    for (const name of NAMES) assert.ok(NO_CONTEXT[name] <= 15 || name === 'other', name)
  })

  test('lines that agree sharpen the answer; lines that disagree blur it', () => {
    const top = (active) => distributionFor(active)[ranked(distributionFor(active))[0]]
    assert.ok(top(['startup', 'brand']) > top(['startup']))
    assert.ok(top(['puppy', 'startup']) < top(['startup']))
  })

  test('ranking puts the likeliest name first and the "other" bucket last', () => {
    const order = ranked(distributionFor(['startup']))
    assert.equal(order[0], 'sentinel')
    assert.equal(order.at(-1), 'other')
  })

  test('sampling follows the distribution', () => {
    const d = distributionFor(['puppy'])
    assert.equal(sample(d, 0), 'max')
    assert.equal(sample(d, 0.999999), 'other')
  })
})

describe('GivenLab model', () => {
  test('the toy world has 200 conversations', () => {
    assert.equal(DOTS.length, 200)
  })

  test('counting reproduces the percentages from the first lab', () => {
    assert.equal(Math.round(percent(count('ans-max', 'ctx-puppy'))), 34)
    assert.equal(Math.round(percent(count('ans-max', 'ctx-startup'))), 1)
    assert.equal(Math.round(percent(count('ans-sentinel', 'ctx-startup'))), 29)
  })

  test('without a condition the world is everyone', () => {
    assert.deepEqual(count('ans-max', null), { given: 200, both: 24 })
  })

  test('P(A | B) is not P(B | A)', () => {
    assert.equal(Math.round(percent(count('ans-max', 'ctx-puppy'))), 34)
    assert.equal(Math.round(percent(count('ctx-puppy', 'ans-max'))), 71)
  })

  test('two contexts can never both be true at once', () => {
    assert.equal(count('ctx-puppy', 'ctx-startup').both, 0)
  })

  test('the scatter is deterministic, so the server and browser agree', async () => {
    const again = await import('../components/blog/labs/givenModel.ts?again')
    assert.deepEqual(again.DOTS, DOTS)
  })
})

// ── Post: "Your LLM has two memories" ──

const months = (world, count, auto) => {
  for (let i = 0; i < count; i++) world = advance(world, auto)
  return world
}

describe('DriftLab model', () => {
  test('the shipped model is right 96% of the time, on 200 customers it never trained on', () => {
    assert.equal(SHOWN.length, 200)
    assert.equal(FROZEN[0], 96)
    assert.ok(Math.abs(modelAngle(SHIPPED) - realityAngle(0)) < 1)
  })

  test('left frozen it falls to 68% after a year and to a coin flip after 18 months', () => {
    assert.equal(Math.round(FROZEN[12]), 68)
    assert.equal(FROZEN[MONTHS], 52)
    for (let month = 1; month <= MONTHS; month++) assert.ok(FROZEN[month] <= FROZEN[month - 1])
  })

  test('never retraining reproduces the frozen line', () => {
    assert.deepEqual(months(start(), MONTHS, false).history, FROZEN)
  })

  test('one retraining at month 12 takes it from 68% back to 94%', () => {
    const before = months(start(), 12, false)
    const after = retrain(before)
    assert.equal(Math.round(before.history.at(-1)), 68)
    assert.equal(after.history.at(-1), 94)
    assert.deepEqual(after.retrained, [12])
    assert.ok(Math.abs(modelAngle(after.weights) - realityAngle(12)) < 2)
  })

  test('retrained every month it never drops below 90%', () => {
    const world = months(start(), MONTHS, true)
    assert.equal(world.history.length, MONTHS + 1)
    assert.ok(Math.min(...world.history) >= 90)
  })

  test('time stops at the last month', () => {
    const end = months(start(), MONTHS + 5, false)
    assert.equal(end.month, MONTHS)
  })
})

describe('MemoryLab model', () => {
  test('everything in the context costs 15,200 tokens on every call', () => {
    assert.equal(tokensPerCall(ALL_CONTEXT), 15200)
    assert.equal(wellPlaced(ALL_CONTEXT), 3)
  })

  test('everything in the weights empties the prompt and misplaces three lessons', () => {
    assert.equal(tokensPerCall(ALL_WEIGHTS), 0)
    assert.equal(wellPlaced(ALL_WEIGHTS), 3)
    assert.equal(ITEMS.filter((item) => item.fit.weights !== 'good').length, 3)
  })

  test('split by kind: all six fit, and the prompt is seven times shorter', () => {
    assert.equal(wellPlaced(BY_KIND), ITEMS.length)
    assert.equal(tokensPerCall(BY_KIND), 2200)
    assert.equal(Math.round(tokensPerCall(ALL_CONTEXT) / tokensPerCall(BY_KIND)), 7)
  })

  test('no lesson suits both homes, and none suits neither', () => {
    for (const item of ITEMS) {
      const good = ['context', 'weights'].filter((home) => item.fit[home] === 'good')
      assert.equal(good.length, 1, item.id)
    }
  })
})
