# Consumer inventory: `astro-blog-md` → `@ktbsh/ui`

**Scope:** plan and align the design system first.  
**Do not edit** the Astro site from this repo’s agent loop until the operator expands the repo boundary.

Source inspected (read-only): `../astro-blog-md` (sibling checkout).

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
A11y: dashed focus rings, `sr-only`, `prefers-reduced-motion` (CRT flicker off).

### Kitbash mapping

| Blog | Kitbash |
|------|---------|
| `data-theme` light/dark | `data-theme` light/dark (`applyTheme`) — **unchanged** |
| `data-ui-mode` terminal/regular | `data-kb-preset` **`terminal`** / **`default`** (`applyPreset`) |
| Blog CSS vars `--terminal-*` | Semantic `--kb-*` only (components never use `--terminal-*`) |

**Preset files:**

- `default` → existing `themes/light.css` + `themes/dark.css` (current DS; close to “regular” blue/neutral)
- `terminal` → `themes/terminal/light.css` + `themes/terminal/dark.css` (Matrix values from blog)

Consumers load **all** theme CSS they need; preset + theme attributes select which vars win.

---

## Blog components → DS gap list

| Blog component | Role | Kitbash today | Wave |
|----------------|------|---------------|------|
| ThemeToggle | light/dark toggle | App-level (use `applyTheme`) | docs / optional toggle recipe later |
| UiToggle | terminal/regular | App-level (use `applyPreset`) | docs / optional later |
| PageHeader | site header + nav | `kitbash-nav` + layout (`box`/`stack`) | compose, not new CE |
| Footer | site footer | layout + `text`/`link` | compose |
| FormattedDate | `<time>` | native / `text` | compose |
| TagList | tag chips | `kitbash-badge` (close) | polish / optional `tag` later |
| BlogList / BlogPostPreview | list + cards | layout + `heading`/`text`/`link` | compose; optional `card` later |
| Pagination | page nav | **`kitbash-pagination`** | wire in site |
| TableOfContents | in-page nav | `nav` / links | compose; optional later |
| Prose | markdown body styles | **missing** (`prose` recipe or CSS) | later |
| TerminalTitle | decorative title | `heading` + styles | compose |
| PulseCursor | decorative caret | decorative only | site-specific CSS ok |
| ScrollToTop | FAB control | **missing** button pattern | small component later |
| BaseHead | meta/SEO | Astro only | stay in app |

**Already strong in DS:** button, link, text, heading, stack, box, container, badge, nav, pagination, alert, tabs, breadcrumb, forms, loading.

**A11y bar:** blog targets WCAG-minded focus, contrast (terminal AAA notes), reduced motion. DS must keep **WCAG 2.2 AA** (`docs/a11y.md`) when porting visuals.

---

## Phased work (slow)

1. **Themes (this PR family)** — terminal preset + preset API + Storybook axes; no site edits.  
2. **Visual parity pass** — Storybook snapshots of button/link/nav/pagination under 4 combos; tweak tokens only.  
3. **Gap components** — only what composition cannot do (e.g. prose styles, scroll-to-top if shared).  
4. **Site integration** (separate repo / expanded boundary) — load `@ktbsh/ui` themes + CEs; replace markup gradually.

---

## Do not break

- Existing `data-theme` light/dark default (no preset) still works.  
- `@ktbsh/ui@0.1.0` export paths for `./themes/light.css` and `./themes/dark.css` stay valid.  
- Components keep **only** `var(--kb-*)` — presets only reassign those variables.

### Theming caveat (fixed in kitbash-ui)

SDK `tokens.json` → `:host { --kb-*: #fixed }` **blocks** inheritance from document themes.  
kitbash-ui **omits** the compiler `tokens` config so CEs inherit `:root` theme CSS. Always load theme stylesheets in the host app / Storybook.
