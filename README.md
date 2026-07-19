# @ktbsh/ui

Framework-agnostic **design system** built with [`@ktbsh/sdk`](https://www.npmjs.com/package/@ktbsh/sdk).  
Author once → vanilla custom elements + React wrappers + Custom Elements Manifest.

| | |
|--|--|
| **Package** | `@ktbsh/ui` |
| **Tags** | `kitbash-*` primitives + layout (box, stack, container, text, heading, …) |
| **Runtime** | Bun ≥ 1.3.14 |

Playground: **Storybook** (`bun run storybook`).  
Agent/process rules: [`AGENTS.md`](./AGENTS.md). Architecture: [`docs/superpowers/specs/`](./docs/superpowers/specs/).  
Accessibility target: **WCAG 2.2 AA** — [`docs/a11y.md`](./docs/a11y.md).

## Requirements

- [Bun](https://bun.sh) **1.3.14+**

## Install

From npm (when published):

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
| `@ktbsh/ui` | Tokens helpers + shared types |
| `@ktbsh/ui/vanilla/<name>` | Register `kitbash-<name>` custom element |
| `@ktbsh/ui/react/<name>` | React wrapper (`Kitbash*`) + types |
| `@ktbsh/ui/themes/light.css` | Light theme (`:root` default) |
| `@ktbsh/ui/themes/dark.css` | Dark theme (`:root[data-theme="dark"]`) |
| `@ktbsh/ui/tokens` | Token API only |
| `@ktbsh/ui/types` | Shared TypeScript unions |
| `@ktbsh/ui/custom-elements.json` | Custom Elements Manifest |

`<name>` matches the component file (e.g. `button`, `stack`, `tab-panel`).

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
import '@ktbsh/ui/themes/light.css';
import '@ktbsh/ui/themes/dark.css';
import { applyTheme } from '@ktbsh/ui';

applyTheme('dark'); // document.documentElement dataset.theme
// light is default via :root even without data-theme
```

Components use semantic vars such as `var(--kb-color-accent-default)`. Kitbash also injects light defaults onto `:host` from `tokens.json`.

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

## Publish notes

- `files` + `exports` define the npm surface; `prepack` runs `bun run build`.
- `publishConfig.access` is `public` for the `@ktbsh` scope.
- Dry-run: `bun run pack:dry`.

## Authoring

1. Add `src/components/<name>.ts` with `export default defineComponent({ tag: 'kitbash-…', … })`.
2. Obey SDK rules: no outer closures in `render` / `events`.
3. `bun run build`.

Full compiler API: [@ktbsh/sdk on npm](https://www.npmjs.com/package/@ktbsh/sdk).

## CI

GitHub Actions runs Biome, typecheck, and build on every push/PR to `master`.

## License

MIT
