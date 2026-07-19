# Task queue (Path A)

Ordered work for agents. Check items when the PR merges. One branch/PR per active item unless the design says otherwise.

**Default branch:** `master` (until rename → `main`).  
**Repo only:** `dandrok/kitbash-ui`.

## Done

- [x] Design system architecture spec + AGENTS / security docs (PR #1)

## In progress / next

- [ ] **Foundation tooling** — `@ktbsh/ui` package identity, Biome, TypeScript, scripts, CI, GEMINI, README (`chore/foundation-tooling`)

## Backlog

- [ ] **Default branch rename** `master` → `main` (GitHub setting + AGENTS/CI retarget) — exit criteria in design spec §2.2
- [ ] **Tokens & themes** — semantic TS, light/dark CSS (`:root` light fallback), generated `tokens.json`, `tokens:build` / `tokens:check`
- [ ] **Storybook** — WC stories, theme toolbar, foundation MDX, CI `build-storybook`
- [ ] **Primitives wave** — Button, Input, Textarea, Checkbox, Select, Label, Link, Badge (+ tests + stories)
- [ ] **Layout wave** — Box, Stack, Container, Text, Heading (split if large)
- [ ] **Feedback / overlay** — Alert, Toast, Modal
- [ ] **Navigation** — as needed for full page kits
- [ ] **Package exports / publish prep** — public entry points, optional npm release workflow

## Rules

1. Do not start the next unchecked item until the previous PR is merged (unless the user says parallelize).
2. Never commit on the default branch.
3. `gh` always `-R dandrok/kitbash-ui`.
