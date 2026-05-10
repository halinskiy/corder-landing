# REVIEW.md — Sections 3–9 — Re-review (after 4-FAIL fix-pass)

**Date:** 2026-05-09
**Reviewer:** 3mpq-judge
**Verdict:** **PASSED**
**Iteration:** 2 (incremental tier-1 после fix-pass-1)
**Scope:** Только 4 FAIL-айтема из iteration 1. Не полная re-проверка секций 3–9.

---

## TL;DR

Все четыре FAIL-айтема из iter-1 закрыты. CDP подтверждает 16 px на трёх typographic violators (privacy mono, pricing toggle, footer top) и `aria-label="Corder, home"` без em-dash. Em-dash counter в DOM = 0 (textContent + aria-label + title + alt + placeholder + data-*). Console errors = 0. Никаких видимых регрессий от точечного fix-pass'а.

Sections 0–9 готовы к показу пользователю на localhost.

---

## Tier-1 verification table

Independent CDP probe on `http://localhost:3050/` (viewport 1440×900, after navigate + 4 s settle).

| # | FAIL (iter-1) | Status | Evidence (computed via `Runtime.evaluate`) |
|---|---|---|---|
| 1 | `.privacy-card__spec-value--mono` `font-size` 14 px → 16 px | **PASSED** | 2 instances found, both computed `font-size: 16px`. Sample text "HTTPS to generativelanguage.googleapis.com". Font-family resolves to IBM Plex Mono. Line-height 24 px. |
| 2 | `.pricing-toggle__btn` `font-size` 14 px → 16 px | **PASSED** | 2 instances ("Monthly" + "Annual"), both `font-size: 16px`, `font-weight: 500`. Active/inactive states intact (`aria-pressed: true / false`). |
| 3 | `.site-footer__top` `font-size` 14 px → 16 px | **PASSED** | Element resolves with `font-size: 16px`, IBM Plex Sans, `color: var(--color-text-muted)`. Globals.css L1300–1306 read clean. |
| 4 | Nav home anchor `aria-label` em-dash → comma | **PASSED** | Selector `[data-component="Nav"] a[href="#top"]` returns `aria-label="Corder, home"`, text "Corder". No `—`. |

---

## Bonus regression spot-check

| Check | Result | Notes |
|---|---|---|
| Em-dash count in DOM (textContent + ariaLabel + title + alt + placeholder + data-*) | **0** | Walked entire `document.body` text-node tree + every attribute on every element. Total samples captured: 0. |
| Console errors / warnings on initial load | **0** | `Runtime.consoleAPICalled` and `Runtime.exceptionThrown` listeners both silent through navigate + 4 s settle. |
| Page renders | **OK** | `document.title = "Corder: Record what was said."`, viewport 1440×900, `location.href = http://localhost:3050/`. |
| `npm run typecheck` | **OK** (verbal claim from main agent, exit 0) | Не re-verified — точечные fix'ы только CSS literal-value swap + aria-label string swap, тип-инвариантов не трогали. |
| `npm run build` | **OK** (verbal claim, 38.6 s, exit 0) | Bundle 102 KB shared + 13.1 KB page — inherited WARN, не regression. |

---

## Carryovers (informational, not blockers for this gate)

Эти 4 WARN + 2 NOTE из iter-1 остаются в backlog'е и **не блокируют** показ пользователю. Они задокументированы в iter-1 REVIEW.md (заменён этим файлом — копия в `git log` если нужна).

| # | Severity | Item | Disposition |
|---|---|---|---|
| W1 | WARN | FAQ accordion glyph (kit Accordion uses rotating `+` reading as `×`, brand-doc спецификует minus) | Backlog — kit-level concern, отдельная сессия |
| W2 | WARN | Caption-tier 14 px boundary (footer captions, eyebrow labels neighbouring) — нужен audit что именно tier допустим | Backlog — typography pass |
| W3 | WARN | 102 KB shared bundle vs 80 KB hard target | Backlog — bundle analyzer pass |
| W4 | WARN | CSS optimization warning at build | Backlog — non-blocking |
| N1 | NOTE | "Recommended" badge text on Pro tier — copy review | Backlog |
| N2 | NOTE | Mobile How UX (sticky live-UI on small viewports) | Backlog |

---

## Bonus observation (non-blocking, not new regression)

Probe заметил, что элемент `<nav>` сам по себе не несёт `data-component / data-source / data-tokens` — атрибуты находятся на wrapper-элементе, который CSS-селектор `[data-component="Nav"]` всё-таки матчит (поэтому Inspector overlay будет работать). Это **не FAIL и не WARN** в рамках iter-2 — точечный 1-line aria-label fix не должен был трогать архитектуру. Если хочется навести абсолютную чистоту по доктрине ("every section root carries the triple"), это можно дописать в backlog, но это `<= 1 строка` правки и не блокирует ничего.

---

## Final verdict

**PASSED.** Section 0 + Section 1 + Section 2 (уже PASSED iter-3) + Sections 3–9 (FAILs закрыты iter-2, WARNs/NOTEs — backlog) → готово к показу пользователю на `http://localhost:3050/`.

Soldier может:
1. Показать страницу пользователю (sections 0–9 целиком).
2. Передать в 3mpq-devops для git audit + commit (после явного "ok" от пользователя).

Backlog WARN/NOTE айтемы — отдельная сессия, не часть этого gate.

---

## Artifacts

- `/tmp/aisoldier-judge/corder-rerev2/probe.mjs` — CDP probe script
- `/tmp/aisoldier-judge/corder-rerev2/probe-output.json` — raw CDP output (полный JSON dump всех 8 проб)

## CDP raw output (key fields)

```json
{
  "privacyMono":      { "fontSize": "16px", "fontFamily": "IBM Plex Mono" },
  "privacyMonoAll":   { "count": 2, "sizes": ["16px", "16px"] },
  "pricingToggle":    { "samples": [{ "text": "Monthly", "fontSize": "16px" },
                                    { "text": "Annual",  "fontSize": "16px" }] },
  "pricingToggleAll": { "count": 2, "sizes": ["16px", "16px"], "states": ["true", "false"] },
  "footerTop":        { "fontSize": "16px", "fontFamily": "IBM Plex Sans" },
  "navAria":          { "ariaLabel": "Corder, home", "href": "#top", "text": "Corder" },
  "emDash":           { "total": 0, "counts": { "textContent": 0, "ariaLabel": 0,
                                                "title": 0, "alt": 0,
                                                "placeholder": 0, "dataAttrs": 0 } },
  "consoleErrors":    []
}
```
