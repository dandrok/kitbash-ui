import { expect, test } from 'bun:test';
import pkg from '../package.json';

test('package identity is @ktbsh/ui', () => {
  expect(pkg.name).toBe('@ktbsh/ui');
  expect(pkg.version).toBe('0.1.0');
});
