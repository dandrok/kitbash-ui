/** Shared public unions for @ktbsh/ui components and consumer DX. */

export type KitbashSize = 'sm' | 'md' | 'lg';

export type KitbashButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export type KitbashBadgeTone =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger';

export type KitbashLinkTone = 'default' | 'muted' | 'accent';

/** Spacing token keys used by layout (maps to --kb-space-*). */
export type KitbashSpace =
  | 'none'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl';

export type KitbashStackDirection = 'row' | 'column';

export type KitbashStackAlign = 'start' | 'center' | 'end' | 'stretch';

export type KitbashStackJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around';

export type KitbashTextTone =
  | 'default'
  | 'muted'
  | 'subtle'
  | 'accent'
  | 'danger';

export type KitbashHeadingLevel = '1' | '2' | '3' | '4' | '5' | '6';

export type KitbashContainerWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type KitbashFeedbackTone = 'info' | 'success' | 'warning' | 'danger';
