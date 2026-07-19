/**
 * Generate theme CSS + kitbash tokens.json from src/tokens/semantic.ts.
 * Usage:
 *   bun run scripts/tokens.ts build
 *   bun run scripts/tokens.ts check
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import {
  cssVarName,
  type SemanticTokenName,
  semanticTokens,
} from '../src/tokens/semantic.ts';

const ROOT = join(import.meta.dir, '..');
const LIGHT_CSS = join(ROOT, 'src/tokens/themes/light.css');
const DARK_CSS = join(ROOT, 'src/tokens/themes/dark.css');
const TOKENS_JSON = join(ROOT, 'src/tokens/tokens.json');

const HEADER = `/**
 * GENERATED FILE — do not edit by hand.
 * Source: src/tokens/semantic.ts
 * Regenerate: bun run tokens:build
 */
`;

function entries(): [
  SemanticTokenName,
  (typeof semanticTokens)[SemanticTokenName],
][] {
  return Object.entries(semanticTokens) as [
    SemanticTokenName,
    (typeof semanticTokens)[SemanticTokenName],
  ][];
}

function renderThemeCss(theme: 'light' | 'dark', selector: string): string {
  const lines = entries().map(([name, value]) => {
    const prop = cssVarName(name);
    const raw = theme === 'light' ? value.light : value.dark;
    return `  ${prop}: ${raw};`;
  });
  return `${HEADER}${selector} {\n${lines.join('\n')}\n}\n`;
}

/** Flat map for kitbash: keys become `--key` on :host (light defaults). */
function renderTokensJson(): string {
  const out: Record<string, string> = {};
  for (const [name, value] of entries()) {
    // Drop leading `--` so generateTokenStyles emits `--kb-…`
    const key = cssVarName(name).slice(2);
    out[key] = value.light;
  }
  return `${JSON.stringify(out, null, 2)}\n`;
}

export async function buildTokens(): Promise<void> {
  const light = renderThemeCss('light', ':root,\n:root[data-theme="light"]');
  const dark = renderThemeCss('dark', ':root[data-theme="dark"]');
  const json = renderTokensJson();

  await mkdir(dirname(LIGHT_CSS), { recursive: true });
  await writeFile(LIGHT_CSS, light, 'utf8');
  await writeFile(DARK_CSS, dark, 'utf8');
  await writeFile(TOKENS_JSON, json, 'utf8');
}

async function readOrEmpty(path: string): Promise<string> {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return '';
  }
}

export async function checkTokens(): Promise<void> {
  const expectedLight = renderThemeCss(
    'light',
    ':root,\n:root[data-theme="light"]',
  );
  const expectedDark = renderThemeCss('dark', ':root[data-theme="dark"]');
  const expectedJson = renderTokensJson();

  const actualLight = await readOrEmpty(LIGHT_CSS);
  const actualDark = await readOrEmpty(DARK_CSS);
  const actualJson = await readOrEmpty(TOKENS_JSON);

  const drifts: string[] = [];
  if (actualLight !== expectedLight) drifts.push(LIGHT_CSS);
  if (actualDark !== expectedDark) drifts.push(DARK_CSS);
  if (actualJson !== expectedJson) drifts.push(TOKENS_JSON);

  if (drifts.length > 0) {
    console.error(
      'Token drift detected. Run `bun run tokens:build` and commit.\n' +
        drifts.map((p) => `  - ${p}`).join('\n'),
    );
    process.exit(1);
  }
  console.log('✅ tokens:check — light.css, dark.css, tokens.json in sync');
}

const cmd = process.argv[2] ?? 'build';
if (cmd === 'build') {
  await buildTokens();
  console.log('✅ tokens:build — wrote themes + tokens.json');
} else if (cmd === 'check') {
  await checkTokens();
} else {
  console.error(`Unknown command: ${cmd}. Use build | check`);
  process.exit(1);
}
