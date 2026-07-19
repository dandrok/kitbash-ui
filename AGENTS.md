# Agent Instructions

> Also read `GEMINI.md` (when present) and the design spec under `docs/superpowers/specs/` before large changes.
>
> **Mode:** **Loop mode** — one coherent slice per branch/PR, dual review, then merge.

---

## Git / PR rules (mandatory)

**Never commit on `main` or `master`.** Every change — including docs, specs, CI, and hotfixes — goes through a branch and a pull request.

```text
1. Start from up-to-date main
   git checkout main && git pull

2. Create a branch BEFORE any commit
   git checkout -b <type>/<short-name>
   # types: feat | fix | chore | docs | ci | test

3. Develop → verify → dual review → commit on the branch only

4. Push the branch and open a PR
   git push -u origin HEAD
   gh pr create --base main …

5. Do not merge your own PR unless the user asks.
   After the user merges: pull main, pick the next task, new branch.
```

| Do | Don’t |
|----|--------|
| Branch first, then commit | Commit on `main` / `master` |
| One PR per coherent slice (including design specs) | Land docs/specs only on the default branch |
| Keep the default branch matching `origin` | Leave local `main` ahead with private commits |
| Use Path A: poll PR until merged, then next task | Stack unrelated work on one long-lived branch |

If you already committed on the default branch by mistake: move commits to a feature branch, reset local `main` to `origin/main`, push the branch, open a PR. Never force-push `main` unless the user explicitly requests it.

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
   - CodeRabbit (if available): cr review --plain --base main
   - Second LLM read-only review (must not edit files)
   - Triage: fix real bugs; skip over-engineering noise

4. COMMIT (on the feature branch only)
   - Clear message: why + what
   - No secrets; do not amend published history unless asked

5. OPEN PR + WAIT
   - gh pr create
   - Poll: gh pr view <n> --json state,mergedAt
   - MERGED → checkout main, pull, mark task done, next branch
   - CLOSED without merge → halt and report
```

---

## Project pins & quality bar

- **Package:** `@ktbsh/ui` — design system built with `@ktbsh/sdk`
- **Tags:** `kitbash-*` custom elements
- **Bun** for install/scripts; **Biome** for lint/format; **TypeScript** strict
- **uhtml:** do not upgrade independently — baked by the SDK (pinned there at 4.7.1)
- Prefer **latest stable** of other deps; no RC unless required
- Components are **framework-agnostic** (author once via SDK → vanilla CE + React wrappers)
- Update README / Storybook / AGENTS only where this change makes them wrong — no duplicated encyclopedias

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
| AGENTS.md | Agent loop, git/PR rules, pins |
| docs/TASKS.md | Ordered implementation queue |
| docs/superpowers/specs/ | Design decisions |

Architecture source of truth for this phase:

`docs/superpowers/specs/2026-07-19-kitbash-ui-design-system-design.md`
