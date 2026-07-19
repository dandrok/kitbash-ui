/**
 * Public token / theme API for @ktbsh/ui consumers and docs.
 * Import theme CSS in the app (or Storybook) so variables resolve:
 *   import '@ktbsh/ui/…'  // path finalized at package-exports PR
 *   or relative: `./themes/light.css` + `./themes/dark.css`
 */

export {
  applyTheme,
  cssVar,
  cssVarName,
  getTheme,
  type KitbashTheme,
  type SemanticTokenName,
  semanticTokens,
  type TokenValue,
} from './semantic.ts';
