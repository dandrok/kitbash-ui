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

Development runs in **Path A autonomous loops**: implement one coherent slice → verify → dual LLM review → commit → open PR → poll until merge → pull the **default branch** → next task.

## 2. Decisions (locked)

| Topic | Decision |
|-------|----------|
| Package name | `@ktbsh/ui` |
| Custom element prefix | `kitbash-*` |
| Architecture | Single package, folder-layered (not a multi-package monorepo) |
| Themes (v1) | Semantic tokens + **light** / **dark** CSS themes via `data-theme` |
| Agent orchestration | **Path A default:** local `docs/TASKS.md` + `gh` PR polling. **Path B optional later:** Actions + `todo-ai` issues + headless agent (see `docs/security-and-secrets.md`). Local `.env` ≠ Actions secrets. |
| Security | No secrets in package/source; gitignored `.env`; least-privilege tokens; DS XSS/supply-chain bar |
| Accessibility | **WCAG 2.2 AA** from first component ship; keyboard, focus, name/state, contrast light+dark; see `docs/a11y.md` |
| First component wave | Button, Input, Textarea, Checkbox, Select, Label, Link, Badge |
| Lint/format | Biome (aligned with kitbash-sdk); pin exact version in `package.json` + lockfile |
| Runtime | **Bun 1.3.14** in CI/`engines` (aligned with kitbash-sdk). Reproducible via `bun.lock`. See §2.1. |
| Default branch | **Temporary `master`** (current GitHub default). **Rename to `main` is required before CI + agent workflows treat `main` as canonical** — see §2.2. |

### 2.1 Version pin policy

| Kind | Policy |
|------|--------|
| **Bun** | Pin **1.3.14** in CI (`oven-sh/setup-bun`) and `package.json` `engines`. Bump only in a deliberate PR. |
| **npm deps** | Exact or lockfile-resolved versions. `bun install --frozen-lockfile` in CI. No floating “latest” in workflows. |
| **GitHub Actions** | Pin third-party actions by **full commit SHA**; keep the human tag as an inline comment (e.g. `# v4`). |
| **uhtml** | Owned by `@ktbsh/sdk` (4.7.1 there) — never bumped from this repo. |
| **Reviewed updates** | Dependency bumps are their own PR: update lockfile, run CI, note breaking risk. |

### 2.2 Default-branch migration (`master` → `main`)

| Phase | Default branch | Agent / CI / `gh` / CodeRabbit base |
|-------|----------------|-------------------------------------|
| **Now (until rename)** | `master` | `--base master`, `on: push/pull_request: branches: [master]` |
| **After rename** | `main` | All bases and branch filters → `main`; update `AGENTS.md` in the same PR |

**Exit criteria for the rename (part of foundation or immediately before first CI workflow that hardcodes a branch list):**

1. GitHub repo default branch renamed `master` → `main` (Settings → General → Default branch), or `gh` equivalent.
2. Local tracking updated; `AGENTS.md` and design spec say `main` only.
3. Any workflow `branches:` filters and `cr review --base` use `main`.
4. No docs still instruct agents to target `master` as the live default.

**Until exit criteria pass, do not hardcode `main` as the live PR base.** Temporary dual notes (“master now / main after rename”) are OK in governance docs only.

## 3. Goals

- Framework-agnostic components (no React-/Svelte-only implementations)
- Professional DS surface: tokens, themes, parts, a11y basics, Storybook, strong TypeScript DX
- KISS / DRY; lockfile-pinned deps and reviewed upgrades (§2.1); no blind `uhtml` upgrades
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

**Authoritative source (single write path):**

| Artifact | Authority |
|----------|-----------|
| `src/tokens/themes/light.css` + `dark.css` | **Source of truth for values** (CSS custom properties) |
| `src/tokens/semantic.ts` + `index.ts` | **Source of truth for names/types** (TS unions, docs, DX) |
| `src/tokens/tokens.json` | **Generated compiler bridge only** for `@ktbsh/sdk` — not hand-edited as primary |

**Enforced sync (tokens PR + forever after):**

1. `bun run tokens:build` generates `tokens.json` from the authoritative sources (theme values + semantic keys).
2. CI runs `bun run tokens:check` — fails if committed `tokens.json` drifts from generation output.
3. Agents never hand-patch `tokens.json` without regenerating; `AGENTS.md` repeats this rule.

Until the tokens PR lands, the scaffold `src/tokens.json` (or path under `src/tokens/`) may remain a temporary stub; generation + drift check become mandatory in PR2.

**Theme CSS selectors (required):**

```css
/* light.css — default light immediately, even without data-theme */
:root,
:root[data-theme="light"] {
  /* --kb-* light values */
}

/* dark.css */
:root[data-theme="dark"] {
  /* --kb-* dark values */
}
```

- Unqualified `:root` **is the light fallback** so pages with no `document.documentElement.dataset.theme` still resolve light semantic variables.
- `:root[data-theme="light"]` keeps an explicit light theme when the attribute is set.
- `:root[data-theme="dark"]` overrides for dark. Preserve this behavior.

**Theme switch:** set `document.documentElement.dataset.theme = 'light' | 'dark'` (or omit for default light). Storybook toolbar uses the same mechanism.

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

**CI workflow** (every push/PR to the **current default branch** — `master` until rename exit criteria in §2.2, then `main`):

1. Checkout (action pinned by full SHA)  
2. Setup Bun **1.3.14**  
3. `bun install --frozen-lockfile`  
4. Biome CI  
5. Typecheck  
6. Tests (when present)  
7. `tokens:check` (from tokens PR onward)  
8. Build  
9. Storybook build (when present)

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
2. Branch from default (master until rename, then main): feat/… or chore/…
3. Implement one coherent slice (KISS/DRY)
4. Verify: typecheck, lint, test, build (+ tokens:check / storybook when applicable)
5. Dual review before commit:
   - cr review --plain --base master   (if available; after rename: --base main)
   - Second LLM read-only review (no silent edits)
6. Triage: fix real bugs/nits; skip over-engineering noise
7. Commit (one clear message: why + what)
8. Open PR via gh --base <default>
9. Poll every ~30s: gh pr view <n> --json state
   - MERGED → git checkout <default> && git pull → mark task done → next
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
| A11y | **WCAG 2.2 AA** gate — native controls preferred; APG when needed; focus-visible; delegatesFocus; contrast; target size; see `docs/a11y.md` |

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
| **1** | Foundation | Package rename `@ktbsh/ui`, Biome, tsconfig, scripts, GEMINI.md, `docs/TASKS.md`, CI on **current default (`master`)**, Bun **1.3.14**, README refresh. **Include or immediately follow with** `master`→`main` rename meeting §2.2 exit criteria. **No** full tokens/Storybook/new components. Keep existing button/input building. |
| **2** | Tokens & themes | Semantic tokens, light/dark CSS (`:root` light fallback), typed exports, **generated** `tokens.json` + `tokens:build` / `tokens:check` |
| **3** | Storybook | Storybook WC setup, theme toolbar, foundation MDX, **a11y addon**, CI storybook build |
| **4** | Primitives wave | Button, Input, Textarea, Checkbox, Select, Label, Link, Badge (+ tests + stories + **WCAG 2.2 AA checklist** / `docs/a11y.md`) |
| **5+** | Later waves | Layout (Box/Stack/Container/Text/Heading), feedback (Alert/Toast), overlays (Modal), nav — split by coherence, not one mega-PR |

### PR1 detailed in-scope

- `package.json`: name `@ktbsh/ui`, version `0.1.0`, type module, `engines.bun` **1.3.14**, scripts: `build`, `dev`, `lint`, `format`, `typecheck`, `test`, `ci`
- Dependencies: current published `@ktbsh/sdk` (lockfile-pinned); devDeps: Biome, TypeScript — exact versions in lockfile
- `biome.json`, `tsconfig.json`
- `.github/workflows/ci.yml` targeting **`master`** until rename; then retarget **`main`** (lint, typecheck, build; test when harness exists); pin Actions by SHA
- `AGENTS.md` / governance aligned with live default branch
- `GEMINI.md` (short architecture pointer)
- `docs/TASKS.md` full ordered queue
- README: install/build/consume only
- Default-branch rename to `main` per §2.2 (same PR or immediate follow-up before treating `main` as live)

### PR1 out-of-scope

- Full token architecture and theme CSS
- Storybook
- New components or production API rewrite of button/input

## 7. Success criteria

- [ ] CI green on the **live** default branch (`master`, then `main` after §2.2)
- [ ] Default branch rename exit criteria met before agents/CI assume `main` only
- [ ] `@ktbsh/ui` identity and agent docs in place
- [ ] Light/dark themes + semantic tokens; `tokens:check` prevents `tokens.json` drift
- [ ] Unqualified `:root` light fallback works without `data-theme`
- [ ] Storybook shows components under both themes
- [ ] Primitives wave covers a usable form + action set
- [ ] Every merged PR is one coherent slice, reviewed, tested, documented where it makes prior docs wrong
- [ ] Path A loop can advance from `docs/TASKS.md` after merge

## 8. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| `gh` not authenticated | Block PR/poll steps until `gh auth` or `GH_TOKEN` works; still implement code |
| SDK token flattening is shallow | Theme CSS + semantic TS are SoT; generated `tokens.json` bridge + CI drift check |
| Storybook + CE tooling churn | Pin Storybook version in lockfile; verify WC framework package |
| Scope creep into “full page kit” | Enforce PR roadmap; TASKS.md is the backlog, not a single PR |
| Docs say `main` while GitHub still uses `master` | §2.2 temporary `master` + explicit rename exit criteria |
| Floating tool versions | §2.1 pin Bun 1.3.14, Actions SHAs, frozen lockfile |

## 9. References

- kitbash-sdk `AGENTS.md`, `GEMINI.md`, `docs/SUPPORTED.md`
- `@ktbsh/sdk` README (authoring, theming hooks, forms, CEM)
- Existing scaffold: `src/components/button.ts`, `input.ts`, `tokens.json`
