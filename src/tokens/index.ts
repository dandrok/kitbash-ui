/**
 * Public token / theme API for @ktbsh/ui consumers and docs.
 * Import theme CSS in the app (or Storybook) so variables resolve:
 *   import '@ktbsh/ui/themes/light.css'
 *   import '@ktbsh/ui/themes/dark.css'
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
