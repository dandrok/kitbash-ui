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
- [x] Loading indicators — Spinner, Progress, Skeleton (PR #8)
- [x] Forms polish — Field, Radio, Switch (PR #9)
- [x] Navigation — Tabs, Breadcrumb, Nav, Pagination (PR #10; CR follow-up PR #12)
- [x] Package exports / publish prep (PR #13)

## In progress / next

- [ ] **Default branch rename** `master` → `main` (GitHub setting + AGENTS/CI retarget)

## Standing requirements (every component PR)

- **A11y / WCAG 2.2 AA** from first ship — see `docs/a11y.md` and `AGENTS.md`
- **Tokens only** via semantic `--kb-*` (incl. radius/space/type — not colors only)
- **Dual review** — `cr review` + `agy --model gemini-3.1-pro-high` before every commit
- **Storybook stories** for new components
- **SDK pain points** — append to [`docs/sdk-feedback.md`](./sdk-feedback.md) when blocked

## Planned waves (backlog)

### Near-term (recommended order)

1. [x] **Loading** — Spinner, Progress, Skeleton  
2. [x] **Forms polish** — Field, Radio, Switch  
3. [x] **Navigation** — Tabs, Breadcrumb, Nav, Pagination (PR #10; CR follow-up PR #12)  
4. [x] **Package exports / publish prep** — public entry points (`package.json` exports), optional npm release CI (PR #13)  
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
- [ ] **SDK improvements** — track consumer pain in [`docs/sdk-feedback.md`](./sdk-feedback.md)

## Known gaps (forms / inputs)

| Area | Status |
|------|--------|
| `kitbash-input` `type` prop | Passed to native `<input>` — text-like first-class; date/file not specialized |
| Number/date/file dedicated fields | Missing |
| Field / Radio / Switch | Shipped (PR #9) |
| Checkbox form value when unchecked | **SDK limit** — see sdk-feedback.md P0 #2 |

## Tokens already shipped (not missing)

Color, **space**, **radius (round)**, **font** size/weight/family, line-height, **shadow**, **focus-ring**, light/dark themes.  
Still missing as tokens: gradients, motion/easing, z-index scale, opacity scale, density.

## Rules

1. Do not start the next unchecked item until the previous PR is merged (unless the user says parallelize).  
2. Never commit on the default branch.  
3. `gh` always `-R dandrok/kitbash-ui`.  
