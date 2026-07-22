# Task queue (Path A)

Ordered work for agents. Check items when the PR merges. One branch/PR per active item unless the design says otherwise.

**Default branch:** `master` (until rename → `main`).  
**Repo only:** `dandrok/kitbash-ui`.  
**Published:** `@ktbsh/ui@0.4.3` on npm (`v0.4.3` tag) — after tag push from this release.

## Phase status

| Phase | Status |
|-------|--------|
| **Design system foundation** (tokens, Storybook, primitives → nav, publish) | **Done** |
| **Blog-driven chrome** (themes, toggles, TOC, tags, terminal visual pass) | **Done** through **0.4.3** (focus/chrome unify) |
| **Markdown / article body (prose)** | **Deferred — site-owned** (see below) |
| **Site integration** (`astro-blog-md` component swap) | **Next**, in the **blog repo** (outside this agent boundary) |
| **Optional DS growth** (cards, overlays, forms extras, …) | Backlog only — not blocking consume |

**Blog-phase default:** do not start optional backlog unless the operator asks or site integration finds a gap in this package.

---

## Done

- [x] Design system architecture spec + AGENTS / security docs (PR #1)
- [x] Foundation tooling — `@ktbsh/ui`, Biome, TypeScript, CI, GEMINI, README (PR #2)
- [x] Tokens & themes + a11y policy (PR #3)
- [x] Storybook — WC, theme toolbar, a11y addon (PR #4)
- [x] Primitives wave — Button through Badge (PR #5)
- [x] Layout wave — Box, Stack, Container, Text, Heading (PR #6)
- [x] Feedback / overlay — Alert, Toast, Modal (PR #7)
- [x] Loading indicators — Spinner, Progress, Skeleton (PR #8)
- [x] Forms polish — Field, Radio, Switch (PR #9)
- [x] Navigation — Tabs, Breadcrumb, Nav, Pagination (PR #10; CR follow-up PR #12)
- [x] Package exports / publish prep (PR #13)
- [x] **Theme presets (astro-blog-md)** — terminal + default light/dark (PR #15, npm 0.2.0)
- [x] **npm first release** — publish workflow + operator release
- [x] **Blog chrome** — theme/preset toggles, toggle-group, scroll-top (PR #17)
- [x] **Form control visuals** — custom checkbox/radio/switch/select + dark skeleton (PR #18)
- [x] **Table of contents** — `kitbash-toc` (PR #20)
- [x] **Tags** — `kitbash-tag` + `kitbash-tag-list` (PR #21)
- [x] **npm 0.4.0** — toc + tags
- [x] **Terminal visual pass** — square CRT radius, toast/modal, spinner, TOC cue, fonts (PR #23)
- [x] **npm 0.4.1** — visual pass on npm (`v0.4.1` / `@ktbsh/ui@0.4.1`)
- [x] **npm 0.4.2** — TOC nested click/scroll + active markers (`v0.4.2` / `@ktbsh/ui@0.4.2`)
- [ ] **npm 0.4.3** — unified focus-ring + softer terminal chrome + `themes/focus.css`

## Deferred / out of scope for blog phase

- [ ] ~~**Prose** (`kitbash-prose` or CSS recipe)~~ — **site-owned**. Articles stay Markdown in `astro-blog-md`; body styles stay in the site (e.g. `.terminal-content`). Kitbash replaces **UI chrome components**, not the MD content pipeline. Optional later: extract a shared CSS recipe if a second consumer needs the same look.
- [ ] ~~Default branch rename `master` → `main`~~ — optional; skip unless desired

## Next (operator / other repo)

1. **Site integration** — in **`astro-blog-md`**: install `@ktbsh/ui@0.4.3`, load themes/fonts + `themes/focus.css`, remove competing dashed focus CSS, swap Astro chrome (toggles, tags, TOC, scroll-top, pagination, etc.). Do **not** rewrite articles as components.
2. **Feedback loop** — if integration needs a fix or missing prop, open a focused PR **here**.
3. **Optional DS growth** — backlog below only when asked.

Consumer inventory: [`docs/consumer-astro-blog-md.md`](./consumer-astro-blog-md.md).

## Standing requirements (every component PR)

- **A11y / WCAG 2.2 AA** from first ship — see [`a11y.md`](./a11y.md) and [`AGENTS.md`](../AGENTS.md)
- **Tokens only** via semantic `--kb-*` (incl. radius/space/type — not colors only)
- **Dual review** — `cr review` + `agy --model gemini-3.1-pro-high` before every commit
- **Storybook stories** for new components
- **SDK pain points** — append to [`docs/sdk-feedback.md`](./sdk-feedback.md) when blocked

## Planned waves (backlog)

### Optional ops

1. [ ] **Default branch rename** `master` → `main` (GitHub setting + AGENTS/CI retarget)

### Later / nice-to-have

- [ ] Avatar, Divider, Card recipes  
- [ ] Tooltip, Popover, Dropdown menu  
- [ ] Table / data list  
- [ ] Accordion / disclosure  
- [ ] Empty state  
- [ ] Combobox / autocomplete  
- [ ] Date/time picker (beyond raw `input type=date`)  
- [ ] File upload / dropzone  
- [ ] Modal focus trap improvements (needs SDK lifecycle support)  
- [ ] Token extras: gradients, motion/duration, z-index, opacity, density  
- [ ] Storybook: richer token docs (already have color + space/radius/type scales)  
- [ ] Automated axe in CI (Storybook test-runner)  
- [ ] **SDK improvements** — track consumer pain in [`docs/sdk-feedback.md`](./sdk-feedback.md)

## Known gaps (forms / inputs)

| Area | Status |
|------|--------|
| `kitbash-input` `type` prop | Passed to native `<input>` — text-like first-class; date/file not specialized |
| Number/date/file dedicated fields | Missing |
| Field / Radio / Switch | Shipped (PR #9) |
| Checkbox form value when unchecked | **SDK limit** — see sdk-feedback.md P0 #2 |

## Tokens already shipped (not missing)

Color, **space**, **radius** (incl. `radius-none`; terminal zeros sm/md/lg), **font** size/weight/family (optional VT323/Inter via `themes/fonts.css`), line-height, **shadow**, **focus-ring**, light/dark + terminal presets.  
Still missing as tokens: gradients, motion/easing, z-index scale, opacity scale, density.

## Rules

1. Do not start optional backlog until the operator asks (blog phase is complete for this repo).  
2. Never commit on the default branch.  
3. `gh` always `-R dandrok/kitbash-ui`.  
