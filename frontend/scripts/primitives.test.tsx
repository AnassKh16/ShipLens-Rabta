import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { readFileSync } from 'node:fs';
import { Button } from '../src/components/Button';
import { Field } from '../src/components/Field';
import { Select } from '../src/components/Select';
import { Checkbox } from '../src/components/Checkbox';
import { Table } from '../src/components/Table';
import { StatusLabel, statuses } from '../src/components/StatusLabel';
import { Dialog } from '../src/components/Dialog';
import { EchoText } from '../src/components/EchoText';
import { Skeleton } from '../src/components/Skeleton';
import { Ltr } from '../src/components/Ltr';
import { LanguageSwitch } from '../src/components/LanguageSwitch';
import i18n from '../src/i18n';
afterEach(async () => {cleanup();await i18n.changeLanguage('en');});
it('supports action variants, loading, disabled and normal activation', () => {
  const clicked = vi.fn();
  const {rerender} = render(<Button onClick={clicked}>Save changes</Button>);
  fireEvent.click(screen.getByRole('button'));expect(clicked).toHaveBeenCalledOnce();
  for (const variant of ['primary','secondary','text','pill'] as const) {
    rerender(<Button variant={variant} disabled onClick={clicked}>Save changes</Button>);
    const button = screen.getByRole('button');expect(button).toBeDisabled();expect(button).toHaveClass(`button--${variant}`);fireEvent.click(button);
  }
  expect(clicked).toHaveBeenCalledOnce();
  rerender(<Button loading onClick={clicked}>Save changes</Button>);
  expect(screen.getByRole('button')).toBeDisabled();expect(screen.getByRole('button')).toHaveAttribute('aria-busy','true');expect(screen.getByRole('status')).toHaveTextContent('Loading');
});
it('connects field labels, required marker, helper, validation and inline error', () => {
  render(<Field label="Reference" helper="Find the reference" required validate={value => !value ? 'Reference is required' : undefined} />);
  const input = screen.getByRole('textbox',{name:/Reference/});
  expect(input).toBeRequired();expect(input).toHaveAccessibleDescription('Find the reference');
  fireEvent.blur(input);
  expect(input).toHaveAttribute('aria-invalid','true');expect(input).toHaveAccessibleDescription('Find the reference Reference is required');
  expect(screen.getByText('Reference is required').querySelector('svg')).not.toBeNull();
  fireEvent.change(input,{target:{value:'DEMO-01'}});
  expect(input).not.toHaveAttribute('aria-invalid','true');expect(screen.queryByText('Reference is required')).toBeNull();
});
it('handles native invalid submit events and reveals passwords without submitting', () => {
  render(<Field label="Password" type="password" required />);
  const input = screen.getByLabelText(/Password/,{selector:'input'});
  fireEvent.invalid(input);expect(input).toHaveAttribute('aria-invalid','true');
  fireEvent.click(screen.getByRole('button',{name:'Show password'}));expect(input).toHaveAttribute('type','text');
  expect(screen.getByRole('button',{name:'Hide password'})).toHaveAttribute('type','button');
});
it('labels select and checkbox and describes their errors', () => {
  render(<><Select label="Status" options={[{value:'active',label:'Active'}]} error="Choose a status" /><Checkbox label="Include paused" error="Confirm selection" /></>);
  expect(screen.getByRole('combobox',{name:'Status'})).toHaveAttribute('aria-invalid','true');
  expect(screen.getByRole('checkbox',{name:'Include paused'})).toHaveAccessibleDescription('Confirm selection');
});
it('sorts numeric values, announces sort direction, and paginates', () => {
  render(<Table caption="Test register" rows={[{id:'a',amount:20},{id:'b',amount:3},{id:'c',amount:100}]} rowKey={row=>row.id} emptyMessage="No records" pageSizes={[2,3]} columns={[{key:'id',label:'Code',value:row=>row.id},{key:'amount',label:'Amount',value:row=>row.amount,sortable:true,numeric:true}]} />);
  const table = screen.getByRole('table',{name:'Test register'}), header = screen.getByRole('columnheader',{name:'Amount'});
  expect(header).toHaveAttribute('scope','col');expect(header).toHaveAttribute('aria-sort','none');
  fireEvent.click(screen.getByRole('button',{name:'Amount'}));expect(header).toHaveAttribute('aria-sort','ascending');
  expect(within(table).getAllByRole('row')[1]).toHaveTextContent('b');
  fireEvent.click(screen.getByRole('button',{name:'Amount'}));expect(header).toHaveAttribute('aria-sort','descending');expect(within(table).getAllByRole('row')[1]).toHaveTextContent('c');
  fireEvent.click(screen.getByRole('button',{name:'Next page'}));expect(screen.getByText('Page 2 of 2')).toBeVisible();
  fireEvent.change(screen.getByRole('combobox',{name:'Rows per page'}),{target:{value:'3'}});expect(within(table).getAllByRole('row')).toHaveLength(4);
});
for (const status of statuses) it(`renders icon and translated text for ${status}`, () => {
  const {container} = render(<StatusLabel status={status} />);
  expect(screen.getByText(i18n.t(`statuses.${status}`))).toBeVisible();expect(container.querySelector('svg')).toHaveAttribute('aria-hidden','true');
});
it('traps forward/reverse focus, closes with Escape and restores the opener', () => {
  function Demo() {const [open,setOpen] = useState(false);return <><button onClick={()=>setOpen(true)}>Review closure</button><Dialog open={open} title="Close branch?" consequence="The branch will leave the active list." confirmLabel="Close branch" onConfirm={()=>setOpen(false)} onClose={()=>setOpen(false)} /></>;}
  render(<Demo />);const opener=screen.getByRole('button',{name:'Review closure'});opener.focus();fireEvent.click(opener);
  const dialog=screen.getByRole('dialog',{name:'Close branch?'}), cancel=within(dialog).getByRole('button',{name:'Cancel'}), confirm=within(dialog).getByRole('button',{name:'Close branch'});
  expect(cancel).toHaveFocus();fireEvent.keyDown(cancel,{key:'Tab',shiftKey:true});expect(confirm).toHaveFocus();
  fireEvent.keyDown(confirm,{key:'Tab'});expect(cancel).toHaveFocus();
  expect(opener.closest('[inert]')).not.toBeNull();
  fireEvent.keyDown(cancel,{key:'Escape'});expect(screen.queryByRole('dialog')).toBeNull();expect(opener).toHaveFocus();expect(opener.closest('[inert]')).toBeNull();
});
it('disables echo layers in Urdu and for non-Latin text', async () => {
  const {container,rerender}=render(<EchoText text="Branch record" />);
  expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(4);
  await i18n.changeLanguage('ur');rerender(<EchoText text="Branch record" />);expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
  await i18n.changeLanguage('en');rerender(<EchoText text="رابطہ" />);expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
});
it('keeps skeleton static and free of gradient effects', () => {
  render(<Skeleton />);expect(screen.getByRole('status')).toHaveAttribute('class','skeleton');
  const css=readFileSync('src/styles/primitives.css','utf8'), rule=css.match(/\.skeleton\s*\{([^}]+)\}/)![1];
  expect(rule).toContain('animation: none');expect(rule).not.toMatch(/gradient|transition|keyframes/);expect(css).not.toMatch(/@keyframes|gradient/);
});
it('uses the sans fallback, isolates identifiers and keeps the separator muted in both languages', async () => {
  const tokens=readFileSync('src/styles/tokens.css','utf8'), css=readFileSync('src/styles/base.css','utf8');
  expect(tokens).toContain("--font-urdu: 'Noto Naskh Arabic', var(--font-body), sans-serif;");
  expect(css).toMatch(/\.language-switch \.language-separator\s*\{[^}]*color: var\(--muted\)/);
  expect(css).toMatch(/\.ltr-identifier\s*\{[^}]*unicode-bidi: isolate/);
  const {container}=render(<><Ltr>--paper</Ltr><LanguageSwitch /></>);
  expect(screen.getByText('--paper')).toHaveAttribute('dir','ltr');
  await i18n.changeLanguage('ur');expect(container.querySelector('.language-separator')).toHaveAttribute('aria-hidden','true');
});

it('renders the whole showcase in English and Urdu and opens its keyboard dialog', async () => {
  const {default: ComponentsPage} = await import('../src/features/dev/ComponentsPage');
  const {rerender} = render(<ComponentsPage />);
  expect(screen.getByRole('heading',{name:'Component primitives'})).toBeVisible();
  fireEvent.click(screen.getByRole('button',{name:'Review branch closure'}));
  expect(screen.getByRole('dialog')).toHaveAccessibleDescription('Closing this branch removes it from active branch choices. Existing records remain available.');
  fireEvent.keyDown(document,{key:'Escape'});
  await i18n.changeLanguage('ur');rerender(<ComponentsPage />);
  expect(screen.getByRole('heading',{name:i18n.t('showcase.title')})).toBeVisible();
  expect(document.documentElement.dir).toBe('rtl');
  expect(screen.getByRole('button',{name:i18n.t('showcase.dialogOpen')})).toBeVisible();
});
