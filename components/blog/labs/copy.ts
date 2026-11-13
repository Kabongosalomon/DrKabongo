// Every word the labs show, in both languages the post is written in.
// `Record<LabLocale, …>` makes a missing French string a type error.

import type { ContextId, Name } from './conditionModel'
import type { Context, EventId } from './givenModel'
import type { Fit, Home, ItemId } from './memoryModel'

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

// ── Post: "Your LLM has two memories" ──────────────────────────────────────

interface DriftCopy {
  eyebrow: string
  title: string
  intro: string
  worldLabel: string
  worldHint: string
  month: (month: number, total: number) => string
  play: string
  pause: string
  replay: string
  retrain: string
  auto: string
  reset: string
  legendBuys: string
  legendNot: string
  legendWrong: string
  legendModel: string
  legendReality: string
  scoreLabel: string
  accuracyNow: string
  frozenWouldBe: string
  retrainCount: string
  chartLabel: string
  chartYours: string
  chartFrozen: string
  /** One line under the score, chosen by what just happened. */
  status: {
    start: string
    drifting: (lost: number) => string
    retrained: (from: string, to: string) => string
    auto: string
    end: (yours: string, frozen: string) => string
  }
  pct: (value: number) => string
  disclaimer: string
}

interface MemoryCopy {
  eyebrow: string
  title: string
  intro: string
  presetsLabel: string
  presets: Record<'allContext' | 'allWeights' | 'byKind', string>
  homes: Record<Home, { name: string; note: string }>
  empty: string
  itemsLabel: string
  items: Record<ItemId, { name: string; short: string; verdict: Record<Home, string> }>
  fit: Record<Fit, string>
  tokensLabel: string
  tokensUnit: string
  placedLabel: string
  placedOf: (n: number, total: number) => string
  summary: Record<'allContext' | 'allWeights' | 'byKind' | 'mixed', string>
  number: (value: number) => string
  disclaimer: string
}

export const driftCopy: Record<LabLocale, DriftCopy> = {
  en: {
    eyebrow: 'Interactive · a real model, a toy world',
    title: 'The world moves. Does the model?',
    intro:
      'Each dot is a customer. The model drew one line to separate those who buy from those who don’t, and it was right 96% of the time. Now let time pass.',
    worldLabel: '1 · Watch behaviour drift',
    worldHint:
      'The customers stay where they are. What they do changes a little every month. The model’s line only moves if you retrain it.',
    month: (month, total) => `Month ${month} of ${total}`,
    play: 'Let time pass',
    pause: 'Pause',
    replay: 'Play again',
    retrain: 'Retrain on this month’s data',
    auto: 'Retrain every month',
    reset: 'Start over',
    legendBuys: 'Buys',
    legendNot: 'Doesn’t buy',
    legendWrong: 'The model gets this one wrong',
    legendModel: 'Where the model draws the line',
    legendReality: 'Where the line really is today',
    scoreLabel: '2 · Keep score',
    accuracyNow: 'Right this month',
    frozenWouldBe: 'Never retrained',
    retrainCount: 'Times retrained',
    chartLabel: 'Accuracy, month by month',
    chartYours: 'Your model',
    chartFrozen: 'Never retrained',
    status: {
      start: 'Month 0. The model was trained on today’s customers, so the two lines agree.',
      drifting: (lost) =>
        `Nothing in the model changed. The customers did, and it has lost ${lost} points since it shipped.`,
      retrained: (from, to) =>
        `Retrained: ${from} → ${to}. Same code, same customers. The weights were adjusted to what people do now.`,
      auto: 'Retrained every month on the month that just ended. It is always a step behind, and it stays good.',
      end: (yours, frozen) =>
        yours === frozen
          ? `After 18 months without retraining: ${frozen}. For a yes-or-no question, that is a coin flip.`
          : `After 18 months: ${yours} with retraining, ${frozen} without.`,
    },
    pct: (value) => `${Math.round(value)}%`,
    disclaimer:
      'The world is a toy: two features, and behaviour that turns 5 degrees a month. The model is real: a logistic regression, trained in your browser by gradient descent on 400 customers and scored on the 200 you see, which it never trained on.',
  },
  fr: {
    eyebrow: 'Interactif · un vrai modèle, un monde jouet',
    title: 'Le monde bouge. Et le modèle ?',
    intro:
      'Chaque point est un client. Le modèle a tracé une ligne pour séparer ceux qui achètent de ceux qui n’achètent pas, et il avait raison 96 % du temps. Laissez maintenant passer le temps.',
    worldLabel: '1 · Regardez les comportements dériver',
    worldHint:
      'Les clients ne bougent pas. Ce qu’ils font change un peu chaque mois. La ligne du modèle ne bouge que si vous le réentraînez.',
    month: (month, total) => `Mois ${month} sur ${total}`,
    play: 'Laisser passer le temps',
    pause: 'Pause',
    replay: 'Rejouer',
    retrain: 'Réentraîner sur les données du mois',
    auto: 'Réentraîner chaque mois',
    reset: 'Recommencer',
    legendBuys: 'Achète',
    legendNot: 'N’achète pas',
    legendWrong: 'Le modèle se trompe sur celui-ci',
    legendModel: 'Là où le modèle trace la ligne',
    legendReality: 'Là où la ligne se trouve vraiment aujourd’hui',
    scoreLabel: '2 · Tenez le score',
    accuracyNow: 'Juste ce mois-ci',
    frozenWouldBe: 'Jamais réentraîné',
    retrainCount: 'Réentraînements',
    chartLabel: 'Précision, mois après mois',
    chartYours: 'Votre modèle',
    chartFrozen: 'Jamais réentraîné',
    status: {
      start:
        'Mois 0. Le modèle a été entraîné sur les clients d’aujourd’hui : les deux lignes coïncident.',
      drifting: (lost) =>
        `Rien n’a changé dans le modèle. Les clients, si : il a perdu ${lost} points depuis sa mise en service.`,
      retrained: (from, to) =>
        `Réentraîné : ${from} → ${to}. Même code, mêmes clients. Les poids ont été ajustés à ce que les gens font maintenant.`,
      auto: 'Réentraîné chaque mois sur le mois qui vient de finir. Il a toujours un temps de retard, et il reste bon.',
      end: (yours, frozen) =>
        yours === frozen
          ? `Après 18 mois sans réentraînement : ${frozen}. Pour une question à deux réponses, c’est pile ou face.`
          : `Après 18 mois : ${yours} avec réentraînement, ${frozen} sans.`,
    },
    pct: (value) => `${Math.round(value)} %`,
    disclaimer:
      'Le monde est un jouet : deux variables, et des comportements qui tournent de 5 degrés par mois. Le modèle est réel : une régression logistique, entraînée dans votre navigateur par descente de gradient sur 400 clients et évaluée sur les 200 que vous voyez, qu’elle n’a jamais vus à l’entraînement.',
  },
}

export const memoryCopy: Record<LabLocale, MemoryCopy> = {
  en: {
    eyebrow: 'Interactive · illustrative demo',
    title: 'Six lessons. Two memories. Where does each one go?',
    intro:
      'A support assistant for an online shop. Six things the business has learned. Most teams put all six in the context, because the weights are frozen. Move them around and see what each choice costs.',
    presetsLabel: 'Quick starts',
    presets: {
      allContext: 'All in the context (today)',
      allWeights: 'All in the weights',
      byKind: 'Split by kind',
    },
    homes: {
      context: { name: 'Context', note: 'Read again on every call' },
      weights: { name: 'Weights', note: 'Learned once, by training' },
    },
    empty: 'Nothing here',
    itemsLabel: 'The six lessons',
    items: {
      prices: {
        name: 'This week’s price list',
        short: 'Prices',
        verdict: {
          context:
            'Change the file and the next answer is right. The model can also show where the price came from.',
          weights:
            'Out of date by next week, and changing one number means a training run. The old price can still come out.',
        },
      },
      order: {
        name: 'One customer’s order status',
        short: 'Order status',
        verdict: {
          context: 'Fetched by a tool at the moment it is needed, for this customer only.',
          weights:
            'Live and private. Train on it and you bake one customer’s data into a model that everyone else uses.',
        },
      },
      policy: {
        name: 'The returns policy that changed on Monday',
        short: 'Returns policy',
        verdict: {
          context: 'In force the minute you update the document. Easy to audit, easy to roll back.',
          weights:
            'Fine-tuning is poor at overwriting a fact. The old rule and the new one end up competing.',
        },
      },
      tone: {
        name: 'The house style: how a reply should sound',
        short: 'House style',
        verdict: {
          context:
            'A style rule is easy to state and hard to follow. So you paste 40 example replies, and pay for them on every call.',
          weights:
            'Stable, and learned by imitation. A few hundred approved replies teach it once. The prompt gets short again.',
        },
      },
      routing: {
        name: 'Which of 40 teams gets a ticket, from 20,000 past tickets',
        short: 'Ticket routing',
        verdict: {
          context:
            'You can retrieve ten similar tickets per call. The other 19,990 teach the model nothing.',
          weights:
            'This is plain supervised learning. Every resolved ticket is a labelled example, and all 20,000 count.',
        },
      },
      edits: {
        name: '3,000 drafts your reviewers corrected last quarter',
        short: 'Reviewer edits',
        verdict: {
          context:
            'You can boil them down to a page of rules. The page keeps what was easy to say and loses the rest.',
          weights:
            'Draft in, corrected version out: that is training data. It is the feedback loop classic ML always had.',
        },
      },
    },
    fit: { good: 'Fits', strained: 'Strained', wrong: 'Wrong place' },
    tokensLabel: 'Re-read on every call',
    tokensUnit: 'tokens',
    placedLabel: 'In a home that suits them',
    placedOf: (n, total) => `${n} of ${total}`,
    summary: {
      allContext:
        'Today’s default. It works, and the facts are where they belong. But three lessons that need thousands of examples are squeezed into a few pages, and you pay for those pages on every call.',
      allWeights:
        'The prompt is empty, and three things are now wrong: prices go stale, a rule can’t be changed by Monday, and private data is inside the model.',
      byKind:
        'Facts that change stay in the context. Behaviour learned from examples moves into the weights. The prompt is seven times shorter and nothing is in the wrong place.',
      mixed: 'Keep going: try to get all six into a home that suits them.',
    },
    number: (value) => value.toLocaleString('en-US'),
    disclaimer:
      'An illustration. The token counts are rough, round figures and the verdicts are simplified. The split itself follows published comparisons: retrieval is the better home for facts, training for behaviour learned from many examples.',
  },
  fr: {
    eyebrow: 'Interactif · démo illustrative',
    title: 'Six leçons. Deux mémoires. Où ranger chacune ?',
    intro:
      'Un assistant de support pour une boutique en ligne. Six choses que l’entreprise a apprises. La plupart des équipes mettent les six dans le contexte, parce que les poids sont gelés. Déplacez-les et voyez ce que coûte chaque choix.',
    presetsLabel: 'Départs rapides',
    presets: {
      allContext: 'Tout dans le contexte (aujourd’hui)',
      allWeights: 'Tout dans les poids',
      byKind: 'Répartir par nature',
    },
    homes: {
      context: { name: 'Contexte', note: 'Relu à chaque appel' },
      weights: { name: 'Poids', note: 'Appris une fois, par entraînement' },
    },
    empty: 'Rien ici',
    itemsLabel: 'Les six leçons',
    items: {
      prices: {
        name: 'La liste de prix de la semaine',
        short: 'Prix',
        verdict: {
          context:
            'Modifiez le fichier et la réponse suivante est juste. Le modèle peut aussi montrer d’où vient le prix.',
          weights:
            'Périmée dès la semaine prochaine, et changer un chiffre demande un entraînement. L’ancien prix peut encore ressortir.',
        },
      },
      order: {
        name: 'Le statut de la commande d’un client',
        short: 'Statut de commande',
        verdict: {
          context: 'Récupéré par un outil au moment où on en a besoin, pour ce client seulement.',
          weights:
            'Vivant et privé. L’entraîner, c’est graver les données d’un client dans un modèle que tous les autres utilisent.',
        },
      },
      policy: {
        name: 'La politique de retour, modifiée lundi',
        short: 'Politique de retour',
        verdict: {
          context:
            'En vigueur dès que vous mettez le document à jour. Facile à auditer, facile à annuler.',
          weights:
            'Le fine-tuning écrase mal un fait. L’ancienne règle et la nouvelle se retrouvent en concurrence.',
        },
      },
      tone: {
        name: 'Le style maison : le ton d’une réponse',
        short: 'Style maison',
        verdict: {
          context:
            'Une règle de style est facile à énoncer et difficile à suivre. On colle donc 40 réponses modèles, et on les paie à chaque appel.',
          weights:
            'Stable, et appris par imitation. Quelques centaines de réponses validées l’enseignent une fois. Le prompt redevient court.',
        },
      },
      routing: {
        name: 'Laquelle des 40 équipes reçoit un ticket, d’après 20 000 tickets passés',
        short: 'Routage des tickets',
        verdict: {
          context:
            'On peut retrouver dix tickets similaires par appel. Les 19 990 autres n’apprennent rien au modèle.',
          weights:
            'C’est de l’apprentissage supervisé classique. Chaque ticket résolu est un exemple étiqueté, et les 20 000 comptent.',
        },
      },
      edits: {
        name: '3 000 brouillons corrigés par vos relecteurs le trimestre dernier',
        short: 'Corrections',
        verdict: {
          context:
            'On peut les résumer en une page de règles. La page garde ce qui était facile à dire et perd le reste.',
          weights:
            'Brouillon en entrée, version corrigée en sortie : ce sont des données d’entraînement. C’est la boucle de retour que le ML classique a toujours eue.',
        },
      },
    },
    fit: { good: 'À sa place', strained: 'À l’étroit', wrong: 'Mauvais endroit' },
    tokensLabel: 'Relu à chaque appel',
    tokensUnit: 'tokens',
    placedLabel: 'Rangées au bon endroit',
    placedOf: (n, total) => `${n} sur ${total}`,
    summary: {
      allContext:
        'Le choix par défaut aujourd’hui. Cela fonctionne, et les faits sont à leur place. Mais trois leçons qui demandent des milliers d’exemples sont compressées en quelques pages, et ces pages se paient à chaque appel.',
      allWeights:
        'Le prompt est vide, et trois choses ne vont plus : les prix se périment, une règle ne peut pas changer pour lundi, et des données privées sont dans le modèle.',
      byKind:
        'Les faits qui changent restent dans le contexte. Les comportements appris par l’exemple passent dans les poids. Le prompt est sept fois plus court et rien n’est au mauvais endroit.',
      mixed: 'Continuez : essayez de ranger les six au bon endroit.',
    },
    number: (value) => value.toLocaleString('fr-FR'),
    disclaimer:
      'Une illustration. Les nombres de tokens sont des ordres de grandeur arrondis et les verdicts sont simplifiés. La répartition, elle, suit les comparaisons publiées : la recherche documentaire convient mieux aux faits, l’entraînement aux comportements appris à partir de nombreux exemples.',
  },
}
