import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { contrast } from '../src/features/dev/TokenPage';
const css = readFileSync('src/styles/tokens.css','utf8');
const token = (name: string) => css.match(new RegExp(`--${name}:\\s*([^;]+);`))![1];
it('meets contrast for all text and focus pairings used by the foundation', () => {
  for (const [fg,bg] of [['ink','paper'],['muted','paper'],['muted','white'],['danger','paper'],['ink','white'],['primary','white'],['paper','primary'],['white','danger'],['ink','accent-mint'],['accent-mint','ground-dark']]) {
    const ratio = Number(contrast(token(fg),token(bg)));
    console.log(`${fg} on ${bg}: ${ratio}:1`);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  }
  expect(Number(contrast(token('primary'),token('paper')))).toBeGreaterThanOrEqual(3);
});
