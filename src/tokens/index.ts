/**
 * Public token / theme API for @ktbsh/ui consumers and docs.
 * Import theme CSS in the app (or Storybook) so variables resolve:
 *   import '@ktbsh/ui/themes/light.css'
 *   import '@ktbsh/ui/themes/dark.css'
 *   import '@ktbsh/ui/themes/terminal/light.css'  // optional preset
 *   import '@ktbsh/ui/themes/terminal/dark.css'
 *
 * Axes: applyTheme('light'|'dark') + applyPreset('default'|'terminal')
 */

export {
  applyPreset,
  applyTheme,
  cssVar,
  cssVarName,
  getPreset,
  getTheme,
  type KitbashPreset,
  type KitbashTheme,
  type SemanticTokenName,
  semanticTokens,
  type TokenValue,
} from './semantic.ts';
