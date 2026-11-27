<!-- Translation of learning_in_the_llm_era.py (fr). Each block replaces the English slide with the same key.
     Delete a block to show the English text instead. -->

<!-- @title -->
# Apprendre à l'ère des LLM

**Comment nos langues sont-elles devenues « peu dotées » ?**

**Dr. Kabongo** · Deep Learning IndabaX R.D. Congo 2026 · UNH Lubumbashi · 27 novembre 2026

<!-- @inventions -->
## La plupart des inventions sont la réponse de l’ingénierie à une limite

| La limite | La réponse de l’ingénierie | La science en dessous |
| --- | --- | --- |
| La voix ne porte pas loin | Téléphone, radio | Électromagnétisme |
| Nous calculons lentement | Ordinateurs | Logique, physique des semi-conducteurs |
| Trop de règles à écrire à la main | Apprentissage automatique | Probabilités, optimisation |
| Nos langues manquent en ligne | Des ressources numériques ouvertes | Linguistique, statistiques |

<!-- @three_questions -->
### Trois questions pour chaque nouveau mot à la mode

1. À quelle **limite** répond-il ?
2. Quel est le geste d’**ingénierie** ?
3. Quelle **science** y a-t-il en dessous ?

<!-- @llm_era -->
### Le même schéma à l’ère des LLM

| Nom | Le problème | Solution d’ingénierie |
| --- | --- | --- |
| RAG | Le savoir est figé ; vos documents manquent | Chercher, puis coller dans le contexte |
| Outils | Un modèle écrit du texte ; il ne peut pas agir | Le modèle écrit une demande, votre code l’exécute |
| MCP | Chaque application doit se brancher à chaque outil | Un protocole ouvert |
| Skills, plugins, GPT personnalisés | On répète les instructions ; le contexte est limité | Instructions et fichiers enregistrés, chargés au besoin |

<!-- @roadmap -->
| Étape | À apprendre |
| --- | --- |
| Ramper | Probabilités, algèbre linéaire, code |
| Marcher | Tokens, embeddings, évaluation |
| Courir | Modèles locaux, RAG, adaptation |
| Voler | Construire des ressources et des modèles pour nos langues |

**Sauter les fondations n’est pas une bonne idée.**

<!-- @people_title -->
## Comprendre les grands modèles de langage

La réponse d’un LLM dépend de deux choses que vous pouvez changer :

$$p_{\theta}(\text{answer} \mid \text{context})$$

<!-- @levers -->
|  | Le contexte (à droite de la barre) | Les poids θ |
| --- | --- | --- |
| Le métier | Ingénierie : une API, une base de données, un pipeline | Apprentissage automatique : données, courbes de perte, évaluation |
| Les noms | RAG, outils, MCP, skills | Entraînement, fine-tuning, LoRA |

<!-- @where_the_people_were -->
> **Les progrès des trois dernières années ont eu lieu là où étaient les gens.**

Or la plupart de ces personnes sont des ingénieurs : environ **50 millions d’ingénieurs logiciels** pour **5 000 chercheurs en LLM** (une estimation approximative de 2023). Dans une enquête de 2024 auprès de 600 décideurs d’entreprise aux États-Unis, **51 %** avaient adopté le **RAG**, tandis que seulement **9 %** des modèles en production étaient **fine-tunés**.

L’ingénierie est remarquable. Mais le côté des poids a reçu peu d’efforts : le prochain grand gain viendra plus probablement de là.

<!-- @our_languages -->
Pour nos langues, c’est décisif : le RAG demande des documents et les outils des tests, mais **aucun n’apprend à un modèle le swahili, le lingala, le kikongo ou le tshiluba, et aucun ne crée de données linguistiques**. Il faut des données et des personnes capables de travailler sur les poids. **Cela peut être vous.**

<!-- @low_resource -->
## Comment nos langues sont-elles devenues « peu dotées » ?

**Pas parce que personne ne les parle.** Des millions de personnes rêvent, débattent, prient, commercent et élèvent leurs enfants en lingala, tshiluba, swahili et dans des centaines d’autres langues.

<!-- @data_classes -->
En IA, « peu dotée » ne veut pas dire peu de locuteurs. Cela veut dire **peu de données numériques**, et les deux ne vont pas de pair :

> **88 %** des langues du monde, parlées par environ **1 milliard de personnes**, sont encore « laissées de côté » par les technologies du langage.

<!-- @where_we_wrote -->
Pourquoi ? Pendant des générations, les parties « sérieuses » de la vie se sont passées en français, en anglais ou en portugais : l’école, la science, l’administration, les affaires et maintenant internet. Nos langues sont restées à la maison, au marché, à l’église, au téléphone.

> **Parlées, pas conservées. Vécues, pas numérisées.**

<!-- @where_machines_learn -->
| Où les machines apprennent | Français ou anglais | Nos langues |
| --- | --- | --- |
| Livres et bibliothèques | Beaucoup | Peu |
| École et université | Par défaut | Rare |
| Administration et droit | Par défaut | Rare |
| Sites web | Des milliards de pages | Très peu |

<!-- @daily_life_online -->
L’anglais n’est pas bien doté parce que quelqu’un a financé un jeu de données. Il l’est parce que **la vie quotidienne se passe en ligne en anglais** : cours, forums, applications bancaires, recettes, disputes dans les commentaires.

**L’IA apprend de ces traces.**

<!-- @beyond_data -->
En 2020, avec Masakhane, nous avons soutenu que ce n’est pas qu’une question de données :

> « Le manque de ressources est un problème complexe qui dépasse la disponibilité des données et **reflète des problèmes systémiques de la société**. » *(traduit de l’anglais)*

Je le crois toujours.

<!-- @low_digitised -->
> **Peu dotée veut dire peu numérisée, pas sans valeur.** C’est une limite que l’ingénierie peut lever.

<!-- @counting -->
## Pourquoi c’est important : le pré-entraînement apprend des fréquences

Pendant le **pré-entraînement**, un LLM ne stocke pas une table de comptes : il ajuste ses poids $\theta$ en minimisant la perte d’entropie croisée du token suivant :

$$\mathcal{L}(\theta) = -\frac{1}{N}\sum_{t=1}^{N} \log p_{\theta}(w_t \mid w_{<t})$$

Pour un contexte $c$ qui revient souvent, la perte est minimale quand $p_{\theta}$ égale les fréquences du corpus d’entraînement. Les poids partagés ne font que s’en approcher, et généralisent aussi aux contextes jamais vus :

$$p_{\theta}(w \mid c) \approx \hat{p}(w \mid c) = \frac{\mathrm{count}(c,\ w)}{\mathrm{count}(c)} = \frac{k}{n}$$

<!-- @counting_example -->
Prenons un contexte courant en **swahili** : $c =$ *« Niko naenda ku … »* (*« Je vais à … »*). Supposons qu’un petit corpus de pré-entraînement contienne ce contexte $n = 10$ fois :

| Mot suivant $w$ | Sens | Compte $k$ | $\hat{p} = k / n$ |
| --- | --- | --- | --- |
| `nyumba` | la maison | 2 | $2/10 = 0{,}20$ |
| `masomo` | l’école | 3 | $3/10 = 0{,}30$ |
| `kazi` | le travail | 3 | $3/10 = 0{,}30$ |
| `soko` | le marché | 2 | $2/10 = 0{,}20$ |

Plus de paramètres ne créent pas plus de preuves : les textes proches aident le modèle à généraliser, mais ne remplacent pas les exemples en swahili. *(Ici nous montrons des mots entiers pour la clarté ; en pratique $w_t$ est un **token** sous-lexical — ce qui nous mène à la tokenisation juste après.)*

<!-- @how_sure -->
**Quelle est la fiabilité de $\hat{p} = k/n$ ?** Si *« nyumba »* suit réellement *« Niko naenda ku »* avec une probabilité $p = 0{,}2$, alors $k \sim \mathrm{Binomial}(n, p)$, donc $\mathrm{Var}(\hat{p}) = \frac{p(1 - p)}{n}$ et :

$$\mathrm{SE}(\hat{p}) = \sqrt{\frac{p(1 - p)}{n}}, \qquad \text{erreur relative} = \frac{\mathrm{SE}(\hat{p})}{p} = \sqrt{\frac{1 - p}{n\,p}}$$

*Remarque : la formule suppose que les occurrences sont indépendantes. Les textes du web se répètent (pages copiées, une même phrase de nombreuses fois dans un document) : l’erreur réelle est donc **généralement plus grande**.*

Comme l’erreur diminue en $1/\sqrt{n}$, **diviser l’erreur par 2 demande $4\times$ plus de données** (et la diviser par 10 demande $100\times$ plus de données) :

<!-- @zero_counts -->
**Quand les comptes sont faibles ou nuls :** même pour un mot valide de vraie probabilité $p$, la probabilité de ne jamais le voir en $n$ exemples est $P(k = 0) = (1 - p)^n$ (à $n = 10$, $\approx 11\%$ pour $p = 0{,}2$, et $\approx 60\%$ pour un mot plus rare comme *« hospitali »* (hôpital) à $p = 0{,}05$).

Si le contexte lui-même n’a **jamais** été vu ($n = 0$), $\frac{0}{0}$ n’a pas de valeur. Le modèle répond quand même, en généralisant à partir de contextes proches, et avec peu de données il peut basculer vers le français ou le swahili standard d’Afrique de l’Est, ou inventer des mots.

<!-- @counting_takeaway -->
> **Un modèle connaît une langue aussi bien qu’il l’a comptée.**

<!-- @token_tax -->
## La taxe de tokenisation

Avant de compter, le texte est découpé en **tokens**. BPE part des caractères et fusionne la paire la plus fréquente, encore et encore.

<!-- @bpe_inside -->
### Dans un `bpe_step`

`bpe_step` n’est **pas un paquet** : c’est une courte fonction écrite pour cet exposé (`talk_kit.py`), d’après Sennrich et al. Son cœur, simplifié :

```python
# 1. count every pair of neighbouring pieces, in all words
for word in corpus:
    for pair in zip(word, word[1:]):
        counts[pair] = counts.get(pair, 0) + 1
# 2. take the most frequent pair (first merge: k + o, seen 7 times)
left, right = max(counts, key=counts.get)
# 3. glue it into one piece in every word, and add it to the vocabulary
corpus = merge(corpus, left, right)
vocab.add(left + right)
```

<!-- @same_sentence -->
Notre phrase, *« La langue ne doit jamais être une barrière au savoir »*, maintenant avec un vrai tokeniseur : `o200k_base`, celui qu’**OpenAI** utilise pour **GPT-4o**, dans sa bibliothèque `tiktoken`. D’autres familles de modèles découpent le texte autrement.

<!-- @tax_headers -->
| Langue | Mots | Tokens | vs anglais | Calcul d’attention (∝ T²) |

<!-- @tax_chart_title -->
Tokens et calcul d’attention, relativement à l’anglais

<!-- @tax_chart_tokens -->
Tokens

<!-- @tax_chart_attention -->
Calcul d’attention

<!-- @why_square -->
**Pourquoi $T^2$ ?** Cela vient de la formule d’attention de *Attention Is All You Need* :

$$\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^{\top}}{\sqrt{d_k}}\right) V, \qquad Q, K \in \mathbb{R}^{T \times d_k}$$

$QK^{\top}$ compare chaque token avec chaque token : une grille de $T \times T$ scores, soit $9 \times 9 = 81$ pour l’anglais et $20 \times 20 = 400$ pour le tshiluba.

$$\frac{400}{81} = \left(\frac{20}{9}\right)^2 \approx 4{,}94$$

<!-- @what_it_costs -->
`koyekolisa` (enseigner, lingala), découpé par deux tokeniseurs :

| Tokeniseur | Fusions apprises sur | Morceaux | Racine **-yekol-** |
| --- | --- | --- | --- |
| Notre BPE jouet, 4 fusions | 4 mots lingala | `ko · yekol · i · s · a` | un seul morceau |
| `o200k_base` | Les textes d’OpenAI (mélange non publié) | `k · oy · ek · ol · isa` | coupée en trois |

Un tokeniseur garde entier ce qui était **fréquent dans ses textes d’entraînement**. *Le nôtre est un jouet ; les vrais apprennent environ 200 000 morceaux à partir d’octets.*

Le même message en tshiluba avec `o200k_base` : **2,2 fois plus de tokens**, donc **2,2 fois le prix** quand on paie au token, **2,2 fois moins** de texte dans le contexte, et des réponses plus lentes. *Une phrase n’est qu’une illustration ; mesurez un corpus avant de conclure.*

<!-- @tax_open -->
**Problème ouvert :** des tokeniseurs qui respectent la morphologie bantoue (`préfixe + racine + extension + voyelle finale`).

<!-- @embeddings -->
## Embeddings et similarité cosinus

Un identifiant de token n’a pas de sens. Un **embedding** donne un vecteur à chaque mot ou phrase ; un sens proche devient un petit angle :

$$\mathbf{e} = \phi(x) \in \mathbb{R}^{d}, \qquad \cos(\mathbf{u}, \mathbf{v}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|\,\|\mathbf{v}\|}$$

<!-- @theory_and_practice -->
**En théorie**, une phrase en lingala et sa traduction anglaise reçoivent presque le même vecteur.

**Ce qu’on observe souvent** dans les modèles qui ont vu peu de lingala (vecteurs jouets, choisis pour montrer le phénomène) :

<!-- @embedding_limits -->
- Les phrases peuvent se regrouper par **langue**, pas par **sens** : une recherche en lingala renvoie alors du texte en lingala, pas la bonne réponse.
- Un score de 0,8 ne veut pas dire la même chose en tshiluba qu’en anglais : les seuils réglés sur l’anglais cassent.

<!-- @embedding_open -->
**Problème ouvert :** mesurer et aligner les embeddings de nos langues, avec des paires de phrases vérifiées par des locuteurs.

<!-- @metrics -->
## Des métriques qui ratent nos langues

On note souvent une traduction selon ce qu’elle partage avec une référence : **BLEU** compare des suites de mots, **chrF** des suites de caractères.

<!-- @two_answers -->
Deux réponses en tshiluba, notées contre la référence :

<!-- @wrong_answer_wins -->
- `mayi` pour `mâyi` (eau) : **bon sens**, autre orthographe, chrF bas.
- `kulonga` (apprendre) pour `kulongesha` (enseigner) : **mauvais sens**, chrF plus haut.

**La métrique préfère la mauvaise réponse.**

*Les valeurs en direct sont un chrF simplifié (1 à 3 caractères). La version standard (1 à 6) est d’accord : 0,49 pour la mauvaise réponse, 0,27 pour la bonne.*

<!-- @why_metrics_fail -->
- L’orthographe n’est pas standardisée (*â* ou *a*, *ɛ* ou *e*, tons notés ou non).
- Un seul mot long porte toute une phrase : un affixe faux et BLEU perd le mot entier.
- Un LLM juge, faible en tshiluba, ne peut pas noter du tshiluba.

<!-- @metrics_open -->
**Problème ouvert :** des jeux de test écrits à partir de nos propres contenus, des métriques qui tiennent compte de la morphologie et de l’orthographe, et une évaluation par des locuteurs natifs.

<!-- @local_llms -->
## LLM locaux : faire tourner un modèle sur votre machine

- **Souveraineté :** vos données restent chez vous, dans votre pays
- **Hors ligne :** fonctionne sans bonne connexion
- **Pas de facture au token :** la taxe de tokenisation devient du calcul qui vous appartient
- **Poids ouverts :** vous pouvez adapter le modèle à nos langues

<!-- @memory_rule -->
**Combien de mémoire ?** Les poids prennent environ **paramètres × bits ÷ 8** octets, plus de la place pour le contexte (souvent 1 à 2 Go, davantage s’il est long) :

<!-- @memory_chart_title -->
Mémoire nécessaire pour les poids

<!-- @memory_chart_full -->
16 bits

<!-- @memory_chart_quantised -->
4 bits (quantifié)

<!-- @what_fits -->
| Votre machine | Modèles qui tiennent (4 bits, ordre de grandeur) |
| --- | --- |
| Portable, 8 Go de RAM | Jusqu’à environ 3–4 milliards de paramètres |
| Portable, 16 Go de RAM | Jusqu’à environ 8 milliards |
| GPU, 24 Go | Jusqu’à environ 30 milliards |
| 48 Go ou plus | Environ 70 milliards |

<!-- @tools_to_run -->
| Outil | Idéal pour |
| --- | --- |
| Ollama | Une commande pour télécharger et discuter, plus une API locale |
| LM Studio | Une application graphique, sans terminal |
| llama.cpp | Contrôle total, tourne sur CPU, téléphones, petites cartes |

<!-- @try_tonight -->
```bash
ollama run llama3.2:3b        # downloads ~2 GB once, then works offline

curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:3b", "stream": false,
  "prompt": "Translate into Lingala: Language should never be a gate to knowledge."
}'
```

<!-- @adapt_with_lora -->
**L’adapter à nos langues avec LoRA :** garder $W$ gelée et entraîner seulement deux petites matrices.

$$W' = W + BA, \qquad B \in \mathbb{R}^{d \times r},\quad A \in \mathbb{R}^{r \times k},\quad r \ll \min(d, k)$$

<!-- @be_honest -->
**Observation :** les petits modèles ouverts sont encore faibles en lingala et en tshiluba. Les adapter et les évaluer reste un travail ouvert, qui demande nos données.

<!-- @masakhane -->
## Masakhane : construire ensemble

**Masakhane** (*« nous construisons ensemble »* en isiZulu) est une communauté de chercheurs africains qui construit, en ouvert, des données, des modèles et des méthodes pour les langues africaines. J’ai siégé au conseil d’administration de la **Masakhane Research Foundation** de 2021 à mi-2026.

<!-- @my_work -->
- **2020 :** traduction automatique participative pour plus de 30 langues africaines
- **LiSTra :** corpus et système de base de traduction vocale anglais-lingala
- **BibleTTS, IrokoBench, INJONGO :** données vocales et benchmarks pour les langues africaines

<!-- @what_i_learned -->
**Ce que j’en retiens :** les jeux de données ponctuels comptent : ils nous ont donné nos premiers benchmarks et modèles. Mais **un jeu de données est un instantané ; une langue réellement utilisée en ligne grandit chaque jour.** Et le financement est lent et s’arrête.

<!-- @darakili -->
## DarAkili : vivons dans nos langues

Nous sommes devenus peu dotés parce que la vie dans nos langues a été parlée, pas conservée. La solution est donc :

<!-- @live_in_our_languages -->
> **Faire entrer nos habitudes quotidiennes, dans nos langues, dans l’espace numérique :** apprendre, enseigner, écrire, enregistrer et discuter en lingala, tshiluba et swahili.

<!-- @what_we_build -->
Pendant mon temps libre, je travaille sur **DarAkili** (**SALELA BONGO LLC**) : des leçons de STIM, de compétences numériques et bientôt d’IA, enseignées en **lingala, tshiluba, swahili** et d’autres à venir.

Les leçons sont **surtout audio**, parce que c’est ainsi que beaucoup d’entre nous utilisent réellement leurs langues. Apprendre les sciences ne devrait jamais passer obligatoirement par l’anglais ou le français.

<!-- @why_it_works -->
Chaque leçon donnée dans nos langues est du **nouveau texte et de la nouvelle parole numériques** dans nos langues, produits en les vivant, pas par un projet ponctuel.

> **Les transferts d’argent envoient de l’argent au pays. DarAkili y envoie du savoir.**

<!-- @your_part -->
**Votre part :** donnez une leçon dans votre langue, prenez vos notes dans cette langue, et publiez-les pour que d’autres puissent les réutiliser.

**Professionnels de la diaspora :** si vous pouvez enseigner quelque chose dans votre langue maternelle, j’aimerais beaucoup vous lire.

<!-- @not_magic -->
## Derrière chaque limite, une science à apprendre

| Limite | Réponse | Science |
| --- | --- | --- |
| Nos langues ne sont pas numériques | Vivre, apprendre, publier en elles | Linguistique, données |
| Peu d’exemples | Plus de texte, de meilleurs comptes | Probabilités |
| Les tokens coupent nos mots | Tokeniseurs morphologiques | Compression |
| Les vecteurs ratent notre sens | Embeddings alignés | Algèbre linéaire |
| Les métriques ratent nos langues | Évaluation par des locuteurs | Statistiques |
| Coût du cloud, pas de contrôle | LLM locaux, LoRA | Algèbre de rang faible |
| Peu de personnes travaillent sur les poids | Apprendre le machine learning, pas seulement les API | Statistiques, optimisation |

<!-- @open_problems -->
### Des problèmes ouverts à garder en tête

1. Un jeu de test en lingala ou en tshiluba écrit à partir de contenus locaux
2. Des tokeniseurs qui gardent les racines bantoues entières
3. Un petit modèle ouvert adapté à une langue congolaise, et évalué honnêtement
4. La reconnaissance vocale sensible aux tons

<!-- @your_turn -->
**À vous :** prenez un nouvel outil d’IA et répondez aux trois questions du début :

1. À quelle **limite** répond-il ?
2. Quel est le geste d’**ingénierie** ?
3. Quelle **science** y a-t-il en dessous ?

Puis enseignez une chose dans votre langue.

<!-- @thank_you -->
## Tuasakidila · Matondo · Aksanti · Thank you · Merci
