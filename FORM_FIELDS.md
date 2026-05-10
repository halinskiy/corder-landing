# Corder — Set up your design system (form copy-paste)

Все тексты ниже — готовые к вставке в форму Claude.ai «Set up your design system».
Открывай нужное поле, копируй блок, вставляй.

---

## 1. Company name and blurb

```
Corder — local-first macOS meeting recorder and transcriber. A status-bar app that captures system audio and your microphone, transcribes on-device with Whisper large-v3, diarises speakers via FluidAudio (a CoreML port of pyannote 3.1), and optionally polishes transcripts with Gemini Flash. Recordings can be archived to your own Dropbox. Everything runs locally — no cloud, no signups, no audio leaves your machine unless you explicitly turn it on.
```

---

## 2. Link code on GitHub

Пропусти — репозиторий приватный. Вместо этого ниже идёт «Link code from your computer».

---

## 3. Link code from your computer

Перетащи папку:

```
/Users/3mpq/Corder/Web
```

Это фронтенд-подмодуль приложения (Vite + React + TypeScript). Там — реальная
рабочая дизайн-система продукта: токены в `src/styles.css`, компоненты в
`src/components/`. Именно её визуальный язык должен унаследовать лендинг.

---

## 4. Upload a .fig file

Пропусти на этом шаге — приложишь сам.

---

## 5. Add fonts, logos and assets

Перетащи файлы из папки:

```
/Users/3mpq/Aisoldier/projects/corder-landing/assets/
```

Что внутри:
- `CORDER-BRAND.md` — плотный бренд-документ: что продукт, аудитория,
  конкуренты, тон голоса, ключевые сообщения, токены палитры,
  типографика, паттерны секций, стоп-слова. Главный текстовый ассет —
  Claude прочитает его и будет опираться на него при работе.
- `corder-mark-waveform.svg` — основной знак (вертикальный волнообразный
  паттерн, уходящий в чёрный диск). Используется в окне приложения.
- `corder-app-icon.svg` — иконка приложения для macOS Tahoe (split
  dark/light + красная точка записи).
- `corder-portfolio-icon.svg` — портфолио-версия (зелёный градиент
  `#1f7a4f → #0e3d28`, белая запись-точка). Подходит как карточная иконка.
- `screen-library.png` — основной скрин: библиотека встреч.
- `screen-popover.png` — меню-бар поповер (управление записью).
- `screen-recording.png` — состояние «идёт запись».

Шрифты не прикладываем — продукт использует системный стек
(`-apple-system, "SF Pro Text"`). Лендинг по доктрине студии перейдёт на
**IBM Plex Serif + IBM Plex Sans** (Google Fonts).

---

## 6. Any other notes?

```
Visual direction:

— Light theme by default. Dark mode is a secondary state, not the primary one.
— Single accent colour. Two candidates inherited from the app: deep green (#1f7a4f, used in the portfolio icon and the "ready" status) or warm muted red (#b8443c, used for the record indicator). Pick one — do not use both.
— Editorial, document-like layouts. The product is a tool for capturing speech and turning it into readable text, so the marketing site should feel like a well-typeset document, not a flashy SaaS page.
— Type pairing: IBM Plex Serif for headings and display, IBM Plex Sans for everything else. Minimum body size 16px. 12px only allowed for uppercase eyebrow labels with letter-spacing 0.04em and font-weight 600.
— Borders, not shadows. Every card, input and surface gets a 1px border (gray-200 in light, #393939 in dark). Shadows only as light-theme secondary depth.
— Pill-shaped chrome controls (toolbar buttons, search inputs) — inherited from the app. Block-level CTAs and content cards use 8–12px radii instead.
— Easing: cubic-bezier(0.16, 1, 0.3, 1) for all entry animations. Nothing bouncy or elastic. Smooth, damped, pneumatic.
— Dot-grid backgrounds (radial-gradient, 24px tile) where atmosphere is wanted.
— Tone of voice: matter-of-fact, technical, slightly dry. The product is for journalists, researchers, therapists, founders doing 1-on-1s — people who care that audio stays on their device. Lead with the privacy story, not feature lists.
— Inspector mode: every component must carry data-component / data-source / data-tokens attributes so the Webflow developer can Cmd+click any element on the staging build and see which kit component produced it.
— Stack: Next.js 15 App Router, React 19, TypeScript strict, Tailwind v4 with @theme tokens, Framer Motion 12, Lenis smooth scroll. No component library — everything built from scratch against the studio's own UI kit at /ui-kit.
```

---

## После заполнения формы

Когда форма пройдёт, начнём полноценный кикофф проекта (`/new-project`) —
researcher соберёт нишевый трендовый скан, copywriter напишет копи под
аудиторию privacy-first инструментов, soldier построит первую секцию.
