# Consumer inventory: `astro-blog-md` → `@ktbsh/ui`

**Scope:** plan and align the design system first.  
**Do not edit** the Astro site from this repo’s agent loop until the operator expands the repo boundary.

**DS package ready for consume:** `@ktbsh/ui@0.4.2` (npm + `v0.4.2`).  
Source inspected (read-only): `../astro-blog-md` (sibling checkout).

---

## Integration model (locked)

| Concern | Owner |
|---------|--------|
| **Article content** | Blog — Markdown in `astro-blog-md` (unchanged) |
| **Article body styles** | Blog — site CSS (e.g. `.terminal-content`); **not** a kitbash prose CE |
| **Mermaid, code copy, SEO** | Blog — app-specific |
| **UI chrome components** | `@ktbsh/ui` — swap Astro pieces for `kitbash-*` tags |
| **Themes / presets / fonts** | `@ktbsh/ui` theme CSS + `applyTheme` / `applyPreset` |

Articles stay MD → HTML in light DOM → blog styles. Kitbash is for **reusable chrome**, not rewriting posts as components.

---

## Theme model (blog)

Two independent axes on `<html>`:

| Axis | Attribute | Values | UI label |
|------|-----------|--------|----------|
| Color scheme | `data-theme` | `light` \| `dark` | theme=light / theme=**night** |
| UI chrome | `data-ui-mode` | `terminal` \| `regular` | ui=terminal / ui=regular |

That yields **four palettes**:

| Combo | Feel (from blog CSS) |
|-------|----------------------|
| terminal + dark | Matrix green CRT (default) |
| terminal + light | Dark green on light paper |
| regular + dark | Blue/slate modern dark |
| regular + light | Blue modern light (Inter) |

Persistence: `localStorage` keys `theme`, `ui-mode`. FOUC script in `SiteLayout.astro` applies both before paint.  
A11y: **one focus recipe** via `--kb-focus-ring` (soft glow; CEs + optional `themes/focus.css` for natives), `sr-only`, `prefers-reduced-motion` (CRT flicker off).

### Kitbash mapping

| Blog | Kitbash |
|------|---------|
| `data-theme` light/dark | `data-theme` light/dark (`applyTheme`) — **unchanged** |
| `data-ui-mode` terminal/regular | `data-kb-preset` **`terminal`** / **`default`** (`applyPreset`) |
| Blog CSS vars `--terminal-*` | Semantic `--kb-*` only (components never use `--terminal-*`) |

**Preset files:**

- `default` → existing `themes/light.css` + `themes/dark.css` (current DS; close to “regular” blue/neutral)
- `terminal` → `themes/terminal/light.css` + `themes/terminal/dark.css` (Matrix values from blog)

**Fonts (blog faces):** load once so stacks resolve (Storybook does this via `themes/fonts.css`):

| Preset | Face | Blog |
|--------|------|------|
| terminal | **VT323** | `global.css` Google Fonts import |
| default | **Inter** (optional) | regular UI |

```ts
import '@ktbsh/ui/themes/fonts.css'; // VT323 + Inter
import '@ktbsh/ui/themes/light.css';
import '@ktbsh/ui/themes/dark.css';
import '@ktbsh/ui/themes/terminal/light.css';
import '@ktbsh/ui/themes/terminal/dark.css';
import '@ktbsh/ui/themes/focus.css'; // light-DOM Tab focus ≡ CE focus-ring
```

Without `fonts.css`, terminal falls back to `ui-monospace` / Courier (stack still works; less CRT).

Consumers load **all** theme CSS they need; preset + theme attributes select which vars win.

### Focus / chrome inheritance (source of truth = DS)

| Concern | Source of truth | Blog action |
|---------|-----------------|-------------|
| Focus (Tab) | `--kb-focus-ring` + CE styles; optional `themes/focus.css` for natives | Import `focus.css`; **remove** global `outline: 2px dashed …` and competing `.theme-toggle:focus-visible` rules |
| Resting chrome borders | Terminal `color-border-default` (soft `rgba` green, not full `#00e637`) | Prefer kitbash tokens / CEs; drop duplicate `.theme-toggle { border: … }` if CE owns the control |
| Hover | Soft surface/fg change; **no** border → full `border-focus` on chrome toggles | Drop hover rules that force full primary border on toggles/TOC |
| TOC / tags / toggles | `kitbash-toc`, `kitbash-tag*`, `kitbash-theme-toggle`, … | Already wired; leftover light-DOM `.toc-link` / `.theme-toggle` CSS is dead weight or fights shadow styles |

**Quick blog align checklist** (when site boundary allows edits in `astro-blog-md`):

1. Bump / path-link `@ktbsh/ui` build that includes softer terminal borders + unified focus.
2. Import `@ktbsh/ui/themes/focus.css` after theme CSS (e.g. in `BaseHead` or `kitbash.ts` side-effect CSS).
3. In `global.css` base layer: remove dashed `a:focus-visible, button:focus-visible` (or scope it only to places that must stay custom).
4. Remove or neutralize legacy `.theme-toggle` / `.toc-link` hover+focus blocks that predate kitbash CEs.
5. Keep prose-specific link hover in `.terminal-content` if desired (content is site-owned); keyboard focus should still use the DS ring when `focus.css` is loaded.

---

## Blog components → DS gap list

| Blog component | Role | Kitbash today | Wave |
|----------------|------|---------------|------|
| ThemeToggle | light/dark toggle | **`kitbash-theme-toggle`** | shipped |
| UiToggle | terminal/regular | **`kitbash-preset-toggle`** (+ `kitbash-toggle-group`) | shipped |
| PageHeader | site header + nav | `kitbash-nav` + layout (`box`/`stack`) | compose, not new CE |
| Footer | site footer | layout + `text`/`link` | compose |
| FormattedDate | `<time>` | native / `text` | compose |
| TagList | tag chips | **`kitbash-tag-list`** + **`kitbash-tag`** | shipped (blog 1:1 outline + `#`) |
| BlogList / BlogPostPreview | list + cards | layout + `heading`/`text`/`link` | compose; optional `card` later |
| Pagination | page nav | **`kitbash-pagination`** | wire in site |
| TableOfContents | in-page nav | **`kitbash-toc`** (light-DOM links + scroll-spy) | shipped |
| Prose | markdown body styles | **site-owned** (keep blog CSS / MD pipeline) | **deferred** — not a DS requirement for blog |
| TerminalTitle | decorative title | `heading` + styles | compose |
| PulseCursor | decorative caret | decorative only | site-specific CSS ok |
| ScrollToTop | FAB control | **`kitbash-scroll-top`** (`visible` from app scroll) | shipped |
| BaseHead | meta/SEO | Astro only | stay in app |

**Already strong in DS:** button, link, text, heading, stack, box, container, badge, nav, pagination, alert, tabs, breadcrumb, forms, loading, toast, modal, spinner, progress, skeleton.

**A11y bar:** blog targets WCAG-minded focus, contrast (terminal AAA notes), reduced motion. DS must keep **WCAG 2.2 AA** ([`a11y.md`](./a11y.md)) when porting visuals.

---

## Phased work

1. [x] **Themes** — terminal preset + preset API + Storybook axes (PR #15).  
2. [x] **Blog chrome** — theme/preset toggles, toggle-group, scroll-top (PR #17).  
3. [x] **Visual parity pass** — square terminal chrome, TOC/tags, toast/modal, spinner, fonts (PR #23; npm **0.4.1**).  
4. [x] **Gap components for blog chrome** — `kitbash-toc` + tags shipped; **prose stays in the site**. Optional `card` only if list UI needs it later.  
5. [ ] **Site integration** (separate repo / expanded boundary) — install `@ktbsh/ui@0.4.2`, swap Astro chrome one by one; leave MD + prose CSS in the blog.

---

## Do not break

- Existing `data-theme` light/dark default (no preset) still works.  
- `@ktbsh/ui` export paths for `./themes/light.css` and `./themes/dark.css` stay valid (since 0.1.0).  
- Components keep **only** `var(--kb-*)` — presets only reassign those variables.

### Theming caveat (fixed in kitbash-ui)

SDK `tokens.json` → `:host { --kb-*: #fixed }` **blocks** inheritance from document themes.  
kitbash-ui **omits** the compiler `tokens` config so CEs inherit `:root` theme CSS. Always load theme stylesheets in the host app / Storybook.
