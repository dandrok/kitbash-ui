# Gemini & agent architecture notes

> **CRITICAL:** Follow `AGENTS.md` first — especially the **repository hard boundary** (`dandrok/kitbash-ui` only) and branch-first PR rules.

## What this repo is

`@ktbsh/ui` — product design system authored with `@ktbsh/sdk`. **Published:** **0.4.2**.

- Author: `defineComponent` in `src/components/*.ts`
- Build: `kitbash build` → `dist/vanilla`, `dist/react`, CEM + themes
- Themes/tokens: `src/tokens/semantic.ts` → `bun run tokens:build` / `tokens:check`
- Storybook: present (`bun run storybook`)
- Blog-phase chrome (toggles, TOC, tags, terminal preset) shipped; **prose/MD body stays in the consumer**

Queue + phase status: `docs/TASKS.md`. Consumer inventory: `docs/consumer-astro-blog-md.md`.

## Loop mode (summary)

One coherent slice → branch → verify (`bun run verify`) → dual review → commit → PR to **master** (until renamed to `main`) → next task in `docs/TASKS.md`.

Blog-driven foundation is **complete** for this repo; do not invent backlog work unless the operator asks or site integration reports a gap. Site swap is **out of boundary** (`astro-blog-md`).

Always: `gh … -R dandrok/kitbash-ui`. Never other repositories.

## Pins

- Bun **1.3.14** (CI + engines)
- Biome **2.5.4**
- `@ktbsh/sdk` **0.2.0** (uhtml owned by SDK)
- Actions: full commit SHAs in `.github/workflows/ci.yml`

## SDK footguns

No outer closures in `render` / `events`. Prefer `commit` for user input. Semantic CSS vars + `part` hooks.
