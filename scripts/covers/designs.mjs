// What each post's cover says and shows. One entry per slug, with the wording
// per language. A post with no entry here still gets a cover: its title, set in
// the same frame (see `fallbackDesign` in build.mjs).
//
// Every figure is drawn in a 1080 × 290 box. Keep labels at 26px or larger: the
// cover is shown as small as 300px wide on the home page, a quarter of its
// drawn size.

export const C = {
  paper: '#FBF9F6',
  raised: '#F3F0EA',
  rule: '#E2DCD2',
  ink: '#14120F',
  ink2: '#4A443C',
  ink3: '#7C7469',
  accent: '#7A2E1E',
  accentFill: '#A6371F',
  soft: '#F2E7E2',
}

const svg = (body) =>
  `<svg viewBox="0 0 1080 290" width="1080" height="290" xmlns="http://www.w3.org/2000/svg">${body}</svg>`

const label = (x, y, text, { anchor = 'start', fill = C.ink3 } = {}) =>
  `<text x="${x}" y="${y}" class="mono" font-size="19" letter-spacing="3.4" text-anchor="${anchor}" fill="${fill}">${text}</text>`

// ── Your LLM has two memories ────────────────────────────────────────────────

const twoMemories = (t) =>
  svg(`
  <defs>
    <pattern id="hatch" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="16" stroke="${C.rule}" stroke-width="5"/>
    </pattern>
  </defs>
  ${label(0, 20, t.leftLabel)}
  <rect x="1" y="40" width="508" height="210" rx="10" fill="${C.raised}"/>
  <rect x="1" y="40" width="508" height="210" rx="10" fill="url(#hatch)" stroke="${C.ink3}" stroke-width="2" stroke-dasharray="10 7"/>
  <text x="36" y="182" class="serif" font-style="italic" font-size="130" fill="${C.ink3}">θ</text>
  <text x="150" y="140" class="serif" font-size="46" fill="${C.ink}">${t.weights}</text>
  <text x="150" y="190" class="sans" font-size="30" fill="${C.ink2}">${t.frozen}</text>

  ${label(570, 20, t.rightLabel, { fill: C.accent })}
  <rect x="571" y="40" width="508" height="210" rx="10" fill="${C.accent}"/>
  <text x="606" y="140" class="serif" font-size="46" fill="${C.paper}">${t.context}</text>
  <text x="606" y="190" class="sans" font-size="30" fill="${C.soft}">${t.names}</text>
`)

// ── Beyond the context window ────────────────────────────────────────────────

const beyondWindow = (t) => {
  // The window: a block of tokens, read again in full on every call.
  const cells = []
  const accentCells = new Set([7, 19, 30, 41, 58, 63, 77])
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 21; col++) {
      const index = row * 21 + col
      cells.push(
        `<rect x="${col * 25}" y="${44 + row * 30}" width="19" height="22" rx="3" fill="${accentCells.has(index) ? C.ink3 : C.rule}"/>`,
      )
    }
  }
  return svg(`
  ${label(0, 20, t.windowLabel)}
  ${cells.join('')}
  <text x="0" y="214" class="sans" font-size="30" fill="${C.ink2}">${t.windowNote}</text>

  <line x1="556" y1="103" x2="646" y2="103" stroke="${C.accent}" stroke-width="4"/>
  <path d="M646 89 L672 103 L646 117 Z" fill="${C.accent}"/>

  ${label(712, 20, t.weightsLabel, { fill: C.accent })}
  <rect x="713" y="44" width="150" height="118" rx="6" fill="${C.raised}" stroke="${C.ink2}" stroke-width="2"/>
  <text x="788" y="124" class="serif" font-style="italic" font-size="62" text-anchor="middle" fill="${C.ink}">W</text>
  <text x="895" y="122" class="serif" font-size="50" text-anchor="middle" fill="${C.ink2}">+</text>
  <rect x="928" y="44" width="30" height="118" rx="4" fill="${C.accentFill}"/>
  <rect x="970" y="44" width="110" height="30" rx="4" fill="${C.accentFill}"/>
  <text x="943" y="196" class="serif" font-style="italic" font-size="30" text-anchor="middle" fill="${C.accent}">B</text>
  <text x="1025" y="108" class="serif" font-style="italic" font-size="30" text-anchor="middle" fill="${C.accent}">A</text>
  <text x="712" y="250" class="sans" font-size="30" fill="${C.ink2}">${t.weightsNote}</text>
`)
}

// ── LLMs are conditional probability machines ────────────────────────────────

const conditional = (t) => {
  const rows = [
    { name: t.names[0], left: 34, right: 1 },
    { name: t.names[1], left: 0, right: 29 },
    { name: t.names[2], left: 0, right: 22 },
  ]
  const pct = (value) => (value === 0 ? `&lt;1${t.percent}` : `${value}${t.percent}`)
  const body = rows
    .map((row, i) => {
      const y = 44 + i * 82
      const leftWidth = Math.max(6, row.left * 9.4)
      const rightWidth = Math.max(6, row.right * 9.4)
      return `
      <line x1="0" y1="${y}" x2="1080" y2="${y}" stroke="${C.rule}" stroke-width="2"/>
      <rect x="${420 - leftWidth}" y="${y + 24}" width="${leftWidth}" height="34" fill="${C.ink}"/>
      <text x="${404 - leftWidth}" y="${y + 51}" class="mono" font-size="26" text-anchor="end" fill="${C.ink2}">${pct(row.left)}</text>
      <text x="540" y="${y + 54}" class="serif" font-size="40" text-anchor="middle" fill="${C.ink}">${row.name}</text>
      <rect x="660" y="${y + 24}" width="${rightWidth}" height="34" fill="${C.accentFill}"/>
      <text x="${676 + rightWidth}" y="${y + 51}" class="mono" font-size="26" fill="${C.ink2}">${pct(row.right)}</text>`
    })
    .join('')
  return svg(`
  ${label(420, 22, t.leftLabel, { anchor: 'end', fill: C.ink })}
  ${label(660, 22, t.rightLabel, { fill: C.accent })}
  ${body}
  <line x1="0" y1="290" x2="1080" y2="290" stroke="${C.rule}" stroke-width="2"/>
`)
}

// ── Circular queue ───────────────────────────────────────────────────────────

const circularQueue = (t) => {
  const cx = 150
  const cy = 148
  const outer = 132
  const inner = 74
  const filled = new Set([1, 2, 3, 4])
  const point = (radius, angle) => [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]
  const segments = []
  for (let i = 0; i < 8; i++) {
    const a0 = (i / 8) * 2 * Math.PI - Math.PI / 2
    const a1 = ((i + 1) / 8) * 2 * Math.PI - Math.PI / 2
    const [x0, y0] = point(outer, a0)
    const [x1, y1] = point(outer, a1)
    const [x2, y2] = point(inner, a1)
    const [x3, y3] = point(inner, a0)
    segments.push(
      `<path d="M${x0} ${y0} A${outer} ${outer} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${inner} ${inner} 0 0 0 ${x3} ${y3} Z" fill="${filled.has(i) ? C.accentFill : C.raised}" stroke="${C.paper}" stroke-width="5"/>`,
    )
  }
  return svg(`
  ${segments.join('')}
  <text x="380" y="92" class="serif" font-style="italic" font-size="46" fill="${C.ink}">${t.line1}</text>
  <text x="380" y="148" class="serif" font-style="italic" font-size="46" fill="${C.ink}">${t.line2}</text>
  <rect x="380" y="196" width="30" height="30" rx="4" fill="${C.accentFill}"/>
  <text x="424" y="221" class="sans" font-size="30" fill="${C.ink2}">${t.used}</text>
  <rect x="640" y="196" width="30" height="30" rx="4" fill="${C.raised}" stroke="${C.ink3}" stroke-width="2"/>
  <text x="684" y="221" class="sans" font-size="30" fill="${C.ink2}">${t.free}</text>
`)
}

// ── Mutually exclusive vs. collectively exhaustive ───────────────────────────

const mece = (t) =>
  svg(`
  ${label(0, 20, t.leftLabel)}
  <rect x="1" y="40" width="498" height="210" rx="10" fill="${C.raised}" stroke="${C.ink3}" stroke-width="2"/>
  <circle cx="120" cy="145" r="78" fill="${C.ink}"/>
  <circle cx="300" cy="145" r="78" fill="${C.accentFill}"/>
  <text x="120" y="162" class="serif" font-style="italic" font-size="50" text-anchor="middle" fill="${C.paper}">A</text>
  <text x="300" y="162" class="serif" font-style="italic" font-size="50" text-anchor="middle" fill="${C.paper}">B</text>
  <text x="440" y="232" class="serif" font-size="34" text-anchor="middle" fill="${C.ink3}">Ω</text>

  ${label(580, 20, t.rightLabel, { fill: C.accent })}
  <rect x="581" y="40" width="498" height="210" rx="10" fill="${C.ink}"/>
  <path d="M781 40 H1069 a10 10 0 0 1 10 10 V150 H781 Z" fill="${C.accentFill}"/>
  <path d="M781 150 H1079 V240 a10 10 0 0 1 -10 10 H781 Z" fill="${C.ink3}"/>
  <rect x="581" y="40" width="498" height="210" rx="10" fill="none" stroke="${C.ink}" stroke-width="2"/>
  <text x="681" y="162" class="serif" font-style="italic" font-size="50" text-anchor="middle" fill="${C.paper}">A</text>
  <text x="930" y="112" class="serif" font-style="italic" font-size="50" text-anchor="middle" fill="${C.paper}">B</text>
  <text x="930" y="217" class="serif" font-style="italic" font-size="50" text-anchor="middle" fill="${C.paper}">C</text>
`)

// ── yield in Python ──────────────────────────────────────────────────────────

const yieldInPython = (t) =>
  svg(`
  <rect x="1" y="12" width="560" height="236" rx="10" fill="${C.raised}" stroke="${C.rule}" stroke-width="2"/>
  <text x="34" y="84" class="mono" font-size="30" fill="${C.ink}" xml:space="preserve"><tspan fill="${C.ink3}">def</tspan> table(x):</text>
  <text x="34" y="140" class="mono" font-size="30" fill="${C.ink}" xml:space="preserve">    <tspan fill="${C.ink3}">for</tspan> i <tspan fill="${C.ink3}">in</tspan> range(11):</text>
  <text x="34" y="196" class="mono" font-size="30" fill="${C.ink}" xml:space="preserve">        <tspan fill="${C.accentFill}" font-weight="700">yield</tspan> x * i</text>

  ${[0, 5, 10]
    .map((value, i) => {
      const y = 62 + i * 68
      return `
      <text x="640" y="${y + 10}" class="mono" font-size="28" fill="${C.ink2}">next(gen)</text>
      <line x1="822" y1="${y}" x2="900" y2="${y}" stroke="${C.accent}" stroke-width="4"/>
      <path d="M900 ${y - 12} L924 ${y} L900 ${y + 12} Z" fill="${C.accent}"/>
      <text x="950" y="${y + 15}" class="serif" font-size="48" fill="${C.ink}">${value}</text>`
    })
    .join('')}
  <text x="640" y="262" class="sans" font-size="26" fill="${C.ink3}">${t.note}</text>
`)

// ── A real photograph, for a post about a real trip ──────────────────────────

const photo = (file, position) => () =>
  `<img src="{{public}}${file}" style="display:block;width:1080px;height:290px;object-fit:cover;object-position:${position};border-radius:10px" alt="">`

export const designs = {
  'llm-two-memories': {
    figure: twoMemories,
    en: {
      eyebrow: 'LLMs · Part 1 of 2',
      lines: ['Your LLM has two memories.', 'You’re only using one.'],
      leftLabel: 'PARAMETRIC MEMORY',
      rightLabel: 'NON-PARAMETRIC MEMORY',
      weights: 'The weights',
      frozen: 'frozen',
      context: 'The context',
      names: 'RAG · MCP · agents · memory',
    },
    fr: {
      eyebrow: 'LLM · Partie 1 sur 2',
      lines: ['Votre LLM a deux mémoires.', 'Vous n’en utilisez qu’une.'],
      leftLabel: 'MÉMOIRE PARAMÉTRIQUE',
      rightLabel: 'MÉMOIRE NON PARAMÉTRIQUE',
      weights: 'Les poids',
      frozen: 'gelés',
      context: 'Le contexte',
      names: 'RAG · MCP · agents · mémoire',
    },
  },
  'llm-two-memories-part-2': {
    figure: beyondWindow,
    en: {
      eyebrow: 'LLMs · Part 2 of 2',
      lines: ['Beyond the context window.', 'Teach the model your business.'],
      windowLabel: 'CONTEXT WINDOW',
      windowNote: 'read again on every call',
      weightsLabel: 'WEIGHTS',
      weightsNote: 'learned once, and kept',
    },
    fr: {
      eyebrow: 'LLM · Partie 2 sur 2',
      lines: ['Au-delà de la fenêtre de contexte.', 'Apprenez votre métier au modèle.'],
      windowLabel: 'FENÊTRE DE CONTEXTE',
      windowNote: 'relue à chaque appel',
      weightsLabel: 'POIDS',
      weightsNote: 'appris une fois, et gardé',
    },
  },
  'conditional-probability-machines': {
    figure: conditional,
    en: {
      eyebrow: 'LLMs, reframed',
      lines: ['Not just next-word prediction.', 'A conditional probability machine.'],
      leftLabel: 'GIVEN A PUPPY',
      rightLabel: 'GIVEN A STARTUP',
      names: ['Max', 'Sentinel', 'Bastion'],
      percent: '%',
    },
    fr: {
      eyebrow: 'Les LLM, autrement',
      lines: ['Pas seulement prédire le mot suivant.', 'Une machine à probabilités conditionnelles.'],
      size: 58,
      leftLabel: 'AVEC UN CHIOT',
      rightLabel: 'AVEC UNE STARTUP',
      names: ['Max', 'Sentinelle', 'Bastion'],
      percent: ' %',
    },
  },
  'circular-queue': {
    figure: circularQueue,
    en: {
      eyebrow: 'Data structures',
      lines: ['Circular queue.', 'A ring buffer in Python.'],
      line1: 'A fixed array whose end',
      line2: 'wraps back to its start.',
      used: 'in the queue',
      free: 'free',
    },
  },
  'prob-mutually-exclusive': {
    figure: mece,
    en: {
      eyebrow: 'Probability',
      lines: ['Mutually exclusive.', 'Collectively exhaustive.'],
      leftLabel: 'NEVER BOTH AT ONCE',
      rightLabel: 'NOTHING LEFT OUT',
    },
  },
  'yield-in-python': {
    figure: yieldInPython,
    en: {
      eyebrow: 'Python',
      lines: ['yield in Python.', 'Pause, hand back a value, resume.'],
      note: 'one value at a time, with x = 5',
    },
  },
  hlf: {
    figure: photo('/images/hlf/main.JPG', '50% 53%'),
    format: 'jpg',
    en: {
      eyebrow: 'Heidelberg · September 2019',
      lines: ['Heidelberg Laureate Forum.', 'How a last-minute application got me there.'],
      size: 60,
    },
  },
}
