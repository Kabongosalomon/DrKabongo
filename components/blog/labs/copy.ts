// Every word the two labs show, in both languages the post is written in.
// `Record<LabLocale, …>` makes a missing French string a type error.

import type { ContextId, Name } from './conditionModel'
import type { Context, EventId } from './givenModel'

export type LabLocale = 'en' | 'fr'

/** Posts exist in English and French; any other language shows the English text. */
export const labLocale = (locale: string): LabLocale => (locale === 'fr' ? 'fr' : 'en')

type Role = 'system' | 'earlier'

interface ConditionCopy {
  eyebrow: string
  title: string
  buildLabel: string
  buildHint: string
  presetsLabel: string
  presets: Record<'none' | 'puppy' | 'startup' | 'conflict', string>
  roles: Record<Role | 'now', string>
  contexts: Record<ContextId, { role: Role; text: string }>
  addLine: string
  removeLine: string
  request: string
  locked: string
  wordsChanged: string
  linesAdded: string
  notYet: string
  resultLabel: string
  resultHint: string
  names: Record<Name, string>
  legendBar: string
  legendTick: string
  topLine: (name: string, pct: string, baseline: string) => string
  /** Shown instead of `topLine` when no context line is on: nothing stands out. */
  flatLine: (name: string, pct: string) => string
  pct: (value: number) => string
  drawButton: string
  drawHint: string
  drawResult: string
  drawOther: string
  disclaimer: string
}

interface GivenCopy {
  eyebrow: string
  title: string
  intro: string
  eventLabel: string
  givenLabel: string
  givenNone: string
  /**
   * `chip` finishes "The chance that…", `given` finishes "…given that…" (French
   * needs the subjunctive for one and the indicative for the other), `short` is
   * the name used inside P( … | … ), and `long` is the full clause for the sentence.
   */
  events: Record<EventId, { chip: string; given: string; short: string; long: string }>
  bands: Record<Context, string>
  legendHit: string
  legendRest: string
  legendOut: string
  readoutLabel: string
  /** "In 50 conversations, the context mentions a puppy. In 17 of them, the answer is “Max”." */
  sentence: (given: string | null, total: number, both: number, event: string) => string
  formulaLabel: string
  flipLabel: string
  flipButton: string
  asymmetry: string
  never: string
  noCondition: string
  pct: (value: number) => string
  disclaimer: string
}

export const conditionCopy: Record<LabLocale, ConditionCopy> = {
  en: {
    eyebrow: 'Interactive · illustrative demo',
    title: 'Same request. Change the condition.',
    buildLabel: '1 · Build the condition',
    buildHint:
      'Tap a line to put it earlier in the conversation. Tap it again to take it out. The last line is fixed.',
    presetsLabel: 'Quick starts',
    presets: {
      none: 'No context',
      puppy: 'Puppy',
      startup: 'Cybersecurity startup',
      conflict: 'Puppy + branding consultant',
    },
    roles: { system: 'System, hidden', earlier: 'Earlier message', now: 'You, now' },
    contexts: {
      brand: {
        role: 'system',
        text: 'You are a branding consultant. Suggest company names.',
      },
      puppy: { role: 'earlier', text: 'I just adopted a golden retriever puppy.' },
      startup: { role: 'earlier', text: 'We’re launching a cybersecurity startup.' },
    },
    addLine: 'Add to the conversation:',
    removeLine: 'Remove from the conversation:',
    request: 'Suggest a name.',
    locked: 'Locked. The request never changes.',
    wordsChanged: 'Words of the request changed',
    linesAdded: 'Lines of context added',
    notYet: 'Not in the conversation yet',
    resultLabel: '2 · What the model is likely to say',
    resultHint: 'If it answers with a name, how likely is each one?',
    names: {
      max: 'Max',
      bella: 'Bella',
      sunny: 'Sunny',
      nova: 'Nova',
      alex: 'Alex',
      sentinel: 'Sentinel',
      bastion: 'Bastion',
      cipher: 'Cipher',
      other: 'Other names',
    },
    legendBar: 'With your condition',
    legendTick: 'With no context',
    topLine: (name, pct, baseline) =>
      `Most likely: ${name}, ${pct}. With no context, ${name} had ${baseline}.`,
    flatLine: (name, pct) =>
      `Nothing to go on, so nothing stands out: even the best guess, ${name}, gets only ${pct}.`,
    pct: (value) => (value < 1 ? '<1%' : `${Math.round(value)}%`),
    drawButton: 'Ask the model 10 times',
    drawHint:
      'Each ask is one random draw from the bars above. Same request, same model, different answers.',
    drawResult: 'In 10 asks',
    drawOther: 'another name',
    disclaimer:
      'An illustrative demo, not a live model. The probabilities are hand-written to show the mechanism. A real model spreads them over tens of thousands of possible words and reads far longer conditions.',
  },
  fr: {
    eyebrow: 'Interactif · démo illustrative',
    title: 'Même demande. Changez la condition.',
    buildLabel: '1 · Construisez la condition',
    buildHint:
      'Touchez une ligne pour la placer plus tôt dans la conversation. Touchez-la encore pour la retirer. La dernière ligne est fixe.',
    presetsLabel: 'Départs rapides',
    presets: {
      none: 'Aucun contexte',
      puppy: 'Chiot',
      startup: 'Startup de cybersécurité',
      conflict: 'Chiot + consultant en marque',
    },
    roles: { system: 'Système, caché', earlier: 'Message précédent', now: 'Vous, maintenant' },
    contexts: {
      brand: {
        role: 'system',
        text: 'Vous êtes un consultant en image de marque. Proposez des noms d’entreprise.',
      },
      puppy: { role: 'earlier', text: 'Je viens d’adopter un chiot golden retriever.' },
      startup: { role: 'earlier', text: 'On lance une startup de cybersécurité.' },
    },
    addLine: 'Ajouter à la conversation :',
    removeLine: 'Retirer de la conversation :',
    request: 'Suggérez un nom.',
    locked: 'Verrouillée. La demande ne change jamais.',
    wordsChanged: 'Mots de la demande modifiés',
    linesAdded: 'Lignes de contexte ajoutées',
    notYet: 'Pas encore dans la conversation',
    resultLabel: '2 · Ce que le modèle risque de répondre',
    resultHint: 'S’il répond par un nom, quelle est la probabilité de chacun ?',
    names: {
      max: 'Max',
      bella: 'Bella',
      sunny: 'Sunny',
      nova: 'Nova',
      alex: 'Alex',
      sentinel: 'Sentinelle',
      bastion: 'Bastion',
      cipher: 'Cipher',
      other: 'Autres noms',
    },
    legendBar: 'Avec votre condition',
    legendTick: 'Sans contexte',
    topLine: (name, pct, baseline) =>
      `Le plus probable : ${name}, ${pct}. Sans contexte, ${name} avait ${baseline}.`,
    flatLine: (name, pct) =>
      `Rien sur quoi s’appuyer, donc rien ne ressort : même la meilleure piste, ${name}, n’obtient que ${pct}.`,
    pct: (value) => (value < 1 ? '< 1 %' : `${Math.round(value)} %`),
    drawButton: 'Interroger le modèle 10 fois',
    drawHint:
      'Chaque essai est un tirage au hasard dans les barres ci-dessus. Même demande, même modèle, réponses différentes.',
    drawResult: 'Sur 10 essais',
    drawOther: 'un autre nom',
    disclaimer:
      'Une démo illustrative, pas un vrai modèle. Les probabilités sont écrites à la main pour montrer le mécanisme. Un vrai modèle les répartit sur des dizaines de milliers de mots possibles et lit des conditions bien plus longues.',
  },
}

export const givenCopy: Record<LabLocale, GivenCopy> = {
  en: {
    eyebrow: 'Interactive · illustrative demo',
    title: 'Narrow the world, then recount.',
    intro:
      'Picture 200 conversations, each one ending with an answer to “Suggest a name.” Pick a question, then add a condition and watch the world shrink.',
    eventLabel: 'The chance that…',
    givenLabel: '…given that…',
    givenNone: 'nothing (all 200)',
    events: {
      'ans-max': {
        chip: 'the answer is Max',
        given: 'the answer is Max',
        short: 'Max',
        long: 'the answer is “Max”',
      },
      'ans-sentinel': {
        chip: 'the answer is Sentinel',
        given: 'the answer is Sentinel',
        short: 'Sentinel',
        long: 'the answer is “Sentinel”',
      },
      'ctx-puppy': {
        chip: 'the context is a puppy',
        given: 'the context is a puppy',
        short: 'puppy',
        long: 'the context mentions a puppy',
      },
      'ctx-startup': {
        chip: 'the context is a startup',
        given: 'the context is a startup',
        short: 'startup',
        long: 'the context is a cybersecurity startup',
      },
    },
    bands: { puppy: 'Puppy', startup: 'Cybersecurity startup', other: 'Other' },
    legendHit: 'The event happens',
    legendRest: 'Condition holds, event doesn’t',
    legendOut: 'Ruled out by the condition',
    readoutLabel: 'Count what is left',
    sentence: (given, total, both, event) =>
      given
        ? `In ${total} conversations, ${given}. In ${both} of them, ${event}.`
        : `Across all ${total} conversations, in ${both} of them, ${event}.`,
    formulaLabel: 'count(both) ÷ count(condition)',
    flipLabel: 'Flip it',
    flipButton: 'Swap the two',
    asymmetry: 'Same two events, a different question, a different answer.',
    never: 'These never happen together in this world, so the chance is 0.',
    noCondition: 'With no condition, we count in the whole world.',
    pct: (value) => (value > 0 && value < 1 ? '<1%' : `${Math.round(value)}%`),
    disclaimer:
      'An imagined set of 200 conversations, built to match the numbers in the first demo. It is a picture of the idea, not data from a real model.',
  },
  fr: {
    eyebrow: 'Interactif · démo illustrative',
    title: 'Réduisez le monde, puis recomptez.',
    intro:
      'Imaginez 200 conversations, chacune terminée par une réponse à « Suggérez un nom. » Choisissez une question, puis ajoutez une condition et regardez le monde rétrécir.',
    eventLabel: 'La probabilité que…',
    givenLabel: '…sachant que…',
    givenNone: 'rien (les 200)',
    events: {
      'ans-max': {
        chip: 'la réponse soit Max',
        given: 'la réponse est Max',
        short: 'Max',
        long: 'la réponse est « Max »',
      },
      'ans-sentinel': {
        chip: 'la réponse soit Sentinelle',
        given: 'la réponse est Sentinelle',
        short: 'Sentinelle',
        long: 'la réponse est « Sentinelle »',
      },
      'ctx-puppy': {
        chip: 'le contexte soit un chiot',
        given: 'le contexte est un chiot',
        short: 'chiot',
        long: 'le contexte mentionne un chiot',
      },
      'ctx-startup': {
        chip: 'le contexte soit une startup',
        given: 'le contexte est une startup',
        short: 'startup',
        long: 'le contexte est une startup de cybersécurité',
      },
    },
    bands: { puppy: 'Chiot', startup: 'Startup de cybersécurité', other: 'Autre' },
    legendHit: 'L’événement se produit',
    legendRest: 'La condition tient, l’événement non',
    legendOut: 'Écarté par la condition',
    readoutLabel: 'Comptez ce qui reste',
    sentence: (given, total, both, event) =>
      given
        ? `Dans ${total} conversations, ${given}. Dans ${both} d’entre elles, ${event}.`
        : `Sur l’ensemble des ${total} conversations, dans ${both} d’entre elles, ${event}.`,
    formulaLabel: 'nombre(les deux) ÷ nombre(condition)',
    flipLabel: 'Inversez',
    flipButton: 'Échanger les deux',
    asymmetry: 'Les mêmes deux événements, une autre question, une autre réponse.',
    never: 'Ces deux-là n’arrivent jamais ensemble dans ce monde : la probabilité est 0.',
    noCondition: 'Sans condition, on compte dans le monde entier.',
    pct: (value) => (value > 0 && value < 1 ? '< 1 %' : `${Math.round(value)} %`),
    disclaimer:
      'Un ensemble imaginaire de 200 conversations, construit pour coller aux chiffres de la première démo. C’est une image de l’idée, pas des données d’un vrai modèle.',
  },
}
