# Agent Instructions

> Also read `GEMINI.md` (when present) and the design spec under `docs/superpowers/specs/` before large changes.
>
> **Mode:** **Loop mode** — one coherent slice per branch/PR, dual review, then merge.
>
> **Security:** `@ktbsh/ui` must stay fully secure — no secrets in source, `dist/`, or Storybook. See `docs/security-and-secrets.md`.
>
> **⛔ NO COMMIT WITHOUT dual review:** **CodeRabbit CLI (`cr`)** **and** **`agy` (gemini-3.1-pro-high, read-only)** are **both mandatory** before every commit. Skipping either is forbidden — even if CI is green or the change “looks small.”

---

## ⛔ REPOSITORY HARD BOUNDARY (strict — non-negotiable)

**Allowed repository (only):**

| Scope | Target / path |
|-------|----------------|
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

3. Develop → verify → **`cr review`** + **`agy` review** (both required) → triage fixes → commit on the branch only
   - **Never** `git commit` until both reviewers have finished a pass on the pending changes.

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
| Run **`cr` + `agy` before every commit** | Skip CodeRabbit or agy because “CI green” / “docs only” / “takes too long” |

If you already committed on the default branch by mistake: move commits to a feature branch, reset local default to `origin/<default>`, push the branch, open a PR. Never force-push the default branch unless the user explicitly requests it.

---

## ⛔ Mandatory dual review: CodeRabbit + `agy` (before every commit)

This is as strict as the repository hard boundary. **Two independent reviewers** before every commit:

| Reviewer | Role |
|----------|------|
| **CodeRabbit CLI (`cr`)** | Diff-focused review (bugs, smells, a11y, consistency) |
| **`agy` (`gemini-3.1-pro-high`)** | Second LLM, read-only plan mode |

| Rule | Detail |
|------|--------|
| **When** | After local verify, **before** `git commit` — every time |
| **Not optional** | Do **not** skip either because the other passed, the diff is tiny, or CI is green |
| **Order** | verify → **`cr review`** → **`agy`** → triage/fix → re-verify → re-run both if fixes were material → only then commit |
| **If `cr` hangs or fails** | Retry with a longer wait / `cr doctor`. If still broken, **stop and tell the user** — do not silently drop CodeRabbit. (Do not treat hang as “optional skip.”) |
| **If `agy` fails** | Same: retry or stop; never “commit anyway.” |
| **Triage** | Fix real bugs, security, a11y, correctness nits; skip over-engineering that fights KISS/SDK serialization rules |

### Required CodeRabbit invocation

```bash
# From this repo only (dandrok/kitbash-ui). Base = current default branch.
cr review --plain --base master
# After rename: cr review --plain --base main
# Agent-friendly output (optional):
# cr review --agent --base master
```

Notes:

- Local CLI review of the branch/uncommitted work — **not** a substitute for the GitHub PR bot (that can still run on the PR).
- Use `--plain` for readable findings; triage like agy output.
- Auth: `cr auth login` or API key (`cr doctor` should pass).

### Required `agy` invocation

**Model (mandatory):** `--model gemini-3.1-pro-high` (Gemini 3.1 Pro **High** — not Flash/Low).

```bash
# From this repo only. Read-only. Do not edit files.
agy --model gemini-3.1-pro-high \
  --mode plan \
  --sandbox \
  --dangerously-skip-permissions \
  --print-timeout 15m \
  -p "READ-ONLY review of current uncommitted changes (and branch vs master if needed) in dandrok/kitbash-ui ONLY. Do not edit files. Do not touch other repos. Report: (1) real bugs/security (2) CI/config mistakes (3) nits worth fixing before commit (4) noise to ignore. Be concise."
```

Notes:

- Prefer `--mode plan` (not accept-edits). Review must not silently rewrite the tree.
- `--print-timeout 15m` avoids false timeouts on larger diffs.

### Forbidden rationalizations

- “agy is enough” / “cr is enough”
- “cr hung last time so I always skip it”
- “docs-only / config-only”
- “user is waiting”
- “I’ll let the GitHub PR bot catch it”

**After commit is too late for the gate.** GitHub CodeRabbit on the PR is **extra**, not a replacement for pre-commit `cr` + `agy`.

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

3. EXTERNAL REVIEW (before commit) — HARD GATE
   - **REQUIRED CodeRabbit:**
       cr review --plain --base master
     (After rename: --base main). If hung/failed: retry / cr doctor / tell user — do not skip.
   - **REQUIRED agy:** (command above, gemini-3.1-pro-high)
   - Triage both reports: fix real bugs; skip over-engineering noise
   - Re-run local verify (+ cr + agy if fixes were material)

4. COMMIT (on the feature branch only) — only after step 3 passes
   - Clear message: why + what
   - No secrets; do not amend published history unless asked

5. OPEN PR + WAIT (always -R dandrok/kitbash-ui)
   - gh pr create -R dandrok/kitbash-ui --base master   # after rename: --base main
   - Poll: gh pr view -R dandrok/kitbash-ui <n> --json state,mergedAt
   - MERGED → checkout master (or main), pull, mark task done, next branch
   - CLOSED without merge → halt and report
```

---

## Craftsmanship (no rush, no trash, no security holes, a11y from day one)

**Speed never beats correctness.** Take the time the change needs. Prefer one solid slice over a sloppy pile of files.

| Do | Don’t |
|----|--------|
| Read surrounding code and the design spec before editing | Drive-by “while I’m here” refactors |
| KISS / DRY — smallest clear design that works | Clever abstractions, copy-paste twins, dead code |
| Strong TypeScript types for public APIs and component props | `any`, silent casts, undocumented stringly APIs |
| Semantic tokens + **WCAG-minded** color/focus/disabled/invalid | Hard-coded one-off styles or insecure HTML injection |
| **A11y built in on first ship** of each component (see below) | “We’ll add ARIA later” / mouse-only widgets |
| Verify fully, then **`agy --model gemini-3.1-pro-high`**, then commit | Rush commits, skip review, “fix later” |
| Secrets never in source, `dist/`, Storybook, or logs | Tokens in env committed to git, XSS via untrusted HTML |

**Security (product + process):**

- No secrets in the package; least privilege for `gh` (this repo only).
- Prefer text/slots over HTML injection; if rich HTML ever appears, sanitize and document.
- Pin deps and Actions SHAs; frozen lockfile in CI.
- Destructive git only with explicit user ask for **this** repo.

**Code quality bar for `@ktbsh/ui`:** professional design-system standard — clear names, stable props, tested behavior, Storybook-ready when components land. If it looks like prototype trash, rewrite before commit.

### Accessibility (mandatory — WCAG 2.2 AA)

Full checklist: **`docs/a11y.md`**. Summary for every component PR:

| Gate | Requirement |
|------|-------------|
| **Target** | **WCAG 2.2 Level AA** for interactive components |
| **Patterns** | Prefer native controls; else APG-aligned roles/keyboard |
| **Keyboard** | Fully usable without a pointer |
| **Focus** | Visible `:focus-visible` (tokenized); `delegatesFocus` when appropriate |
| **Name / state** | Accessible name; disabled/invalid/expanded/etc. exposed to AT |
| **Contrast** | Text/UI against backgrounds meets AA in **light and dark** |
| **Target size** | Aim ≥ 24×24 CSS px (WCAG 2.2 target size) where applicable |
| **Motion** | Honor `prefers-reduced-motion` when animations exist |
| **Tests** | Behavior tests for a11y-critical props; Storybook a11y when available |

**Do not merge** a component that is pointer-only, missing focus styles, or unlabeled for assistive tech. Consumer apps own product copy; this library owns roles, keyboard, focus, and state (not the SDK compiler alone).

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

### Token source of truth (enforced)

| Layer | Role |
|-------|------|
| **Source of truth** | `src/tokens/semantic.ts` — names **and** light/dark values |
| **Generated** | `src/tokens/themes/light.css`, `dark.css` (`:root` light fallback + `[data-theme]`) |
| **Compiler bridge** | `src/tokens/tokens.json` — light defaults for kitbash `:host` inject; never hand-edit |
| **Enforcement** | `bun run tokens:build` / `bun run tokens:check` (CI fails on drift) |

Edit `semantic.ts` only, then `tokens:build`. Do not hand-patch generated CSS/JSON.

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
| Storybook | Component API playground + a11y notes |
| AGENTS.md | Agent loop, git/PR rules, pins, security, a11y gates |
| docs/a11y.md | WCAG 2.2 AA target, component checklist, testing |
| docs/security-and-secrets.md | Tokens, Path A/B secrets, DS security bar |
| docs/TASKS.md | Ordered implementation queue |
| docs/superpowers/specs/ | Design decisions |

Architecture source of truth for this phase:

`docs/superpowers/specs/2026-07-19-kitbash-ui-design-system-design.md`
