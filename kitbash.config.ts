/**
 * Optional project config for `kitbash build`.
 *
 * Supported (paths relative to project root):
 *   - components  (default: src/components)
 *   - tokens      (default: src/tokens.json)
 *   - outDir      (default: dist)
 *
 * Hard authoring rule: render/events are stringified — no outer closures/imports.
 * See packages/sdk/README.md and docs/SUPPORTED.md.
 *
 * **Tokens intentionally omitted.** The SDK prepends `tokens.json` as fixed
 * values on `:host { --kb-*: … }`, which **seals** the shadow tree and blocks
 * document-level theming (`data-theme`, `data-kb-preset`). Consumers load
 * `@ktbsh/ui/themes/*.css` on `:root` instead so components inherit `--kb-*`.
 * `src/tokens/tokens.json` is still generated for reference / future SDK modes.
 */
export default {
  components: './src/components',
  outDir: './dist',
};
