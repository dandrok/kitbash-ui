/**
 * Public package entry for `@ktbsh/ui`.
 *
 * Components are **side-effect imports** (custom element registration):
 *   import '@ktbsh/ui/vanilla/button'
 *   import { KitbashButton } from '@ktbsh/ui/react/button'
 *
 * Theme CSS (load once in the app shell):
 *   import '@ktbsh/ui/themes/light.css'
 *   import '@ktbsh/ui/themes/dark.css'
 *   import '@ktbsh/ui/themes/terminal/light.css' // optional
 *   import '@ktbsh/ui/themes/terminal/dark.css'
 *
 * applyTheme('light'|'dark'); applyPreset('default'|'terminal');
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
} from './tokens/index.ts';

export type {
  KitbashBadgeTone,
  KitbashBadgeVariant,
  KitbashButtonVariant,
  KitbashContainerWidth,
  KitbashFeedbackTone,
  KitbashHeadingLevel,
  KitbashLinkTone,
  KitbashSize,
  KitbashSkeletonVariant,
  KitbashSpace,
  KitbashStackAlign,
  KitbashStackDirection,
  KitbashStackJustify,
  KitbashTextTone,
} from './types/index.ts';
