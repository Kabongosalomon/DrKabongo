#!/usr/bin/env node
/**
 * Compile standalone EdTrace presentation traces for `/[locale]/speaking/[slug]`.
 *
 * Emits lock-step identical v2 EdTrace JSON traces across all supported
 * languages (`en`, `fr`, `ln`, `lua`) under `public/edtrace/traces/talks/<lang>/`
 * with verified LLM research & app-store growth charts, classical ML comparison,
 * live looping trace demos (Conditional Probability, BPE merges, Multimodal
 * Embeddings across Text/Image/Audio/Video, LoRA/Two Memories & Congolese speech),
 * and closing Africa AI 100 / SALELA BONGO LLC / DarAkili spotlight.
 *
 * Run: `npm run presentations`
 */

import fs from 'node:fs'
import path from 'node:path'
import {
  COPY,
  PRESENTATION_META,
  getReferences,
} from '../content/presentations/learning_in_the_llm_era.mjs'

const OUT_ROOT = path.join(process.cwd(), 'public', 'edtrace', 'traces', PRESENTATION_META.courseId)

function pyInt(n) {
  return { type: 'int', contents: n, dtype: null, shape: null }
}

function pyFloat(x) {
  return { type: 'float', contents: Number(x.toFixed(4)), dtype: null, shape: null }
}

function pyStr(s) {
  return { type: 'str', contents: s, dtype: null, shape: null }
}

function pyList(items) {
  return { type: 'list', contents: items, dtype: null, shape: null }
}

function pyDict(record) {
  return { type: 'dict', contents: record, dtype: null, shape: null }
}

function md(data) {
  return { type: 'markdown', data, style: {}, external_link: null, internal_link: null }
}

function note(data) {
  return { type: 'note', data, style: {}, external_link: null, internal_link: null }
}

function plot(spec) {
  return {
    type: 'plot',
    data: spec,
    style: { width: '100%', maxWidth: '820px' },
    external_link: null,
    internal_link: null,
  }
}

function img(assetPath, caption) {
  const items = [
    {
      type: 'image',
      data: assetPath,
      style: { display: 'block', maxWidth: '500px', height: 'auto', width: 500 },
      external_link: null,
      internal_link: null,
    },
  ]
  if (caption) items.push(md(`*${caption}*`))
  return items
}

function refLink(refs, refKey) {
  const spec = refs[refKey]
  return {
    type: 'link',
    data: spec.anchor,
    style: {},
    external_link: spec.external_link,
    internal_link: null,
  }
}

function formatAsciiTable(headers, rows) {
  const strRows = rows.map((r) => r.map((cell) => String(cell)))
  const widths = headers.map((h, col) =>
    Math.max(String(h).length, ...strRows.map((r) => (r[col] ?? '').length)),
  )
  const fmt = (vals) => vals.map((v, i) => String(v).padEnd(widths[i])).join(' | ')
  const sep = widths.map((w) => '-'.repeat(w)).join('-+-')
  return '```text\n' + [fmt(headers), sep, ...strRows.map(fmt)].join('\n') + '\n```'
}

function cosine(a, b) {
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  return Number((dot / (Math.sqrt(na) * Math.sqrt(nb))).toFixed(4))
}

function runBpeMerges(initialWords, numMerges) {
  let corpus = initialWords.map((word) => word.split(''))
  const history = []
  let vocabSize = new Set(corpus.flat()).size

  for (let step = 1; step <= numMerges; step++) {
    const counts = new Map()
    for (const tokens of corpus) {
      for (let i = 0; i < tokens.length - 1; i++) {
        const key = `${tokens[i]}|${tokens[i + 1]}`
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }
    }
    let bestPair = null
    let bestCount = -1
    for (const [key, count] of counts.entries()) {
      if (count > bestCount) {
        bestCount = count
        bestPair = key.split('|')
      }
    }
    if (!bestPair) break

    const mergedSymbol = bestPair[0] + bestPair[1]
    corpus = corpus.map((tokens) => {
      const next = []
      let i = 0
      while (i < tokens.length) {
        if (i < tokens.length - 1 && tokens[i] === bestPair[0] && tokens[i + 1] === bestPair[1]) {
          next.push(mergedSymbol)
          i += 2
        } else {
          next.push(tokens[i])
          i += 1
        }
      }
      return next
    })
    vocabSize += 1
    const totalTokens = corpus.reduce((acc, t) => acc + t.length, 0)
    history.push({
      mergeStep: step,
      pair: `${bestPair[0]} + ${bestPair[1]} -> ${mergedSymbol}`,
      pairCount: bestCount,
      vocabSize,
      totalTokens,
      sampleSegmentation: corpus.slice(0, 2).map((t) => t.join(' · ')),
    })
  }
  return history
}

function makeVenueSurgeSpec(title) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: { text: title, fontSize: 14, anchor: 'start' },
    background: 'transparent',
    width: 620,
    height: 220,
    data: {
      values: [
        { venue: 'ACL 2024 (Main)', submissions: 4407, group: 'NLP' },
        { venue: 'ICLR 2024', submissions: 7400, group: 'ML' },
        { venue: 'ICLR 2025', submissions: 11600, group: 'ML' },
        { venue: 'NeurIPS 2025', submissions: 21575, group: 'ML' },
      ],
    },
    mark: { type: 'bar', cornerRadiusTopLeft: 4, cornerRadiusTopRight: 4 },
    encoding: {
      x: {
        field: 'venue',
        type: 'nominal',
        sort: ['ACL 2024 (Main)', 'ICLR 2024', 'ICLR 2025', 'NeurIPS 2025'],
        title: null,
        axis: { labelAngle: 0, labelFontSize: 12 },
      },
      y: { field: 'submissions', type: 'quantitative', title: 'Paper submissions' },
      color: {
        field: 'venue',
        type: 'nominal',
        legend: null,
        scale: { range: ['#0b7f78', '#8a8278', '#1d4e6b', '#7a2e1e'] },
      },
      tooltip: [
        { field: 'venue', type: 'nominal', title: 'Venue' },
        { field: 'submissions', type: 'quantitative', title: 'Submissions', format: ',' },
      ],
    },
  }
}

function makeConditionalProbSpec(title) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: { text: title, fontSize: 14, anchor: 'start' },
    background: 'transparent',
    width: 620,
    height: 230,
    data: {
      values: [
        { condition: '1. No context', candidate: 'Max', probability: 12 },
        { condition: '1. No context', candidate: 'Bella', probability: 11 },
        { condition: '1. No context', candidate: 'Sentinel', probability: 9 },
        { condition: '2. Given: golden puppy', candidate: 'Max', probability: 34 },
        { condition: '2. Given: golden puppy', candidate: 'Bella', probability: 27 },
        { condition: '2. Given: golden puppy', candidate: 'Sentinel', probability: 1 },
        { condition: '3. Given: cyber startup', candidate: 'Max', probability: 1 },
        { condition: '3. Given: cyber startup', candidate: 'Bella', probability: 2 },
        { condition: '3. Given: cyber startup', candidate: 'Sentinel', probability: 29 },
      ],
    },
    mark: { type: 'bar', cornerRadiusTopLeft: 4, cornerRadiusTopRight: 4 },
    encoding: {
      x: { field: 'candidate', type: 'nominal', title: null, axis: { labelAngle: 0, labelFontSize: 12 } },
      y: { field: 'probability', type: 'quantitative', title: 'P(name | condition) %', scale: { domain: [0, 40] } },
      xOffset: { field: 'condition' },
      color: {
        field: 'condition',
        type: 'nominal',
        title: null,
        scale: { range: ['#8a8278', '#0b7f78', '#7a2e1e'] },
        legend: { orient: 'top', labelFontSize: 12 },
      },
      tooltip: [
        { field: 'condition', type: 'nominal' },
        { field: 'candidate', type: 'nominal' },
        { field: 'probability', type: 'quantitative', title: 'Probability (%)' },
      ],
    },
  }
}

function makeTokenTaxSpec(title) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: { text: title, fontSize: 14, anchor: 'start' },
    background: 'transparent',
    width: 620,
    height: 230,
    data: {
      values: [
        { language: 'English', metric: 'Fertility (tokens/word)', value: 1.12 },
        { language: 'English', metric: 'Attention Cost (x EN)', value: 1.0 },
        { language: 'Français', metric: 'Fertility (tokens/word)', value: 1.33 },
        { language: 'Français', metric: 'Attention Cost (x EN)', value: 1.78 },
        { language: 'Kiswahili', metric: 'Fertility (tokens/word)', value: 1.8 },
        { language: 'Kiswahili', metric: 'Attention Cost (x EN)', value: 2.56 },
        { language: 'Lingála', metric: 'Fertility (tokens/word)', value: 2.29 },
        { language: 'Lingála', metric: 'Attention Cost (x EN)', value: 3.16 },
        { language: 'Tshiluba', metric: 'Fertility (tokens/word)', value: 2.62 },
        { language: 'Tshiluba', metric: 'Attention Cost (x EN)', value: 5.44 },
      ],
    },
    mark: { type: 'bar', cornerRadiusTopLeft: 4, cornerRadiusTopRight: 4 },
    encoding: {
      x: {
        field: 'language',
        type: 'nominal',
        sort: ['English', 'Français', 'Kiswahili', 'Lingála', 'Tshiluba'],
        title: null,
        axis: { labelAngle: 0, labelFontSize: 12 },
      },
      y: { field: 'value', type: 'quantitative', title: 'Multiplier' },
      xOffset: { field: 'metric' },
      color: {
        field: 'metric',
        type: 'nominal',
        title: null,
        scale: { range: ['#1d4e6b', '#7a2e1e'] },
        legend: { orient: 'top', labelFontSize: 12 },
      },
      tooltip: [
        { field: 'language', type: 'nominal' },
        { field: 'metric', type: 'nominal' },
        { field: 'value', type: 'quantitative' },
      ],
    },
  }
}

function makeMultimodalEmbeddingSpec(title) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: { text: title, fontSize: 14, anchor: 'start' },
    background: 'transparent',
    width: 620,
    height: 280,
    data: {
      values: [
        { x: 0.86, y: 0.51, modality: 'Text', label: 'Text EN: "water"', cluster: 'Water / Mâyi / Mai' },
        { x: 0.82, y: 0.56, modality: 'Text', label: 'Text LUA (aligned): "mâyi"', cluster: 'Water / Mâyi / Mai' },
        { x: 0.79, y: 0.46, modality: 'Audio', label: 'Audio LN: waveform "mai"', cluster: 'Water / Mâyi / Mai' },
        { x: 0.88, y: 0.43, modality: 'Image', label: 'Image Patch: Congo River', cluster: 'Water / Mâyi / Mai' },
        { x: 0.76, y: 0.53, modality: 'Video', label: 'Video Tubelet: pouring water', cluster: 'Water / Mâyi / Mai' },
        { x: 0.14, y: -0.22, modality: 'Unadapted BPE', label: 'Shattered BPE: "mâ|yi" (noise)', cluster: 'Unadapted Fragment' },
        { x: -0.68, y: 0.64, modality: 'Text', label: 'Text LUA: "kulonga" (learn)', cluster: 'Learn / Kulonga / Koyekola' },
        { x: -0.63, y: 0.59, modality: 'Audio', label: 'Audio LN: "koyekola"', cluster: 'Learn / Kulonga / Koyekola' },
        { x: -0.71, y: 0.54, modality: 'Image', label: 'Image Patch: UNH classroom', cluster: 'Learn / Kulonga / Koyekola' },
        { x: -0.45, y: -0.72, modality: 'Text', label: 'Text LUA: "kapia" (fire)', cluster: 'Fire / Kapia / Moto' },
        { x: -0.51, y: -0.67, modality: 'Video', label: 'Video Tubelet: campfire', cluster: 'Fire / Kapia / Moto' },
      ],
    },
    layer: [
      {
        mark: { type: 'point', filled: true, size: 150 },
        encoding: {
          x: { field: 'x', type: 'quantitative', title: 'Embedding dimension e_1', scale: { domain: [-1, 1.15] } },
          y: { field: 'y', type: 'quantitative', title: 'Embedding dimension e_2', scale: { domain: [-0.95, 0.85] } },
          color: {
            field: 'cluster',
            type: 'nominal',
            title: 'Concept cluster',
            scale: { range: ['#0b7f78', '#1d4e6b', '#d97706', '#7a2e1e'] },
          },
          shape: { field: 'modality', type: 'nominal', title: 'Modality' },
          tooltip: [
            { field: 'label', type: 'nominal', title: 'Input' },
            { field: 'modality', type: 'nominal', title: 'Modality' },
            { field: 'cluster', type: 'nominal', title: 'Cluster' },
          ],
        },
      },
      {
        mark: { type: 'text', align: 'left', dx: 9, dy: -2, fontSize: 11 },
        encoding: {
          x: { field: 'x', type: 'quantitative' },
          y: { field: 'y', type: 'quantitative' },
          text: { field: 'label', type: 'nominal' },
        },
      },
    ],
  }
}

function buildLanguageTrace(langCode) {
  const c = COPY[langCode]
  const refs = getReferences(langCode)
  const sourcePath = PRESENTATION_META.sourcePath

  const lines = []
  const hiddenLines = []
  const steps = []

  const addLine = (code, { hidden = false } = {}) => {
    lines.push(code)
    const lineNumber = lines.length
    if (hidden) hiddenLines.push(lineNumber)
    return lineNumber
  }

  const frame = (lineNumber, fnName) => ({
    path: sourcePath,
    line_number: lineNumber,
    function_name: fnName,
    code: lines[lineNumber - 1].trim(),
  })

  const addStep = (stack, renderings = [], env = {}) => {
    steps.push({ stack, renderings, env })
  }

  // ── Hidden module header ──
  addLine('"""Learning in the Era of LLM — IndabaX D.R. Congo 2026 (UNH Lubumbashi)."""', { hidden: true })
  addLine('from __future__ import annotations', { hidden: true })
  addLine('import math', { hidden: true })
  addLine('from edtrace import image, link, note, plot, text', { hidden: true })
  addLine('')

  // ── Table of Contents (7 sections) ──
  const tocDefLine = addLine('def table_of_contents() -> None:')
  addLine('    """IndabaX D.R. Congo 2026 keynote roadmap."""  # @hide', { hidden: true })
  const callS1Line = addLine('    the_rise_of_llms_and_history()')
  const callS2Line = addLine('    crawl_walk_run_fly()')
  const callS3Line = addLine('    conditional_probability_machines()')
  const callS4Line = addLine('    bpe_and_the_tokenization_tax()')
  const callS5Line = addLine('    embeddings_across_all_modalities()')
  const callS6Line = addLine('    two_memories_and_congolese_speech()')
  const callS7Line = addLine('    recognition_darakili_and_building_together()')
  addLine('')

  const mainDefLine = addLine('def main() -> None:  # @hide', { hidden: true })
  const mainCallLine = addLine('    table_of_contents()  # @hide', { hidden: true })
  addLine('')

  // ── Section 1: The Rise of LLMs (Research & App Stores) + Deep Learning vs Classical ML ──
  const s1DefLine = addLine('def the_rise_of_llms_and_history() -> None:')
  const s1TitleLine = addLine('    text("# " + TITLE)')
  const s1VenueLine = addLine('    text(EVENT_CONTEXT)')
  const s1SpeakerLine = addLine('    text(SPEAKER_LINE)')
  const s1PosterLine = addLine('    image("images/talks/indabax-drc-2026.jpg")')
  const s1WaveTitleLine = addLine('    text("## " + LLM_WAVE_TITLE)')
  const s1ResearchLine = addLine('    text(RESEARCH_PUBLICATION_EXPLOSION)')
  const s1RefStanfordLine = addLine('    link(STANFORD_AI_INDEX_REPORT)')
  const s1PlotLine = addLine('    plot(TOP_VENUE_SUBMISSIONS_CHART)')
  const s1AppStoreLine = addLine('    text(APP_STORE_AND_GOOGLE_PLAY_SURGE)')
  const s1RefSensorLine = addLine('    link(SENSOR_TOWER_GENAI_APPS)')
  const s1RefAppfigLine = addLine('    link(APPFIGURES_AI_APP_PUBLISHING)')
  const s1HistTitleLine = addLine('    text("### " + DEEP_LEARNING_VS_CLASSICAL_ML_TITLE)')
  const s1HistBodyLine = addLine('    text(CLASSICAL_ML_HISTORY_PARALLEL)')
  const s1RefGrinsztajnLine = addLine('    link(GRINSZTAJN_NEURIPS_2022_TABULAR)')
  const s1HistTakeawayLine = addLine('    text(HISTORY_TAKEAWAY)')
  addLine('')

  // ── Section 2: Crawl, Walk, Run, Fly ──
  const s2DefLine = addLine('def crawl_walk_run_fly() -> None:')
  const s2TitleLine = addLine('    text("## " + CRAWL_WALK_FLY_TITLE)')
  const s2ParadoxLine = addLine('    text(EXECUTION_SPEED_PARADOX)')
  const s2ShortcutLine = addLine('    text(SHORTCUT_NUANCE)')
  const s2TrapLine = addLine('    text(HYPE_TRAP_BODY)')
  const s2TableLine = addLine('    text(PROGRESSION_TABLE)')
  const s2TakeawayLine = addLine('    text(THESIS_TAKEAWAY)')
  addLine('')

  // ── Section 3: Conditional Probability Machines + Live Trace Demo #1 ──
  const s3DefLine = addLine('def conditional_probability_machines() -> None:')
  const s3TitleLine = addLine('    text("## " + CONDITIONAL_PROBABILITY_TITLE)')
  const s3IntroLine = addLine('    text(CONDITIONAL_INTRO)')
  const s3BarLine = addLine('    text(GIVEN_BAR_INTUITION)')
  const s3AutoregEqLine = addLine(
    '    text(r"$$P_\\theta(y_1, \\dots, y_T \\mid \\mathrm{context}) = \\prod_{t=1}^{T} P_\\theta\\!\\left(y_t \\;\\middle|\\; \\mathrm{context},\\, y_1, \\dots, y_{t-1}\\right)$$")',
  )
  const s3NarrowLine = addLine('    text(NARROW_WORLD_EXPLANATION)')
  const s3BayesEqLine = addLine(
    '    text(r"$$P(A \\mid B) = \\frac{|A \\cap B|}{|B|} = \\frac{P(A \\cap B)}{P(B)}, \\qquad P_\\theta(x_t = v \\mid x_{<t}) = \\frac{\\exp(z_v / \\tau)}{\\sum_{u \\in V} \\exp(z_u / \\tau)}$$")',
  )
  const s3TraceIntroLine = addLine('    text(TRACE_DEMO_1_INTRO)')
  const s3WorldTotalLine = addLine(
    '    total_worlds, max_worlds = 200, 24; p_max_general = max_worlds / total_worlds  # @inspect p_max_general',
  )
  const s3PuppyLine = addLine(
    '    puppy_worlds, puppy_and_max = 50, 17; p_max_given_puppy = puppy_and_max / puppy_worlds  # @inspect p_max_given_puppy',
  )
  const s3StartupLine = addLine(
    '    startup_worlds, startup_and_max = 80, 1; p_max_given_startup = startup_and_max / startup_worlds  # @inspect p_max_given_startup',
  )
  const s3FlippedLine = addLine(
    '    p_puppy_given_max = puppy_and_max / max_worlds  # @inspect p_puppy_given_max',
  )
  const s3PlotLine = addLine('    plot(CONDITIONAL_PROBABILITY_CHART)')
  const s3BayesTrapLine = addLine('    text(BAYES_AND_CONDITIONING_LAWS)')
  const s3SnowballIntroLine = addLine('    text(SNOWBALL_TRACE_INTRO)')
  const s3SnowballLoopLine = addLine('    for step_t in (1, 2, 4, 6):')
  const s3SnowballCalcLine = addLine(
    '        chain_reliability = 0.85 ** step_t  # @inspect step_t chain_reliability',
  )
  const s3TakeawayLine = addLine('    text(CONDITIONAL_TAKEAWAY)')
  const s3RefBlogLine = addLine('    link(BLOG_CONDITIONAL_PROBABILITY_MACHINES)')
  addLine('')

  // ── Section 4: BPE From Scratch + Congolese Tokenization Tax ──
  const s4DefLine = addLine('def bpe_and_the_tokenization_tax() -> None:')
  const s4TitleLine = addLine('    text("## " + BPE_SECTION_TITLE)')
  const s4IntroLine = addLine('    text(BPE_INTRO)')
  const s4HowLine = addLine('    text(BPE_TRACE_DEMO_INTRO)')
  const s4BpeEqLine = addLine(
    '    text(r"$$(a^*, b^*) = \\arg\\max_{(a, b) \\in V \\times V} \\mathrm{count}(a, b), \\qquad V_{m+1} = V_m \\cup \\{a^* \\circ b^*\\}$$")',
  )
  const s4BpeInitLine = addLine(
    '    corpus = ["kulonga", "kulonga", "kulongesha", "mulongeshi"]  # Tshiluba root: -long- (learn)',
  )
  const s4BpeLoopLine = addLine('    for merge_step in range(1, 5):')
  const s4BpeBodyLine = addLine(
    '        top_pair, pair_count, vocab_size, total_tokens = step_bpe_merge(corpus, merge_step)  # @inspect merge_step top_pair pair_count vocab_size total_tokens sample_words',
  )
  const s4TaxQLine = addLine('    text(FROZEN_ENGLISH_TOKENIZER_QUESTION)')
  const s4TaxDemoLine = addLine('    text(PARALLEL_FERTILITY_SETUP)')
  const s4FertilityLine = addLine(
    '    fertility_en, fertility_fr, fertility_sw, fertility_ln, fertility_lua = 9 / 8, 12 / 9, 9 / 5, 16 / 7, 21 / 8  # @inspect fertility_en fertility_fr fertility_sw fertility_ln fertility_lua',
  )
  const s4TaxCalcLine = addLine(
    '    token_tax_lua = 21 / 9; attention_cost_lua = token_tax_lua ** 2  # @inspect token_tax_lua attention_cost_lua',
  )
  const s4TaxEqLine = addLine(
    '    text(r"$$f_L = \\frac{T_L}{W_L}, \\qquad \\tau_L = \\frac{T_L}{T_{\\mathrm{en}}}, \\qquad \\mathcal{C}_{\\mathrm{attention}}(L) \\propto T_L^2 = \\tau_L^2 \\, T_{\\mathrm{en}}^2$$")',
  )
  const s4PlotLine = addLine('    plot(TOKENIZATION_TAX_CHART)')
  const s4TableLine = addLine('    text(FERTILITY_TABLE)')
  const s4BantuTitleLine = addLine('    text("### " + BANTU_MORPHOLOGY_TITLE)')
  const s4BantuBodyLine = addLine('    text(BANTU_MORPHOLOGY_BODY)')
  const s4ResearchLine = addLine('    text(TOKENIZATION_THESIS_DIRECTIONS)')
  addLine('')

  // ── Section 5: Embeddings Across Text, Image, Audio & Video ──
  const s5DefLine = addLine('def embeddings_across_all_modalities() -> None:')
  const s5TitleLine = addLine('    text("## " + EMBEDDINGS_SECTION_TITLE)')
  const s5IntroLine = addLine('    text(WHAT_IS_AN_EMBEDDING)')
  const s5MathIntroLine = addLine('    text(EMBEDDING_MATH_INTUITION)')
  const s5CosEqLine = addLine(
    '    text(r"$$\\mathbf{e} = \\phi(x) \\in \\mathbb{R}^d, \\qquad \\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|_2 \\, \\|\\mathbf{v}\\|_2} = \\frac{\\sum_{i=1}^{d} u_i v_i}{\\sqrt{\\sum_{i=1}^{d} u_i^2}\\,\\sqrt{\\sum_{i=1}^{d} v_i^2}}$$")',
  )
  const s5ModTitleLine = addLine('    text("### " + MODALITIES_BRIDGE_TITLE)')
  const s5ModTableLine = addLine('    text(MODALITIES_PROJECTION_TABLE)')
  const s5ContrastEqLine = addLine(
    '    text(r"$$\\mathcal{L}_{\\mathrm{contrastive}} = -\\log \\frac{\\exp\\!\\left(\\cos(\\mathbf{e}_i^{(m_1)}, \\mathbf{e}_i^{(m_2)}) / \\tau\\right)}{\\sum_{j=1}^{N} \\exp\\!\\left(\\cos(\\mathbf{e}_i^{(m_1)}, \\mathbf{e}_j^{(m_2)}) / \\tau\\right)}, \\qquad \\mathrm{Attention}(Q,K,V)=\\mathrm{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V$$")',
  )
  const s5TraceIntroLine = addLine('    text(TRACE_DEMO_3_MULTIMODAL_INTRO)')
  const s5AnchorLine = addLine(
    '    anchor_text_en = [0.86, 0.51, 0.12, -0.04]  # Text EN: "water"',
  )
  const s5ModLoopLine = addLine('    for modality_item, vec in MULTIMODAL_VECTORS.items():')
  const s5ModCalcLine = addLine(
    '        sim_to_anchor = cosine(anchor_text_en, vec)  # @inspect modality_item sim_to_anchor',
  )
  const s5CompareBpeLine = addLine(
    '    sim_unadapted_mayi, sim_aligned_mayi = 0.1892, 0.9614  # @inspect sim_unadapted_mayi sim_aligned_mayi',
  )
  const s5PlotLine = addLine('    plot(MULTIMODAL_EMBEDDING_SPACE_PLOT)')
  const s5WhyFirstLine = addLine('    text(MULTIMODAL_EMBEDDINGS_TAKEAWAY)')
  addLine('')

  // ── Section 6: Two Memories & Congolese Speech ──
  const s6DefLine = addLine('def two_memories_and_congolese_speech() -> None:')
  const s6TitleLine = addLine('    text("## " + TWO_MEMORIES_TITLE)')
  const s6IntroLine = addLine('    text(TWO_MEMORIES_INTRO)')
  const s6TwoMemEqLine = addLine(
    '    text(r"$$p_\\theta(\\mathrm{answer} \\mid \\mathrm{context}), \\qquad T_W(\\mathrm{context},\\, x) = T_{W + \\Delta W}(x), \\qquad W\' = W + BA \\;\\; (r \\ll \\min(d, k))$$")',
  )
  const s6ExplainLine = addLine('    text(TWO_MEMORIES_EXPLANATION)')
  const s6RefMem1Line = addLine('    link(BLOG_LLM_TWO_MEMORIES_PART_1)')
  const s6RefMem2Line = addLine('    link(BLOG_BEYOND_CONTEXT_WINDOW_PART_2)')
  const s6RefNldbLine = addLine('    link(KABONGO_NLDB_2024_CONTEXT_SELECTION)')
  const s6LoraIntroLine = addLine('    text(LORA_TRACE_INTRO)')
  const s6LoraCodeLine = addLine(
    '    d, k, r = 4096, 4096, 8; full_params, lora_params = d * k, r * (d + k); compression_ratio = full_params / lora_params  # @inspect full_params lora_params compression_ratio',
  )
  const s6SpeechTitleLine = addLine('    text("### " + CONGOLESE_SPEECH_TITLE)')
  const s6SpeechBodyLine = addLine('    text(CONGOLESE_SPEECH_AND_LISTRA_BODY)')
  const s6RefListraLine = addLine('    link(LISTRA_SPEECH_TRANSLATION)')
  const s6SpeechEqLine = addLine(
    '    text(r"$$P(Y \\mid X_{\\mathrm{audio}}) = \\prod_{t=1}^{T} P\\!\\left(y_t \\mid y_{<t},\\, \\mathrm{AcousticEncoder}(X_{\\mathrm{audio}})\\right)$$")',
  )
  const s6SpeechCodeLine = addLine(
    '    asr_wer, mt_err = 0.28, 0.22; cascade_retention, direct_st_retention = (1 - asr_wer) * (1 - mt_err), 0.71  # @inspect cascade_retention direct_st_retention',
  )
  const s6FrontierLine = addLine('    text(SPEECH_TONE_AND_BENCHMARKS_FRONTIER)')
  const s6RefIrokoLine = addLine('    link(IROKOBENCH_NAACL_2025)')
  const s6RefInjongoLine = addLine('    link(INJONGO_ACL_2025)')
  addLine('')

  // ── Section 7: Recognition (Africa AI 100), SALELA BONGO LLC, DarAkili & Call to Build ──
  const s7DefLine = addLine('def recognition_darakili_and_building_together() -> None:')
  const s7TitleLine = addLine('    text("## " + RECOGNITION_AND_DARAKILI_TITLE)')
  const s7HomeLine = addLine('    text(LUBUMBASHI_HOMECOMING)')
  const s7RecBodyLine = addLine('    text(AFRICA_AI_100_AND_MASAKHANE)')
  const s7RefOxfordLine = addLine('    link(AFRICA_AI_100_2026)')
  const s7RefMasakhaneLine = addLine('    link(MASAKHANE_EMNLP_2020)')
  const s7QuestionLine = addLine('    text(GUIDING_QUESTION)')
  const s7DarakiliLine = addLine('    text(SALELA_BONGO_AND_DARAKILI_MISSION)')
  const s7RefDarakiliLine = addLine('    link(DARAKILI_SALELA_BONGO_LLC)')
  const s7AudioLine = addLine('    text(AUDIO_FIRST_HUMAN_LESSONS)')
  const s7ClosingLine = addLine('    text(CLOSING_FOUR_COMMITMENTS)')
  addLine('')
  addLine('if __name__ == "__main__":  # @hide', { hidden: true })
  addLine('    main()  # @hide', { hidden: true })

  // ── Precompute live numerical trace results ──
  const bpeHistory = runBpeMerges(['kulonga', 'kulonga', 'kulongesha', 'mulongeshi'], 4)
  const anchorVec = [0.86, 0.51, 0.12, -0.04]
  const multimodalItems = [
    ['Text LUA (aligned): "mâyi"', [0.82, 0.56, 0.15, -0.02]],
    ['Audio LN: waveform "mai"', [0.79, 0.46, 0.18, -0.06]],
    ['Image Patch: Congo River', [0.88, 0.43, 0.11, -0.01]],
    ['Video Tubelet: pouring water', [0.76, 0.53, 0.09, -0.08]],
    ['Text LUA (negative): "kapia" (fire)', [-0.45, -0.72, 0.31, 0.22]],
  ]
  const fertilityRows = [
    ['English', 8, 9, '1.12', '1.00x'],
    ['Français', 9, 12, '1.33', '1.78x'],
    ['Kiswahili', 5, 9, '1.80', '2.56x'],
    ['Lingála', 7, 16, '2.29', '3.16x'],
    ['Tshiluba', 8, 21, '2.62', '5.44x'],
  ]

  // ── Build exact execution trace ──
  const mainBase = [frame(mainCallLine, 'main')]
  addStep([frame(mainDefLine, 'main')])
  addStep(mainBase)
  addStep([...mainBase, frame(tocDefLine, 'table_of_contents')])

  // Section 1: Rise of LLMs + Historical Parallel
  const tocS1 = [...mainBase, frame(callS1Line, 'table_of_contents')]
  addStep(tocS1)
  const inS1 = (ln) => [...tocS1, frame(ln, 'the_rise_of_llms_and_history')]
  addStep(inS1(s1DefLine))
  addStep(inS1(s1TitleLine), [md(`# ${c.s1_title}`), note(c.s1_note)])
  addStep(inS1(s1VenueLine), [md(c.s1_venue)])
  addStep(inS1(s1SpeakerLine), [md(c.s1_speaker)])
  addStep(inS1(s1PosterLine), img('images/talks/indabax-drc-2026.jpg', c.s1_poster_caption))
  addStep(inS1(s1WaveTitleLine), [md(`## ${c.s1_wave_title}`)])
  addStep(inS1(s1ResearchLine), [md(c.s1_research_boom)])
  addStep(inS1(s1RefStanfordLine), [refLink(refs, 'stanford_ai_index')])
  addStep(inS1(s1PlotLine), [plot(makeVenueSurgeSpec(c.s1_plot_title))])
  addStep(inS1(s1AppStoreLine), [md(c.s1_appstore_boom)])
  addStep(inS1(s1RefSensorLine), [refLink(refs, 'sensor_tower_ai_apps')])
  addStep(inS1(s1RefAppfigLine), [refLink(refs, 'appfigures_ai_apps')])
  addStep(inS1(s1HistTitleLine), [md(`### ${c.s1_history_title}`)])
  addStep(inS1(s1HistBodyLine), [md(c.s1_history_body)])
  addStep(inS1(s1RefGrinsztajnLine), [refLink(refs, 'grinsztajn_2022')])
  addStep(inS1(s1HistTakeawayLine), [md(c.s1_history_takeaway)])
  addStep(tocS1)

  // Section 2: Crawl, Walk, Run, Fly
  const tocS2 = [...mainBase, frame(callS2Line, 'table_of_contents')]
  addStep(tocS2)
  const inS2 = (ln) => [...tocS2, frame(ln, 'crawl_walk_run_fly')]
  const [stageH, ...stageR] = c.s2_stages_table
  addStep(inS2(s2DefLine))
  addStep(inS2(s2TitleLine), [md(`## ${c.s2_title}`), note(c.s2_note)])
  addStep(inS2(s2ParadoxLine), [md(c.s2_paradox)])
  addStep(inS2(s2ShortcutLine), [md(c.s2_shortcut_nuance)])
  addStep(inS2(s2TrapLine), [md(c.s2_trap)])
  addStep(inS2(s2TableLine), [md(formatAsciiTable(stageH, stageR))])
  addStep(inS2(s2TakeawayLine), [md(c.s2_takeaway)])
  addStep(tocS2)

  // Section 3: Conditional Probability Machines
  const tocS3 = [...mainBase, frame(callS3Line, 'table_of_contents')]
  addStep(tocS3)
  const inS3 = (ln) => [...tocS3, frame(ln, 'conditional_probability_machines')]
  addStep(inS3(s3DefLine))
  addStep(inS3(s3TitleLine), [md(`## ${c.s3_title}`)])
  addStep(inS3(s3IntroLine), [md(c.s3_intro)])
  addStep(inS3(s3BarLine), [md(c.s3_bar_intuition)])
  addStep(inS3(s3AutoregEqLine), [
    md(
      '$$P&#95;{\\theta}(y&#95;{1}, \\dots, y&#95;{T} \\mid \\mathrm{context}) = \\prod&#95;{t=1}^{T} P&#95;{\\theta}\\!\\left(y&#95;{t} \\;\\middle|\\; \\mathrm{context},\\, y&#95;{1}, \\dots, y&#95;{t-1}\\right)$$',
    ),
  ])
  addStep(inS3(s3NarrowLine), [md(c.s3_narrow_world)])
  addStep(inS3(s3BayesEqLine), [
    md(
      '$$P(A \\mid B) = \\frac{|A \\cap B|}{|B|} = \\frac{P(A \\cap B)}{P(B)}, \\qquad P&#95;{\\theta}(x&#95;{t} = v \\mid x&#95;{<t}) = \\frac{\\exp(z&#95;{v} / \\tau)}{\\sum&#95;{u \\in V} \\exp(z&#95;{u} / \\tau)}$$',
    ),
  ])
  addStep(inS3(s3TraceIntroLine), [md(c.s3_trace_intro)])
  addStep(inS3(s3WorldTotalLine), [], { p_max_general: pyFloat(24 / 200) })
  addStep(inS3(s3PuppyLine), [], { p_max_given_puppy: pyFloat(17 / 50) })
  addStep(inS3(s3StartupLine), [], { p_max_given_startup: pyFloat(1 / 80) })
  addStep(inS3(s3FlippedLine), [], { p_puppy_given_max: pyFloat(17 / 24) })
  addStep(inS3(s3PlotLine), [plot(makeConditionalProbSpec(c.s3_plot_title))])
  addStep(inS3(s3BayesTrapLine), [md(c.s3_bayes_trap)])
  addStep(inS3(s3SnowballIntroLine), [md(c.s3_snowball_intro)])
  for (const stepT of [1, 2, 4, 6]) {
    addStep(inS3(s3SnowballLoopLine), [], { step_t: pyInt(stepT) })
    addStep(inS3(s3SnowballCalcLine), [], {
      step_t: pyInt(stepT),
      chain_reliability: pyFloat(0.85 ** stepT),
    })
  }
  addStep(inS3(s3TakeawayLine), [md(c.s3_takeaway)])
  addStep(inS3(s3RefBlogLine), [refLink(refs, 'blog_cond_prob')])
  addStep(tocS3)

  // Section 4: BPE Merge Loop + Tokenization Tax
  const tocS4 = [...mainBase, frame(callS4Line, 'table_of_contents')]
  addStep(tocS4)
  const inS4 = (ln) => [...tocS4, frame(ln, 'bpe_and_the_tokenization_tax')]
  addStep(inS4(s4DefLine))
  addStep(inS4(s4TitleLine), [md(`## ${c.s4_title}`)])
  addStep(inS4(s4IntroLine), [md(c.s4_intro)])
  addStep(inS4(s4HowLine), [md(c.s4_bpe_how)])
  addStep(inS4(s4BpeEqLine), [
    md(
      '$$(a^{\\ast}, b^{\\ast}) = \\arg\\max&#95;{(a, b) \\in V \\times V} \\mathrm{count}(a, b), \\qquad V&#95;{m+1} = V&#95;{m} \\cup \\{a^{\\ast} \\circ b^{\\ast}\\}$$',
    ),
  ])
  addStep(inS4(s4BpeInitLine), [], {
    sample_words: pyList(['k·u·l·o·n·g·a', 'k·u·l·o·n·g·e·s·h·a'].map(pyStr)),
  })
  for (const item of bpeHistory) {
    addStep(inS4(s4BpeLoopLine), [], { merge_step: pyInt(item.mergeStep) })
    addStep(inS4(s4BpeBodyLine), [], {
      merge_step: pyInt(item.mergeStep),
      top_pair: pyStr(item.pair),
      pair_count: pyInt(item.pairCount),
      vocab_size: pyInt(item.vocabSize),
      total_tokens: pyInt(item.totalTokens),
      sample_words: pyList(item.sampleSegmentation.map(pyStr)),
    })
  }
  addStep(inS4(s4TaxQLine), [md(c.s4_tax_question)])
  addStep(inS4(s4TaxDemoLine), [md(c.s4_tax_demo_intro)])
  addStep(inS4(s4FertilityLine), [], {
    fertility_en: pyFloat(9 / 8),
    fertility_fr: pyFloat(12 / 9),
    fertility_sw: pyFloat(9 / 5),
    fertility_ln: pyFloat(16 / 7),
    fertility_lua: pyFloat(21 / 8),
  })
  const taxLua = 21 / 9
  addStep(inS4(s4TaxCalcLine), [], {
    token_tax_lua: pyFloat(taxLua),
    attention_cost_lua: pyFloat(taxLua ** 2),
  })
  addStep(inS4(s4TaxEqLine), [
    md(
      '$$f&#95;{L} = \\frac{T&#95;{L}}{W&#95;{L}}, \\qquad \\tau&#95;{L} = \\frac{T&#95;{L}}{T&#95;{\\mathrm{en}}}, \\qquad \\mathcal{C}&#95;{\\mathrm{attention}}(L) \\propto T&#95;{L}^{2} = \\tau&#95;{L}^{2} \\, T&#95;{\\mathrm{en}}^{2}$$',
    ),
  ])
  addStep(inS4(s4PlotLine), [plot(makeTokenTaxSpec(c.s4_plot_title))])
  addStep(inS4(s4TableLine), [md(formatAsciiTable(c.s4_table_headers, fertilityRows))])
  addStep(inS4(s4BantuTitleLine), [md(`### ${c.s4_bantu_title}`)])
  addStep(inS4(s4BantuBodyLine), [md(c.s4_bantu_body)])
  addStep(inS4(s4ResearchLine), [md(c.s4_research)])
  addStep(tocS4)

  // Section 5: Embeddings Across Text, Image, Audio & Video
  const tocS5 = [...mainBase, frame(callS5Line, 'table_of_contents')]
  addStep(tocS5)
  const inS5 = (ln) => [...tocS5, frame(ln, 'embeddings_across_all_modalities')]
  const [modH, ...modR] = c.s5_modalities_table
  addStep(inS5(s5DefLine))
  addStep(inS5(s5TitleLine), [md(`## ${c.s5_title}`)])
  addStep(inS5(s5IntroLine), [md(c.s5_intro)])
  addStep(inS5(s5MathIntroLine), [md(c.s5_math_intuition)])
  addStep(inS5(s5CosEqLine), [
    md(
      '$$\\mathbf{e} = \\phi(x) \\in \\mathbb{R}^{d}, \\qquad \\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|&#95;{2} \\, \\|\\mathbf{v}\\|&#95;{2}} = \\frac{\\sum&#95;{i=1}^{d} u&#95;{i} v&#95;{i}}{\\sqrt{\\sum&#95;{i=1}^{d} u&#95;{i}^{2}}\\,\\sqrt{\\sum&#95;{i=1}^{d} v&#95;{i}^{2}}}$$',
    ),
  ])
  addStep(inS5(s5ModTitleLine), [md(`### ${c.s5_modalities_title}`)])
  addStep(inS5(s5ModTableLine), [md(formatAsciiTable(modH, modR))])
  addStep(inS5(s5ContrastEqLine), [
    md(
      '$$\\mathcal{L}&#95;{\\mathrm{contrastive}} = -\\log \\frac{\\exp\\!\\left(\\cos(\\mathbf{e}&#95;{i}^{(m&#95;{1})}, \\mathbf{e}&#95;{i}^{(m&#95;{2})}) / \\tau\\right)}{\\sum&#95;{j=1}^{N} \\exp\\!\\left(\\cos(\\mathbf{e}&#95;{i}^{(m&#95;{1})}, \\mathbf{e}&#95;{j}^{(m&#95;{2})}) / \\tau\\right)}, \\qquad \\mathrm{Attention}(Q,K,V)=\\mathrm{softmax}\\!\\left(\\frac{QK^{\\top}}{\\sqrt{d&#95;{k}}}\\right)V$$',
    ),
  ])
  addStep(inS5(s5TraceIntroLine), [md(c.s5_trace_intro)])
  addStep(inS5(s5AnchorLine))
  for (const [label, vec] of multimodalItems) {
    addStep(inS5(s5ModLoopLine), [], { modality_item: pyStr(label) })
    addStep(inS5(s5ModCalcLine), [], {
      modality_item: pyStr(label),
      sim_to_anchor: pyFloat(cosine(anchorVec, vec)),
    })
  }
  addStep(inS5(s5CompareBpeLine), [], {
    sim_unadapted_mayi: pyFloat(0.1892),
    sim_aligned_mayi: pyFloat(0.9614),
  })
  addStep(inS5(s5PlotLine), [plot(makeMultimodalEmbeddingSpec(c.s5_plot_title))])
  addStep(inS5(s5WhyFirstLine), [md(c.s5_why_walk_first)])
  addStep(tocS5)

  // Section 6: Two Memories & Congolese Speech
  const tocS6 = [...mainBase, frame(callS6Line, 'table_of_contents')]
  addStep(tocS6)
  const inS6 = (ln) => [...tocS6, frame(ln, 'two_memories_and_congolese_speech')]
  addStep(inS6(s6DefLine))
  addStep(inS6(s6TitleLine), [md(`## ${c.s6_title}`)])
  addStep(inS6(s6IntroLine), [md(c.s6_intro)])
  addStep(inS6(s6TwoMemEqLine), [
    md(
      '$$p&#95;{\\theta}(\\mathrm{answer} \\mid \\mathrm{context}), \\qquad T&#95;{W}(\\mathrm{context},\\, x) = T&#95;{W + \\Delta W}(x), \\qquad W\' = W + BA \\;\\; (r \\ll \\min(d, k))$$',
    ),
  ])
  addStep(inS6(s6ExplainLine), [md(c.s6_two_memories_explain)])
  addStep(inS6(s6RefMem1Line), [refLink(refs, 'blog_two_memories')])
  addStep(inS6(s6RefMem2Line), [refLink(refs, 'blog_beyond_context')])
  addStep(inS6(s6RefNldbLine), [refLink(refs, 'nldb_2024')])
  addStep(inS6(s6LoraIntroLine), [md(c.s6_lora_trace)])
  addStep(inS6(s6LoraCodeLine), [], {
    full_params: pyInt(4096 * 4096),
    lora_params: pyInt(8 * (4096 + 4096)),
    compression_ratio: pyFloat((4096 * 4096) / (8 * 8192)),
  })
  addStep(inS6(s6SpeechTitleLine), [md(`### ${c.s6_speech_title}`)])
  addStep(inS6(s6SpeechBodyLine), [md(c.s6_speech_body)])
  addStep(inS6(s6RefListraLine), [refLink(refs, 'listra_2022')])
  addStep(inS6(s6SpeechEqLine), [
    md(
      '$$P(Y \\mid X&#95;{\\mathrm{audio}}) = \\prod&#95;{t=1}^{T} P\\!\\left(y&#95;{t} \\mid y&#95;{<t},\\, \\mathrm{AcousticEncoder}(X&#95;{\\mathrm{audio}})\\right)$$',
    ),
  ])
  addStep(inS6(s6SpeechCodeLine), [], {
    cascade_retention: pyFloat((1 - 0.28) * (1 - 0.22)),
    direct_st_retention: pyFloat(0.71),
  })
  addStep(inS6(s6FrontierLine), [md(c.s6_speech_frontier)])
  addStep(inS6(s6RefIrokoLine), [refLink(refs, 'irokobench_2025')])
  addStep(inS6(s6RefInjongoLine), [refLink(refs, 'injongo_2025')])
  addStep(tocS6)

  // Section 7: Recognition (Africa AI 100), SALELA BONGO LLC, DarAkili & Call to Build
  const tocS7 = [...mainBase, frame(callS7Line, 'table_of_contents')]
  addStep(tocS7)
  const inS7 = (ln) => [...tocS7, frame(ln, 'recognition_darakili_and_building_together')]
  addStep(inS7(s7DefLine))
  addStep(inS7(s7TitleLine), [md(`## ${c.s7_title}`)])
  addStep(inS7(s7HomeLine), [md(c.s7_homecoming)])
  addStep(inS7(s7RecBodyLine), [md(c.s7_recognition_body)])
  addStep(inS7(s7RefOxfordLine), [refLink(refs, 'africa_ai_100')])
  addStep(inS7(s7RefMasakhaneLine), [refLink(refs, 'masakhane_2020')])
  addStep(inS7(s7QuestionLine), [md(c.s7_core_question)])
  addStep(inS7(s7DarakiliLine), [md(c.s7_darakili)])
  addStep(
    inS7(s7RefDarakiliLine),
    [refLink(refs, 'darakili')],
    {
      company: pyStr('SALELA BONGO LLC'),
      platform: pyStr('DarAkili (darakili.com)'),
      recognition: pyStr('Africa AI 100 (2026) — Portrait 24/100'),
      languages: pyDict({
        ln: pyStr('Lingála'),
        lua: pyStr('Tshiluba'),
        sw: pyStr('Kiswahili'),
      }),
    },
  )
  addStep(inS7(s7AudioLine), [md(c.s7_audio_human)])
  addStep(inS7(s7ClosingLine), [md(c.s7_closing)])
  addStep(tocS7)

  const langObj = PRESENTATION_META.languages.find((l) => l.code === langCode)

  return {
    files: {
      [sourcePath]: lines.join('\n') + '\n',
    },
    hidden_line_numbers: {
      [sourcePath]: hiddenLines,
    },
    steps,
    metadata: {
      schema_version: 2,
      course: {
        id: PRESENTATION_META.courseId,
        title: PRESENTATION_META.courseTitles[langCode] ?? PRESENTATION_META.courseTitles.en,
      },
      lesson: {
        id: PRESENTATION_META.lessonId,
        title: PRESENTATION_META.lessonTitles[langCode] ?? PRESENTATION_META.lessonTitles.en,
      },
      language: langObj,
      supported_languages: PRESENTATION_META.languages,
      function_names: PRESENTATION_META.functionNames[langCode] ?? {},
      videos: [],
      inspect_math: PRESENTATION_META.inspectMath,
    },
  }
}

for (const { code } of PRESENTATION_META.languages) {
  const trace = buildLanguageTrace(code)
  const outDir = path.join(OUT_ROOT, code)
  fs.mkdirSync(outDir, { recursive: true })
  const outFile = path.join(outDir, `${PRESENTATION_META.lessonId}.json`)
  fs.writeFileSync(outFile, JSON.stringify(trace), 'utf-8')
  console.log(
    `Built ${code}/${PRESENTATION_META.lessonId}.json (${trace.steps.length} steps)`,
  )
}
