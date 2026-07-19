# @ktbsh/ui

Framework-agnostic **design system** built with [`@ktbsh/sdk`](https://www.npmjs.com/package/@ktbsh/sdk).  
Author once → vanilla custom elements + React wrappers + Custom Elements Manifest.

| | |
|--|--|
| **Package** | `@ktbsh/ui` |
| **Tags** | `kitbash-*` (production tags land with the primitives PR; scaffold still has `my-button` / `kitbash-input`) |
| **Runtime** | Bun ≥ 1.3.14 |

Component playground and full prop docs will live in **Storybook** (not yet).  
Agent/process rules: [`AGENTS.md`](./AGENTS.md). Architecture: [`docs/superpowers/specs/`](./docs/superpowers/specs/).

## Requirements

- [Bun](https://bun.sh) **1.3.14+**

## Install & build

```bash
bun install
bun run build
```

Output:

```text
dist/
├── custom-elements.json
├── vanilla/   # browser custom elements (uhtml bundled)
└── react/     # React wrappers + .d.ts
```

## Scripts

| Script | Purpose |
|--------|---------|
| `bun run build` | Compile components with kitbash |
| `bun run dev` | Watch rebuild |
| `bun run lint` / `format` / `ci` | Biome |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run test` | Bun tests |
| `bun run verify` | ci + typecheck + build |

## Theming (light / dark)

Source of truth: `src/tokens/semantic.ts`  
Generated: `src/tokens/themes/light.css`, `dark.css`, `src/tokens/tokens.json`

```bash
bun run tokens:build   # regenerate after editing semantic.ts
bun run tokens:check   # CI drift check
```

Load theme CSS in the host app (variables inherit into shadow roots):

```html
<link rel="stylesheet" href="./src/tokens/themes/light.css" />
<link rel="stylesheet" href="./src/tokens/themes/dark.css" />
```

```ts
import { applyTheme } from './src/tokens/index.ts';

applyTheme('dark'); // document.documentElement dataset.theme
// light is default via :root even without data-theme
```

Components use semantic vars such as `var(--kb-color-accent-default)`. Kitbash also injects light defaults onto `:host` from `tokens.json`.

## Consume (after build)

**Vanilla**

```html
<script type="module">
  import './dist/vanilla/button.js';
</script>
<my-button variant="primary">Hello</my-button>
```

**React**

```tsx
import { MyButton } from './dist/react/button.js';

<MyButton variant="primary">Hello</MyButton>
```

**Svelte** — import the vanilla custom element and use the tag in markup.

## Authoring

1. Add `src/components/<name>.ts` with `export default defineComponent({ tag: 'kitbash-…', … })`.
2. Obey SDK rules: no outer closures in `render` / `events`.
3. `bun run build`.

Full compiler API: [@ktbsh/sdk on npm](https://www.npmjs.com/package/@ktbsh/sdk).

## CI

GitHub Actions runs Biome, typecheck, and build on every push/PR to `master`.

## License

MIT
