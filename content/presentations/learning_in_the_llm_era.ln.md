<!-- Translation of learning_in_the_llm_era.py (ln). Each block replaces the English slide with the same key.
     Delete a block to show the English text instead. -->

<!-- @title -->
# Koyekola na tango ya ba LLM

**Ndenge nini minoko na biso ekomaki « na mwa ba ressources » ?**

**Dr. Kabongo** · Deep Learning IndabaX R.D. Congo 2026 · UNH Lubumbashi · 27 novembre 2026

<!-- @talk_qr_image -->
images/qr-talk-ln.png

<!-- @scan_title -->
**Scanner mpo na kozwa mpe kotala lisolo oyo**  
[drkabongo.com/ln/speaking/learning-in-the-llm-era](https://drkabongo.com/ln/speaking/learning-in-the-llm-era)

<!-- @inventions -->
## Biloko mingi basali ezali eyano ya ingénierie na mokakatano

| Mokakatano | Eyano ya ingénierie | Science na nse |
| --- | --- | --- |
| Mongongo ekendaka mosika te | Telefone, radio | Électromagnétisme |
| Totangaka malembe | Ba ordinateurs | Logique, physique |
| Mibeko ya kokoma eleki mingi | Machine learning | Probabilité, optimisation |
| Minoko na biso ezangi na internet | Ba ressources numériques ya polele | Linguistique, statistique |

<!-- @three_questions -->
### Mituna misato mpo na liloba nyonso ya sika

1. Eyanolaka na **mokakatano** nini?
2. **Ingénierie** esali nini?
3. **Science** nini ezali na nse?

<!-- @llm_era -->
### Ndenge moko na tango ya ba LLM

| Kombo | Mokakatano | Eyano ya ingénierie |
| --- | --- | --- |
| RAG | Boyebi ekangami; mikanda na yo ezangi | Koluka, sima kotia na contexte |
| Bisaleli | Modèle ekomaka kaka makomi; ekoki kosala te | Modèle akomaka bosenga, code na yo esalaka yango |
| MCP | Application nyonso esengeli kokangama na esaleli nyonso | Protocole moko ya polele |
| Skills, plugins, custom GPTs | Tozongelaka malako; contexte ezali na suka | Malako pe ba fichiers ebombami, etangami na bosenga |

<!-- @roadmap -->
| Etape | Yekola |
| --- | --- |
| Kolanda | Probabilité, algèbre linéaire, code |
| Kotambola | Tokens, embeddings, évaluation |
| Kopota | Ba modèles ya mboka, RAG, kobongisa |
| Kopumbwa | Kotonga ba ressources pe ba modèles mpo na minoko na biso |

**Kopumbwa miboko ezali likanisi ya malamu te.**

<!-- @people_title -->
## Koyeba ba modèle minene ya minoko (LLM)

Eyano ya LLM etali biloko mibale oyo okoki kobongola:

$$p_{\theta}(\text{eyano} \mid \text{contexte})$$

<!-- @levers -->
|  | Contexte (loboko ya mobali ya elembo) | Ba poids θ |
| --- | --- | --- |
| Mosala ya nani | Ingénierie: API, base de données, pipeline | Machine learning: données, courbes ya loss, évaluation |
| Bakombo | RAG, bisaleli, MCP, skills | Entraînement, fine-tuning, LoRA |

<!-- @where_the_people_were -->
> **Bokoli ya mibu misato eleki esalemaki epai bato bazalaki.**

Mpe bato mingi bazali ba ingénieurs: pene ya **ba ingénieurs logiciels millions 50** mpo na **balukiluki ya LLM 5 000** (motango ya pene ya 2023). Na bolukiluki ya 2024 epai ya bakambi 600 ya ba entreprises na États-Unis, **51%** bandaki kosalela **RAG**, nzoka kaka **9%** ya ba modèles na production nde bazalaki **fine-tuné**.

Ingénierie esali makambo ya kokamwa. Kasi ngambo ya ba poids ezwaki mwa milende, yango wana litomba monene oyo ekoya ekouta mbala mingi kuna.

<!-- @our_languages -->
Mpo na minoko na biso ezali ntina mingi: RAG esengi mikanda, bisaleli esengi ba tests, kasi **moko te alakisaka modèle Swahili, Lingala, Kikongo, Tshiluba to akelaka ba données ya lokota**. Esengi ba données pe bato oyo bayebi kosala na ba poids. **Okoki kozala yo.**

<!-- @low_resource -->
## Ndenge nini minoko na biso ekomaki « na mwa ba ressources »?

**Ezali te mpo moto moko te alobaka yango.** Bato ba millions balotaka, baswanaka, basambelaka, basalaka mombongo mpe babokolaka bana na Lingala, Tshiluba, Swahili mpe minoko mosusu nkama na nkama.

<!-- @data_classes -->
Na IA, « mwa ba ressources » elingi koloba te ete balobi bazali moke. Elingi koloba **ba données ya numérique ezali moke**, mpe makambo wana mibale etambolaka elongo te:

> **88%** ya minoko ya mokili, oyo bato soki **milliard 1** balobaka, etikali kaka **nsima** na ba technologie ya minoko.

<!-- @where_we_wrote -->
Mpo na nini? Na boumeli ya mabota ebele, makambo « ya ntina » ya bomoi esalemaki na Français, Anglais to Portugais: kelasi, science, leta, mombongo mpe sikoyo internet. Minoko na biso etikalaki na ndako, na zando, na losambo, na telefone.

> **Elobami, kasi ebombami te. Ezali na bomoi, kasi ekoti na numérique te.**

<!-- @where_machines_learn -->
| Epai ba machine eyekolaka | Français to Anglais | Minoko na biso |
| --- | --- | --- |
| Ba buku pe ba bibliothèques | Ebele | Moke |
| Kelasi pe université | Ntango nyonso | Mbala moke |
| Leta pe mibeko | Ntango nyonso | Mbala moke |
| Ba site web | Ba milliards ya nkasa | Moke mpenza |

<!-- @daily_life_online -->
Anglais ezali na ba ressources ebele te mpo moto moko afutaki mpo na ba données. Ezali bongo mpo **bomoi ya mokolo na mokolo esalemaka na internet na Anglais**: mateya, ba forum, ba application ya banque, bilei, koswana na ba commentaire.

**IA eyekolaka na makambo wana etikali.**

<!-- @beyond_data -->
Na 2020, elongo na Masakhane, tolobaki ete likambo oyo etali kaka ba données te:

> « Kozanga ba ressources ezali mokakatano ya mindondo oyo eleki likambo ya ba données mpe **elakisaka mikakatano ya sisteme na societe**. » *(ebongolami uta na Anglais)*

Nazali kaka kondima yango.

<!-- @low_digitised -->
> **Mwa ba ressources elingi koloba mwa makomi ya numérique, kasi motuya moke te.** Ingénierie ekoki kobongisa yango.

<!-- @counting -->
## Mpo na nini: pré-entraînement eyekolaka ba fréquences

Na tango ya **pré-entraînement**, LLM ebombaka tablo ya mitango te : ebongisaka ba poids na yango $\theta$ mpo na kokitisa libunga ya cross-entropy ya token oyo elandi :

$$\mathcal{L}(\theta) = -\frac{1}{N}\sum_{t=1}^{N} \log p_{\theta}(w_t \mid w_{<t})$$

Mpo na contexte $c$ oyo ezongaka mbala ebele, libunga ekomaka ya moke koleka ntango $p_{\theta}$ ekokani na ba fréquences ya makomi ya boyekoli. Ba poids ekaboli ekomaka kaka pene na yango, mpe esalaka généralisation na ba contextes oyo emonaki naino te :

$$p_{\theta}(w \mid c) \approx \hat{p}(w \mid c) = \frac{\mathrm{count}(c,\ w)}{\mathrm{count}(c)} = \frac{k}{n}$$

<!-- @counting_example -->
Tokamata fraze ya mokolo na mokolo na **Swahili**: $c =$ *« Niko naenda ku … »* (*« Nazali kokende na … »*). Takanisa ete corpus moko ya moke ya pré-entraînement ezali na contexte oyo mbala $n = 10$:

| Liloba oyo elandi $w$ | Ndimbola | Motango $k$ | $\hat{p} = k / n$ |
| --- | --- | --- | --- |
| `nyumba` | ndako | 2 | $2/10 = 0.20$ |
| `masomo` | kelasi | 3 | $3/10 = 0.30$ |
| `kazi` | mosala | 3 | $3/10 = 0.30$ |
| `soko` | zando | 2 | $2/10 = 0.20$ |

Kobakisa paramètres ebakisaka bilembeteli te : makomi ya pene esalisaka modèle na généralisation, kasi ekoki te kozwa esika ya bandakisa ya Swahili. *(Awa tolakisi maloba mobimba mpo ezala polele ; na mosala ya solo $w_t$ ezali **token** — eteni ya liloba — oyo ekomema biso na tokenisation sima.)*

<!-- @how_sure -->
**$\hat{p} = k/n$ ezali sikisiki boni?** Soki na solo *« nyumba »* elandaka *« Niko naenda ku »* na probabilité $p = 0.2$, boye $k \sim \mathrm{Binomial}(n, p)$, yango wana $\mathrm{Var}(\hat{p}) = \frac{p(1 - p)}{n}$ mpe:

$$\mathrm{SE}(\hat{p}) = \sqrt{\frac{p(1 - p)}{n}}, \qquad \text{erreur relative} = \frac{\mathrm{SE}(\hat{p})}{p} = \sqrt{\frac{1 - p}{n\,p}}$$

*Note: formule oyo ezwi ete mbala nyonso ezali ya kokabwana (indépendante). Makomi ya internet ezongelaka (ba pages ya copie, fraze moko mbala ebele na document), yango wana erreur ya solo ezalaka **mbala mingi monene koleka**.*

Mpo erreur ekitaka na $1/\sqrt{n}$, **kokata erreur na katikati esengaka ba données mbala $4\times$ mingi** (mpe kokitisa yango mbala $10\times$ esengaka ba données mbala $100\times$ mingi):

<!-- @zero_counts -->
**Ntango mitango ezali moke to zéro:** ata mpo na liloba ya malamu oyo ezali na probabilité ya solo $p$, likoki ya kozanga komona yango na bandakisa $n$ ezali $P(k = 0) = (1 - p)^n$ (na $n = 10$, $\approx 11\%$ mpo na $p = 0.2$, mpe $\approx 60\%$ mpo na liloba oyo ebimaka mingi te lokola *« hospitali »* (lopitalo) na $p = 0.05$).

Soki modèle emoni contexte yango **ata mbala moko te** ($n = 0$), $\frac{0}{0}$ ezali na motuya te. Kasi modèle epesaka kaka eyano na généralisation uta na ba contextes ya pene, mpe soki ba données ezali moke ekoki kokota na Français to na Swahili ya Est ya Afrika, to kobimisa maloba ya lokuta.

<!-- @counting_takeaway -->
> **Modèle eyebi lokota kaka ndenge atangaki yango.**

<!-- @token_tax -->
## Mpako ya tokenisation

Liboso ya kotanga, makomi ekatamaka na **tokens**. BPE ebandaka na ba lettres mpe esangisaka paire oyo ezongelaka mingi, mbala na mbala.

<!-- @bpe_inside -->
### Na kati ya `bpe_step` moko

`bpe_step` ezali **package te**: ezali fonction ya mokuse oyo ekomami mpo na lisolo oyo (`talk_kit.py`), na kolanda Sennrich et al. Motema na yango, na ndenge ya pete:

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
Fraze na biso, *« Lokota esengeli kozala epekiseli ya boyebi te »*, sikoyo na tokeniseur ya solo: `o200k_base`, oyo **OpenAI** esalelaka mpo na **GPT-4o**, na bibliothèque na yango `tiktoken`. Ba modèles mosusu ekataka makomi ndenge mosusu.

<!-- @tax_headers -->
| Lokota | Maloba | Tokens | vs Anglais | Mosala ya attention (∝ T²) |

<!-- @tax_chart_title -->
Tokens pe mosala ya attention, soki tokokanisi na Anglais

<!-- @tax_chart_tokens -->
Tokens

<!-- @tax_chart_attention -->
Mosala ya attention

<!-- @why_square -->
**Mpo na nini $T^2$?** Euti na formule ya attention ya *Attention Is All You Need*:

$$\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^{\top}}{\sqrt{d_k}}\right) V, \qquad Q, K \in \mathbb{R}^{T \times d_k}$$

$QK^{\top}$ ekokanisaka token nyonso na token nyonso: grille ya ba scores $T \times T$, $9 \times 9 = 81$ mpo na Anglais, $20 \times 20 = 400$ mpo na Tshiluba.

$$\frac{400}{81} = \left(\frac{20}{9}\right)^2 \approx 4.94$$

<!-- @what_it_costs -->
`koyekolisa` (kolakisa, Lingala), ekatami na ba tokeniseurs mibale:

| Tokeniseur | Esangisi eyekolami na | Biteni | Ntina **-yekol-** |
| --- | --- | --- | --- |
| BPE na biso ya ndakisa, bisangisi 4 | Maloba 4 ya Lingala | `ko · yekol · i · s · a` | eteni moko |
| `o200k_base` | Makomi ya OpenAI (bosangani ebimisami te) | `k · oy · ek · ol · isa` | ekatani na biteni misato |

Tokeniseur ebombaka mobimba oyo **ezongelaki mingi na makomi oyo eyekolaki**. *Ya biso ezali ndakisa; ya solo eyekolaka pene biteni 200 000 uta na ba octets.*

Message moko na Tshiluba na `o200k_base`: **ba tokens mbala 2.2**, yango wana **ntalo mbala 2.2** esika bafutaka mpo na token, makomi **mbala 2.2 moke** na contexte, pe biyano ya malembe. *Fraze moko ezali kaka ndakisa; meka corpus liboso ya kosukisa.*

<!-- @tax_open -->
**Mokakatano ya polele:** ba tokeniseurs oyo etosaka morphologie ya Bantu (`préfixe + ntina + extension + voyelle ya suka`).

<!-- @embeddings -->
## Embeddings pe similarité cosinus

Nimero ya token ezali na ndimbola te. **Embedding** epesaka liloba to fraze nyonso vecteur; ndimbola ya pene ekomaka angle ya moke:

$$\mathbf{e} = \phi(x) \in \mathbb{R}^{d}, \qquad \cos(\mathbf{u}, \mathbf{v}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|\,\|\mathbf{v}\|}$$

<!-- @theory_and_practice -->
**Na théorie**, fraze ya Lingala pe libongoli na yango na Anglais ezwaka pene vecteur moko.

**Oyo tomonaka mbala mingi** na ba modèles oyo emonaki Lingala moke (ba vecteurs ya ndakisa):

<!-- @embedding_limits -->
- Ba fraze ekoki kosangana na **lokota**, na **ndimbola** te: na yango koluka na Lingala ezongisaka makomi ya Lingala, eyano ya malamu te.
- Score 0.8 elingi koloba likambo moko te na Tshiluba pe na Anglais: ba seuils oyo babongisaki na Anglais ebukanaka.

<!-- @embedding_open -->
**Mokakatano ya polele:** komeka pe kobongisa ba embeddings ya minoko na biso, na ba paires ya fraze oyo bato ya lokota batali.

<!-- @metrics -->
## Ba métriques oyo eyebi minoko na biso te

Mbala mingi libongoli ezwaka note na oyo esangani na référence: **BLEU** ekokanisaka milongo ya maloba, **chrF** milongo ya ba lettres.

<!-- @two_answers -->
Biyano mibale na Tshiluba, na note na yango:

<!-- @wrong_answer_wins -->
- `mayi` na esika ya `mâyi` (mai): **ndimbola malamu**, ekomeli mosusu, chrF ya nse.
- `kulonga` (koyekola) na esika ya `kulongesha` (kolakisa): **ndimbola mabe**, chrF ya likolo.

**Métrique eponi eyano ya mabe.**

*Mituya oyo ezali komonana ezali chrF ya pete (ba lettres 1–3). Version standard (1–6) emonisi mpe bongo : 0.49 mpo na eyano ya mabe, 0.27 mpo na eyano ya malamu.*

<!-- @why_metrics_fail -->
- Ekomeli ezali moko te (*â* to *a*, *ɛ* to *e*, ba tons to te).
- Liloba moko ya molai ememaka fraze mobimba: affixe moko ya mabe, BLEU ebungisi liloba mobimba.
- LLM oyo eyebi Tshiluba malamu te ekoki kopesa Tshiluba note te.

<!-- @metrics_open -->
**Mokakatano ya polele:** ba tests oyo ekomami na makambo na biso, ba métriques oyo eyebi morphologie pe ekomeli, pe évaluation na bato ya lokota.

<!-- @local_llms -->
## LLM ya mboka: modèle na ordinateur na yo

- **Bokonzi:** ba données na yo etikalaka epai na yo, na mboka na yo
- **Hors ligne:** esalaka ata connexion ezali malamu te
- **Kofuta token te:** mpako ya token ekomaka calcul ya yo moko
- **Ba poids ya polele:** okoki kobongisa modèle mpo na minoko na biso

<!-- @memory_rule -->
**Mémoire boni?** Ba poids ezwaka pene **paramètres × bits ÷ 8** octets, na esika mpo na contexte (mbala mingi 1–2 Go, mingi koleka soki ezali molai):

<!-- @memory_chart_title -->
Mémoire oyo esengeli mpo na ba poids

<!-- @memory_chart_full -->
16 bits

<!-- @memory_chart_quantised -->
4 bits (quantisé)

<!-- @what_fits -->
| Machine na yo | Ba modèles oyo ekoti (4 bits, pene) |
| --- | --- |
| Laptop, RAM 8 Go | Tii pene 3–4 B ya paramètres |
| Laptop, RAM 16 Go | Tii pene 8 B |
| GPU, 24 Go | Tii pene 30 B |
| 48 Go to koleka | Pene 70 B |

<!-- @tools_to_run -->
| Esaleli | Malamu mpo na |
| --- | --- |
| Ollama | Commande moko mpo na kokitisa pe kosolola, na API ya mboka |
| LM Studio | Application ya graphique, terminal te |
| llama.cpp | Contrôle mobimba, esalaka na CPU, telefone, ba cartes ya mike |

<!-- @try_tonight -->
```bash
ollama run llama3.2:3b        # downloads ~2 GB once, then works offline

curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:3b", "stream": false,
  "prompt": "Translate into Lingala: Language should never be a gate to knowledge."
}'
```

<!-- @adapt_with_lora -->
**Kobongisa yango mpo na minoko na biso na LoRA:** tika $W$ ndenge ezali mpe yekolisa kaka ba matrices mibale ya mike.

$$W' = W + BA, \qquad B \in \mathbb{R}^{d \times r},\quad A \in \mathbb{R}^{r \times k},\quad r \ll \min(d, k)$$

<!-- @be_honest -->
**Oyo tomonaka:** ba modèles ya mike ya polele bazali naino na bolembu na Lingala pe Tshiluba. Kobongisa pe komeka yango ezali mosala ya polele, mpe esengeli ba données na biso.

<!-- @masakhane -->
## Masakhane: totonga elongo

**Masakhane** (*« totonga elongo »* na isiZulu) ezali lisanga ya ba chercheurs ya Afrika oyo batongaka ba données, ba modèles pe ba méthodes mpo na minoko ya Afrika, na polele. Nazalaki membre ya conseil ya **Masakhane Research Foundation** banda 2021 kino na katikati ya 2026.

<!-- @my_work -->
- **2020:** traduction automatique ya elongo mpo na minoko ya Afrika koleka 30
- **LiSTra:** corpus pe système ya traduction ya mongongo Anglais-Lingala
- **BibleTTS, IrokoBench, INJONGO:** ba données ya mongongo pe ba benchmarks mpo na minoko ya Afrika

<!-- @what_i_learned -->
**Oyo nayekolaki:** ba données ya mbala moko ezali na ntina: epesaki biso ba benchmark mpe ba modele ya liboso. Kasi **ba données ezali foto ya ntango moko; lokota oyo bato basalelaka mpenza na internet ekolaka mokolo na mokolo.** Mpe mbongo eyaka malembe mpe esilaka.

<!-- @darakili -->
## DarAkili: tozala na bomoi na minoko na biso

Tokomaki na mwa ba ressources mpo bomoi na minoko na biso elobamaki, kasi ebombamaki te. Boye eyano ezali:

<!-- @live_in_our_languages -->
> **Komema bizaleli na biso ya mokolo na mokolo, na minoko na biso, na espace numérique:** koyekola, kolakisa, kokoma, ko-enregistrer pe kosolola na Lingala, Tshiluba pe Swahili.

<!-- @what_we_build -->
Na ntango na ngai ya bopemi, nazali kosala na **DarAkili** (**SALELA BONGO LLC**): mateya ya STEM, mayele ya numérique mpe mosika te IA, na **Lingala, Tshiluba, Swahili** mpe mosusu ekoya.

Mateya mingi ezali **ya mongongo**, mpo ndenge wana nde bato mingi na biso basalelaka minoko na biso. Koyekola science esengeli kozala na ekuke ya Anglais to ya Français te.

<!-- @why_it_works -->
Liteya nyonso oyo elakisami na minoko na biso ezali **makomi pe mongongo ya sika ya numérique** na minoko na biso, oyo ebimi na kozala na bomoi na yango, na projet ya mbala moko te.

> **Batindaka mbongo na mboka. DarAkili etindaka boyebi na mboka.**

<!-- @your_part -->
**Eteni na yo:** lakisa liteya moko na lokota na yo, koma ba notes na yo na yango, mpe bimisa yango mpo basusu basalela yango lisusu.

**Bandeko ya diaspora:** soki okoki kolakisa eloko na lokota ya mama na yo, nakosepela koyoka yo.

<!-- @not_magic -->
## Nsima ya mokakatano nyonso, science ya koyekola

| Mokakatano | Eyano | Science |
| --- | --- | --- |
| Minoko na biso ezali na numérique te | Kozala, koyekola, kobimisa na yango | Linguistique, données |
| Bandakisa moke | Makomi mingi, kotanga malamu | Probabilité |
| Ba tokens ekataka maloba na biso | Ba tokeniseurs ya morphologie | Compression |
| Ba vecteurs eyebi ndimbola na biso te | Ba embeddings oyo ebongisami | Algèbre linéaire |
| Ba métriques eyebi minoko na biso te | Évaluation na bato ya lokota | Statistique |
| Ntalo ya cloud, bokonzi te | LLM ya mboka, LoRA | Algèbre ya rang moke |
| Bato moke basalaka na ba poids | Yekola machine learning, kaka ba API te | Statistique, optimisation |

<!-- @open_problems -->
### Mikakatano ya polele ya kobomba na makanisi

1. Test ya Lingala to ya Tshiluba oyo ekomami na makambo ya mboka
2. Ba tokeniseurs oyo ebatelaka ba ntina ya Bantu mobimba
3. Modèle moke ya polele oyo ebongisami mpo na lokota moko ya Congo, mpe emekami na bosolo
4. Koyoka mongongo na ba tons

<!-- @your_turn -->
**Mosala na yo:** pona esaleli moko ya sika ya AI mpe yanola na mituna misato ya ebandeli:

1. Eyanolaka na **mokakatano** nini?
2. **Ingénierie** esali nini?
3. **Science** nini ezali na nse?

Sima lakisa likambo moko na lokota na yo.

<!-- @take_it_with_you -->
### Kende na yango

| Lisolo oyo | DarAkili · Android | DarAkili · iPhone |
|:---:|:---:|:---:|
| ![QR: Lisolo oyo](/edtrace/images/talks/qr-talk-ln.png) | ![QR: DarAkili, Google Play](/edtrace/images/talks/qr-darakili-android.png) | ![QR: DarAkili, App Store](/edtrace/images/talks/qr-darakili-ios.png) |
| drkabongo.com | Google Play | App Store |

<!-- @thank_you -->
## Matondo · Tuasakidila · Aksanti · Merci · Thank you
