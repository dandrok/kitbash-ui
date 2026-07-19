# Agent Instructions

> Also read `GEMINI.md` (when present) and the design spec under `docs/superpowers/specs/` before large changes.
>
> **Mode:** **Loop mode** — one coherent slice per branch/PR, dual review, then merge.
>
> **Security:** `@ktbsh/ui` must stay fully secure — no secrets in source, `dist/`, or Storybook. See `docs/security-and-secrets.md`.

---

## ⛔ REPOSITORY HARD BOUNDARY (strict — non-negotiable)

**Allowed repository (only):**

| | |
|--|--|
| **Local path** | `/home/dandrok/git/kitbash-ui` (this workspace) |
| **GitHub** | `dandrok/kitbash-ui` only (`https://github.com/dandrok/kitbash-ui`) |

The operator may have **global** `gh` / SSH auth that can reach other repos. That does **not** grant the agent permission. Agents act **as the user** and must behave as if access is **scoped to this one repository forever**.

### Absolute bans (even if the user asks)

| Ban | Why |
|-----|-----|
| **Any other GitHub repo** | No `gh` / `git` / API against other owners or names |
| **Clone other repos** into or outside this workspace for agent work | Out of scope |
| **Create / delete / fork** other repositories | Out of scope |
| **Push, PR, issue, release, secret, or settings** outside `dandrok/kitbash-ui` | Blast radius |
| **Browse / list** the user’s other repos (`gh repo list`, org inventory, etc.) | Curiosity ≠ permission |
| **Force-push** default branch, **delete** remote branches without explicit ask for *this* repo, **rewrite** published history | Destructive |
| **`rm -rf`**, mass delete, or wipe `node_modules`/git history as “cleanup” without need | Harmful |
| **Change global git/gh config** (e.g. `gh auth logout`, `git config --global`) | Affects the whole machine |
| Use sibling paths like `../kitbash-sdk` as a **write** target | Read-only reference only when needed for API clues; **never** commit/push there |

If asked to touch another repository: **refuse**, restate this boundary, and stay in `dandrok/kitbash-ui`.

### Required guardrails before every `gh` / remote git command

1. **CWD must be this repo:** `pwd` resolves under `…/kitbash-ui` (or git root is this project).
2. **Confirm remote:** `git remote get-url origin` is `git@github.com:dandrok/kitbash-ui.git` or `https://github.com/dandrok/kitbash-ui.git` (no other host/path).
3. **Prefer explicit repo flag for `gh`:** always pass `-R dandrok/kitbash-ui` (or `--repo dandrok/kitbash-ui`) so a wrong cwd cannot hit another project.
4. **Never** omit the check because “auth is global” or “user said do it on X repo.”
5. **Read-only peek at kitbash-sdk** (path `../kitbash-sdk`) is allowed only for understanding `@ktbsh/sdk` APIs — no edits, no git commands that mutate it, no `gh` for that repo unless the user later expands this file’s boundary in writing in-repo.

### Safety posture (do no harm)

- Prefer **branch + PR**; never commit on the default branch.
- Prefer **additive, reversible** changes; ask before destructive ops even inside this repo (force-push, delete branch on remote, `git reset --hard` of shared work, drop files the user may need).
- Do **not** merge PRs, change branch protection, or rotate secrets unless the user explicitly requests it **for this repo**.
- Do **not** print tokens, cookies, or full `gh auth token` output into logs or commits.
- If unsure whether a command leaves this repo: **do not run it**.

**Self-check line (run mentally before risky commands):**  
“Is the only repository touched `dandrok/kitbash-ui`? If not → stop.”

---

## Security (mandatory)

| Rule | Detail |
|------|--------|
| Repo isolation | **Only** `dandrok/kitbash-ui` — see hard boundary above |
| No secrets in git | `.env` / `.env.*` gitignored; only `.env.example` committed |
| No secrets in the DS | Components and published builds never embed API keys or tokens |
| Local secrets | Copy `.env.example` → `.env` (Path A). Guide: `docs/security-and-secrets.md` |
| CI secrets | Path B uses **GitHub Actions secrets**, not the local `.env` file |
| `gh` usage | Global login may exist; agent still scopes every command to **this repo only** (`-R dandrok/kitbash-ui`) |

If a secret is ever committed: rotate it immediately, purge from history if needed, and treat the leak as an incident.

---

## Agent loop: Path A (default) vs Path B (optional later)

| | **Path A — local (default)** | **Path B — GitHub Actions factory** |
|--|------------------------------|-------------------------------------|
| Where agent runs | Your machine / this CLI | `ubuntu-latest` runner |
| Task queue | `docs/TASKS.md` | Issues labeled `todo-ai` |
| Secrets | Local `.env` + `gh auth` | Repo Actions secrets (`AGENT_GITHUB_TOKEN`, AI key) |
| Trigger | After PR merge, poll + next task | `pull_request` closed + `merged` |
| Reality check | This session *is* the agent | Needs a **headless** CLI in CI — not this interactive TUI by default |

**Do not enable full Path B autonomy until:** a non-interactive agent entrypoint exists, concurrency/budget guards exist, and secrets are in GitHub (not only `.env`). Normal **CI** (lint/typecheck/build) is separate and should land early.

---

## Git / PR rules (mandatory)

**Never commit on the default branch.** Every change — including docs, specs, CI, and hotfixes — goes through a branch and a pull request.

**Default branch (current):** `master`  
**Target name:** `main` (rename is an explicit foundation/exit step — see design spec §2 / PR1).  
Until rename lands, all agent/CI/`gh`/`cr` bases use **`master`**. After rename, update this line and use `main` everywhere.

```text
1. Start from up-to-date default branch
   git checkout master && git pull
   # After rename: git checkout main && git pull

2. Create a branch BEFORE any commit
   git checkout -b <type>/<short-name>
   # types: feat | fix | chore | docs | ci | test

3. Develop → verify → dual review → commit on the branch only

4. Push the branch and open a PR (this repo only)
   git push -u origin HEAD
   gh pr create -R dandrok/kitbash-ui --base master …
   # After rename: gh pr create -R dandrok/kitbash-ui --base main …

5. Do not merge your own PR unless the user asks.
   After the user merges: pull the default branch, pick the next task, new branch.
```

| Do | Don’t |
|----|--------|
| Branch first, then commit | Commit on the default branch (`master` now, `main` after rename) |
| One PR per coherent slice (including design specs) | Land docs/specs only on the default branch |
| Keep the default branch matching `origin` | Leave local default ahead with private commits |
| Use Path A: poll PR until merged, then next task | Stack unrelated work on one long-lived branch |
| Keep `.env` local only; document vars in `.env.example` | Commit real tokens or put them in DS source |

If you already committed on the default branch by mistake: move commits to a feature branch, reset local default to `origin/<default>`, push the branch, open a PR. Never force-push the default branch unless the user explicitly requests it.

---

## Loop mode (one step)

```text
1. DEVELOP / FIX
   - One clear goal from docs/TASKS.md (or the active plan)
   - Prefer tests when behavior changes
   - KISS / DRY; no drive-by refactors

2. VERIFY LOCALLY
   - bun run typecheck && bun run ci && bun run test && bun run build
   - Include Storybook build when Storybook exists

3. EXTERNAL REVIEW (before commit)
   - CodeRabbit (if available): cr review --plain --base master
     (After rename: --base main)
   - Second LLM read-only review (must not edit files)
   - Triage: fix real bugs; skip over-engineering noise

4. COMMIT (on the feature branch only)
   - Clear message: why + what
   - No secrets; do not amend published history unless asked

5. OPEN PR + WAIT (always -R dandrok/kitbash-ui)
   - gh pr create -R dandrok/kitbash-ui --base master   # after rename: --base main
   - Poll: gh pr view -R dandrok/kitbash-ui <n> --json state,mergedAt
   - MERGED → checkout master (or main), pull, mark task done, next branch
   - CLOSED without merge → halt and report
```

---

## Project pins & quality bar

- **Package:** `@ktbsh/ui` — design system built with `@ktbsh/sdk`
- **Tags:** `kitbash-*` custom elements
- **Bun:** pin in CI and `package.json` `engines` (target **1.3.14**, same family as kitbash-sdk). Reproducible installs via `bun.lock`; do not rely on floating “latest Bun” in CI.
- **Biome / TypeScript:** pin exact versions in `package.json`; upgrades are deliberate PRs with lockfile update + CI green.
- **uhtml:** do not upgrade independently — baked by the SDK (pinned there at 4.7.1)
- **Other deps:** versions resolved by `bun.lock`. Prefer current stable when adding; never blind major bumps; RCs only if required and reviewed.
- Components are **framework-agnostic** (author once via SDK → vanilla CE + React wrappers)
- Update README / Storybook / AGENTS only where this change makes them wrong — no duplicated encyclopedias

### Token source of truth (enforced when tokens PR lands)

| Layer | Role |
|-------|------|
| **Source of truth** | Theme CSS (`src/tokens/themes/light.css`, `dark.css`) + semantic keys/types in `src/tokens/semantic.ts` |
| **Compiler bridge** | `src/tokens/tokens.json` — **generated** from the source for `@ktbsh/sdk` only; never hand-edited as primary |
| **Enforcement** | `bun run tokens:build` writes `tokens.json`; CI runs `bun run tokens:check` (drift fails the build) |

Documented fully in the design spec §5.3. Until the tokens PR exists, scaffold `tokens.json` may remain minimal.

### SDK authoring footguns

1. No outer closures/imports inside `render` / `events` (serialized with `.toString()`).
2. Prefer `commit({ props, state })` for user input.
3. External property sets do not emit `kitbash-change`.
4. Semantic CSS variables + `part` hooks for theming; product a11y lives here, not in the SDK.

---

## Docs map

| Surface | Owns |
|---------|------|
| README | Install, scripts, consume |
| Storybook | Component API playground |
| AGENTS.md | Agent loop, git/PR rules, pins, security pointers |
| docs/security-and-secrets.md | Tokens, Path A/B secrets, DS security bar |
| docs/TASKS.md | Ordered implementation queue |
| docs/superpowers/specs/ | Design decisions |

Architecture source of truth for this phase:

`docs/superpowers/specs/2026-07-19-kitbash-ui-design-system-design.md`
