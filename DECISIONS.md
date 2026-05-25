# corder-landing — Decisions Log

Записи отсортированы от свежих к старым. Каждая запись — что решено, какие альтернативы рассмотрены, почему отвергнуты.

---

## 2026-05-25 — Account infrastructure: magic-link auth, Supabase + Resend + Cloudflare Worker

**Decision.** Add a full account layer to the landing: `/signup`,
`/login`, `/verify`, `/account`. Magic-link authentication (no
passwords). Backend is a Cloudflare Worker on `api.getcorder.com`
writing to Supabase Postgres; email goes through Resend; Paddle
subscriptions sync via webhook.

**Why.** Strategic pivot: even if Pro doesn't convert at the
expected rate, the account base gives us (1) an email list of
qualified leads for future products, (2) a reactivation channel
for past free-tier users, (3) a referral funnel with a bilateral
1-month-free reward (codified in `Referral.qualifiedCount` +
`freeMonthsEarned` in `account-types.ts`), (4) a place to surface
subscription self-service so support volume drops.

**Alternatives.**
- *Passwords.* Rejected. Reset flows are a support burden for a
  small team and the magic-link UX is now the indie-tool default.
- *OAuth-only (Sign in with Apple / Google).* Rejected as primary
  because it makes us depend on third-party consent forms for
  basic signup; Sign in with Apple lands later as a SECOND option
  that links to an existing email account.
- *Cloudflare D1 instead of Supabase.* D1 is edge-native and
  faster, but Supabase's web dashboard for inspecting users + the
  mature JS SDK won the trade-off for a 2-3 day setup.
- *Loops instead of Resend.* Loops has a built-in magic-link
  template, but charges sooner. Resend's React Email components +
  3k/mo free tier covers us for the first thousand signups.

**Reward model: bilateral 1 month free.** When a referee signs up
via `/?ref=CODE` AND completes at least one paid month, BOTH the
referrer and the referee get one month of Pro credited. The
Paddle `subscription.created` webhook on the referee's first cycle
triggers the credit.

**Ship order.**
- Phase 1 (today): frontend pages wired to mock data. Allows the
  maker to review UI without any backend.
- Phase 2 (user TODO): create Supabase project + Resend account +
  Cloudflare token + Paddle webhook URL.
- Phase 3: Worker code + DB schema + email templates + replace mock
  fetch calls in `MagicLinkForm` / `VerifyClient` / `AccountView`.
- Phase 4: Mac app integration of `GET /check?email=…`.
- Phase 5: end-to-end test + Paddle sandbox -> production keys.

---

## 2026-05-22 -- Drop Lenis. Native `scroll-behavior: smooth` only.

**Decision.** Remove the `LenisProvider` wrapper. Use native CSS `scroll-behavior: smooth` on the html element with `scroll-padding-top: 88px` for the sticky nav offset.

**Why.** User reported scroll lag: "плавный скролл убрать, чтобы не выглядело как будто подлагивает". On a DOM this heavy (hero with 17 SVG mocks, three HowItWorks chapter mocks, six Features SVGs, the morphing presence chain), Lenis at `lerp: 0.08` + `duration: 1.0` made every wheel event take ~1s to settle on top of macOS hardware momentum. The two scrolls fought each other and the result felt sluggish rather than smooth.

**Alternatives rejected.**
- *Tune Lenis parameters.* Tried `lerp: 0.12` in earlier sessions; still felt laggy because the rAF tick + the trackpad momentum overlap. The fundamental issue is mixing JS smoothing with native momentum, not the constants.
- *Replace with Locomotive / GSAP ScrollSmoother.* Same architecture, same problem. Locomotive is heavier and ScrollSmoother is paid + jQuery-flavoured. No.
- *Keep Lenis only for `lenis.scrollTo` on anchor clicks.* The smooth scroll on anchor jumps is the only thing JS smoothing actually buys you over CSS, and `scroll-behavior: smooth` does it natively now. Not worth 7 KB gzip and one rAF loop for nav anchors.

**Implementation.**
- Deleted `src/components/providers/LenisProvider.tsx`.
- Removed import + `<LenisProvider>` wrapper from `src/app/layout.tsx`.
- Added `scroll-behavior: smooth` + `scroll-padding-top: 88px` on `html` in `src/app/globals.css` (with `@media (prefers-reduced-motion)` override).
- Removed `lenis` from `package.json`.

**Replacement for the doctrine line in `CLAUDE.md`.** Earlier the project doctrine read "Lenis 1.x in the root layout". Updated to "No JS smooth-scroll library. Use native scroll-behavior. If a future requirement asks for finer scroll control, discuss before re-adding any rAF-driven smoothing -- it adds latency to a DOM this heavy."

**Side-effects watched.**
- `useScroll` + `useTransform` + `useSpring` in `HowItWorks.tsx` now reads native scroll position via getBoundingClientRect on rAF ticks. Verified the morph window still positions correctly (Playwright: scroll into HiW, window present at expected coordinates).
- Three scroll listeners in `CorderPresence.tsx` (lines 311, 538, 604) -- all passive, all rAF-throttled -- now fire on native scroll events only. No code change required.
- Anchor scroll test: clicking the Nav `#features` link lands the section top at `y = 88px`, matching `scroll-padding-top`. No JS interception needed.

**Re-add criteria.** Only if a future product brief requires scroll-linked timeline scrubbing past what `useScroll` already gives, and the visual benefit demonstrably outweighs the input-lag cost. Default answer: no.

---

## 2026-05-22 -- Drop dead `WorksWithDock` + `react-icons` dep.

**Decision.** Delete `src/components/sections/WorksWithDock.tsx`, drop the `~160 lines of `.dock-*` rules in `globals.css`, remove `react-icons` from `package.json`.

**Why.** `WorksWithDock` was an alternative compatibility surface (macOS Dock style) we explored alongside `WorksWith` (marquee rows). `page.tsx` renders `WorksWith`, never the dock. The dock file was the sole consumer of `react-icons/si`. Keeping a dead 225-line component that pulls a 83 MB icon library risks accidental future bundling.

**Alternatives rejected.** Keep both for "optionality". No -- if we want the dock back we can recover it from git history. Dead code is liability, not optionality.

---

## 2026-05-22 -- PopoverWidget SVG: port from SwiftUI rather than approximate.

**Decision.** Rewrite the `PopoverWidget` SVG in `Features.tsx` (cell "Catches the meeting first") line-by-line against `/Users/3mpq/Corder/Sources/Corder/UI/PopoverContentView.swift`. Use the exact Color tokens: `Color.primary` in dark mode = `#ffffff` (Start button fill), `NSColor.windowBackgroundColor` in dark mode = `#1d1d1f` (Start button text + popover bg), `Color.secondary` ~ white@0.55.

**Why.** Two consecutive iterations were eyeballed approximations (`#ededee` for the Start button, `#0b0b0c` for its text, viewBox 260px tall). User: "Зачем ты соврал что сделал также как у оригинального кордера?". The complaint was about colour fidelity, not just proportions. Going back to the Swift source and porting it 1:1 is the only honest move.

**Layout maths.**
- `VStack(spacing:18) .padding(20) .frame(width: 320)` → viewBox `0 0 320 298` (28 top padding inside the popover + 72 IdleStatus + 14 + 44 Start + 18 + 5 separator + 18 + 44 Open lib + 10 + 20 Quit + 25 bottom padding ≈ 298).
- IdleStatus height 72 = `padding(.vertical, 14)` * 2 + label 17 + spacing 1 + time 26.
- Time text uses `font-variant-numeric: tabular-nums` to match `.monospacedDigit()`. The earlier ui-monospace font made the colon a wide cell ("0 0 : 0 0").

**Size cap.** The taller viewBox would have rendered the popover 50% taller than its sibling Features cells if width:100% applied. Capped with `.feature-cell__visual > .ftr-svg--popover { width: 76%; max-width: 240px; margin-inline: auto }` (specificity 0,2,1 beats the existing 0,1,1 `.feature-cell__visual > svg` rule). Renders 240x224, sits visually between the no-bot grid (200h) and timeline (240h) cells.

---

## 2026-05-22 -- CorderPresenceForm: kill minHeight, symmetric padding.

**Decision.** Remove `minHeight: 260px` from the floating form motion.div. Set padding to `40px 22px` (symmetric top/bottom).

**Why.** User screenshot showed ~100px of dead space below the Subscribe pill. Content fit in ~210px, but minHeight forced 260px. Earlier minHeight was a leftover from making the morph from orb to card have a chunky target -- the side effect was the dead space.

The orb→card morph still works without minHeight: framer-motion interpolates from the orb's `width:64px, height:64px` straight to whatever the card resolves to, and the lerp is smooth. The minHeight was unnecessary defensiveness.

---

## 2026-05-21 -- HowItWorks chapter mockups: layout + tracking decisions

### Decision 1: Three-mockup swap inside the existing sticky window, not new windows per row

**Решение:** оставить ровно один `WindowFrame` (тот, что уже использует `hiw-window-wrap`, sticky-snap, tilt и CorderPresence `layoutId`), и менять только ВНУТРЕННОСТИ через `AnimatePresence`. Каждая chapter row не получает свой собственный window.

**Контекст:** brief предлагал три "swap" мockup'a, но не уточнял где они физически живут. Альтернатива была -- по window на row, прячем все кроме активного.

**Альтернативы:**
- a) **Three full windows, one visible per row.** Отвергнуто: ломает CorderPresence morph-chain (orb expects ровно один `layoutId={CORDER_PRESENCE_LAYOUT_ID}` source). Также теряется уже отлаженная sticky/snap/tilt механика.
- b) **Single window, swap inner content** (выбрано). Window CHROME (titlebar, layoutId) -- константа. Inner content -- меняется. Это сохраняет orb morph chain, sticky-snap, и tilt; добавляет только дополнительный layer для crossfade.

**Последствия:** `WindowFrame` теперь параметризован `chapter: 1 | 2 | 3` и `reduced` флагом. `.hiw-window-content` -- новый слой между чисто-chrome window и mockup'ом, который AnimatePresence использует как exit/enter snapshot.

### Decision 2: IntersectionObserver на rows, не scrollYProgress-based step function

**Решение:** active chapter tracking через `IntersectionObserver` с `rootMargin: -40% 0px -40% 0px`, не через дополнительный `useTransform` на scrollYProgress.

**Контекст:** в HowItWorks уже есть `useScroll` + step-function для window position. Логичный шаг -- разделить тот же scroll progress на три равных bucket и взять index.

**Альтернативы:**
- a) **Reuse scrollYProgress + useTransform [0, 0.333, 0.666, 1] -> [1, 2, 3].** Отвергнуто: window position thresholds (0.34/0.36, 0.64/0.66) уже smoothed через `useSpring`. Если активный chapter дергается от spring overshoot, crossfade тоже дергается. Декаплинг через IntersectionObserver делает chapter switch event-driven по реальной viewport intersection -- стабильнее.
- b) **IntersectionObserver** (выбрано). rootMargin `-40% 0px -40% 0px` означает chapter активируется только когда его центр пересек middle 20% band вьюпорта. Это совпадает с slot snap positions window'a (centres at 35/105/175vh). Single source of truth: "что видит пользователь в центре" = "что показывает window".

### Decision 3: Static green orb внутри mockup'a, не canvas blob

**Решение:** в каждом mockup'e нижний-правый recording-indicator -- статичный SVG-free CSS gradient circle (`.hl-mock-blob`), не canvas.

**Контекст:** real hero demo использует `RecBlobCanvas` -- 110px canvas с rAF loop, breathing blob, активной/idle гонкой. В трех mockup'ах подряд это три canvas'a с тремя рекурсивными rAF -- 30 fps × 3 = 90 fps работы пока секция в view.

**Альтернативы:**
- a) **Three canvas blobs.** Отвергнуто: performance budget tight (≤80KB JS, INP <100ms). И canvas blob -- это hero-сигнатура; повторять три раза = размывает уникальность hero.
- b) **Static CSS-only orb** (выбрано). Radial-gradient + box-shadow halo, 22×22px, zero JS, zero canvas. Сигнализирует "блоб тут есть" не отбирая внимания от main content mockup'a.

**Последствия:** mockup'ы это product UI стопкадры, а не вторые live demo. Recording HUD читается как "iconic affordance", а не как "wow look another animated blob".

---

## 2026-05-21 -- Features section: three decisions baked into the cell swap

### Decision 1: AUTO-DETECT popover keeps the RED Start-recording dot

**Решение:** в `PopoverWidget` SVG mock'е (новая cell 03 illustration)
маленький 8x8 dot на кнопке "Start recording" остаётся **красный
`#dc2626`**, не accent green `#217a50`.

**Контекст:** brief явно просил soldier judgement и просил
зафиксировать выбор. Альтернатива -- заменить red dot на accent green
ради проектной single-accent doctrine.

**Альтернативы:**
- a) **Accent green dot.** Отвергнуто: в реальном macOS app красный
  dot -- это semantic indicator состояния "recording is active" и
  "tap here to start" (red = action будет recording). Если landing
  показывает green dot на кнопке Start, пользователь скачает app и
  увидит red dot -- рассинхронизация между landing-обещанием и реальным
  UI. Worse: на странице рядом есть green accent (Download button,
  пр.) -- green dot читался бы как "go" / "started", вводя в заблуждение
  по поводу состояния popover (мы рисуем именно **idle** state).
- b) **No dot вообще.** Отвергнуто: дот это integral piece визуала
  кнопки в реальном app, без него кнопка теряет product-recognition.
- c) **Red dot, no other accent в иллюстрации.** Отвергнуто: тогда у
  cell нет single-accent spotlight роли вообще, и cell визуально
  читается как "продукт без брендинга".

**Что выбрано:** red dot stays (product fidelity). Single accent role
для этой cell = **dropdown caret/anchor at top-center** иллюстрации.
Caret рисуется в `var(--color-accent)` и тонко связывает popover с
menu-bar икон-источником сверху. Это даёт cell ровно один accent
touchpoint, не конкурирующий с product-semantic red.

### Decision 2: INTEGRATIONS skipped as a separate Features cell

**Решение:** свободные два slot'а в Features (после удаления AUDIO и
RE-RUN) заняты NO-BOT и TRANSCRIPT. INTEGRATIONS не получает
отдельной cell.

**Контекст:** brief давал три кандидата на два слота: NO-BOT,
TRANSCRIPT, INTEGRATIONS. Brief сам флагнул INTEGRATIONS как risky и
рекомендовал skip.

**Why skip:**
- Per `research/corder-feature-inventory-2026-05.md` section 10
  ("Integrations + Downloads"), in-app Integrations card сейчас
  буквально говорит "Soon" и отсылает users в profile menu. На landing
  обещать integrations = vapour-promise. См. также inventory line 319:
  *"The 0.9.0 settings pass removed the Gemini-key input and the in-pane
  Integrations promo. Integrations now live exclusively in the profile
  menu."*
- DRAG cell (position 04) уже несёт integrations story для v0.9.0 в
  честной форме: "Drag out, no export dialog" + Pricing tier mentions
  "Drag-out to Notion, Obsidian, Apple Notes". Вторая cell про
  integrations была бы дублированием на лучшем случае, vapour-promise
  на худшем.
- NO-BOT и TRANSCRIPT обе прямые ответы на верифицированные user
  pain-points (skeptic structure F.A в research), их visual mocks
  можно нарисовать честно (Zoom call grid без Corder; scrubber +
  transcript line -- это РЕАЛЬНЫЕ artefacts продукта).

**Альтернативы:**
- a) **Honest framing INTEGRATIONS как "Lives in Finder, plays with
  any tool that opens .txt/.md/.wav".** Отвергнуто: умно но дублирует
  то что DRAG cell уже показывает. Cell-grid не нужен второй
  integrations-narrative.
- b) **Replace DRAG cell на INTEGRATIONS, add NO-BOT + TRANSCRIPT.**
  Отвергнуто: DRAG illustration сильный visual hook, drag-gesture
  читается мгновенно. NO-BOT + TRANSCRIPT покрывают новые story slots
  без удаления уже-работающего DRAG.

### Decision 3: Single accent role per illustration after the swap

В каждой из трёх новых иллюстраций ровно один элемент использует
`var(--color-accent)`:

- `popover-widget` -- **dropdown caret/anchor** at top-center (signals
  "this widget lives in the menu bar"). Red dot в Start-recording
  кнопке остаётся product-semantic red, не считается за second
  accent (это product chrome, не landing chrome).
- `no-bot-grid` -- **annotation hairline + label "CORDER LIVES HERE"**.
  Hairline тонкая `var(--color-accent)` 1px, label маленький accent
  serif. Это spotlight, ВСЕ остальные элементы (tiles, badges,
  participant labels) -- neutral grey / product palette (purple +
  amber, scoped к product UI demos).
- `transcript-fragment` -- **scrubber's accent progress fill +
  playhead handle**. Filled portion track + handle circle. Purple
  speaker badge "KH" -- НЕ second accent, это product UI palette
  scoped к demos (same palette as Hero `HeroLibraryDemo`).

**Verification:** grep на `var(--color-accent)` в каждом из трёх
новых SVG функций даёт ровно один functional role (multiple
`fill="var(--color-accent)"` в одной функции допустимо если они
формируют ОДИН визуальный элемент, e.g. circle + smaller white inner
circle = одна "ручка").

---

## 2026-05-21 — Features cells: inline-SVG mocks instead of typographic gestures

### Решение: каждая cell получает свой inline-`<svg>` mock в стиле `GoogleMeetMock`

**Решение:** все шесть feature cells теперь рендерят inline-SVG картинку
после `body`. Никаких external assets, никаких `<img src="...">`, никаких
icon-fonts. Каждая иллюстрация полностью описана через `<rect>` / `<text>` /
`<path>` с project tokens (`var(--color-accent)`, `var(--color-surface)` итд)
и заливается ASCII-only текстом.

Стиль ровно тот же, что и у `GoogleMeetMock` в
`src/components/hero/HeroLibraryDemo.tsx` (commit `6d358fd`): minimal labels,
viewBox-driven, no external dependencies.

**Контекст:** копирайтер сжал body cells до 29 слов суммарно (cells 01 и 04
вообще без body). Когда копия перестаёт нести нагрузку, иллюстрация
становится главным несущим элементом. До этой сессии cells использовали
typographic gestures: `<mark>` на слове `phrase`, `feature-pro-pill` с
sparkles, `feature-version-row` chips, `feature-mono` path-плашка, `feature-timeline`
с тиками. Они **работали как примитивы**, но в сумме читались разрозненно
(один stylized chip, один highlight, один pill) и не давали зрителю
конкретного UI-намёка на то, что делает каждая фича.

Inline-SVG mocks — это шаг к "show, don't tell": видишь play button над
тёмным frame → понимаешь "записывает экран". Видишь dashed curve → понимаешь
"drag-out". Видишь selected row в списке устройств → понимаешь "no driver
install, system-level". Это парадигма GoogleMeetMock примененная к **каждой**
cell в Features.

**Альтернативы:**
- a) **Lottie / Rive анимации.** Отвергнуто: project CLAUDE.md явно
  запрещает Rive в production. И статичные illustrations здесь читаются
  лучше — cell viewer not interacting, only scrolling past.
- b) **PNG / JPEG mockups.** Отвергнуто: каждая cell ушла бы в +30-50KB
  payload, нарушение performance budget (≤80KB total JS gz + image budget).
  И theme/accent overrides невозможны без перерендера в build-time.
- c) **Один универсальный `<FeatureMock variant="...">`** компонент.
  Отвергнуто: шесть mocks имеют шесть совершенно разных layout shapes
  (timeline, frame, capsule, drag, list, chip-row). Унификация дала бы
  больше абстракций чем сэкономила бы строк. Каждый mock — это shape, не
  config.
- d) **Lucide-style stroke icons.** Отвергнуто: project rule "no
  pictograms in features cells" + это бы дублировало icons из nav-bar и
  чужих SaaS landings — потеряли бы редакционный voice.

**Single accent role per illustration:**
- `mini-timeline-fragment` — playhead dot
- `screen-video-frame` — centre play button
- `menu-bar-capsule` — `Record` pill
- `drag-out-gesture` — dashed drag curve + arrowhead
- `audio-sound-row` — selected `Corder` row's left border + radio dot
- `version-sequence` — middle chip outline + accent-subtle fill

Vадym row в `mini-timeline-fragment` использует purple `#5a3aa6`. Это
**не** second accent: purple живёт исключительно внутри speaker-coded
product UI (Hero `HeroLibraryDemo` + теперь этот timeline mock), никогда
в chrome или CTA. Это пере-использование "real Corder" color из
session 2026-05-20 (см. `RETRO.md` запись про "real-UI policy").

**Trade-offs:**
- Features.tsx вырос с ~220 строк до ~770. Trade принят: каждая SVG —
  это decorative unit, плюс ~60-100 строк на mock. Альтернатива (отдельные
  файлы под каждый mock) дала бы 6 extra files for one section — over-eng.
  Если другой проект захочет похожий mock — promote в kit как singleton
  при втором использовании.
- `feature-mark` / `feature-pro-pill` / `feature-mono` / `feature-version-row`
  CSS правила в `globals.css` теперь unused. Оставил на одну сессию
  (judge может попросить show-side-by-side), удалить в housekeeping pass.

---

## 2026-05-20 — Hero polish: theme toggle, Settings tab, taller window, transcript scroll

### Решение 1: dark theme живёт ТОЛЬКО внутри demo, не на landing

**Решение:** добавили `[data-theme="dark"]` override `--hl-*` токенов
внутри scope `.hero-library-demo`. Landing tokens (`--color-bg`,
`--color-text` итд) НЕ трогаем. Кнопка-луна переключает state локально
в `HeroLibraryDemo`, никак не дёргает `<html>` или body.

**Контекст:** CLAUDE.md фиксирует "default light, dark only on explicit
request". User просил повторить theme toggle "как в оригинале" — но в
оригинале это переключение Corder web-app внутри его собственного
window. Landing остаётся в light theme. Demo-окно — это product mock,
оно вправе иметь свою theme как часть live UI demo.

**Альтернативы:**
- a) Global `<html data-theme="dark">` swap. Отвергнуто: ломает доктрину
  (single light theme), и user явно хотел "smooth animation в этом
  интерфейсе hero", не на всём landing.
- b) Прокинуть `--color-accent` в demo и поменять акцент в dark.
  Отвергнуто: single accent rule per project. Forest green
  `#217a50` (light) -> brighter `#1f9d59` (dark) — это вариант ТОГО ЖЕ
  акцента под dark background (так и в оригинале), не второй цвет.
  Документировано: `--hl-accent` в `[data-theme="dark"]` остаётся
  derived from base accent, просто tuned for dark luminance.

### Решение 2: Integrations таб не реализован, остановились на Recording/Settings

**Решение:** Рендерим только два таба в правом столбце — `Recording`
(default) и `Settings`. `Integrations` из реального app (Image #67 user
screenshot) опущен.

**Контекст:** brief разрешал "пропустить Integrations если усложняет
layout — soldier judgement". В реальном app Integrations это not a
tab внутри meeting view, а отдельная панель в Profile menu (см.
inventory §10, §11). Добавлять третий таб только ради landing визуала
было бы false signal — лишняя кнопка которая никуда не ведёт. Если
user захочет, легко добавить позже: rightTab type + ещё одна
`SettingsPane` ветка.

### Решение 3: blob IDLE_FLOOR = 0.35 — морфит даже когда не recording

**Решение:** Ввели `IDLE_FLOOR = 0.35` в `RecBlobCanvas`. Activity
target = 1 (recording) или 0.35 (idle), а НЕ 0. Цветовой mix
вычисляется отдельно (`colorActivityFor`) — нормализован от floor до
1, так что green idle ↔ red recording flip всё равно чёткий.

**Контекст:** User жаловался "сейчас он застыл". Old behaviour: при
mode=`transcript` (idle) activity decays к 0, baseR=TPL_BLOB,
wobbleAmplitude=0.2, jitter*0 — визуально это статичный blob.
Сравнение с real macOS app: SwiftUI `RecordingHUDView` имеет idle
"breath bulge" (см. inventory §2). Без floor наш JS port не повторяет
этот idle breath.

**Альтернатива:** keep activity at 0 idle, но добавить SEPARATE
`breathPhase` source независимо от activity. Отвергнуто: ввело бы
второй timing source и осложнило бы reduced-motion fallback. Floor =
single source of truth и сразу управляет shape + wobble + jitter +
size, что было намерением original Swift code тоже (activity > 0
гарантировано когда HUD is mounted).

### Решение 4: theme transition rule на `*` внутри demo, не на root

**Решение:** Универсальный transition rule:
```css
.hero-library-demo,
.hero-library-demo *,
.hero-library-demo *::before,
.hero-library-demo *::after {
  transition: bg/color/border/fill/stroke/box-shadow/opacity 240 ms doctrine;
}
```

**Контекст:** Theme swap on root flips `--hl-*` CSS variables. Every
descendant repaints. Without transition, repaint is instant — user
would see SNAP. Universal `*` selector inside demo scope guarantees
EVERY surface (including pseudo-elements like `::before` for audio
scrub track) crossfades in lockstep.

**Specificity catch:** the existing `[data-reveal="visible"]`
`transition` shorthand on the root was clobbering the universal rule
(higher specificity, shorthand RESET). Fixed by converting that rule
to longhand `transition-property` / `transition-duration` that
explicitly includes bg/color/border/fill/stroke alongside the reveal-
only transform/opacity. Root-level color crossfade is now safe.

### Решение 5: token hygiene — все hardcoded grey hex заменены на `--hl-*`

**Решение:** Заменили `#b8b8b4`, `#ececea`, `#dcdcd9`, `#e8e8e5`,
`#e8e8e6`, `#dff1e5`, `#cfe7da`, `#d8d8d4` на CSS variables
(`--hl-fg-dim`, `--hl-border`, `--hl-border-strong`, `--hl-bg-active`,
`color-mix(in srgb, var(--hl-accent) 20%, transparent)`).

**Контекст:** До этого hover/active states в demo paint'или
светло-серым, который в dark theme смотрится как яркие пятна.
Поскольку dark theme стал requirement, любой hardcoded light-theme
grey становится bug. Цена замены — единственная новая зависимость:
браузерная поддержка `color-mix()` (Chrome 111+, Safari 16.2+, Firefox
113+). Все таргет-браузеры project'а это поддерживают.

---

## 2026-05-20 — Hero `HeroLibraryDemo` обновлён до Corder v0.9.0

### Решение 1: один patch, никакого редизайна

**Решение:** не перерисовываем HeroLibraryDemo, а добавляем/заменяем элементы по §0.5 inventory (canonical diff). Все существующие поведения (3D tilt, три режима recording/transcribing/transcript, recording blob, elapsed-time counter, restart-recording) сохраняются 1:1.

**Контекст:** user явно сказал «тоже самый экран что у нас есть в hero сейчас просто обновленный, все добавляем». Brief требовал «extend the existing demo so it reflects what 0.9.0 actually ships». Нулевая правда — диффом, не редизайном.

**Альтернативы:**
- **(rejected) (a) Полный rewrite секции** с новыми компонентами `Header`, `Sidebar`, `Main`, `RightPanel` извлечёнными в `ui-kit/`. Соблазнительно, но user НЕ просил рефакторинг, а большой rewrite рискует поломать tilt/recording/transcript transitions, которые отлажены в RETRO за 15 сессий.
- **(taken) (b) Surgical patch.** Каждый row §0.5 — один Edit на TSX + один на CSS. Триплет `data-component`/`data-source`/`data-tokens` на каждом новом element.

### Решение 2: amber `#a16207` для self-speaker — это speaker-colour token, НЕ второй accent

**Решение:** добавили `--hl-speaker-self: #a16207` в `.hero-library-demo` scope. Используется ТОЛЬКО для одной первой-личной "I" аватарки внутри транскрипта.

**Контекст:** brief требует амбер для "I" чтобы отличить self от других speakers. Project CLAUDE.md фиксирует один accent `#217a50`. Внутри HeroLibraryDemo уже живут два других speaker-colour токена (`--hl-speaker-purple #5a3aa6`, `--hl-speaker-amber #c7741b`) — они не утекают в landing tokens. Self-speaker amber следует тому же паттерну.

**Доказательство что это не violation:** `--color-accent` в `tokens.css` остаётся `#217a50`. Никакой `accent` token не дёрнут. `--hl-speaker-self` — это локальная palette demo-окна, как `--hl-speaker-purple` уже был.

### Решение 3: Boost кнопка удалена, не deprecated

**Решение:** `hl-boost-switch` (TSX блок + полные CSS правила + mobile media query overrides) удалены целиком. Не остались как `display: none` для будущего возврата.

**Контекст:** inventory §18 чётко: `text_boost` и `btn_boost` i18n keys ушли из 0.9.0. Toast keys `toast_boost_*` тоже. Это не deprecation — это removal в реальном продукте. Landing должна следовать за продуктом, не за legacy.

**Альтернатива:** **(rejected)** оставить Boost в TSX с `display: none`. Зачем? Если 0.10 вернёт boost, его вернёт инвентарь, и тогда вернётся и в hero. Mёртвый код — это шум для Webflow developer, который читает HANDOFF.

### Решение 4: видео preview card mount только при `mode === "transcript"`

**Решение:** `<div className="hl-video-card">` рендерится только если `isActive` (т.е. mode = transcript). В recording/transcribing скрыт.

**Контекст:** inventory §6: video card renders «only when has_video». Real app скрывает card если файл 404 или video write нo arm'нут. В hero демо нет реального video файла, но семантика «recording идёт → есть видеоинформация → можно показать» воспроизводится через mode.

**Альтернатива:** **(rejected)** показывать всегда (даже recording/transcribing). Это бы выглядело inconsistent: во время recording «play preview» это нелогично — recording ещё пишется.

### Verified

- `npm run typecheck` exit 0.
- `npm run build` exit 0, route `/` 23.7 kB parsed.
- Visual 1440/375/?motion=0 — все 7 acceptance bullets PASS.
- Zero console errors во всех трёх контекстах (после bouncing dev cache — `npm run build` стерла CSS asset из dev-mode, требовался `rm -rf .next` + restart; см. RETRO 2026-05-20).

---

## 2026-05-20 — CorderPresence третье состояние (form) + удаление Newsletter секции

### Решение 1: Newsletter секция уходит, форма становится state C морфа

**Решение:** `src/components/sections/Newsletter.tsx` удалён, `<Newsletter />` + соседний `<hr>` сняты со страницы. Subscribe-форма теперь — третье состояние `CorderPresence`: orb (state B) разворачивается в карточку 380×440 с тем же `layoutId="corder-presence"`, framer-motion интерполирует bbox/радиус/положение между орбом и карточкой.

**Контекст:** До этой сессии user'у была видна последовательность «orb появился в правом-нижнем после HowItWorks и просто плывёт там до футера». Финальная Newsletter секция жила в обычном flow страницы и никак не была связана с орбом. Чтобы оправдать наличие орба (а не просто абстрактного декора), его нужно было приземлить в конкретный affordance в конце страницы. Морф «orb → contact form» делает это: orb = ожидание, форма = действие.

**Альтернативы:**
- **(rejected) (a) Оставить Newsletter секцию + орб в углу как декорацию.** Самый дешёвый вариант, но создаёт visual conflict: орб тянет внимание к углу, а форма — к центру страницы. Две точки внимания на одной задаче — это шум.
- **(rejected) (b) Заменить Newsletter inline-плашкой «эта секция теперь в орбе».** Лёгкий вариант, но требует от пользователя интерпретации «куда же мне ткнуть». Морф — самообъясняющий: ты видишь как orb растёт в карту.
- **(taken) (c) Полный морф chain через `layoutId`.** Один framer-motion shared layout, ноль дополнительных компонентов, full reuse `copy.json#newsletter`. CSS `.newsletter*` (14 правил) уходит, на её место — единственный `.presence-static` блок для reduced-motion fallback.

**Verified:** typecheck + build green (page First Load JS 23.3 kB, было 31.2 kB), zero `.newsletter` refs во всём проекте, оба sentinel рендерятся.

### Решение 2: Reduced-motion path — inline section, не fixed-corner card

**Решение:** Когда `prefers-reduced-motion: reduce` ИЛИ `?motion=0` — orb/form морф полностью отключается, на его место рендерится `CorderPresenceStaticSection` в обычном flow страницы между Faq и Footer. **НЕ** статичная карточка в углу.

**Контекст:** Брифинг предложил «orb hidden, form hidden, inline section instead». Я согласился потому что:
1. Fixed-position карточка в углу без анимации появления — это просто навязчивый baked-in UI element, который читается как stuck overlay. Анимация морфа = единственное визуальное оправдание для такого позиционирования. Без неё — лучше обычная секция.
2. Reduced-motion users ожидают **меньше** visual interruption, не больше. Inline section — это привычный pattern subscribe-плашки внизу landing'а.

**Альтернативы:**
- **(rejected) (a) Скрыть всё, включая форму.** Лишает reduced-motion users возможности подписаться. Регрессия в функциональности.
- **(rejected) (b) Статичный corner card.** Visual noise без анимационного обоснования. См. контекст выше.
- **(taken) (c) Inline section в page flow.** Sub-100% UX parity с motion-on path (нет slick морфа, но subscribe-функция полностью сохранена). CSS написан с нуля под класс `.presence-static` — не reuse удалённого `.newsletter` namespace.

**Verified:** SSR HTML не содержит `presence-static` в default motion-on режиме; рендерится только post-hydration при `?motion=0`. Будущий regression: если кто-то решит вернуть `presence-static` в SSR — он сломает hydration, потому что сервер не знает query string.

---

## 2026-05-10 — fix-pass-2 — composition order, Inspector deprecation, single-accent CTA contract

### Решение 1: AudienceLine после Privacy (структурный rearrangement в page.tsx)

**Решение:** Порядок секций изменён с `Nav → Hero → AudienceLine → Privacy → How → ...` на `Nav → Hero → Privacy → AudienceLine → How → ...`.

**Контекст:** Юзер посмотрел live и сказал перенести AudienceLine под Privacy. Это шёл вразрез с research'ом из `corder-landing-research-2026-05.md` §F.A "Skeptic" structure, где AudienceLine — second beat сразу после Hero (audience-mirror задача: «вы такие как они»). Но research — рекомендация, не закон. Юзер видит свой landing впервые целиком — у него может быть валидное замечание о flow.

**Альтернативы:**
- **(rejected) (a) Оставить как было.** Research-первичность. Но research опирался на pattern-frequency в other landings, не на A/B на этом конкретном продукте. Юзер видит контент целиком впервые — его reaction карта flow.
- **(rejected) (b) Полностью переделать порядок согласно user.** Слишком radical для одного user-comment без reason'ов. Move just AudienceLine — minimum viable change, не требует переписи.
- **(taken) (c) Move AudienceLine после Privacy.** Один transposition, не трогает остальное. Privacy теперь — second beat (trust frame: «vault not blackbox»), AudienceLine — third (audience expansion). Логически consistent: показали кто control в данных → потом расширили на «таких людей много, ты тоже один из них».

**Verified:** CDP order probe — `[Nav, Hero, Privacy, AudienceLine, How, Features, Pricing, Faq, FinalCta, Footer]`, точно как заказано.

### Решение 2: Inspector deprecation для corder-landing

**Решение:** Inspector overlay удалён из `src/app/layout.tsx`. `data-component`/`data-source`/`data-tokens` атрибуты на компонентах оставлены.

**Контекст:** Глобальная доктрина (CLAUDE.md §6) предписывает Inspector mount на каждом проекте под `NODE_ENV === 'development'` для Webflow handoff. Юзер для этого проекта явно сказал «выпили встроенный редактор и перестань его делать».

**Альтернативы:**
- **(rejected) (a) Сохранить Inspector, переключить на `?inspector=1` query flag.** Менее invasive override доктрины, но Inspector всё равно загружается в dev и активируется по Cmd+click — юзер хочет именно отсутствие Inspector в принципе, не disable-by-default.
- **(rejected) (b) Удалить и Inspector, и data-attributes.** Атрибуты используются handoff'ом, документируют structure для Webflow developer'а. Их польза не зависит от Inspector'а. Удалять — потерять handoff-mapping.
- **(taken) (c) Удалить только Inspector mount, оставить атрибуты.** Атрибуты — passive metadata, weight 0 на runtime, читабельны grep'ом или Chrome DevTools Elements panel. Если Webflow developer хочет Cmd+click overlay — он включит свой собственный browser extension или вернёт Inspector локально для своего checkout'а.

**Side-effect:** Это project-local override доктрины §6. Inspector остаётся default'ом для остальных проектов (template-design, booquarium, vendo-ai, pagestack). corder-landing — exception, документированный здесь.

### Решение 3: Single-accent CTA contract — `.cta-pill--primary` теперь fill green из class

**Решение:** Backgrounded styles для `.cta-pill--primary` подняты из inline `style={{}}` пропсов на каждом use site в base CSS rule в `globals.css`. Inline пропсы убраны.

**Контекст:** В оригинальной реализации каждый primary CTA (Hero, Pricing, FinalCta, Lifetime) имел `style={{background: "var(--color-text)", color: "var(--color-bg)"}}` — четыре дублированных inline override'а класса `.cta-pill`. Юзер потребовал перекрасить все CTA в green. Можно было пройти каждый use site и поменять inline в каждом — 5 минут механической работы. Лучше: положить authoritative styling в class, удалить inline propsы.

**Альтернативы:**
- **(rejected) (a) Поменять inline `style={{background:'var(--color-text)'}}` на `'var(--color-accent)'` в каждом use site.** Сохраняет существующий контракт «inline = source of truth, class = transition machinery». Но это закрепляет анти-pattern: следующий fix-pass снова потребует обхода всех use sites. Hardcoded values rule — обещанная авто-update через CSS var дублируется на каждом site.
- **(taken) (b) Class — source of truth для primary fill+border+color, inline убраны.** Один источник правды. Любой следующий fix-pass меняет ровно одну CSS rule. Trailing accent dot тоже убран — на зелёном bg зелёный dot невидим, не contribute визуально.

**Side-effect:** `data-tokens` обновлены на CTA elementах с `radius-pill,color-text,color-bg,color-accent,...` на `radius-pill,color-accent,color-bg,...` — точнее отражают actual tokens used.

### Решение 4: Accent value `#1f7a4f` → `#217a50`

**Решение:** Authoritative accent hex обновлён с `#1f7a4f` на `#217a50` в `tokens.css` и project `CLAUDE.md` (последний — pending update в этой же session).

**Контекст:** Юзер прямо указал hex `#217A50` в feedback. Старое значение `#1f7a4f` было документировано как «pulled from app's status-ready dot». В app source (`Web/src/styles.css`) `--accent: #0e7c44`, а `--speaker-2: #1f7a4f`. То есть старая ссылка была на speaker color, не на app primary accent. Разница `#1f7a4f` vs `#217a50` — 2 unit на R, 0 на G, 1 на B. Visually imperceptible, но юзер задал авторитетный hex и это правильнее принять как single source of truth.

**Альтернативы:**
- **(rejected) (a) Переспросить: «hex был, ты уверен что `#217a50`?»** Юзер дал прямую инструкцию. Переспрашивать = создавать friction.
- **(taken) (b) Принять `#217a50` как новый authoritative.** Обновить везде где hex hardcoded (rgba versions of accent-subtle и accent-soft, ::selection rgba).

### Решение 5: Hero center alignment + eyebrow pill removal

**Решение:** Hero copy блок `.mx-auto.max-w-[860px]` получил `text-center`, CTAs row — `justify-center`, subhead — `mx-auto`. Eyebrow `<motion.span>` с pill chrome удалена.

**Контекст:** Юзер: «выровняй по центру всё что там есть» + «убери pill-eyebrow». Hero был left-aligned editorial pattern (типичный Awwwards 2024-2026 для content-heavy heroes), но user feedback явно meant centered "promo / SaaS landing" pattern. Eyebrow pill — отдельный 12px uppercase chrome поверх headline. Без него headline становится первым визуальным элементом, что усиливает statement.

**Альтернативы:**
- **(rejected) (a) Оставить eyebrow без pill border.** Юзер сказал «может убери полностью если визуально лишний», и без pill его 12px uppercase «MAC MEETING RECORDER» становится дублем subhead'а («Corder captures system audio…»). Удаление чище.
- **(taken) (b) Полностью удалить eyebrow + center wrapper.** Headline → subhead → CTAs → qualifier, всё центрировано, всё в одном potolk wrapper.

### Решение 6: Section dividers как `<hr>` элементы, не `border-top` на секциях

**Решение:** Hairline dividers — отдельные `<hr className="section-divider" />` элементы в `page.tsx` между парами соседних секций (8 штук). CSS rule `.section-divider { border: 0; border-top: 1px solid var(--color-border); margin: 0; }`.

**Контекст:** Юзер: «между секциями всеми добавь разделитель, я потом скажу где убрать».

**Альтернативы:**
- **(rejected) (a) `border-top: 1px solid var(--color-border)` на каждом `<section>` через CSS rule типа `main > section + section`.** Ноль discrete элементов в DOM, чище композиция. Но удаление одного divider требует CSS exception (`main > section.no-top-border + section`) или inline style. Юзер сказал «потом точечно убирать» — значит management должен быть easy.
- **(taken) (b) 8 отдельных `<hr>` элементов в `page.tsx`.** Каждый divider — одна строка JSX, удалить = удалить строку. Семантически также корректно (`<hr>` = thematic break). Doctrine: cards/inputs/badges имеют border, но это border-as-separator-between-blocks — `<hr>` типичный паттерн.

**Verification:** `dividerCount: 8` через CDP query.

---

## 2026-05-09 — Typed JSON wrapper для copy.json (`src/content/copy.ts`)

**Решение:** Создан `src/content/copy.ts` — single typed entry point. Все компоненты импортируют `import { copy } from "@/content/copy"`, никто больше не читает `@content/copy.json` напрямую. Wrapper выносит TS-narrowing `accentRanges: ReadonlyArray<readonly [number, number]>` в одно место. JSON остаётся data, TS-shape живёт в `.ts`.

**Контекст:** В fix-pass-1 (iter-2) я перенёс `accentRanges` из JSX const в `copy.json` — архитектурно правильно, copywriter контролирует accent-pillar choice через JSON. Но добавил unsafe direct cast `audienceLine.accentRanges as ReadonlyArray<readonly [number, number]>` в `AudienceLine.tsx`. `next dev` (lenient transpile-only) пропустил, `next build` (strict typecheck) упал с TS2352 — `number[][]` не overlaps с `readonly [number, number][]`, потому что TypeScript widens JSON `[[1,5],[5,9],[10,15]]` до `number[][]`, не до tuple. Judge поймал на iter-3, потому что впервые запустил `next build` сам. Vercel deploy сломался бы.

**Альтернативы:**
- **(rejected) (a) Quick double-cast** `as unknown as ReadonlyArray<...>`. Один-line, но патчит каждое место отдельно. Уже скоро будут другие structured fields в copy.json (privacy.cards, features.cells, faq.items, pricing.tiers — все они структурированы) — они потенциально упадут на ту же проблему через несколько секций. Двойной cast through `unknown` это код-смрад в любом случае.
- **(rejected) (b) Destructure без cast** — `accentRanges.some((r) => i >= r[0] && i < r[1])`. Чисто, без casts вообще, но теряем tuple destructuring там, где он семантически правилен. И **не помогает** для будущих structured fields, где shape сложнее (объекты с union'ами, optional fields, tagged unions). Решает один случай, не паттерн.
- **(taken) (c) Typed JSON wrapper** — `src/content/copy.ts` с `Copy = typeof raw & { audienceLine: { accentRanges: ReadonlyArray<readonly [number, number]> } }`. Single-cast at the boundary, типы narrow один раз, все компоненты получают typed `copy`. Каждый будущий structured field добавляет одну строку в `Copy` type, не патчит компонент. Cleanly separates concerns: copy.json = data (copywriter pwn), copy.ts = types (soldier owns).

**Side-effect:** Все 4 текущих читателя copy.json мигрированы (`AudienceLine.tsx`, `Hero.tsx`, `Nav.tsx`, `layout.tsx`). Future sections (privacy, how, features, pricing, faq, finalCta, footer) импортируют только из wrapper'а — invariant поддерживается grep'ом `grep "@content/copy.json" src/` который должен давать пустой output.

**Файлы:** `src/content/copy.ts` (создан), `src/components/sections/{AudienceLine,Hero,Nav}.tsx`, `src/app/layout.tsx`.

**Verified:** `npm run typecheck` exit 0, `npm run build` exit 0, CDP probe на prod build:3051 — accent indices `[1,2,3,4,5,6,7,8,10,11,12,13,14]` unchanged, `?motion=0` final state preserved, console clean, LCP 820ms (`H1.mt-6` hero headline).

---

## 2026-05-09 — `?motion=0` через pre-hydration script + `<html data-motion="off">`

**Решение:** `?motion=0` (и `prefers-reduced-motion: reduce`) выставляют `<html data-motion="off">` синхронно через inline `<script>` в `<head>` ещё до hydration. Глобальные CSS-правила в `globals.css` под селектором `:root[data-motion="off"]` отключают любые motion-animations, включая native CSS `animation-timeline: view()` (AudienceLine word-fill).

**Контекст:** Judge поймал что `MotionProvider` (на `useEffect`) бежит только после hydration, а `animation-timeline: view()` стартует на page load. На `?motion=0` слова AudienceLine оставались в инициальном `rgb(212,212,212)` + blur(2px) до пока пользователь не доскроллит. Doctrine: `?motion=0` ≡ "final state forever", не "deferred animation".

**Альтернативы:**
- **(rejected)** Перевести AudienceLine на Framer Motion `useScroll` + `prefersReducedMotion` — теряем главное архитектурное достоинство (zero-JS scroll-driven CSS) ради runtime kill-switch'а.
- **(rejected)** Только `MotionProvider` ставит атрибут — flash инициального состояния до hydration.
- **(rejected)** Перенести логику в external `<script>` — делает critical path ещё одним сетевым раундом.
- **(taken)** Inline pre-hydration script (≈140 байт, исполняется до first paint) + global CSS rule. Чистый JS-free стиль для самого animation-timeline кода сохраняется; runtime kill-switch стоит ровно одну `dataset.motion = 'off'` запись.

**Дополнительно:** `MotionProvider` тоже пишет атрибут после hydration — redundant safety net на случай если script был зарезан CSP или browser стрипил inline scripts.

**`suppressHydrationWarning` на `<html>`:** Стандартный React 19 / Next 15 паттерн для случаев когда client-script намеренно мутирует root attributes до hydration (theme detection, motion detection, RTL flag). Без этого React репортует attribute mismatch warning в development. `suppressHydrationWarning` распространяется только на mismatches на самом element'е, не на children — children всё ещё проверяются. Это узкий escape hatch, ровно тот случай для которого он предназначен.

**Файлы:** `src/app/layout.tsx`, `src/app/globals.css`, `src/components/providers/MotionProvider.tsx`.

**Verified via CDP:** на `?motion=0` `document.documentElement.dataset.motion === 'off'`, первое слово `rgb(14,14,13) blur(0)`, первое accent-слово `rgb(31,122,79) blur(0)`. Console clean (0 errors, 0 warnings) на обоих `/` и `/?motion=0`.

---

## 2026-05-09 — `accentRanges` source-of-truth: copy.json wins, component reads

**Решение:** `audienceLine.accentRanges` в `content/copy.json` — единственный источник правды. `AudienceLine.tsx` читает массив напрямую вместо хранения локального const. Half-open semantics `[start, end)` явно задокументированы через `_accentRangesNote` поле.

**Контекст:** Judge поймал расхождение: copy.json содержал `[[1,4],[6,9],[11,16]]`, JSX константа — `[[1,5],[5,9],[10,15]]`. Рендер был корректен (JSX выигрывал), но JSON врал. Когда у двух мест одна структура data, расходятся именно они — sooner or later. Doctrine: copy is data, data lives in the copy file.

**Альтернативы:**
- **(rejected)** Удалить `accentRanges` из copy.json и оставить в JSX — копирайтер потеряет контроль над "какие именно слова подсвечивать", это редакторское решение.
- **(rejected)** Дублировать оба + комментировать "обновлять синхронно" — тип ошибки, который случается дважды.
- **(taken)** copy.json — truth, JSX читает оттуда. Если копирайтер захочет переакцентировать, правит только JSON.

**Editorial значение текущих ranges (half-open):**
- `[1, 5)` → "founders taking investor calls,"
- `[5, 9)` → "consultants on client kickoffs,"
- `[10, 15)` → "anyone who thinks out loud"

Три accent-фразы, ровно три audience pillars. 13 accent words из 20 — выглядит чуть много визуально, но если judge на следующих review захочет уменьшить до 9 (например `[1,4) [5,8) [11,14)`) — fix теперь one place, copy.json.

**Файлы:** `src/components/sections/AudienceLine.tsx`, `content/copy.json`.

---

## 2026-05-09 — Hover/focus policy: глобальные CSS-классы, не per-component

**Решение:** Единая глобальная политика в `globals.css`: `:focus-visible` через element selectors (`a, button, input, ...`), hover через class-based mixins `.cta-pill--primary:hover`, `.cta-pill--ghost:hover`, `.nav-link:hover`, `.nav-cta:hover`. Компоненты декларируют интент через class names, не через inline styles.

**Контекст:** Judge поймал отсутствие focus ring и hover state. Inline-style transitions были декларированы (`transition-[background-color] duration-150`), но конечного состояния не было — потому что Tailwind v4 не имеет хука для `:hover { background: var(--color-X) }` без custom CSS. Можно было бы наплодить per-CTA `onMouseEnter`/`onMouseLeave` стейт-машин, но: (а) дублирование, (б) теряется semantic CSS pattern для будущих секций, (в) Webflow rebuild потребует дублировать ту же машину в IX2.

**Альтернативы:**
- **(rejected)** Tailwind `hover:bg-[#0e3d28]` — захардкоден hex, нарушает doctrine "no hex literals", и tailwind v4 + CSS variables в arbitrary values работают капризно.
- **(rejected)** Inline JS state машина — overkill, плодит state per-CTA.
- **(taken)** Class-based CSS rules в `globals.css`. CTAs получают `cta-pill cta-pill--primary` или `--ghost`. Webflow developer мапит class names напрямую на Webflow class hover state. Чистый handoff.

**Покрытие fix-pass-1:**
- `.cta-pill--primary:hover` → `bg → --color-accent-deep` + `translateY(-1px)`
- `.cta-pill--ghost:hover` → `border → --color-text` + `bg → --color-surface`
- `.nav-link:hover` → `color → --color-text`
- `.nav-cta:hover` → `bg → --color-text` + `color → --color-bg` (inverted)
- `.cta-pill, .nav-cta:active` → `transform: scale(0.98)`

**Файлы:** `src/app/globals.css`, `src/components/sections/Hero.tsx`, `src/components/sections/Nav.tsx`.

---

## 2026-05-09 — Lenis: не диспатчить синтетические `scroll` events из useLenis tick

**Решение:** В `LenisProvider.tsx` не бриджевать Lenis-ticks через `window.dispatchEvent(new Event('scroll'))`. Просто wrap в `<ReactLenis root>`, и хватит.

**Контекст:** Booquarium использовал такой бридж, чтобы framer-motion `useScroll` (на родных scroll events) видел Lenis-driven scroll. На Lenis 1.3+ это даёт `RangeError: Maximum call stack size exceeded` — Lenis отправляет свой эмиттер по нативным `scroll` events и наш диспатч триггерит самого себя бесконечно.

**Альтернативы:**
- **(rejected)** Сохранить bridge с throttle/раз в frame — добавляет сложность, всё ещё риск рекурсии.
- **(rejected)** Откатиться на Lenis 1.1 — теряем багфиксы.
- **(taken)** Удалить bridge. Текущая Hero+AudienceLine не использует framer-motion `useScroll`, так что моста не нужно. Если в будущем секции его потребуют — подключим Lenis 1.x новый API `lenis.on('scroll', ...)` без re-emit.

**Файл:** `src/components/providers/LenisProvider.tsx`. **Smoke-test caught:** RangeError в консоли при первой попытке скролла.

---

## 2026-05-09 — Stack: Next.js 15, не 16

**Решение:** Стартуем на Next.js 15.x вместо 16, который указан в брифе.

**Контекст:** Бриф говорит "Next.js 16 (App Router, React 19, TypeScript strict, Cache Components где уместно)". Доктрина soldier'а: "scaffold from the most recent working project, not from scratch" — это booquarium на 15.1. Поднимать стек до 16 одновременно с первой секцией кор-проекта удваивает риск.

**Альтернативы:**
- **(rejected)** Next 16 + Cache Components — Cache Components всё ещё experimental на момент написания, и для статичного landing'а CC не дают conversion-преимущества над static export.
- **(taken)** Next 15 сейчас, бамп до 16 в отдельной scoped сессии после того как все секции пройдут judge.

**Тяжесть:** низкая. Миграция Next 15 → 16 — однострочные изменения в `package.json` + проверка breaking changes.

---

## 2026-05-09 — Hero: не использовать Hero-pinned scroll-compression

**Решение:** Hero — статичный editorial layout (eyebrow + headline + subhead + CTA + live demo), без 200vh sticky compression.

**Контекст:** Default doctrine pattern для hero — `HeroPinned`. Но Corder Hero уникален: его proof — это **не нестойкий visual moment**, это **selectable text демо приложения**, к которому пользователь должен иметь возможность подойти и взаимодействовать. Pinned compression скрывает demo за scroll-progress. Это loss.

**Альтернативы:**
- **(rejected)** HeroPinned: compression text → ослабевает demo как proof.
- **(rejected)** Hero с auto-cycling demo states (variant F.B research): высокий LCP-риск, отвлекает от копи.
- **(taken)** Static hero, demo всегда видим в финальном state, ambient cursor walk даёт «оно живое» без агрессии.

**Файл:** `src/components/sections/Hero.tsx`.

---

## 2026-05-09 — Hero state machine: первая итерация — S0/S1/S3/S4 only

**Решение:** В первой итерации hero implements states S0 (idle), S1 (reveal), S3 (hover tilt), S4 (click play). S2 (active line jump), S5 (sidebar arrival), S6 (hover focus on tick) — отложены.

**Контекст:** Research §3 описывает 7 состояний. Реализация всех семи — как минимум 2× больше JS. Бюджет ≤80KB, и сейчас bundle уже включает Lenis + Framer Motion 12 + project code. Урезка до критичных states.

**Что было выбрано:**
- S0 idle: рендерится first paint без JS — ✓
- S1 reveal: `data-reveal` attribute toggles initial → visible через rAF ✓
- S3 hover tilt: pointermove + rAF ✓
- S4 click play: `data-playing` attribute, переключает CSS keyframe animation ✓
- Ambient cursor walk: native CSS `@keyframes hl-cursor-ambient` infinite — даёт ощущение «живое» без JS ✓

**Что отложено:**
- S2 active line jump (динамическая подсветка следующего segment) — добавит JS state machine, читается как «оно реагирует на меня». Cost-benefit низкий для первой итерации.
- S5 sidebar arrival (новая meeting-карточка появляется через 9s). Идёт в session 2.
- S6 hover focus on tick. Идёт в session 2.

---

## 2026-05-09 — Audience-line: native CSS scroll-driven, не framer-motion + scroll bridge

**Решение:** `animation-timeline: view()` per-word с `@supports` fallback, без JS.

**Контекст:** Текущий HTML использовал GSAP ScrollTrigger (~70KB) для word-by-word fill. Бриф запрещает GSAP. Альтернативы — framer-motion `useScroll` (требует Lenis bridge — см. предыдущее решение, дорого) или native CSS.

**Альтернативы:**
- **(rejected)** GSAP ScrollTrigger — запрещён.
- **(rejected)** framer-motion `useScroll` per-word — стоимость bundle и сложность state.
- **(taken)** native CSS `animation-timeline: view()` — 0KB JS, runs на compositor thread, fallback на final state для Firefox 147- и `prefers-reduced-motion`.

**Browser support:** Baseline 2026 (Chrome 115+, Edge, Opera, Safari 18+). Firefox 147- получает final-state fallback через `@supports not`. Для paid traffic это OK: 92%+ browsers получают полный effect, 100% получают читабельный текст.

---

## 2026-05-09 — Не использовать Tweaks panel из текущего HTML

**Решение:** Не переносить Tweaks panel из `Corder Landing.html` в Next-проект.

**Контекст:** Текущий HTML имеет dev Tweaks panel (React UMD + Babel-standalone, ~1.4MB). Юзер явно сказал убрать.

**Альтернативы:**
- **(rejected)** Перенести в Next как Server Component с cookie preference — overkill для preview-only утилиты.
- **(taken)** Не переносить. Если позже нужна, делать как dev-only popover (`popover` attribute baseline 2025), не в production bundle.

---

## 2026-05-09 — Speaker purple `#5a3aa6` НЕ второй акцент

**Решение:** Purple `#5a3aa6` существует только внутри `.hero-library-demo` как scoped speaker color. На странице вне demo акцент один — forest green.

**Контекст:** Доктрина: один accent на проект. Demo использует две speaker colors (KH purple, VG green) для visual differentiation внутри transcript. Это data, не brand. Purple никогда не выходит за пределы demo card.

**Альтернативы:**
- **(rejected)** Использовать только зелёный для обоих speakers — теряется per-speaker visual signal внутри demo, читается некорректно.
- **(taken)** Scoped purple через `--hl-speaker-purple`, не существует на уровне `--color-*`.

---

## 2026-05-09 — Frame A в alt-тексте и aria-label

**Решение:** Все aria-label, alt-text и data-component строки следуют Frame A. Не использовать "covert", "stealth", "invisible", "no one knows".

**Места проверены:**
- `<div role="img" aria-label="Corder Library window with transcript and per-speaker timeline">` — описывает UI, не утверждает скрытность.
- `<button aria-label="Boost on">` — feature name из app.
- `<a aria-label="Corder — home">` — нейтрально.

---

## 2026-05-09 — Page-container 1280px max width

**Решение:** Custom `.page-container` utility (1280px max + 24/32/40px padding по breakpoint) вместо Tailwind `container`.

**Контекст:** Tailwind v4 стандартный `container` слишком агрессивно сжимает на small screens; кастомный класс даёт editorial-style breathing room и совпадает с doctrine 1280-1440 максимумом.

**Файл:** `globals.css` `.page-container { ... }`.

---
