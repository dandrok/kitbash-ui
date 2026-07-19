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
} from './tokens/index.ts';

export type {
  KitbashBadgeTone,
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
