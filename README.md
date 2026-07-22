# @ktbsh/ui

Framework-agnostic **design system** built with [`@ktbsh/sdk`](https://www.npmjs.com/package/@ktbsh/sdk).  
Author once → vanilla custom elements + React wrappers + Custom Elements Manifest.

| | |
|--|--|
| **Package** | [`@ktbsh/ui`](https://www.npmjs.com/package/@ktbsh/ui) |
| **Current** | **0.4.2** (`v0.4.2`) |
| **Tags** | `kitbash-*` primitives, layout, forms, nav, feedback, blog chrome |
| **Runtime** | Bun ≥ 1.3.14 |

Playground: **Storybook** (`bun run storybook`).  
Agent/process rules: [`AGENTS.md`](./AGENTS.md). Task queue: [`docs/TASKS.md`](./docs/TASKS.md).  
Blog consumer plan: [`docs/consumer-astro-blog-md.md`](./docs/consumer-astro-blog-md.md).  
Architecture: [`docs/superpowers/specs/2026-07-19-kitbash-ui-design-system-design.md`](./docs/superpowers/specs/2026-07-19-kitbash-ui-design-system-design.md).  
Accessibility target: **WCAG 2.2 AA** — [`docs/a11y.md`](./docs/a11y.md).

### Status (blog-driven phase)

Foundation, themes (default + terminal), Storybook, and the components needed to replace **UI chrome** in a personal Astro blog are **shipped on npm**.  
**Article Markdown and body prose styles stay in the consumer app** — this package does not own post content.  
Next step for the blog is **site integration** (install + swap Astro components), not more required work here unless integration finds a gap.

## Requirements

- [Bun](https://bun.sh) **1.3.14+**

## Install

```bash
bun add @ktbsh/ui
# or: npm install @ktbsh/ui
```

From a local clone (path / workspace):

```bash
bun install
bun run build
```

Build output:

```text
dist/
├── custom-elements.json
├── vanilla/   # browser custom elements (uhtml bundled)
└── react/     # React wrappers + .d.ts
```

## Public import map

| Import | Purpose |
|--------|---------|
| `@ktbsh/ui` | Theme helpers (`applyTheme`, `applyPreset`, …) + shared types |
| `@ktbsh/ui/vanilla/<name>` | Register `kitbash-<name>` custom element |
| `@ktbsh/ui/react/<name>` | React wrapper (`Kitbash*`) + types |
| `@ktbsh/ui/themes/light.css` | Default preset light (`:root` default) |
| `@ktbsh/ui/themes/dark.css` | Default preset dark (`:root[data-theme="dark"]`) |
| `@ktbsh/ui/themes/terminal/light.css` | Terminal preset light |
| `@ktbsh/ui/themes/terminal/dark.css` | Terminal preset dark (Matrix night) |
| `@ktbsh/ui/themes/fonts.css` | Optional VT323 + Inter (terminal / regular faces) |
| `@ktbsh/ui/tokens` | Token API only |
| `@ktbsh/ui/types` | Shared TypeScript unions |
| `@ktbsh/ui/custom-elements.json` | Custom Elements Manifest |

`<name>` matches the component file (e.g. `button`, `stack`, `toc`, `tag-list`).

### Component surface (0.4.2)

| Area | Tags (short) |
|------|----------------|
| Actions / text | `button`, `link`, `badge`, `tag`, `tag-list` |
| Layout | `box`, `stack`, `container`, `text`, `heading` |
| Forms | `input`, `textarea`, `select`, `checkbox`, `radio`, `switch`, `field`, `label` |
| Nav | `nav`, `tabs` / `tab` / `tab-panel`, `breadcrumb`, `pagination`, `toc` |
| Feedback | `alert`, `toast`, `modal` |
| Loading | `spinner`, `progress`, `skeleton` |
| Site chrome | `theme-toggle`, `preset-toggle`, `toggle-group`, `scroll-top` |

## Scripts

| Script | Purpose |
|--------|---------|
| `bun run build` | kitbash compile + package entry emit (JS/d.ts/themes) |
| `bun run package:entries` | Emit public `dist` entries after kitbash (also part of `build`) |
| `bun run dev` | Watch rebuild |
| `bun run lint` / `format` / `ci` | Biome |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run test` | Bun tests |
| `bun run storybook` | Storybook dev (port 6006) |
| `bun run build-storybook` | Static Storybook build |
| `bun run verify` | tokens, ci, typecheck, test, kitbash build, Storybook build |
| `bun run pack:dry` | `npm pack --dry-run` (runs `prepack` → build once) |

## Theming (light / dark)

Source of truth: `src/tokens/semantic.ts`  
Generated: `src/tokens/themes/light.css`, `dark.css`, `src/tokens/tokens.json`

```bash
bun run tokens:build   # regenerate after editing semantic.ts
bun run tokens:check   # CI drift check
```

Load theme CSS in the host app (variables inherit into shadow roots):

```ts
import '@ktbsh/ui/themes/fonts.css'; // optional faces (VT323 + Inter)
import '@ktbsh/ui/themes/light.css';
import '@ktbsh/ui/themes/dark.css';
// Optional Matrix-style preset (blog terminal mode):
import '@ktbsh/ui/themes/terminal/light.css';
import '@ktbsh/ui/themes/terminal/dark.css';
import { applyPreset, applyTheme } from '@ktbsh/ui';

applyTheme('dark'); // data-theme — light | dark (night)
applyPreset('terminal'); // data-kb-preset — default | terminal
// light + default when attributes omitted
```

Two axes (same idea as the personal blog): **theme** (light/dark) × **preset** (default/terminal).  
Components use only semantic vars such as `var(--kb-color-accent-default)`, **inherited from document** theme CSS.

> **Required:** load theme stylesheets on the app shell (`:root`). We do **not** bake absolute token values onto each component `:host` — that sealed the shadow tree and blocked theme toggles (see `docs/sdk-feedback.md` P0 #0).

## Consume

**Vanilla / Astro / Svelte** — import the custom element (side-effect registration), then use the tag:

```html
<script type="module">
  import '@ktbsh/ui/vanilla/button';
</script>
<kitbash-button variant="primary">Hello</kitbash-button>
```

```svelte
<script>
  import '@ktbsh/ui/vanilla/button';
</script>
<kitbash-button variant="primary">Hello</kitbash-button>
```

**React**

```tsx
import { KitbashButton } from '@ktbsh/ui/react/button';

<KitbashButton variant="primary">Hello</KitbashButton>
```

React is an **optional peer** (`react` ≥ 18). Vanilla-only apps do not need it.

## Publish / release

- **Package:** `@ktbsh/ui` (public). `files` + `exports` define the npm surface; `prepack` runs `bun run build`.
- **Dry-run:** `bun run pack:dry`.
- **CI does not publish on every merge.** Releases are **git tags** only.

### Cut a release (maintainers)

1. On a **feature branch**, bump `"version"` in `package.json` (and smoke test if present); open a PR — never commit the bump only on `master`. Current version is **0.4.2**.
2. Merge the version PR; `master` green.
3. Pull `master`, confirm `package.json` version, then tag and push (tag must match):

```bash
git checkout master && git pull
# package.json version is e.g. 0.4.2
git tag v0.4.2
git push origin v0.4.2
```

4. GitHub Actions workflow **Publish** runs `bun run verify` then `npm publish` using secret `NPM_TOKEN`.
5. Check: https://www.npmjs.com/package/@ktbsh/ui

Semver guide: **patch** fixes/polish, **minor** new components/exports, **major** breaking changes.  
Prefer an exact pin (`0.4.2`) or a constrained range (`~0.4.2`) in consumers.

## Authoring

1. Add `src/components/<name>.ts` with `export default defineComponent({ tag: 'kitbash-…', … })`.
2. Obey SDK rules: no outer closures in `render` / `events`.
3. `bun run build`.

Full compiler API: [@ktbsh/sdk on npm](https://www.npmjs.com/package/@ktbsh/sdk).

## CI

GitHub Actions runs Biome, typecheck, and build on every push/PR to `master`.

## License

MIT
