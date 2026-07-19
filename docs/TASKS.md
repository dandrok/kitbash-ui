# Task queue (Path A)

Ordered work for agents. Check items when the PR merges. One branch/PR per active item unless the design says otherwise.

**Default branch:** `master` (until rename → `main`).  
**Repo only:** `dandrok/kitbash-ui`.

## Done

- [x] Design system architecture spec + AGENTS / security docs (PR #1)
- [x] Foundation tooling — `@ktbsh/ui`, Biome, TypeScript, CI, GEMINI, README (PR #2)
- [x] Tokens & themes + a11y policy (PR #3)
- [x] Storybook — WC, theme toolbar, a11y addon (PR #4)

## In progress / next

- [ ] **Primitives wave** — Button, Input, Textarea, Checkbox, Select, Label, Link, Badge (`feat/primitives`)

## Standing requirements (every component PR)

- **A11y / WCAG 2.2 AA** from first ship — see `docs/a11y.md` and `AGENTS.md` (keyboard, focus, name/state, contrast, target size).
- **Tokens only** via semantic `--kb-*` (no one-off inaccessible colors).
- **agy** pre-commit (`gemini-3.1-pro-high`) + branch/PR workflow.
- **Storybook stories** for new components.

## Backlog

- [ ] **Default branch rename** `master` → `main` (GitHub setting + AGENTS/CI retarget) — exit criteria in design spec §2.2
- [ ] **Layout wave** — Box, Stack, Container, Text, Heading (split if large)
- [ ] **Feedback / overlay** — Alert, Toast, Modal
- [ ] **Navigation** — as needed for full page kits
- [ ] **Package exports / publish prep** — public entry points, optional npm release workflow

## Rules

1. Do not start the next unchecked item until the previous PR is merged (unless the user says parallelize).
2. Never commit on the default branch.
3. `gh` always `-R dandrok/kitbash-ui`.
