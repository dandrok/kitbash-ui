import { expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import pkg from '../package.json';

const root = resolve(import.meta.dir, '..');

test('package identity is @ktbsh/ui', () => {
  expect(pkg.name).toBe('@ktbsh/ui');
  expect(pkg.version).toBe('0.2.0');
});

test('package.json exposes public export map (dist-only runtime)', () => {
  const exports = pkg.exports as Record<string, unknown>;
  expect(exports).toBeTruthy();
  expect(exports['.']).toEqual({
    types: './dist/index.d.ts',
    import: './dist/index.js',
    default: './dist/index.js',
  });
  expect(exports['./vanilla/*']).toEqual({
    types: './dist/vanilla/*.d.ts',
    import: './dist/vanilla/*.js',
    default: './dist/vanilla/*.js',
  });
  expect(exports['./react/*']).toEqual({
    types: './dist/react/*.d.ts',
    import: './dist/react/*.js',
    default: './dist/react/*.js',
  });
  expect(exports['./themes/*']).toBe('./dist/themes/*');
  expect(exports['./tokens']).toEqual({
    types: './dist/tokens/index.d.ts',
    import: './dist/tokens/index.js',
    default: './dist/tokens/index.js',
  });
  expect(exports['./types']).toEqual({
    types: './dist/types/index.d.ts',
    import: './dist/types/index.js',
    default: './dist/types/index.js',
  });
  expect(exports['./custom-elements.json']).toBe('./dist/custom-elements.json');
  expect(exports['./package.json']).toBe('./package.json');
  expect(pkg.main).toBe('./dist/index.js');
  expect(pkg.types).toBe('./dist/index.d.ts');
});

test('publish surface is dist + README only', () => {
  expect(pkg.files).toEqual(['dist', 'README.md']);
  expect(pkg.publishConfig).toEqual({ access: 'public' });
  expect(pkg.sideEffects).toEqual(
    expect.arrayContaining(['**/*.css', './dist/vanilla/**/*.js']),
  );
});

test('react is an optional peer dependency', () => {
  expect(pkg.peerDependencies?.react).toBe('>=18');
  expect(pkg.peerDependenciesMeta?.react?.optional).toBe(true);
});

test('built component, theme, and entry files resolve for documented subpaths', () => {
  // CI runs `bun run build` before tests so dist exists on a clean checkout.
  const required = [
    'dist/index.js',
    'dist/index.d.ts',
    'dist/tokens/index.js',
    'dist/tokens/index.d.ts',
    'dist/types/index.js',
    'dist/types/index.d.ts',
    'dist/themes/light.css',
    'dist/themes/dark.css',
    'dist/themes/terminal/light.css',
    'dist/themes/terminal/dark.css',
    'dist/vanilla/button.js',
    'dist/vanilla/button.d.ts',
    'dist/react/button.js',
    'dist/react/button.d.ts',
    'dist/custom-elements.json',
  ];
  for (const rel of required) {
    expect(existsSync(resolve(root, rel))).toBe(true);
  }
});

test('compiled root entry re-exports tokens helpers', async () => {
  // Dynamic URL import so typecheck does not require dist/*.d.ts on disk.
  const href = pathToFileURL(resolve(root, 'dist/index.js')).href;
  const api = (await import(href)) as {
    applyTheme: unknown;
    getTheme: unknown;
    cssVarName: unknown;
    semanticTokens: unknown;
  };
  expect(typeof api.applyTheme).toBe('function');
  expect(typeof api.getTheme).toBe('function');
  expect(typeof api.cssVarName).toBe('function');
  expect(api.semanticTokens).toBeTruthy();
});
