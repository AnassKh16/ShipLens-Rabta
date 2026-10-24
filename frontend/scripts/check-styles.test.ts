import { expect, it } from 'vitest';
import { execFileSync, spawnSync } from 'node:child_process';
it('rejects the deliberately bad fixture through the actual CLI', () => {
  const result = spawnSync(process.execPath, ['scripts/check-styles.mjs','scripts/__fixtures__'], {encoding:'utf8'});
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('hex color');
  expect(result.stderr).toContain('raw font-family');
  expect(result.stderr).toContain('physical CSS property');
  expect(result.stderr).toContain('physical CSS value');
});
it('accepts the actual source tree', () => {
  expect(execFileSync(process.execPath,['scripts/check-styles.mjs'],{encoding:'utf8'})).toContain('passed');
});
