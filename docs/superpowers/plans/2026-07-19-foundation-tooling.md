# Foundation tooling Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** Establish `@ktbsh/ui` package identity, Biome, TypeScript, scripts, CI on `master`, agent task queue, and README — without tokens/Storybook/new components.

**Architecture:** Single package. Bun 1.3.14 + Biome 2.5.4 + TypeScript (lockfile-pinned). CI mirrors kitbash-sdk checks reduced to lint/typecheck/build. Branch-first PRs only.

**Tech Stack:** Bun, `@ktbsh/sdk@0.2.0`, Biome, TypeScript, GitHub Actions (SHA-pinned).

**Repo boundary:** `dandrok/kitbash-ui` only (`AGENTS.md`).

---

### Task 1: Package identity + tooling configs

**Files:**
- Modify: `package.json`
- Create: `biome.json`, `tsconfig.json`, `GEMINI.md`, `docs/TASKS.md`
- Modify: `README.md`
- Create: `.github/workflows/ci.yml`

- [x] Rename package to `@ktbsh/ui`, engines, scripts, devDeps
- [x] Biome + tsconfig aligned with kitbash-sdk
- [x] CI on `master` with Bun 1.3.14 and SHA-pinned actions
- [x] TASKS.md queue + GEMINI.md + README refresh
- [ ] Verify: `bun install`, `bun run ci`, `bun run typecheck`, `bun run build`
- [ ] Open PR to `master`

---

### Task 2 (next PR, not this branch)

Tokens & themes — see design spec PR2.
