import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { expect, it } from 'vitest';
const base = readFileSync('src/styles/base.css', 'utf8');
const fontsPath = resolve('src/styles/fonts.css');
const fonts = readFileSync(fontsPath, 'utf8');
const tokens = readFileSync('src/styles/tokens.css', 'utf8');
it('matches font-face family names to the shared family tokens', () => {
  for (const token of ['font-body', 'font-display', 'font-urdu']) {
    const family = tokens.match(new RegExp(`--${token}:\\s*'([^']+)'`))![1];
    expect(fonts).toContain(`font-family: '${family}'`);
  }
  const urdu = tokens.match(/--font-urdu:\s*'([^']+)'/)![1];
  for (const weight of [400, 700]) {
    expect(fonts).toMatch(new RegExp(`font-family: '${urdu}';[^}]*font-weight: ${weight};`));
  }
});
it('sets the Urdu token on the document, body, headings and controls', () => {
  expect(base).toMatch(/button, input, select, textarea\s*\{\s*font: inherit;\s*letter-spacing: inherit;/);
  const documentRule = base.match(/html\[lang="ur"\][^{]*\{([^}]+)\}/)!;
  expect(documentRule[0]).toContain('html[lang="ur"] body');
  expect(documentRule[0]).toContain('[lang="ur"] :is(button, input, select, textarea)');
  expect(documentRule[1]).toContain('font-family: var(--font-urdu)');
  expect(documentRule[1]).toContain('word-spacing: normal');
  expect(base).toMatch(/\[lang="ur"\] h1,[^{]*\[lang="ur"\] h3\s*\{[^}]*font-family: var\(--font-urdu\)/);
  expect(base).toMatch(/\.language-switch button\[lang="en"\]\s*\{[^}]*font-family: var\(--font-body\)/);
});
it('resolves every self-hosted font source and keeps readable headline spacing', () => {
  for (const match of fonts.matchAll(/url\('([^']+)'\)/g)) expect(existsSync(resolve(dirname(fontsPath), match[1]))).toBe(true);
  expect(tokens).toContain('--heading-word-spacing: .14em;');
  expect(tokens).toContain('--tracking-headline: -.03em;');
  expect(base).toMatch(/h1, h2, h3\s*\{[^}]*word-spacing: var\(--heading-word-spacing\)/);
});
// jsdom checks CSS contracts and paths; it cannot prove font rendering.
