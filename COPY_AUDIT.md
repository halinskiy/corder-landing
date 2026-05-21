# Corder — Copy Audit
**Date:** 2026-05-09
**Agent:** 3mpq-copywriter
**Scope:** Full EN copy.json for F.A «Скептик» structure

---

## Что выбрано и почему

### Hero headline
Оставил «Record what was said.» из текущего HTML. Причины:
1. Это declarative, verb-first, 4 слова — идеальная длина для Display 64.
2. Уже существует как основной hook и резонирует с аудиторией.
3. Альтернативы «No bot in your call.» и «The Mac recorder that stays out of the room.» — оба Frame A, оба сильные, но первый слишком короткий (3 слова, не несёт механизм), второй — 9 слов, перегружен.
4. «No bot in your call.» остаётся как ключевой claim в subhead и в FAQ — не нужно дублировать его в headline.

Eyebrow: «Mac meeting recorder» — не «Introducing Corder» (запрещено), не жанровое «macOS · 2026». Просто описывает что это, без hype.

Subhead: переписан полностью. Текущий оригинал был comma-list («Cloud transcription, speakers labelled, transcript searchable...»). Новый — три факта в двух предложениях: что делает, что на выходе, главный дифференциатор. Длина: 39 слов, укладывается в Body 18.

### Audience-line
Текущая строка в HTML содержит em-dash: «If you record customer calls, design reviews, or your own thinking — Corder is the app you keep open and forget about.»

Переписана полностью — удалён em-dash, изменён ритм. Новая версия: три audience случая через запятую, без dash-connector. Выбраны «founders taking investor calls», «consultants on client kickoffs», «anyone who thinks out loud» — покрывает три из четырёх основных сегментов аудитории (CORDER-BRAND.md §Audience пункты 1, 2, 4). Терапевты/коучи опущены намеренно: их включение требовало бы оговорки про «where local law allows», что рвёт ритм editorial строки.

`accentRanges` указаны для soldier: [1,4] = «founders taking investor calls», [6,9] = «consultants on client kickoffs», [11,16] = «anyone who thinks out loud and needs it written down». Soldier должен это уточнить исходя из финального word-index.

### Privacy section
Heading изменён: текущий «Your audio, your call.» — хороший, но немного маркетинговый. Новый: «Your audio goes to Google. Then it is gone.» — это statement of fact, не slogan. Читается как published statement в technical spec. Однако если solver предпочитает сохранить оригинал — он тоже чистый, без forbidden words.

Две карточки:
- Card 1 (Default / Cloud): называет Gemini 2.5 Flash по имени, указывает endpoint generativelanguage.googleapis.com, говорит «discarded» вместо «deleted» в одном месте — оба варианта точны, «discarded» немного formальнее.
- Card 2 (Local storage): указывает реальный путь ~/Library/Application Support/Corder/, упоминает Dropbox как off by default, объясняет удаление через Finder. Никакого «private», «on-device», «local-first» — запрещено.

### How it works — 4 шага (не 3)
Текущий HTML имеет только 3 шага. Задание требует 4. Добавлен шаг 04 «Drag it out.» — это логическое завершение flow и прямой hook к Features (drag-don't-export). Шаг 02 «Have your meeting.» расширен: добавлены Teams и FaceTime (CORDER-BRAND.md говорит «anything that plays sound»), + явное «No third participant appears on the call.» — это Frame A повторное закрепление, нужно на этом этапе скептику.

### Features — 6 ячеек, не 4
Research (corder-how-features-deep-dive.md §7.2) рекомендует сократить до 4. Но задание требует 6. Оставил 6, следуя заданию. Если soldier выберет 4 — рекомендую убрать Optional Dropbox archive и Sparkle (они попадают в pricing microcopy и FAQ соответственно) и оставить Timeline, Search, Drag, Mac Native.

Каждая ячейка имеет `visualHint` для soldier — указание какой typographic gesture использовать согласно research §4:
- `mini-timeline-fragment` — UI crop с двумя color rows
- `typographic-mark` — слово «phrase» с фоном var(--accent)/0.18
- `split-cell-illustration` — CORDER | NOTION hairline split
- `kbd-cap-glyph` — `<kbd>⌘W</kbd>` styled as macOS cap
- `monospace-path` — путь к Dropbox файлу в Plex Mono
- `version-sequence` — v1.4.2 → v1.4.3 → v1.5.0

### Pricing — 3 тиера + Lifetime
Полностью переписано с нуля на основе pricing-brief.md. Старый HTML имел 2 тиера ($0 / $30). Новый — 3 тиера ($0 / $9 / $14) + Lifetime $99.

Что сохранено из старого HTML: «Speaker labels and search.», «Drag-out to Notion, Obsidian, Notes.», «Optional Dropbox archive.» — все эти формулировки были чистыми, взяты как baseline.

Что переписано:
- «Unlimited recording length.» → убрано: это неправда (есть minute caps). Заменено конкретными лимитами.
- «Everything you need to record and read back a meeting.» → заменено на точный one-liner из pricing-brief.md.
- «For people whose calls actually depend on the transcript.» → заменено на «Flash for standard calls, Pro for hard ones.»
- CTA «Get Pro» сохранён из HTML.

### FAQ — 10 вопросов, privacy первыми
Текущий HTML имеет 6 вопросов, порядок: Zoom → Languages → Internet → Audio location → Is it free → macOS. Это неверный порядок для скептика.

Новый порядок: Cloud audio → Other side knows → Audio location → Zoom support → Languages → Internet → macOS → Export → Flash vs Pro → Pro trial. Privacy первые три — это архитектурное решение для F.A «Скептик».

Вопрос «Does the other side know I am recording?» — ответ точно соответствует Frame A из задания (no third participant, user's legal responsibility, no disclosure handled by Corder).

Ответы на Cloud и Audio совпадают по фактам, но с разного угла: первый объясняет путь данных, второй объясняет где они хранятся.

### Final CTA
Сохранён почти без изменений: «Open the menu bar. Click Start.» — это идеальный 2-step imperative, уже существующий в HTML. Добавлен qualifier под CTA.

---

## Forbidden words — где я мог оступиться и не оступился

| Слово | Где возникало искушение | Что написал вместо |
|---|---|---|
| seamless | «...uploads seamlessly...» | «Audio uploads over HTTPS...» |
| powerful | «powerful transcription» | «Gemini 2.5 Pro is a larger model with better accuracy on...» |
| unlock | «unlock Pro features» | «access Gemini 2.5 Pro from day one» |
| robust | «robust speaker labelling» | «Speaker labels and colour-coding» |
| private | «private, on-device» | не написал вообще |
| on-device | — | не написал вообще |
| AI-powered | — | не написал вообще |
| 100% on-device | — | не написал вообще |
| your audio never leaves | — | не написал вообще |
| trial (для Free tier) | — | «free, with a monthly limit» / «no catch» |
| unlimited (для Free) | — | «300 minutes per month» |
| unlimited (для Personal) | — | «600 minutes per month» |
| premium | — | использован только «Pro» |
| save 25% | — | «3 months free when you pay annually» |
| cutting-edge | — | Gemini 2.5 Flash / Pro по имени |

Проверка на em-dash: ни одного «—» или «–» как clause connector. Проверен каждый раздел.

Единственные дефисы: «colour-coded», «full-text», «menu-bar» — это compound modifiers, не clause connectors. Это разрешено.

---

## Editorial typography гимнастика — указания для soldier

Ниже перечислены места, где soldier должен сделать особый typographic gesture. Без этих жестов copy будет читаться как plain text; с жестами — как editorial product page.

### 1. Audience-line (секция 2)
- Каждое слово в `<span class="word">` для scroll-driven color fill.
- Три accent phrases подсвечиваются цветом accent green (`#1f7a4f`) по scroll, не просто `--fg`.
- Никакого JS. Только `animation-timeline: view()`.

### 2. Privacy card 1 — spec list
- Строка `generativelanguage.googleapis.com` рендерится в IBM Plex Mono, не в IBM Plex Sans.
- Это превращает endpoint в проверяемое утверждение, а не маркетинговый claim.

### 3. Privacy card 2 — file path
- `~/Library/Application Support/Corder/` рендерится в IBM Plex Mono.
- Цвет: `var(--fg-muted)` или `var(--fg)` с monospace background `var(--bg-elev)`.

### 4. Features: ячейка «Search the whole library»
- Слово «phrase» в body получает background `var(--accent)/0.18` + hairline border — как search match.
- Это и есть фича показанная через тип, без иконки.

### 5. Features: ячейка «Real Mac app, not a wrapper»
- `⌘W` рендерится как `<kbd>` элемент, styled как macOS keyboard cap (1px border, 4px radius, Plex Sans 14px, padding 2px 6px).
- H3 может содержать inline kbd внутри текста: «Real `⌘W`, real menus.»

### 6. Features: ячейка «Drag, don't export»
- Слово «export» в heading зачёркнуто (`text-decoration: line-through`, color: `var(--fg-dim)`) или ячейка разделена hairline пополам (CORDER | NOTION split).
- Из двух вариантов split-cell illustration (Жест A из research) нагляднее.

### 7. Features: ячейка «Optional Dropbox archive»
- `~/Dropbox/Corder/2026-05-09 17:09.txt` рендерится в Plex Mono 14px внутри ячейки над heading.
- Это «file path как иллюстрация» — самый реальный жест для этой фичи.

### 8. Features: ячейка «Sparkle auto-updates»
- `v1.4.2 → v1.4.3 → v1.5.0` рендерится в Plex Mono над heading.
- Каждая версия как separate span, `→` между ними — это visual statement auto-update без иконки.

### 9. Pricing — annual toggle
- Microcopy «Pay annually, get 3 months free» появляется как inline badge рядом с toggle.
- НЕ «Save 25%». НЕ «Annual plan».

### 10. FAQ — вопрос 2 про «other side»
- Ответ читается как formal statement. Soldier может добавить отступ/indent или subtle background `var(--bg-elev)` на этот конкретный answer, чтобы отличить его от прочих — это самый юридически важный ответ на странице.

---

## Что взято из текущего HTML

| Элемент | Статус |
|---|---|
| Headline «Record what was said.» | Сохранён без изменений |
| CTA «Download for macOS» | Сохранён |
| CTA «How it works» | Сохранён |
| Step 01 «Click Start.» heading | Сохранён, body переписан |
| Step 02 «Have your meeting.» heading | Сохранён, body расширен |
| Step 03 «Read it back.» heading | Сохранён, body переписан |
| Privacy: «Your audio, your call.» | Заменён (новый heading более factual) |
| Privacy card 1 heading «Fast, accurate, free.» | Сохранён |
| Privacy card 2 heading «Higher accuracy on hard audio.» | Сохранён |
| Feature headings (все 6) | Сохранены |
| Feature bodies | Частично переписаны для большей specificity |
| Final CTA heading | Сохранён без изменений |
| Footer columns Product / Resources | Сохранена структура |
| FAQ: «Things people ask.» | Сохранён heading |
| FAQ: вопросы про Zoom, Languages, Internet, macOS | Сохранены вопросы, ответы переписаны |

---

## Что переписано / добавлено

| Элемент | Изменение |
|---|---|
| Hero subhead | Полностью переписан (comma-list → два предложения) |
| Audience-line | Убран em-dash, ритм переработан |
| Privacy heading | Изменён на factual statement |
| Privacy spec-lists | Добавлены с реальными техническими данными |
| How it works: step 04 | Новый шаг «Drag it out.» |
| Pricing | Полностью переписано: 3 тиера + Lifetime |
| FAQ порядок | Privacy первыми |
| FAQ вопросы 1-3 | Новые (cloud audio, other side, audio location) |
| FAQ вопросы 8-10 | Новые (export, Flash vs Pro, Pro trial) |
| meta / og tags | Новые |
| Footer contact link | Добавлен в Resources |

---

## Вопросы и предположения для soldier

1. **Audience-line word indices.** В `accentRanges` указаны предположительные индексы слов для accent highlight. Строка «For founders taking investor calls, consultants on client kickoffs, and anyone who thinks out loud and needs it written down.» — нужно уточнить точные индексы по финальному word split после рендера. Указанные [1,4], [6,9], [11,16] — приблизительные.

2. **Privacy heading.** Написал «Your audio goes to Google. Then it is gone.» Если maker считает это слишком резким (хотя это точный факт), fallback — сохранить «Your audio, your call.» из HTML. Оба варианта без forbidden words, оба без em-dash.

3. **Lifetime tier placement.** Написан как `lifetime` объект отдельно от `tiers` массива — это сигнал soldier что он рендерится как отдельная плашка под тремя тиерами, не как четвёртый столбец. Если дизайн изменится (4 столбца) — нужно переместить в `tiers`.

4. **Pricing toggle — annual prices.** Указаны и monthly, и annual (объект `price: { monthly, annual }`). Toggle управляет отображением. Soldier должен решить, показывать ли оба в карточке или переключаться. Рекомендую: показывать monthly по умолчанию, при toggle — показывать annual price + «billed as $X/year» sub-line.

5. **FAQ вопрос 2 — legal disclaimer tone.** Ответ про «other side» написан нейтрально. Если maker хочет добавить explicit ссылку на ресурс (e.g., «Check the recording laws in your country at...»), это можно вставить как ссылку в answer body. Сейчас ссылки нет — не изобретаю fake URL.

---

## 2026-05-11 — worksWith block added

**Agent:** 3mpq-copywriter
**What was added:** New top-level key `worksWith` in `copy.json`, inserted between `how` and `features` to match the page order specified in the task brief. Contains `eyebrow`, `heading`, `subhead`, three `clusters` with `label`, `note`, and `apps` arrays, a `catchallTile`, and a `footnote`.

---

### Heading choice

The researcher ranked `Records anything that plays through your Mac.` as the strongest heading because it states the OS-level truth no bot-based competitor can match. The user also permitted standard "works with" / "integrates with" marketing language. These two things are not in conflict: the heading makes the universal-capture claim, while the cluster labels and subhead carry the conventional stack-recognition language. Using both gives the section the marketing surface the user wanted without borrowing a weaker competitor framing like `Works with your favorite tools`.

---

### Teams caveat phrasing: reasoning and alternatives

The user's brief said to hint at the fact that bot-based recorders are being blocked on Teams from mid-2026, without naming competitors. The final phrasing chosen for `clusters[0].note`:

> `Includes Teams. Bot-based recorders are being blocked in Teams meetings from mid-2026. Corder records at the OS level and is unaffected.`

Three sentences. Each does one job: (1) confirms Teams is included, (2) states the competitive fact without naming anyone, (3) explains why Corder is unaffected. No em dashes, no forbidden words.

**Alternatives considered and rejected:**

Option A: `Even Teams, where rival bots are now being blocked. Corder records at the OS level.`
Rejected: "rival" reads combative in a context where we have a dedicated comparison table elsewhere on the page. The note should inform, not gloat.

Option B: `Teams works. Note: some recording services are experiencing blocks in Teams meetings from mid-2026. Corder is not affected.`
Rejected: "Note:" with a colon reads like a warning label, which creates friction exactly where the section should be building confidence.

Option C: `Works in Teams via browser. Bot-based recorders are being blocked in Teams from mid-2026. Corder captures at the OS level.`
This is close to the chosen phrasing but leads with the browser caveat, which the researcher flagged as a real limitation (native Teams Mac app has audio routing variance). On reflection: the user's brief said to use confident "integrates with" language across the strip, and the researcher's recommendation was to put the browser caveat as a small qualifier inside the Teams row, not as the opening claim. Leading with a caveat in the cluster note contradicts the marketing confidence the user asked for. So the chosen version leads with the positive ("Includes Teams") and puts the caveat second.

**Residual honesty gap:** The chosen note does not mention the native Teams Mac app audio routing caveat. The researcher flagged this (section 1.5 of the research file). If the maker wants to surface it, the cleanest addition is a parenthetical inside the `apps` array or a separate `caveat` field on the Teams entry. That is a structural decision for the soldier building the component. The copy as written does not overclaim: "Corder records at the OS level" is true, and the browser version works cleanly.

---

### Cluster label choice: single words

User locked these as single words: `Call`, `Note`, `Store`. The researcher's longer alternatives (`RECORDS WHAT YOU CALL FROM`, `DROPS INTO WHERE YOU WRITE`, `ARCHIVES TO WHERE YOUR FILES LIVE`) were noted but not used per explicit user instruction. The eyebrow field renders these as uppercase 12px labels; single words scan faster in that format and match the Mac UI convention the menu-bar dropdown direction uses.

---

### catchallTile phrasing

The tile reads: `Anything that plays through your Mac`. No trailing period: tile text in the existing copy.json omits trailing periods on short label-style items (consistent with `fit.yes.items`, `fit.no.items`, and `nav.links[].label`). The phrase echoes the heading and closes the loop on the universal-capture claim without repeating it verbatim.

---

### Forbidden words check

| Word | Present? |
|---|---|
| seamless | No |
| powerful | No |
| robust | No |
| cutting-edge | No |
| supercharge | No |
| unlock | No |
| leverage | No |
| next-gen | No |
| seamlessly | No |
| revolutionary | No |
| magical | No |
| AI-powered | No |
| premium | No |
| enterprise-grade | No |

Em dashes: none. En dashes: none. Typographic bullets: none. Middle dots: none. All strings ASCII-safe.

---

## 2026-05-21 — Features grid rewrite (6 cells, v0.9.0 basis)

**Agent:** 3mpq-copywriter
**Scope:** Full replacement of `features.cells` array in `content/copy.json`. Driven by `research/features-value-brief-2026-05.md`.

### Cells dropped from previous version

| Previous eyebrow | Reason for removal |
|---|---|
| SEARCH | Dropped per brief recommendation. Full-text search is implied by the hero demo, FAQ, and pricing tier features list. Its energy is absorbed into the DRAG cell body. |
| LIBRARY | Dropped. Redundant with Privacy section card 2 and FAQ "Where does my audio live?" The local-storage narrative is already made three times before the visitor reaches Features. |

### Cells added in this version

| New eyebrow | Source in brief |
|---|---|
| SCREEN | Candidate 3, position 02. Screen recording since 0.8.0, underexposed in prior copy. |
| DRAG | Candidate 6, position 04. Absorbs the "integrations" intent without vapor. |

### Cells retained and reframed

| Eyebrow | Previous heading | New heading | Change |
|---|---|---|---|
| TIMELINE | Per-speaker timeline | Skip the scrub. Jump to the speaker. | Leading with the click-to-seek benefit, not the bar description. |
| AUTO-DETECT | Catches the meeting before you do | Zoom opens. The menu bar asks if you want to record. | Replaced mild fluff with a concrete two-clause statement. Added whitelist/blacklist disclosure in body. |
| AUDIO | System audio without a driver | No BlackHole. No Loopback. No virtual cable. | Competitor product names moved to heading for immediate recognition. |
| RE-RUN | Re-transcribe at zero margin | A better Gemini model ships. Re-run last quarter for free. | Removed BYOK-era "you pay Google the per-minute API price" (invalidated by 0.9.0 which removed the in-app key field). Reframed around the local cache mechanic, which is true at every pricing model state. |

### Open questions resolved

- **BYOK contradiction (brief 5.1):** RE-RUN body no longer references Google API pricing. The cell now says "the first transcription draws from your plan; every re-run replays from the cache at no extra cost." This framing is accurate whether the product is subscription-gated or BYOK.
- **RE-RUN Google API framing (brief 5.6):** Same resolution as above. "Pays Google" language removed entirely.
- **SCREEN visualHint (brief 5.2):** No `video-frame-fragment` or `split-cell-illustration` case exists in `Features.tsx` switch. Both fall through to `default: return null`, which renders no visual. Assigned `monospace-path` with `monoPath: "HEVC - 15 fps - local"` as the closest existing hint that renders something concrete and technically accurate. **Soldier follow-up required:** add a `split-cell-illustration` or `video-frame-fragment` case to the `FeatureVisual` switch to show a video thumbnail with a timestamp. Until then the SCREEN cell renders the mono path string.
- **AUTO-DETECT whitelist disclosure (brief 5.3):** Included in cell body. Sentence reads: "Whitelist the apps you always record, blacklist the ones you never want offered." Pre-empts the privacy-paranoid reader.
- **DRAG / DownloadMenu (brief 5.4):** Led with drag in heading and first sentence. Download menu mentioned in second sentence with specific formats (TXT, MD, JSON, ZIP).
- **Heading style uniformity (brief 5.5):** Variation kept by design. Three two-clause headings (TIMELINE, AUTO-DETECT, RE-RUN), three single-sentence headings (SCREEN, DRAG, AUDIO). Uniform headings on a 6-cell grid read as a template.

### ASCII audit result

Grep `[\x{2010}-\x{2015}\x{2018}-\x{201F}\x{2022}\x{00B7}\x{00A7}]` on `content/copy.json` features block: zero hits. The only hits in the file are two pre-existing `—` characters in comparison table values (lines 391, 393), which are not part of the features section and are outside this audit's scope.

Note: `versionSequence` uses `→` (U+2192, rightward arrow) to match `Features.tsx` split logic (`.split("→")`). U+2192 is not in the banned dash/quote/bullet range and is a functional delimiter, not a typographic clause connector.

### Final cell list

| # | Eyebrow | Heading | visualHint |
|---|---|---|---|
| 01 | TIMELINE | Skip the scrub. Jump to the speaker. | mini-timeline-fragment |
| 02 | SCREEN | Record what was on screen, not just what was said | monospace-path (HEVC - 15 fps - local) |
| 03 | AUTO-DETECT | Zoom opens. The menu bar asks if you want to record. | pro-pill |
| 04 | DRAG | Drag the transcript into Notion. No export modal. | typographic-mark |
| 05 | AUDIO | No BlackHole. No Loopback. No virtual cable. | monospace-path (CoreAudio process tap) |
| 06 | RE-RUN | A better Gemini model ships. Re-run last quarter for free. | version-sequence |

### Soldier follow-up

1. **SCREEN cell visual:** Add a `split-cell-illustration` or `video-frame-fragment` case to the `FeatureVisual` switch in `Features.tsx`. The cell should show a 16:10 video thumbnail with a centred play overlay and a `0:14 / 4:32` timestamp in Plex Mono underneath. Until this is built, the cell renders `"HEVC - 15 fps - local"` in monospace, which is technically accurate but not visually differentiated from the AUDIO cell.
2. **DRAG cell body mention of "phrase":** The `typographic-mark` visualHint in `FeatureBody` looks for the word "phrase" in the body text to apply the highlight mark. The DRAG cell body does not contain the word "phrase". The mark will not render and the cell will show plain body text. Either (a) soldier updates `FeatureBody` to handle `typographic-mark` differently for the DRAG cell, or (b) the visualHint is changed to `split-cell-illustration` once that case is added. For this pass, plain body text is acceptable. No soldier code change is strictly required; the cell renders correctly, just without the mark gesture.

---

## 2026-05-21 — Aggressive trim of Features cells per user feedback

**Agent:** 3mpq-copywriter
**Scope:** `features.cells` bodies and headings cut to bare minimum. User directive: shorter is better, SVG mocks will carry the visual load, copy should not redescribe the illustration.

### Before vs after: word counts per cell

| # | Eyebrow | Heading before (words) | Heading after (words) | Body before (words) | Body after (words) | Body dropped? |
|---|---|---|---|---|---|---|
| 01 | TIMELINE | Skip the scrub. Jump to the speaker. (7) | Jump to any speaker (4) | 48 | 0 | Yes |
| 02 | SCREEN | Record what was on screen, not just what was said (10) | Records the screen too (4) | 46 | 6 | Reduced |
| 03 | AUTO-DETECT | Zoom opens. The menu bar asks if you want to record. (11) | Catches the meeting first (4) | 57 | 9 | Reduced |
| 04 | DRAG | Drag the transcript into Notion. No export modal. (9) | Drag out, no export dialog (5) | 46 | 0 | Yes |
| 05 | AUDIO | No BlackHole. No Loopback. No virtual cable. (9) | No driver install required (4) | 37 | 7 | Reduced |
| 06 | RE-RUN | A better Gemini model ships. Re-run last quarter for free. (11) | New model out. Re-run for free. (7) | 60 | 7 | Reduced |

### Summary

- Total body words before: 294 (headings) + 294 (bodies) combined
- Total body words before (bodies only): 294
- Total body words after (bodies only): 29
- Reduction: 265 words removed from body copy, a 90% cut
- Cells with empty body: 2 (TIMELINE, DRAG) — visual mock carries the idea
- Cells with short fragment body (5-9 words): 4 (SCREEN, AUTO-DETECT, AUDIO, RE-RUN)
- Combined body word budget: 29 words against 80-word target — 51 words under budget

### ASCII audit

All strings checked for: em dash (U+2014), en dash (U+2013), curly quotes (U+2018, U+2019, U+201C, U+201D), bullet (U+2022), middle dot (U+00B7). Zero hits in rewritten cells. `versionSequence` retains U+2192 (rightward arrow), which is a functional delimiter matching the existing `Features.tsx` split logic and is not a banned typographic character.
