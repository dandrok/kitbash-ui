import { describe, expect, test } from 'bun:test';
import {
  applyTheme,
  cssVar,
  cssVarName,
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
});
