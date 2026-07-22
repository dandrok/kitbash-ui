import { describe, expect, test } from 'bun:test';
import { terminalTokens } from './presets/terminal.ts';
import {
  applyPreset,
  applyTheme,
  cssVar,
  cssVarName,
  getPreset,
  getTheme,
  semanticTokens,
} from './semantic.ts';

describe('semantic tokens', () => {
  test('every token has light and dark string values', () => {
    for (const [name, value] of Object.entries(semanticTokens)) {
      expect(typeof value.light, name).toBe('string');
      expect(typeof value.dark, name).toBe('string');
      expect(value.light.length, name).toBeGreaterThan(0);
      expect(value.dark.length, name).toBeGreaterThan(0);
    }
  });

  test('terminal preset keys match default semantic tokens', () => {
    const base = Object.keys(semanticTokens).sort();
    const term = Object.keys(terminalTokens).sort();
    expect(term).toEqual(base);
    for (const [name, value] of Object.entries(terminalTokens)) {
      expect(typeof value.light, name).toBe('string');
      expect(typeof value.dark, name).toBe('string');
      expect(value.light.length, name).toBeGreaterThan(0);
      expect(value.dark.length, name).toBeGreaterThan(0);
    }
  });

  test('cssVarName and cssVar use --kb- prefix', () => {
    expect(cssVarName('color-accent-default')).toBe(
      '--kb-color-accent-default',
    );
    expect(cssVar('space-md')).toBe('var(--kb-space-md)');
  });

  test('applyTheme / getTheme round-trip without browser document', () => {
    const el = { dataset: {} as DOMStringMap } as HTMLElement;
    applyTheme('dark', el);
    expect(getTheme(el)).toBe('dark');
    applyTheme('light', el);
    expect(getTheme(el)).toBe('light');
  });

  test('getTheme defaults to light when data-theme is absent', () => {
    const el = { dataset: {} as DOMStringMap } as HTMLElement;
    expect(getTheme(el)).toBe('light');
  });

  test('applyPreset / getPreset round-trip', () => {
    const el = { dataset: {} as DOMStringMap } as HTMLElement;
    expect(getPreset(el)).toBe('default');
    applyPreset('terminal', el);
    expect(getPreset(el)).toBe('terminal');
    expect(el.dataset.kbPreset).toBe('terminal');
    applyPreset('default', el);
    expect(getPreset(el)).toBe('default');
    expect(el.dataset.kbPreset).toBeUndefined();
  });

  test('terminal focus-ring meets ≥3:1 vs canvas (WCAG 2.4.13 aim)', () => {
    // Effective ring color = alpha-blend of ring RGB over canvas (box-shadow ring pixels).
    const canvas = {
      light: terminalTokens['color-bg-canvas'].light,
      dark: terminalTokens['color-bg-canvas'].dark,
    } as const;
    for (const theme of ['light', 'dark'] as const) {
      const ringCss = terminalTokens['focus-ring'][theme];
      const m = ringCss.match(
        /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/i,
      );
      expect(m, `${theme} focus-ring rgba`).not.toBeNull();
      if (!m) continue;
      const r = Number(m[1]);
      const g = Number(m[2]);
      const b = Number(m[3]);
      const a = Number(m[4]);
      const bg = parseHexRgb(canvas[theme]);
      const effective = blendOver(r, g, b, a, bg);
      const ratio = contrastRatio(effective, bg);
      expect(ratio, `${theme} focus-ring vs canvas`).toBeGreaterThanOrEqual(3);
    }
  });
});

/** Parse `#rgb` / `#rrggbb` to 0–255 channels. */
function parseHexRgb(hex: string): [number, number, number] {
  const h = hex.trim().replace(/^#/, '');
  if (h.length === 3) {
    return [
      Number.parseInt(h[0] + h[0], 16),
      Number.parseInt(h[1] + h[1], 16),
      Number.parseInt(h[2] + h[2], 16),
    ];
  }
  if (h.length !== 6) {
    throw new Error(`expected #rrggbb, got ${hex}`);
  }
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ];
}

function srgbToLin(c: number): number {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  return 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
}

function contrastRatio(
  c1: [number, number, number],
  c2: [number, number, number],
): number {
  const L1 = relativeLuminance(c1);
  const L2 = relativeLuminance(c2);
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}

function blendOver(
  r: number,
  g: number,
  b: number,
  a: number,
  bg: [number, number, number],
): [number, number, number] {
  return [
    Math.round(a * r + (1 - a) * bg[0]),
    Math.round(a * g + (1 - a) * bg[1]),
    Math.round(a * b + (1 - a) * bg[2]),
  ];
}
