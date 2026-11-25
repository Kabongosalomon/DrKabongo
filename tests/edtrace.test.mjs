// Verifies EdTrace Table of Contents extraction, localized aliases, and line-click navigation.
// Run: `npm run test:edtrace`.

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, test } from 'node:test'
import {
  extractTableOfContents,
  findActiveTocEntry,
  getNavigableSteps,
  resolveCurrentStepIndex,
  resolveLineClickStep,
} from '../components/edtrace/tocModel.ts'

const TRACE_DIR = path.join(
  process.cwd(),
  'public',
  'edtrace',
  'traces',
  'ai_machine_learning_hello_world',
)

function loadTrace(lang) {
  const filePath = path.join(TRACE_DIR, lang, 'from_scratch.json')
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

describe('EdTrace presentation navigation & Table of Contents', () => {
  const enTrace = loadTrace('en')
  const frTrace = loadTrace('fr')
  const lnTrace = loadTrace('ln')
  const luaTrace = loadTrace('lua')

  test('starts at step 2 (def table_of_contents) when minimumStep is 0, matching local EdTrace', () => {
    const initialStep = resolveCurrentStepIndex(
      enTrace,
      { step: null, source: null, line: null, present: false },
      0,
    )
    assert.equal(initialStep, 2)
    const stack = enTrace.steps[initialStep].stack
    assert.equal(stack.at(-1).function_name, 'table_of_contents')
    assert.equal(stack.at(-1).line_number, 74)
  })

  test('extracts all 6 sections from def table_of_contents() in exact execution order', () => {
    const toc = extractTableOfContents(enTrace, false, 0)
    assert.ok(toc.header)
    assert.equal(toc.header.lineNumber, 74)
    assert.equal(toc.header.stepIndex, 2)
    assert.equal(toc.header.displayName, 'table_of_contents')

    assert.deepEqual(
      toc.entries.map((e) => e.functionName),
      [
        'introduction',
        'how_does_ai_learn',
        'create_dataset',
        'initialize_model',
        'train_model',
        'run_inference',
      ],
    )
    assert.deepEqual(
      toc.entries.map((e) => e.tocLineNumber),
      [76, 77, 78, 79, 80, 81],
    )
    assert.deepEqual(
      toc.entries.map((e) => e.callStepIndex),
      [3, 54, 154, 180, 201, 1196],
    )
    assert.deepEqual(
      toc.entries.map((e) => e.sectionStepIndex),
      [4, 55, 155, 181, 202, 1197],
    )

    // Every section resolves its human-readable heading and sub-sections.
    assert.equal(toc.entries[0].heading, 'Traditional Programming vs. Machine Learning/AI')
    assert.ok(toc.entries[1].subSections.length >= 3)
  })

  test('localizes function names across French, Lingala, and Tshiluba unless rawMode is on', () => {
    const frToc = extractTableOfContents(frTrace, false, 0)
    assert.equal(frToc.header?.displayName, 'table_des_matieres')
    assert.equal(frToc.entries[1].displayName, 'comment_l_ia_apprend')
    assert.equal(frToc.entries[1].codeLabel, 'comment_l_ia_apprend()')

    const frRawToc = extractTableOfContents(frTrace, true, 0)
    assert.equal(frRawToc.header?.displayName, 'table_of_contents')
    assert.equal(frRawToc.entries[1].displayName, 'how_does_ai_learn')

    const lnToc = extractTableOfContents(lnTrace, false, 0)
    assert.equal(lnToc.header?.displayName, 'ndimbu_ya_malako')
    assert.equal(lnToc.entries[4].displayName, 'kolongesha_modele')

    const luaToc = extractTableOfContents(luaTrace, false, 0)
    assert.equal(luaToc.header?.displayName, 'mukanda_wa_bintu')
    assert.equal(luaToc.entries[5].displayName, 'kuenza_inference')
  })

  test('tracks the active TOC section across execution steps', () => {
    const toc = extractTableOfContents(enTrace, false, 0)
    assert.equal(findActiveTocEntry(toc, 2), null)
    assert.equal(findActiveTocEntry(toc, 5)?.functionName, 'introduction')
    assert.equal(findActiveTocEntry(toc, 100)?.functionName, 'how_does_ai_learn')
    assert.equal(findActiveTocEntry(toc, 160)?.functionName, 'create_dataset')
    assert.equal(findActiveTocEntry(toc, 190)?.functionName, 'initialize_model')
    assert.equal(findActiveTocEntry(toc, 500)?.functionName, 'train_model')
    assert.equal(findActiveTocEntry(toc, 1210)?.functionName, 'run_inference')
  })

  test('clicking a TOC call line number backward lands on pre-call entry step, not post-return step', () => {
    const sourcePath = 'courses/ai_machine_learning_hello_world/from_scratch.py'

    // From deep inside `train_model` (step 500, line ~470), clicking line 77 (`how_does_ai_learn()`)
    // must land on step 54 (pre-call entry) rather than step 153 (post-return).
    const step = resolveLineClickStep(enTrace, sourcePath, 77, 500, 0)
    assert.equal(step, 54)

    // Clicking line 74 (`def table_of_contents()`) from step 500 returns to step 2.
    assert.equal(resolveLineClickStep(enTrace, sourcePath, 74, 500, 0), 2)

    // Clicking line 80 (`train_model`) from step 2 jumps forward to step 201.
    assert.equal(resolveLineClickStep(enTrace, sourcePath, 80, 2, 0), 201)
  })

  test('lock-step navigable step counts match across all four compiled languages', () => {
    const enCount = getNavigableSteps(enTrace, 0).length
    assert.ok(enCount > 200)
    assert.equal(getNavigableSteps(frTrace, 0).length, enCount)
    assert.equal(getNavigableSteps(lnTrace, 0).length, enCount)
    assert.equal(getNavigableSteps(luaTrace, 0).length, enCount)
  })

  test('falls back cleanly to top-level Markdown headings when no table_of_contents exists', () => {
    const syntheticTrace = {
      files: { 'lesson.py': 'def run():\n    pass\n' },
      steps: [
        {
          stack: [{ path: 'lesson.py', line_number: 1, function_name: 'run' }],
          renderings: [{ type: 'markdown', data: '# Part One' }],
        },
        {
          stack: [{ path: 'lesson.py', line_number: 2, function_name: 'run' }],
          renderings: [{ type: 'markdown', data: 'Some body text' }],
        },
        {
          stack: [{ path: 'lesson.py', line_number: 3, function_name: 'run' }],
          renderings: [{ type: 'markdown', data: '## Part Two' }],
        },
      ],
    }
    const toc = extractTableOfContents(syntheticTrace, false, 0)
    assert.equal(toc.header, null)
    assert.equal(toc.entries.length, 2)
    assert.equal(toc.entries[0].heading, 'Part One')
    assert.equal(toc.entries[1].heading, 'Part Two')
  })

  test('host stylesheet keeps cloaked content visible (dimmed) rather than display:none', () => {
    const css = fs.readFileSync(
      path.join(process.cwd(), 'components', 'edtrace', 'edtrace-host.css'),
      'utf-8',
    )
    assert.match(css, /\.present-mode\s+\.cloaked[\s\S]*?display:\s*block/)
    assert.match(css, /\.edtrace-host\.is-fullscreen/)
  })
})

describe('IndabaX DRC 2026 presentation (learning_in_the_llm_era) & i18n parity', () => {
  const talkTraceDir = path.join(process.cwd(), 'public', 'edtrace', 'traces', 'talks')
  const loadTalk = (lang) =>
    JSON.parse(
      fs.readFileSync(path.join(talkTraceDir, lang, 'learning_in_the_llm_era.json'), 'utf-8'),
    )

  test('compiles lock-step traces across en, fr, ln, and lua with all 7 sections, BPE/embedding loops, plots, and blog links', () => {
    const en = loadTalk('en')
    const fr = loadTalk('fr')
    const ln = loadTalk('ln')
    const lua = loadTalk('lua')

    const enSteps = getNavigableSteps(en, 0)
    assert.ok(enSteps.length > 100)
    assert.equal(getNavigableSteps(fr, 0).length, enSteps.length)
    assert.equal(getNavigableSteps(ln, 0).length, enSteps.length)
    assert.equal(getNavigableSteps(lua, 0).length, enSteps.length)

    const tocEn = extractTableOfContents(en, false, 0)
    assert.equal(tocEn.header?.stepIndex, 2)
    assert.deepEqual(
      tocEn.entries.map((e) => e.functionName),
      [
        'the_rise_of_llms_and_history',
        'crawl_walk_run_fly',
        'conditional_probability_machines',
        'bpe_and_the_tokenization_tax',
        'embeddings_across_all_modalities',
        'two_memories_and_congolese_speech',
        'recognition_darakili_and_building_together',
      ],
    )

    const tocFr = extractTableOfContents(fr, false, 0)
    assert.equal(tocFr.header?.displayName, 'table_des_matieres')
    assert.equal(tocFr.entries[0].displayName, 'essor_des_llm_et_lecon_de_l_histoire')
    assert.equal(tocFr.entries[2].displayName, 'machines_a_probabilite_conditionnelle')
    assert.equal(tocFr.entries[3].displayName, 'bpe_et_taxe_de_tokenisation')
    assert.equal(tocFr.entries[4].displayName, 'embeddings_a_travers_les_modalites')
    assert.equal(tocFr.entries[6].displayName, 'reconnaissance_darakili_et_batir_ensemble')

    // Verify Vega-Lite plots exist (venue surge, conditional probability, BPE tax, multimodal embeddings).
    const plots = en.steps.flatMap((s) => (s.renderings || []).filter((r) => r.type === 'plot'))
    assert.equal(plots.length, 4)

    // Verify poster asset, grounded external sources, production blog links, Africa AI 100, SALELA BONGO LLC, and DarAkili.
    assert.ok(
      fs.existsSync(
        path.join(process.cwd(), 'public', 'edtrace', 'images', 'talks', 'indabax-drc-2026.jpg'),
      ),
    )
    const serializedEn = JSON.stringify(en)
    assert.match(serializedEn, /https:\/\/hai\.stanford\.edu\/ai-index/)
    assert.match(serializedEn, /https:\/\/sensortower\.com/)
    assert.match(serializedEn, /https:\/\/appfigures\.com/)
    assert.match(serializedEn, /https:\/\/arxiv\.org\/abs\/2207\.08815/)
    assert.match(serializedEn, /https:\/\/drkabongo\.com\/blog\/conditional-probability-machines/)
    assert.match(serializedEn, /https:\/\/drkabongo\.com\/blog\/llm-two-memories/)
    assert.match(serializedEn, /https:\/\/drkabongo\.com\/blog\/llm-two-memories-part-2/)
    assert.match(serializedEn, /Africa AI 100/)
    assert.match(serializedEn, /SALELA BONGO LLC/)
    assert.match(serializedEn, /DarAkili/)

    const serializedFr = JSON.stringify(fr)
    assert.match(serializedFr, /https:\/\/drkabongo\.com\/fr\/blog\/conditional-probability-machines/)
    assert.match(serializedFr, /https:\/\/drkabongo\.com\/fr\/blog\/llm-two-memories/)
  })

  test('all five locale message files expose identical nested key sets', () => {
    const collectKeys = (obj, prefix = '') =>
      Object.entries(obj).flatMap(([k, v]) =>
        v && typeof v === 'object' && !Array.isArray(v)
          ? collectKeys(v, `${prefix}${k}.`)
          : [`${prefix}${k}`],
      )

    const enKeys = collectKeys(
      JSON.parse(fs.readFileSync(path.join(process.cwd(), 'messages', 'en.json'), 'utf-8')),
    ).sort()

    for (const locale of ['fr', 'ln', 'lua', 'sw']) {
      const keys = collectKeys(
        JSON.parse(
          fs.readFileSync(path.join(process.cwd(), 'messages', `${locale}.json`), 'utf-8'),
        ),
      ).sort()
      assert.deepEqual(keys, enKeys, `Key mismatch in messages/${locale}.json`)
    }
  })
})
