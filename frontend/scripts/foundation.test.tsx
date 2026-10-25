import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';
import { App } from '../src/app/App';
import { LanguageSwitch } from '../src/components/LanguageSwitch';
import i18n from '../src/i18n';
afterEach(async () => { cleanup(); await i18n.changeLanguage('en'); });
it('switches to Urdu and persists only the language preference', async () => {
  render(<LanguageSwitch />);
  const english = screen.getByRole('button', { name: 'English' });
  const urdu = screen.getByRole('button', { name: 'اردو' });
  expect(english).toHaveAttribute('aria-current', 'true');
  expect(urdu).not.toHaveAttribute('aria-current');
  expect(urdu).toHaveAttribute('lang', 'ur');
  expect(screen.getByText('|')).toHaveAttribute('aria-hidden', 'true');
  fireEvent.click(urdu);
  expect(urdu).toHaveAttribute('aria-current', 'true');
  expect(english).not.toHaveAttribute('aria-current');
  await waitFor(() => expect(document.documentElement.dir).toBe('rtl'));
  expect(document.documentElement.lang).toBe('ur');
  expect(localStorage.getItem('rabta-language')).toBe('ur');
  fireEvent.click(screen.getByRole('button', { name: 'English' }));
  await waitFor(() => expect(document.documentElement.dir).toBe('ltr'));
  expect(english).toHaveAttribute('aria-current', 'true');
  expect(urdu).not.toHaveAttribute('aria-current');
});
it('renders the lazy public foundation', async () => {
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'The RABTA foundation' })).toBeInTheDocument();
});
function components(root: string): string[] {
  return readdirSync(root,{withFileTypes:true}).flatMap(e => e.isDirectory() ? components(resolve(root,e.name)) : e.name.endsWith('.tsx') ? [resolve(root,e.name)] : []);
}
describe('translation discipline', () => {
  for (const file of [...components(resolve('src/components')), ...components(resolve('src/features'))]) {
    it(`${file} has no literal user-facing JSX text or attributes`, () => {
      const source = ts.createSourceFile(file,readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
      const failures: string[] = [];
      function visit(node: ts.Node) {
        if (ts.isJsxText(node) && /[\p{L}\p{N}]/u.test(node.text)) failures.push(node.text);
        if (ts.isJsxAttribute(node) && ['title','placeholder','alt','aria-label'].includes(node.name.getText(source)) && node.initializer && ts.isStringLiteral(node.initializer) && /[\p{L}]/u.test(node.initializer.text)) failures.push(node.initializer.text);
        if (ts.isJsxExpression(node) && node.expression && ts.isStringLiteral(node.expression) && /[\p{L}]/u.test(node.expression.text)) failures.push(node.expression.text);
        ts.forEachChild(node,visit);
      }
      visit(source);
      expect(failures).toEqual([]);
    });
  }
});

it('provides loading, empty, error with retry, and content states', async () => {
  const { ResourceState } = await import('../src/components/ResourceState');
  let retried = false;
  const props = {onRetry: () => {retried = true;}};
  const {rerender} = render(<ResourceState {...props} state="loading" />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading');
  rerender(<ResourceState {...props} state="empty" />);
  expect(screen.getByRole('status')).toHaveTextContent('No records');
  rerender(<ResourceState {...props} state="error" />);
  expect(screen.getByRole('alert')).toBeVisible();
  fireEvent.click(screen.getByRole('button',{name:'Try again'}));
  expect(retried).toBe(true);
  rerender(<ResourceState {...props} state="content"><p>Content fixture</p></ResourceState>);
  expect(screen.getByText('Content fixture')).toBeVisible();
});
