<!-- Translation of learning_in_the_llm_era.py (lua). Each block replaces the English slide with the same key.
     Delete a block to show the English text instead. -->

<!-- @title -->
# Kulongesha mu tshikondo tshia ba LLM

**Mushindu kayi miakulu yetu milua « ne ba ressources bikese » ?**

**Dr. Kabongo** · Deep Learning IndabaX R.D. Congo 2026 · UNH Lubumbashi · 27 novembre 2026

<!-- @inventions -->
## Bintu bia bungi bidi diandamuna dia ingénierie ku lutatu

| Lutatu | Diandamuna dia ingénierie | Science munshi |
| --- | --- | --- |
| Diyi kadiena difika kule to | Telefone, radio | Électromagnétisme |
| Tudi tubala bitekete | Ba ordinateurs | Logique, physique |
| Mikenji ya kufunda mmivule | Machine learning | Probabilité, optimisation |
| Miakulu yetu kayiena pa internet | Ba ressources numériques patoke | Linguistique, statistique |

<!-- @three_questions -->
### Nkonko isatu bua muaku wonso mupiamupia

1. Udi wandamuna **lutatu** kayi?
2. **Ingénierie** udi wenza tshinyi?
3. **Science** kayi udi munshi?

<!-- @llm_era -->
### Mushindu umue mu tshikondo tshia ba LLM

| Dîna | Lutatu | Diandamuna dia ingénierie |
| --- | --- | --- |
| RAG | Dimanya didi dijalamu; mikanda yebe kayenamu | Kukeba, pashishe kuteka mu contexte |
| Bia mudimu | Modèle udi ufunda anu mifundu; kena mua kuenza | Modèle udi ufunda dilomba, code webe udi udienza |
| MCP | Application wonso udi ukengela kusuika ku tshia mudimu tshionso | Protocole umue patoke |
| Skills, plugins, custom GPTs | Tudi tupingaja mikenji; contexte udi ne ndekelu | Mikenji ne ba fichiers bilama, bibala padi bikengela |

<!-- @roadmap -->
| Etape | Longa |
| --- | --- |
| Kulandakana | Probabilité, algèbre linéaire, code |
| Kuenda | Tokens, embeddings, évaluation |
| Kunyema | Ba modèles ba ku muaba, RAG, kulongolola |
| Kubuka | Kuibaka ba ressources ne ba modèles bua miakulu yetu |

**Kutshiuka miboko ki lungenyi luimpe to.**

<!-- @people_title -->
## Kumvua ba modèles manene a miakulu (LLM)

Diandamuna dia LLM didi dilondela bintu bibidi biudi mua kushintulula:

$$p_{\theta}(\text{answer} \mid \text{context})$$

<!-- @levers -->
|  | Contexte (ku tshianza tshia balume tshia tshimanyinu) | Ba poids θ |
| --- | --- | --- |
| Mudimu wa nganyi | Ingénierie: API, base de données, pipeline | Machine learning: données, courbes ya loss, évaluation |
| Mena | RAG, bia mudimu, MCP, skills | Entraînement, fine-tuning, LoRA |

<!-- @where_the_people_were -->
> **Dituluka dia bidimu bisatu bishale diakenzeka muaba uvua bantu.**

Ne bantu ba bungi mba ingénieurs: pabuipi ne **ba ingénieurs logiciels millions 50** bua **bakebulula ba LLM 5 000** (bungi bua pabuipi bua 2023). Mu dikonkonona dia 2024 kudi bamfumu 600 ba ba entreprises mu États-Unis, **51%** bakavua basadila **RAG**, kadi anu **9%** a ba modèles mu production ke avua **fine-tuné**.

Ingénierie udi wenza malu a kukema. Kadi luseke lua ba poids luakapeta bidiakaja bikese, nunku diakalenga dinene didi dilua mua kufumina kuoku.

<!-- @our_languages -->
Bua miakulu yetu bualu ebu budi ne mushinga: RAG udi ukengela mikanda ne bia mudimu ba tests, kadi **kakuena tshimue tshidi tshilongesha modèle Swahili, Lingala, Kikongo, Tshiluba anyi tshienza ba données ba muakulu**. Bidi bikengela ba données ne bantu badi bamanya kuenza mudimu pa ba poids. **Udi mua kuikala wewe.**

<!-- @low_resource -->
## Mushindu kayi miakulu yetu milua « ne ba ressources bikese »?

**Ki bualu kakuena muntu udi uyakula to.** Bantu ba ma millions badi balota, batandangana, basambila, benza mushinga ne balela bana mu Lingala, Tshiluba, Swahili ne miakulu mikuabu nkama ne nkama.

<!-- @data_classes -->
Mu IA, « ba ressources bikese » kabiena biumvuija ne bantu badi bakula mbakese to. Bidi biumvuija ne **ba données a numérique makese**, ne malu abidi aa kaena enda pamue to:

> **88%** a miakulu ya pa buloba, idi bantu bu **milliard 1** bakula, idi anu **panyima** mu ba technologie a miakulu.

<!-- @where_we_wrote -->
Bua tshinyi? Mu bikondo bia bungi, malu « a mushinga » a muoyo avua enzeka mu Français, Anglais anyi Portugais: kalasa, science, mbulamatadi, mushinga ne mpindieu internet. Miakulu yetu yakashala ku nzubu, ku tshisalu, ku tshiendelu, ku telefone.

> **Biakula, kabiyi bilama. Bidi ne muoyo, kabiyi mu numérique.**

<!-- @where_machines_learn -->
| Muaba udi ba machine balonga | Français anyi Anglais | Miakulu yetu |
| --- | --- | --- |
| Mikanda ne ba bibliothèques | Bivule | Bikese |
| Kalasa ne université | Misangu yonso | Bikese |
| Mbulamatadi ne mikenji | Misangu yonso | Bikese |
| Ba site web | Ba milliards a mabeji | Bikese bikole |

<!-- @daily_life_online -->
Anglais kêna ne ba ressources a bungi bualu muntu kampanda wakafuta bua ba données to. Udi nawu bualu **malu a dituku dionso adi enzeka ku internet mu Anglais**: malongesha, ba forum, ba application a banque, biakudia, matandu mu ba commentaire.

**IA udi ulongela ku malu adi ashala au.**

<!-- @beyond_data -->
Mu 2020, pamue ne Masakhane, tuakamba ne bualu ebu kabuena anu bua ba données to:

> « Dikengela dia ba ressources ndilu lukunukunu ludi lupitshisha bualu bua ba données ne **dileja ntatu ya nsombelu wa bantu**. » *(bikudimuna ku Anglais)*

Ntshidi mbuitabuja.

<!-- @low_digitised -->
> **Ba ressources bikese mbumvuija mifundu ya numérique mikese, ki mushinga mukese to.** Ingénierie udi mua kulongolola bualu ebu.

<!-- @counting -->
## Bua tshinyi: pré-entraînement udi ulonga ba fréquences

Mu tshikondo tshia **pré-entraînement**, LLM kena ulama tablo wa mibalu to : udi ulongolola ba poids biende $\theta$ bua kukepesha tshilema tshia cross-entropy tshia token udi ulonda :

$$\mathcal{L}(\theta) = -\frac{1}{N}\sum_{t=1}^{N} \log p_{\theta}(w_t \mid w_{<t})$$

Bua contexte $c$ udi upingana misangu ya bungi, tshilema tshidi tshikala tshikese menemene padi $p_{\theta}$ muakangane ne ba fréquences ba mifundu ya dilongesha. Ba poids basangisha badi basemena anu pabuipi, ne badi benza kabidi généralisation ku ba contextes kabaayi banji kumona :

$$p_{\theta}(w \mid c) \approx \hat{p}(w \mid c) = \frac{\mathrm{count}(c,\ w)}{\mathrm{count}(c)} = \frac{k}{n}$$

<!-- @counting_example -->
Tuangate tshilejilu tshia dituku dionso mu **Swahili**: $c =$ *« Niko naenda ku … »* (*« Ndi nya ku … »*). Tuelayi meji ne corpus mukese wa pré-entraînement udi ne contexte eu misangu $n = 10$:

| Muaku udi ulonda $w$ | Diumvuija | Bungi $k$ | $\hat{p} = k / n$ |
| --- | --- | --- | --- |
| `nyumba` | ku nzubu | 2 | $2/10 = 0.20$ |
| `masomo` | ku kalasa | 3 | $3/10 = 0.30$ |
| `kazi` | ku mudimu | 3 | $3/10 = 0.30$ |
| `soko` | ku tshisalu | 2 | $2/10 = 0.20$ |

Kusakidila paramètres kakuena kusakidila bijadiki to : mifundu ya pabuipi idi yambuluisha modèle bua kuenza généralisation, kadi kayena mua kupingana pa muaba wa bilejilu bia Swahili. *(Apa tudi tuleja miaku mijima bua bitoke ; mu bulelela $w_t$ udi **token** — tshipindi tshia muaku — tshidi tshituambula ku tokenisation pashishe.)*

<!-- @how_sure -->
**$\hat{p} = k/n$ udi wa bushuwa bishi?** Bikala mu bulelela *« nyumba »* ulonda *« Niko naenda ku »* ne probabilité $p = 0.2$, nunku $k \sim \mathrm{Binomial}(n, p)$, ke bualu kayi $\mathrm{Var}(\hat{p}) = \frac{p(1 - p)}{n}$ ne:

$$\mathrm{SE}(\hat{p}) = \sqrt{\frac{p(1 - p)}{n}}, \qquad \text{erreur relative} = \frac{\mathrm{SE}(\hat{p})}{p} = \sqrt{\frac{1 - p}{n\,p}}$$

*Note: formule eu udi uangata ne musangu wonso udi pa nkayawu (indépendant). Mifundu ya internet idi ipingaja malu (ba pages ba copie, muaku umue misangu ya bungi mu document umue), nunku erreur wa bushuwa utu **misangu ya bungi mupite bunene**.*

Bualu erreur udi ukepela ne $1/\sqrt{n}$, **kukosolola erreur mu bitupa bibidi kudi kukengela ba données misangu $4\times$ kupita** (ne kumukepesha misangu $10\times$ kudi kukengela ba données misangu $100\times$ kupita):

<!-- @zero_counts -->
**Padi bungi buikala bukese anyi zéro:** nansha bua muaku muimpe udi ne probabilité wa bushuwa $p$, mushindu wa kupanga kuwumona mu bilejilu $n$ udi $P(k = 0) = (1 - p)^n$ (pa $n = 10$, $\approx 11\%$ bua $p = 0.2$, ne $\approx 60\%$ bua muaku udi kawuyi umueneka misangu ya bungi bu *« hospitali »* (lupitadi) pa $p = 0.05$).

Bikala modèle kayi muanji **kumona** contexte au nansha musangu umue ($n = 0$), $\frac{0}{0}$ kena ne mushinga to. Kadi modèle udi anu wandamuna ne généralisation wa ba contextes ba pabuipi, ne padi ba données bakese udi mua kubuela mu Français anyi mu Swahili wa ku Est wa Afrika, anyi kupatula miaku ya mashimi.

<!-- @counting_takeaway -->
> **Modèle udi umanya muakulu anu bu muvuaye muubale.**

<!-- @token_tax -->
## Mulambu wa tokenisation

Kumpala kua kubala, mifundu idi ikosolola mu **tokens**. BPE udi ubanga ne maleta, usangisha paire udi upingana misangu ya bungi, misangu ne misangu.

<!-- @bpe_inside -->
### Munda mua `bpe_step` umue

`bpe_step` **ki package to**: udi fonction muipi mufunda bua muyuki eu (`talk_kit.py`), bilondeshile Sennrich et al. Mutshima wawu, mu mushindu mupepele:

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
Muaku wetu, *« Muakulu kawena ne bua kuikala tshibikilu tshia dimanya to »*, katataka ne tokeniseur wa bushuwa: `o200k_base`, udi **OpenAI** wenza nende mudimu bua **GPT-4o**, mu bibliothèque wende `tiktoken`. Bisumbu bikuabu bia ba modèles bidi bikosolola mifundu mu mushindu mukuabu.

<!-- @tax_headers -->
| Muakulu | Miaku | Tokens | vs Anglais | Mudimu wa attention (∝ T²) |

<!-- @tax_chart_title -->
Tokens ne mudimu wa attention, bilondeshile Anglais

<!-- @tax_chart_tokens -->
Tokens

<!-- @tax_chart_attention -->
Mudimu wa attention

<!-- @why_square -->
**Bua tshinyi $T^2$?** Bidi bifumina ku formule wa attention wa *Attention Is All You Need*:

$$\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^{\top}}{\sqrt{d_k}}\right) V, \qquad Q, K \in \mathbb{R}^{T \times d_k}$$

$QK^{\top}$ udi ufuanyikija token yonso ne token yonso: grille wa ba scores $T \times T$, $9 \times 9 = 81$ bua Anglais, $20 \times 20 = 400$ bua Tshiluba.

$$\frac{400}{81} = \left(\frac{20}{9}\right)^2 \approx 4.94$$

<!-- @what_it_costs -->
`koyekolisa` (kulongesha, Lingala), mukosolola kudi ba tokeniseurs babidi:

| Tokeniseur | Disangisha dilongela mu | Bitupa | Muji **-yekol-** |
| --- | --- | --- | --- |
| BPE wetu wa tshilejilu, misangu 4 | Miaku 4 ya Lingala | `ko · yekol · i · s · a` | tshitupa tshimue |
| `o200k_base` | Mifundu ya OpenAI (disanga kabayi badimanyishe) | `k · oy · ek · ol · isa` | mmukosa mu bitupa bisatu |

Tokeniseur udi ulama tshijima tshivua **tshipingana misangu ya bungi mu mifundu ivuaye mulonge**. *Wetu udi tshilejilu; ba bushuwa badi balonga pabuipi ne bitupa 200 000 kubangila ku ba octets.*

Message umue mu Tshiluba ne `o200k_base`: **ba tokens misangu 2.2**, nunku **mushinga misangu 2.2** padibu bafuta bua token, mifundu **misangu 2.2 mikese** mu contexte, ne mandamuna a bitekete. *Muaku umue udi anu tshilejilu; pima corpus kumpala kua kujikija.*

<!-- @tax_open -->
**Lutatu lua patoke:** ba tokeniseurs badi banemeka morphologie wa Bantu (`préfixe + muji + extension + voyelle wa ndekelu`).

<!-- @embeddings -->
## Embeddings ne similarité cosinus

Nimero wa token kena ne diumvuija to. **Embedding** udi upesha muaku anyi muaku mule vecteur; diumvuija dia pabuipi didi dilua angle mukese:

$$\mathbf{e} = \phi(x) \in \mathbb{R}^{d}, \qquad \cos(\mathbf{u}, \mathbf{v}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|\,\|\mathbf{v}\|}$$

<!-- @theory_and_practice -->
**Mu théorie**, muaku wa Lingala ne dikudimuna diawu mu Anglais badi bapeta vecteur umue pabuipi.

**Tshitudi tumona misangu ya bungi** mu ba modèles bakamona Lingala mukese (ba vecteurs ba tshilejilu):

<!-- @embedding_limits -->
- Miaku idi mua kusangila bilondeshile **muakulu**, ki **diumvuija** to: nunku kukeba mu Lingala kudi kupingaja mifundu ya Lingala, ki diandamuna dimpe to.
- Score 0.8 kayi wumvuija bualu bumue mu Tshiluba ne mu Anglais: ba seuils balongolola mu Anglais badi banyanguka.

<!-- @embedding_open -->
**Lutatu lua patoke:** kupima ne kulongolola ba embeddings ba miakulu yetu, ne ba paires a miaku itangila kudi bena muakulu.

<!-- @metrics -->
## Ba métriques kabayi bamanya miakulu yetu

Misangu ya bungi dikudimuna didi dipeta note bilondeshile tshididi disangile ne référence: **BLEU** udi ufuanyikija milongo ya miaku, **chrF** milongo ya maleta.

<!-- @two_answers -->
Mandamuna abidi mu Tshiluba, ne note yawu:

<!-- @wrong_answer_wins -->
- `mayi` pa muaba wa `mâyi`: **diumvuija dimpe**, mufundilu mukuabu, chrF wa munshi.
- `kulonga` pa muaba wa `kulongesha`: **diumvuija dibi**, chrF wa muulu.

**Métrique udi usungula diandamuna dibi.**

*Mibalu idi imueneka eyi idi ya chrF mupepele (maleta 1–3). Version standard (1–6) udi uleja pende nanku : 0.49 bua diandamuna dibi, 0.27 bua diandamuna dimpe.*

<!-- @why_metrics_fail -->
- Mufundilu kawena umue to (*â* anyi *a*, *ɛ* anyi *e*, ne ba tons anyi to).
- Muaku umue mule udi ukuata muaku mujima: affixe umue mubi, BLEU udi ujimija muaku mujima.
- LLM kayi umanya Tshiluba bimpe kena mua kupesha Tshiluba note to.

<!-- @metrics_open -->
**Lutatu lua patoke:** ba tests bafunda ne malu etu, ba métriques badi bamanya morphologie ne mufundilu, ne évaluation kudi bena muakulu.

<!-- @local_llms -->
## LLM wa ku muaba: modèle mu ordinateur webe

- **Bukokeshi:** ba données bebe badi bashala kuudi, mu ditunga diebe
- **Hors ligne:** udi wenza mudimu nansha connexion kayi muimpe
- **Kufuta token to:** mulambu wa token udi ulua calcul webe nkayebe
- **Ba poids patoke:** udi mua kulongolola modèle bua miakulu yetu

<!-- @memory_rule -->
**Mémoire bungi kayi?** Ba poids badi bangata pabuipi ne **paramètres × bits ÷ 8** octets, ne muaba bua contexte (misangu ya bungi 1–2 Go, kupita padiye mule):

<!-- @memory_chart_title -->
Mémoire udi ukengela bua ba poids

<!-- @memory_chart_full -->
16 bits

<!-- @memory_chart_quantised -->
4 bits (quantisé)

<!-- @what_fits -->
| Machine webe | Ba modèles badi babuela (4 bits, pabuipi) |
| --- | --- |
| Laptop, RAM 8 Go | Too ne pabuipi 3–4 B a paramètres |
| Laptop, RAM 16 Go | Too ne pabuipi 8 B |
| GPU, 24 Go | Too ne pabuipi 30 B |
| 48 Go anyi kupita | Pabuipi 70 B |

<!-- @tools_to_run -->
| Tshia mudimu | Tshimpe bua |
| --- | --- |
| Ollama | Commande umue bua kupuekesha ne kuyukila, ne API wa ku muaba |
| LM Studio | Application wa graphique, kakuyi terminal |
| llama.cpp | Contrôle mujima, udi wenza mudimu pa CPU, telefone, ba cartes bakese |

<!-- @try_tonight -->
```bash
ollama run llama3.2:3b        # downloads ~2 GB once, then works offline

curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:3b", "stream": false,
  "prompt": "Translate into Lingala: Language should never be a gate to knowledge."
}'
```

<!-- @adapt_with_lora -->
**Kumulongolola bua miakulu yetu ne LoRA:** lekela $W$ bu mudiye ne longesha anu ba matrices babidi bakese.

$$W' = W + BA, \qquad B \in \mathbb{R}^{d \times r},\quad A \in \mathbb{R}^{r \times k},\quad r \ll \min(d, k)$$

<!-- @be_honest -->
**Tshitudi tumona:** ba modèles bakese ba patoke badi anu ne bunyanu mu Lingala ne Tshiluba. Kubalongolola ne kubapima mbudimu bua patoke, ne budi bukengela ba données betu.

<!-- @masakhane -->
## Masakhane: tuibakayi pamue

**Masakhane** (*« tuibakayi pamue »* mu isiZulu) ndisangisha dia ba chercheurs ba mu Afrika badi bibaka ba données, ba modèles ne ba méthodes bua miakulu ya mu Afrika, patoke. Ngakadi membre wa conseil wa **Masakhane Research Foundation** kubangila mu 2021 too ne pankatshi pa 2026.

<!-- @my_work -->
- **2020:** traduction automatique wa pamue bua miakulu ya mu Afrika ipita 30
- **LiSTra:** corpus ne système wa dikudimuna dia diyi Anglais-Lingala
- **BibleTTS, IrokoBench, INJONGO:** ba données ba diyi ne ba benchmarks bua miakulu ya mu Afrika

<!-- @what_i_learned -->
**Tshindi mulonge:** ba données a musangu umue adi ne mushinga: akatupesha ba benchmark ne ba modele a kumpala. Kadi **ba données ndi foto wa tshikondo tshimue; muakulu udi bantu benza nawu mudimu bulelela ku internet udi ukola dituku dionso.** Ne makuta adi alua bitekete ne adi ajika.

<!-- @darakili -->
## DarAkili: tuikalayi ne muoyo mu miakulu yetu

Tuakalua ne ba ressources bikese bualu muoyo mu miakulu yetu uvua wakula, kauyi ulama. Nunku diandamuna ndi:

<!-- @live_in_our_languages -->
> **Kuambula bilele bietu bia dituku dionso, mu miakulu yetu, mu espace numérique:** kulonga, kulongesha, kufunda, ku-enregistrer ne kuyukila mu Lingala, Tshiluba ne Swahili.

<!-- @what_we_build -->
Mu dîba dianyi dia dikisha, ndi ngenza mudimu pa **DarAkili** (**SALELA BONGO LLC**): malongesha a STEM, a mamanyi a numérique ne mu katupa a IA, mu **Lingala, Tshiluba, Swahili** ne mikuabu ayilua.

Malongesha a bungi ndi **a diyi**, bualu nunku ke mudi bantu ba bungi benza mudimu ne miakulu yabu. Kulonga science kakuena ne bua kuikala ne tshibikilu tshia Anglais anyi Français to.

<!-- @why_it_works -->
Dilongesha dionso dilongesha mu miakulu yetu ndi **mifundu ne diyi bipiabipia bia numérique** mu miakulu yetu, bienza ne kuikala ne muoyo mu miakulu eyi, ki ne projet wa musangu umue to.

> **Bantu batuma makuta kumbelu. DarAkili utuma dimanya kumbelu.**

<!-- @your_part -->
**Tshitupa tshiebe:** longesha dilongesha dimue mu muakulu webe, funda ba notes bebe mu muakulu au, ne bipatule bua bakuabu babisadile kabidi.

**Bana betu ba diaspora:** biwamanya kulongesha tshintu mu muakulu wa mamu webe, ndi ne disanka bua kukuteleja.

<!-- @not_magic -->
## Panyima pa lutatu luonso, science wa kulonga

| Lutatu | Diandamuna | Science |
| --- | --- | --- |
| Miakulu yetu kayena mu numérique to | Kuikala, kulonga, kupatula mu miakulu eyi | Linguistique, données |
| Bilejilu bikese | Mifundu ya bungi, kubala bimpe | Probabilité |
| Ba tokens badi bakosa miaku yetu | Ba tokeniseurs ba morphologie | Compression |
| Ba vecteurs kabayi bamanya diumvuija dietu | Ba embeddings balongolola | Algèbre linéaire |
| Ba métriques kabayi bamanya miakulu yetu | Évaluation kudi bena muakulu | Statistique |
| Mushinga wa cloud, kakuyi bukokeshi | LLM wa ku muaba, LoRA | Algèbre wa rang mukese |
| Bantu bakese ke badi benza mudimu pa ba poids | Longa machine learning, ki anu ba API to | Statistique, optimisation |

<!-- @open_problems -->
### Ntatu ya patoke ya kulama mu meji

1. Test wa Lingala anyi wa Tshiluba mufunda ne malu a ku muaba
2. Ba tokeniseurs badi balama miji ya Bantu mijima
3. Modèle mukese wa patoke mulongolola bua muakulu umue wa mu Congo, ne mupima ne bulelela
4. Kumvua diyi ne ba tons

<!-- @your_turn -->
**Mudimu webe:** sungula tshia mudimu tshipiatshipia tshia AI ne andamuna ku nkonko isatu ya ku ntuadijilu:

1. Udi wandamuna **lutatu** kayi?
2. **Ingénierie** udi wenza tshinyi?
3. **Science** kayi udi munshi?

Pashishe longesha bualu bumue mu muakulu webe.

<!-- @thank_you -->
## Tuasakidila · Matondo · Aksanti · Merci · Thank you
