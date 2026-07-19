import { describe, expect, test } from 'bun:test';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const componentsDir = join(import.meta.dir, 'components');

describe('primitive components', () => {
  test('expected component modules exist', () => {
    const files = readdirSync(componentsDir).filter((f) => f.endsWith('.ts'));
    for (const name of [
      'button.ts',
      'input.ts',
      'label.ts',
      'textarea.ts',
      'checkbox.ts',
      'select.ts',
      'link.ts',
      'badge.ts',
      'box.ts',
      'stack.ts',
      'container.ts',
      'text.ts',
      'heading.ts',
      'alert.ts',
      'toast.ts',
      'modal.ts',
      'spinner.ts',
      'progress.ts',
      'skeleton.ts',
      'field.ts',
      'radio.ts',
      'switch.ts',
    ]) {
      expect(files.includes(name), name).toBe(true);
    }
    expect(files.includes('my-button.ts')).toBe(false);
  });

  test('shared size / variant unions accept documented literals', () => {
    type Size = import('./types/index.ts').KitbashSize;
    type Variant = import('./types/index.ts').KitbashButtonVariant;
    const sizes: Size[] = ['sm', 'md', 'lg'];
    const variants: Variant[] = ['primary', 'secondary', 'ghost', 'danger'];
    expect(sizes).toHaveLength(3);
    expect(variants).toHaveLength(4);
  });
});
