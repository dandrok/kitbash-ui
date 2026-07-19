# Task queue (Path A)

Ordered work for agents. Check items when the PR merges. One branch/PR per active item unless the design says otherwise.

**Default branch:** `master` (until rename → `main`).  
**Repo only:** `dandrok/kitbash-ui`.

## Done

- [x] Design system architecture spec + AGENTS / security docs (PR #1)
- [x] Foundation tooling — `@ktbsh/ui`, Biome, TypeScript, CI, GEMINI, README (PR #2)
- [x] Tokens & themes + a11y policy (PR #3)
- [x] Storybook — WC, theme toolbar, a11y addon (PR #4)
- [x] Primitives wave — Button through Badge (PR #5)
- [x] Layout wave — Box, Stack, Container, Text, Heading (PR #6)
- [x] Feedback / overlay — Alert, Toast, Modal (PR #7)

## In progress / next

- [ ] **Loading indicators** — Spinner, Progress, Skeleton (`feat/loading-indicators`)

## Standing requirements (every component PR)

- **A11y / WCAG 2.2 AA** from first ship — see `docs/a11y.md` and `AGENTS.md`
- **Tokens only** via semantic `--kb-*` (incl. radius/space/type — not colors only)
- **agy** pre-commit (`gemini-3.1-pro-high`) + branch/PR workflow
- **Storybook stories** for new components

## Planned waves (backlog)

### Near-term (recommended order)

1. [ ] **Loading** — Spinner, Progress (determinate + indeterminate), Skeleton  
2. [ ] **Forms polish** — Field (label + control + hint + error), Radio group, Switch  
3. [ ] **Navigation** — Tabs, Breadcrumb, simple Nav / Pagination  
4. [ ] **Package exports / publish prep** — public entry points (`package.json` exports), optional npm release CI  
5. [ ] **Default branch rename** `master` → `main` (GitHub setting + AGENTS/CI retarget)

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

## Known gaps (forms / inputs)

| Area | Status |
|------|--------|
| `kitbash-input` `type` prop | Passed to native `<input>` — text-like types first-class; `date`/`file`/`color` work via browser chrome only (not specialized DS styling) |
| Number/date/file dedicated fields | Missing |
| Field composite (label+error) | Missing |
| Radio / Switch | Missing |
| Checkbox form value when unchecked | SDK `setFormValue` limitation documented on checkbox |

## Tokens already shipped (not missing)

Color, **space**, **radius (round)**, **font** size/weight/family, line-height, **shadow**, **focus-ring**, light/dark themes.  
Still missing as tokens: gradients, motion/easing, z-index scale, opacity scale, density.

## Rules

1. Do not start the next unchecked item until the previous PR is merged (unless the user says parallelize).  
2. Never commit on the default branch.  
3. `gh` always `-R dandrok/kitbash-ui`.  
