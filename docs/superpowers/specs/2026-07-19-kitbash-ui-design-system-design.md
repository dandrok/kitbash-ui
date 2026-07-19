# Kitbash UI Design System — Design Spec

**Date:** 2026-07-19  
**Status:** Approved (conversation)  
**Package:** `@ktbsh/ui`  
**Repo:** `kitbash-ui`  
**Compiler / runtime:** `@ktbsh/sdk` (framework-agnostic Web Components + React wrappers)

## 1. Purpose

Build a professional, framework-agnostic design system authored with Kitbash SDK. One TypeScript definition per component compiles to:

- Vanilla custom elements (Shadow DOM, uhtml-bundled)
- React wrappers + `.d.ts`
- Custom Elements Manifest (`custom-elements.json`)

Consumers use the same components in vanilla JS, React, Svelte (via CE), and other CE-capable environments.

Development runs in **Path A autonomous loops**: implement one coherent slice → verify → dual LLM review → commit → open PR → poll until merge → pull `main` → next task.

## 2. Decisions (locked)

| Topic | Decision |
|-------|----------|
| Package name | `@ktbsh/ui` |
| Custom element prefix | `kitbash-*` |
| Architecture | Single package, folder-layered (not a multi-package monorepo) |
| Themes (v1) | Semantic tokens + **light** / **dark** CSS themes via `data-theme` |
| Agent orchestration | **Path A default:** local `docs/TASKS.md` + `gh` PR polling. **Path B optional later:** Actions + `todo-ai` issues + headless agent (see `docs/security-and-secrets.md`). Local `.env` ≠ Actions secrets. |
| Security | No secrets in package/source; gitignored `.env`; least-privilege tokens; DS XSS/supply-chain bar |
| First component wave | Button, Input, Textarea, Checkbox, Select, Label, Link, Badge |
| Lint/format | Biome (aligned with kitbash-sdk) |
| Runtime | Bun ≥ 1.0 |
| Default branch | `main` (rename from `master`) |

## 3. Goals

- Framework-agnostic components (no React-/Svelte-only implementations)
- Professional DS surface: tokens, themes, parts, a11y basics, Storybook, strong TypeScript DX
- KISS / DRY; latest **stable** package versions (no blind `uhtml` upgrades — respect SDK pin of uhtml@4.7.1 via SDK)
- Separate PRs for foundation vs features; CI gates every PR
- Dual external review before each commit (mirror kitbash-sdk loop mode)
- Docs without duplication: README ≠ Storybook ≠ AGENTS

## 4. Non-goals (v1)

- Multi-brand / multi-product token platforms
- Generated Svelte or Vue wrappers (use vanilla CE)
- Path B cloud AI runner / issue-driven GitHub Actions factory
- Full app shell, marketing site, or animation system
- Changes to `@ktbsh/sdk` (this repo is a **consumer** of the SDK)
- Perfect visual polish of every state before foundations land

## 5. Architecture

### 5.1 Authoring flow

```text
src/components/*.ts   defineComponent({…})
        │
        ▼
  kitbash build  (@ktbsh/sdk)
        │
   ┌────┴────┐
   ▼         ▼
 vanilla/   react/ + CEM
        │
        ▼
 Storybook (CE stories) + consumer apps
```

Hard SDK rules (must follow in every component):

1. No outer closures/imports inside `render` / `events` (they are `.toString()`’d).
2. Prefer `commit({ props, state })` for user input so `kitbash-change` carries fresh values.
3. External property sets re-render but do **not** emit `kitbash-change`.
4. Primitives only for reflected attributes.
5. Theme via CSS variables on `:host` and `part` hooks; product a11y content lives in this DS, not the SDK.

### 5.2 Repository layout

```text
kitbash-ui/
├── .github/workflows/ci.yml
├── AGENTS.md
├── GEMINI.md
├── package.json                 # name: @ktbsh/ui
├── kitbash.config.ts
├── biome.json
├── tsconfig.json
├── .storybook/
│   ├── main.ts
│   └── preview.ts               # theme toolbar + global theme CSS
├── src/
│   ├── tokens/
│   │   ├── index.ts             # public typed exports
│   │   ├── semantic.ts          # semantic token keys / types
│   │   ├── themes/
│   │   │   ├── light.css
│   │   │   └── dark.css
│   │   └── tokens.json          # kitbash compiler bridge (CSS vars)
│   ├── components/              # one file per component
│   └── types/                   # shared public unions (Size, Variant, …)
├── stories/                     # Storybook stories + MDX foundations
├── docs/
│   ├── TASKS.md                 # Path A ordered queue
│   └── superpowers/specs/       # design specs
├── dist/                        # build output (generated)
└── README.md
```

### 5.3 Token & theme model

**Principle:** components consume **semantic CSS variables only** (e.g. `--kb-color-bg-surface`, `--kb-space-md`, `--kb-radius-sm`). Brand hex values live in theme files, not component styles (except rare documented exceptions).

**Layers:**

1. **Semantic TypeScript** (`src/tokens/semantic.ts` + `index.ts`) — exported keys/types for DX and docs.
2. **Theme CSS** (`light.css`, `dark.css`) — values under `:root[data-theme="light"]` and `:root[data-theme="dark"]` (also support `html` without attribute defaulting to light).
3. **`tokens.json`** — flattened vars for `@ktbsh/sdk` build injection onto components. **Single write path:** semantic/theme definitions are source of truth; `tokens.json` is derived or hand-maintained as the compiler bridge and must not diverge (document the sync rule in AGENTS.md when tokens PR lands).

**Theme switch:** set `document.documentElement.dataset.theme = 'light' | 'dark'`. Storybook toolbar uses the same mechanism.

### 5.4 Storybook

- Web Components framework integration (not React-only stories).
- Global light/dark theme toolbar.
- Autodocs where practical; short foundation MDX (tokens, theming, a11y).
- Stories cover primary variants and critical states (disabled, invalid, etc.).
- CI runs `build-storybook` once Storybook exists (PR3).

### 5.5 Tooling & CI

| Check | Command / tool |
|-------|----------------|
| Lint + format | Biome (`bun run ci` / `lint` / `format`) |
| Typecheck | `tsc --noEmit` |
| Build | `kitbash build` |
| Tests | Bun test |
| Storybook (from PR3) | `build-storybook` |

**CI workflow** (every push/PR to `main`):

1. Checkout  
2. Setup Bun (latest stable pin, e.g. matching kitbash-sdk style)  
3. `bun install --frozen-lockfile`  
4. Biome CI  
5. Typecheck  
6. Tests (when present)  
7. Build  
8. Storybook build (when present)

### 5.6 Documentation split (no duplication)

| Surface | Owns |
|---------|------|
| **README** | What it is, install, scripts, consume vanilla/React/Svelte, link out |
| **Storybook** | Interactive props, variants, theming demos, a11y notes |
| **AGENTS.md** | Agent loop, pins, review policy, authoring footguns |
| **docs/TASKS.md** | Ordered implementation queue for Path A |
| **Design specs** | Architecture decisions (this file and successors) |

Do **not** paste full prop tables into both README and Storybook.

### 5.7 Agent loop (Path A)

```text
1. Read next open item in docs/TASKS.md
2. Branch from main: feat/… or chore/…
3. Implement one coherent slice (KISS/DRY)
4. Verify: typecheck, lint, test, build (+ storybook when applicable)
5. Dual review before commit:
   - cr review --plain --base main   (if available)
   - Second LLM read-only review (no silent edits)
6. Triage: fix real bugs/nits; skip over-engineering noise
7. Commit (one clear message: why + what)
8. Open PR via gh
9. Poll every ~30s: gh pr view <n> --json state
   - MERGED → git checkout main && git pull → mark task done → next
   - CLOSED (not merged) → halt and report
   - OPEN → sleep and recheck
```

**Prerequisite:** authenticated GitHub CLI (`gh auth login` or `GH_TOKEN`). Without it, PRs and polling cannot run.

### 5.8 Component conventions

| Convention | Rule |
|------------|------|
| Tag | `kitbash-<name>` |
| File | `src/components/<name>.ts`, default export `defineComponent` |
| Props | Attribute-safe primitives; export TS unions for string variants |
| Sizes | Shared `KitbashSize = 'sm' \| 'md' \| 'lg'` where relevant |
| Button variants | `primary` \| `secondary` \| `ghost` \| `danger` |
| Styles | Semantic CSS vars + `part` hooks |
| Forms | `formAssociated` + `delegatesFocus` for text-like controls |
| Events | User input → `commit`; consumers use `kitbash-change` / `onKitbashChange` |
| Slots | Default slot for content; named slots only when justified |
| A11y | Correct roles, labeling (Label component / aria props), focus ring, disabled |

**Scaffold cleanup (primitives PR):** rename `my-button` → `kitbash-button`; remove demo click-count from default Button API; align Input with production tokens and Label composition.

### 5.9 Shared public types (initial)

```ts
export type KitbashSize = 'sm' | 'md' | 'lg';
export type KitbashButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type KitbashTheme = 'light' | 'dark';
```

Expand carefully as components need; keep types co-located under `src/types/` and re-export from package entry points when packaging stabilizes.

### 5.10 Testing bar (per component PR)

- `kitbash build` succeeds; CEM lists the tag
- Focused tests for critical behavior (e.g. Input commit, Button disabled, Checkbox toggle)
- Stories for main variants/states
- Biome + typecheck clean

## 6. PR roadmap

| PR | Title | Scope |
|----|-------|--------|
| **1** | Foundation | Package rename `@ktbsh/ui`, Biome, tsconfig, scripts, AGENTS.md, GEMINI.md, `docs/TASKS.md`, CI workflow, branch `main`, README refresh. **No** full tokens/Storybook/new components. Keep existing button/input building. |
| **2** | Tokens & themes | Semantic tokens, light/dark CSS, typed exports, `tokens.json` bridge, docs for theming |
| **3** | Storybook | Storybook WC setup, theme toolbar, foundation MDX, CI storybook build |
| **4** | Primitives wave | Button, Input, Textarea, Checkbox, Select, Label, Link, Badge (+ tests + stories) |
| **5+** | Later waves | Layout (Box/Stack/Container/Text/Heading), feedback (Alert/Toast), overlays (Modal), nav — split by coherence, not one mega-PR |

### PR1 detailed in-scope

- `package.json`: name `@ktbsh/ui`, version `0.1.0`, type module, engines bun, scripts: `build`, `dev`, `lint`, `format`, `typecheck`, `test`, `ci`
- Dependencies: latest stable `@ktbsh/sdk`; devDeps: Biome, TypeScript, `@types` as needed
- `biome.json`, `tsconfig.json`
- `.github/workflows/ci.yml` (lint, typecheck, build; test when harness exists)
- `AGENTS.md` (loop mode, pins, review, SDK footguns)
- `GEMINI.md` (short architecture pointer)
- `docs/TASKS.md` full ordered queue
- README: install/build/consume only
- Optional: rename default branch to `main` and update remote tracking

### PR1 out-of-scope

- Full token architecture and theme CSS
- Storybook
- New components or production API rewrite of button/input

## 7. Success criteria

- [ ] CI green on `main` for foundation checks
- [ ] `@ktbsh/ui` identity and agent docs in place
- [ ] Light/dark themes + semantic tokens exported and used by components
- [ ] Storybook shows components under both themes
- [ ] Primitives wave covers a usable form + action set
- [ ] Every merged PR is one coherent slice, reviewed, tested, documented where it makes prior docs wrong
- [ ] Path A loop can advance from `docs/TASKS.md` after merge

## 8. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| `gh` not authenticated | Block PR/poll steps until `gh auth` or `GH_TOKEN` works; still implement code |
| SDK token flattening is shallow | Design semantic CSS layers ourselves; use `tokens.json` as bridge only |
| Storybook + CE tooling churn | Pin latest **stable** Storybook; verify WC framework package |
| Scope creep into “full page kit” | Enforce PR roadmap; TASKS.md is the backlog, not a single PR |
| Divergent `tokens.json` vs CSS themes | One source of truth; document sync in AGENTS when tokens land |

## 9. References

- kitbash-sdk `AGENTS.md`, `GEMINI.md`, `docs/SUPPORTED.md`
- `@ktbsh/sdk` README (authoring, theming hooks, forms, CEM)
- Existing scaffold: `src/components/button.ts`, `input.ts`, `tokens.json`
