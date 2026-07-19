/**
 * Design tokens — single source of truth for names and **default** light/dark values.
 * CSS themes + kitbash `tokens.json` are generated from this module + presets.
 *
 * CSS custom property for key `color-bg-canvas` → `--kb-color-bg-canvas`
 *
 * **Presets** (UI chrome / brand pack), orthogonal to light/dark:
 * - `default` — neutral/blue DS (no `data-kb-preset` or `data-kb-preset="default"`)
 * - `terminal` — Matrix-style pack from consumer blog (`data-kb-preset="terminal"`)
 *
 * See `docs/consumer-astro-blog-md.md`.
 */

/** Color scheme axis (night = dark). */
export type KitbashTheme = 'light' | 'dark';

/**
 * Brand / UI-mode axis. Maps to blog `data-ui-mode`:
 * - default ≈ regular
 * - terminal ≈ terminal
 */
export type KitbashPreset = 'default' | 'terminal';

export type TokenValue = {
  readonly light: string;
  readonly dark: string;
};

/**
 * Flat semantic map. Keys are stable public IDs (kebab after `--kb-`).
 * Prefer semantic roles over raw brand names in components.
 */
export const semanticTokens = {
  /* Color — surfaces */
  'color-bg-canvas': { light: '#ffffff', dark: '#0d1117' },
  'color-bg-surface': { light: '#f6f8fa', dark: '#161b22' },
  'color-bg-subtle': { light: '#eef1f4', dark: '#21262d' },
  'color-bg-inverse': { light: '#1f2328', dark: '#e6edf3' },

  /* Color — foreground */
  'color-fg-default': { light: '#1f2328', dark: '#e6edf3' },
  'color-fg-muted': { light: '#656d76', dark: '#8b949e' },
  'color-fg-subtle': { light: '#8c959f', dark: '#6e7681' },
  'color-fg-on-accent': { light: '#ffffff', dark: '#ffffff' },
  'color-fg-on-inverse': { light: '#ffffff', dark: '#0d1117' },

  /* Color — border */
  'color-border-default': { light: '#d0d7de', dark: '#30363d' },
  'color-border-muted': { light: '#e6ebf0', dark: '#21262d' },
  'color-border-focus': { light: '#0969da', dark: '#2f81f7' },

  /* Color — accent / status */
  'color-accent-default': { light: '#0969da', dark: '#2f81f7' },
  'color-accent-hover': { light: '#0860ca', dark: '#58a6ff' },
  'color-accent-subtle': { light: '#ddf4ff', dark: '#121d2f' },
  'color-danger-default': { light: '#cf222e', dark: '#f85149' },
  'color-danger-subtle': { light: '#ffebe9', dark: '#2d1214' },
  'color-success-default': { light: '#1a7f37', dark: '#3fb950' },
  'color-success-subtle': { light: '#dafbe1', dark: '#12261e' },
  'color-warning-default': { light: '#9a6700', dark: '#d29922' },
  'color-warning-subtle': { light: '#fff8c5', dark: '#2a2111' },

  /* Space */
  'space-2xs': { light: '2px', dark: '2px' },
  'space-xs': { light: '4px', dark: '4px' },
  'space-sm': { light: '8px', dark: '8px' },
  'space-md': { light: '16px', dark: '16px' },
  'space-lg': { light: '24px', dark: '24px' },
  'space-xl': { light: '32px', dark: '32px' },
  'space-2xl': { light: '48px', dark: '48px' },

  /* Radius */
  'radius-sm': { light: '4px', dark: '4px' },
  'radius-md': { light: '8px', dark: '8px' },
  'radius-lg': { light: '12px', dark: '12px' },
  'radius-full': { light: '9999px', dark: '9999px' },

  /* Typography */
  'font-family-sans': {
    light:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    dark: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  'font-size-sm': { light: '0.875rem', dark: '0.875rem' },
  'font-size-md': { light: '1rem', dark: '1rem' },
  'font-size-lg': { light: '1.125rem', dark: '1.125rem' },
  'font-size-xl': { light: '1.25rem', dark: '1.25rem' },
  'font-weight-regular': { light: '400', dark: '400' },
  'font-weight-medium': { light: '500', dark: '500' },
  'font-weight-semibold': { light: '600', dark: '600' },
  'line-height-tight': { light: '1.25', dark: '1.25' },
  'line-height-normal': { light: '1.5', dark: '1.5' },

  /* Elevation / focus */
  'shadow-sm': {
    light: '0 1px 2px rgba(31, 35, 40, 0.08)',
    dark: '0 1px 2px rgba(0, 0, 0, 0.4)',
  },
  'shadow-md': {
    light: '0 4px 12px rgba(31, 35, 40, 0.1)',
    dark: '0 4px 16px rgba(0, 0, 0, 0.45)',
  },
  'focus-ring': {
    light: '0 0 0 3px rgba(9, 105, 218, 0.35)',
    dark: '0 0 0 3px rgba(47, 129, 247, 0.45)',
  },
} as const satisfies Record<string, TokenValue>;

export type SemanticTokenName = keyof typeof semanticTokens;

/** CSS custom property name, e.g. `--kb-color-bg-canvas`. */
export function cssVarName(
  token: SemanticTokenName,
): `--kb-${SemanticTokenName}` {
  return `--kb-${token}`;
}

/** `var(--kb-…)` reference for use in component styles. */
export function cssVar(token: SemanticTokenName): string {
  return `var(${cssVarName(token)})`;
}

function resolveRoot(root?: HTMLElement): HTMLElement | undefined {
  return (
    root ??
    (typeof document !== 'undefined' ? document.documentElement : undefined)
  );
}

/**
 * Apply color scheme on an element (default: document root in browsers).
 * No-op without a DOM root (SSR) unless `root` is passed explicitly.
 */
export function applyTheme(theme: KitbashTheme, root?: HTMLElement): void {
  const el = resolveRoot(root);
  if (el) {
    el.dataset.theme = theme;
  }
}

/** Defaults to `light` when no DOM / no data-theme (SSR-safe). */
export function getTheme(root?: HTMLElement): KitbashTheme {
  const el = resolveRoot(root);
  return el?.dataset.theme === 'dark' ? 'dark' : 'light';
}

/**
 * Apply brand preset (`data-kb-preset`). Omit/`default` uses base theme CSS only.
 * Load matching CSS: `@ktbsh/ui/themes/terminal/light.css` + `dark.css` for terminal.
 */
export function applyPreset(preset: KitbashPreset, root?: HTMLElement): void {
  const el = resolveRoot(root);
  if (!el) return;
  if (preset === 'default') {
    delete el.dataset.kbPreset;
  } else {
    el.dataset.kbPreset = preset;
  }
}

/** Defaults to `default` when unset (SSR-safe). */
export function getPreset(root?: HTMLElement): KitbashPreset {
  const el = resolveRoot(root);
  return el?.dataset.kbPreset === 'terminal' ? 'terminal' : 'default';
}
