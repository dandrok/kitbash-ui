/**
 * Generate theme CSS + kitbash tokens.json from src/tokens/semantic.ts
 * and preset packs (e.g. terminal).
 *
 * Usage:
 *   bun run scripts/tokens.ts build
 *   bun run scripts/tokens.ts check
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { terminalTokens } from '../src/tokens/presets/terminal.ts';
import {
  cssVarName,
  type SemanticTokenName,
  semanticTokens,
  type TokenValue,
} from '../src/tokens/semantic.ts';

const ROOT = join(import.meta.dir, '..');
const LIGHT_CSS = join(ROOT, 'src/tokens/themes/light.css');
const DARK_CSS = join(ROOT, 'src/tokens/themes/dark.css');
const TERMINAL_LIGHT_CSS = join(ROOT, 'src/tokens/themes/terminal/light.css');
const TERMINAL_DARK_CSS = join(ROOT, 'src/tokens/themes/terminal/dark.css');
const TOKENS_JSON = join(ROOT, 'src/tokens/tokens.json');

const HEADER = `/**
 * GENERATED FILE — do not edit by hand.
 * Source: src/tokens/semantic.ts (+ presets)
 * Regenerate: bun run tokens:build
 */
`;

type TokenMap = Record<SemanticTokenName, TokenValue>;

function entries(map: TokenMap): [SemanticTokenName, TokenValue][] {
  return Object.entries(map) as [SemanticTokenName, TokenValue][];
}

function assertPresetKeys(preset: TokenMap, label: string): void {
  const base = Object.keys(semanticTokens).sort();
  const keys = Object.keys(preset).sort();
  if (base.length !== keys.length || base.some((k, i) => k !== keys[i])) {
    throw new Error(`Preset "${label}" keys must exactly match semanticTokens`);
  }
}

function renderThemeCss(
  map: TokenMap,
  theme: 'light' | 'dark',
  selector: string,
): string {
  const lines = entries(map).map(([name, value]) => {
    const prop = cssVarName(name);
    const raw = theme === 'light' ? value.light : value.dark;
    return `  ${prop}: ${raw};`;
  });
  return `${HEADER}${selector} {\n${lines.join('\n')}\n}\n`;
}

/** Flat map for kitbash: keys become `--key` on :host (default light). */
function renderTokensJson(): string {
  const out: Record<string, string> = {};
  for (const [name, value] of entries(semanticTokens as TokenMap)) {
    const key = cssVarName(name).slice(2);
    out[key] = value.light;
  }
  return `${JSON.stringify(out, null, 2)}\n`;
}

function expectedArtifacts(): Record<string, string> {
  assertPresetKeys(terminalTokens as TokenMap, 'terminal');
  return {
    [LIGHT_CSS]: renderThemeCss(
      semanticTokens as TokenMap,
      'light',
      ':root,\n:root[data-theme="light"]',
    ),
    [DARK_CSS]: renderThemeCss(
      semanticTokens as TokenMap,
      'dark',
      ':root[data-theme="dark"]',
    ),
    [TERMINAL_LIGHT_CSS]: renderThemeCss(
      terminalTokens as TokenMap,
      'light',
      ':root[data-kb-preset="terminal"][data-theme="light"]',
    ),
    [TERMINAL_DARK_CSS]: renderThemeCss(
      terminalTokens as TokenMap,
      'dark',
      ':root[data-kb-preset="terminal"],\n:root[data-kb-preset="terminal"][data-theme="dark"]',
    ),
    [TOKENS_JSON]: renderTokensJson(),
  };
}

export async function buildTokens(): Promise<void> {
  const files = expectedArtifacts();
  for (const [path, body] of Object.entries(files)) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, body, 'utf8');
  }
}

async function readOrEmpty(path: string): Promise<string> {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return '';
  }
}

export async function checkTokens(): Promise<void> {
  const expected = expectedArtifacts();
  const drifts: string[] = [];
  for (const [path, body] of Object.entries(expected)) {
    if ((await readOrEmpty(path)) !== body) drifts.push(path);
  }

  if (drifts.length > 0) {
    console.error(
      'Token drift detected. Run `bun run tokens:build` and commit.\n' +
        drifts.map((p) => `  - ${p}`).join('\n'),
    );
    process.exit(1);
  }
  console.log(
    '✅ tokens:check — default + terminal themes and tokens.json in sync',
  );
}

const cmd = process.argv[2] ?? 'build';
if (cmd === 'build') {
  await buildTokens();
  console.log(
    '✅ tokens:build — wrote default + terminal themes + tokens.json',
  );
} else if (cmd === 'check') {
  await checkTokens();
} else {
  console.error(`Unknown command: ${cmd}. Use build | check`);
  process.exit(1);
}
