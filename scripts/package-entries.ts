/**
 * Post-kitbash publish prep:
 * 1. Emit JS + .d.ts for public root/tokens/types entries (tsc.package)
 * 2. Copy theme CSS into dist/themes
 * 3. Write lightweight vanilla module declarations (side-effect CE imports)
 *
 * Run via `bun run package:entries` after `kitbash build`.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');
const dist = join(root, 'dist');
const vanillaDir = join(dist, 'vanilla');
const themesOut = join(dist, 'themes');
const themesIn = join(root, 'src/tokens/themes');

function runTscPackage(): void {
  const result = Bun.spawnSync(['bunx', 'tsc', '-p', 'tsconfig.package.json'], {
    cwd: root,
    stdout: 'inherit',
    stderr: 'inherit',
  });
  if (result.exitCode !== 0) {
    throw new Error(
      `tsc -p tsconfig.package.json failed with code ${result.exitCode}`,
    );
  }
}

function copyThemes(): void {
  // Recursive: default light/dark + presets (e.g. themes/terminal/*.css)
  mkdirSync(themesOut, { recursive: true });
  cpSync(themesIn, themesOut, { recursive: true });
}

/** Side-effect CE modules: no runtime exports, but TS needs a declaration. */
const VANILLA_DTS = `/** Side-effect import — registers the custom element. */
export {};
`;

function writeVanillaDeclarations(): void {
  if (!existsSync(vanillaDir)) {
    throw new Error(`missing ${vanillaDir} — run kitbash build first`);
  }
  const files = readdirSync(vanillaDir).filter(
    (f) => f.endsWith('.js') && !f.endsWith('.src.js'),
  );
  for (const file of files) {
    const base = file.slice(0, -'.js'.length);
    writeFileSync(join(vanillaDir, `${base}.d.ts`), VANILLA_DTS);
  }
}

function assertOutputs(): void {
  const required = [
    'index.js',
    'index.d.ts',
    'tokens/index.js',
    'tokens/index.d.ts',
    'types/index.js',
    'types/index.d.ts',
    'themes/light.css',
    'themes/dark.css',
    'themes/terminal/light.css',
    'themes/terminal/dark.css',
    'vanilla/button.js',
    'vanilla/button.d.ts',
    'react/button.js',
    'react/button.d.ts',
    'custom-elements.json',
  ];
  for (const rel of required) {
    if (!existsSync(join(dist, rel))) {
      throw new Error(`package-entries: missing dist/${rel}`);
    }
  }
}

runTscPackage();
copyThemes();
writeVanillaDeclarations();
assertOutputs();
console.log(
  '✅ package:entries — dist index/tokens/types, themes, vanilla .d.ts ready',
);
