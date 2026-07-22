/**
 * Terminal preset — Matrix-inspired values from astro-blog-md
 * (`src/styles/global.css` terminal light/dark).
 *
 * Keys must match `semanticTokens` (default preset).
 * Components still consume only `--kb-*` vars; this preset reassigns them.
 */
import type { SemanticTokenName, TokenValue } from '../semantic.ts';

/** Same token set as default; light/dark tuned for terminal UI mode. */
export const terminalTokens = {
  /* Color — surfaces */
  'color-bg-canvas': { light: '#f8f9fa', dark: '#050a05' },
  'color-bg-surface': { light: '#ffffff', dark: '#0a120a' },
  'color-bg-subtle': { light: '#eef2ee', dark: '#0f1a0f' },
  'color-bg-inverse': { light: '#212529', dark: '#d1fae5' },

  /* Color — foreground */
  'color-fg-default': { light: '#212529', dark: '#4ade80' },
  'color-fg-muted': { light: '#495057', dark: '#a3f2b0' },
  'color-fg-subtle': { light: '#6c757d', dark: '#00cc33' },
  'color-fg-on-accent': { light: '#ffffff', dark: '#050a05' },
  'color-fg-on-inverse': { light: '#f8f9fa', dark: '#050a05' },

  /* Color — border
   * Dark default matches blog chrome (theme-toggle ~30% green), not full #00e637.
   * Full Matrix green stays on accent / border-focus for active cues only. */
  'color-border-default': {
    light: 'rgba(0, 102, 0, 0.25)',
    dark: 'rgba(0, 230, 55, 0.3)',
  },
  'color-border-muted': {
    light: 'rgba(0, 102, 0, 0.15)',
    dark: 'rgba(0, 230, 55, 0.15)',
  },
  'color-border-focus': { light: '#006600', dark: '#00ff41' },

  /* Color — accent / status */
  'color-accent-default': { light: '#006600', dark: '#00ff41' },
  'color-accent-hover': { light: '#008000', dark: '#00e637' },
  'color-accent-subtle': {
    light: 'rgba(0, 102, 0, 0.08)',
    dark: 'rgba(74, 222, 128, 0.1)',
  },
  'color-danger-default': { light: '#b42318', dark: '#f85149' },
  'color-danger-subtle': { light: '#fee4e2', dark: '#2d1214' },
  'color-success-default': { light: '#006600', dark: '#4ade80' },
  'color-success-subtle': { light: 'rgba(0, 102, 0, 0.08)', dark: '#12261e' },
  'color-warning-default': { light: '#9a6700', dark: '#d29922' },
  'color-warning-subtle': { light: '#fff8c5', dark: '#2a2111' },

  /* Space — same scale as default */
  'space-2xs': { light: '2px', dark: '2px' },
  'space-xs': { light: '4px', dark: '4px' },
  'space-sm': { light: '8px', dark: '8px' },
  'space-md': { light: '16px', dark: '16px' },
  'space-lg': { light: '24px', dark: '24px' },
  'space-xl': { light: '32px', dark: '32px' },
  'space-2xl': { light: '48px', dark: '48px' },

  /*
   * Radius — true terminal chrome: square boxes (0).
   * Keep full for geometric circles only (radio indicator, spinner ring).
   */
  'radius-none': { light: '0', dark: '0' },
  'radius-sm': { light: '0', dark: '0' },
  'radius-md': { light: '0', dark: '0' },
  'radius-lg': { light: '0', dark: '0' },
  'radius-full': { light: '9999px', dark: '9999px' },

  /* Typography — mono stack (VT323 optional via consumer @font-face) */
  'font-family-sans': {
    light: "'VT323', ui-monospace, 'Courier New', monospace",
    dark: "'VT323', ui-monospace, 'Courier New', monospace",
  },
  'font-size-xs': { light: '0.75rem', dark: '0.75rem' },
  'font-size-sm': { light: '0.875rem', dark: '0.875rem' },
  'font-size-md': { light: '1rem', dark: '1rem' },
  'font-size-lg': { light: '1.125rem', dark: '1.125rem' },
  'font-size-xl': { light: '1.25rem', dark: '1.25rem' },
  'font-weight-regular': { light: '400', dark: '400' },
  'font-weight-medium': { light: '500', dark: '500' },
  'font-weight-semibold': { light: '600', dark: '600' },
  'line-height-tight': { light: '1.25', dark: '1.25' },
  'line-height-normal': { light: '1.625', dark: '1.625' },

  /* Elevation / focus */
  'shadow-sm': {
    light: '0 1px 2px rgba(0, 102, 0, 0.08)',
    dark: '0 1px 2px rgba(0, 0, 0, 0.5)',
  },
  'shadow-md': {
    light: '0 4px 12px rgba(0, 102, 0, 0.1)',
    dark: '0 4px 16px rgba(0, 0, 0, 0.55)',
  },
  /* Soft glow (not dashed outline) — one recipe for CEs + light-DOM focus.css */
  'focus-ring': {
    light: '0 0 0 3px rgba(0, 102, 0, 0.35)',
    dark: '0 0 0 3px rgba(74, 222, 128, 0.45)',
  },
} as const satisfies Record<SemanticTokenName, TokenValue>;
