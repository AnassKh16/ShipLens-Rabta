import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
type Props = {open: boolean; title: string; consequence: string; confirmLabel: string; onConfirm: () => void; onClose: () => void; busy?: boolean};
export function Dialog({open, title, consequence, confirmLabel, onConfirm, onClose, busy}: Props) {
  const { t } = useTranslation(), id = useId();
  const panel = useRef<HTMLDivElement>(null), overlay = useRef<HTMLDivElement>(null);
  const close = useRef(onClose); close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const background = [...document.body.children].filter(node => node !== overlay.current);
    const inert = background.map(node => [node, node.getAttribute('inert')] as const);
    background.forEach(node => node.setAttribute('inert', ''));
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusables = () => [...panel.current!.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')];
    const first = () => (focusables()[0] ?? panel.current!).focus();
    first();
    function keydown(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); close.current(); }
      if (event.key !== 'Tab') return;
      const elements = focusables(), start = elements[0], end = elements[elements.length - 1];
      if (!start) { event.preventDefault(); panel.current?.focus(); }
      else if (event.shiftKey && (document.activeElement === start || document.activeElement === panel.current)) { event.preventDefault(); end.focus(); }
      else if (!event.shiftKey && document.activeElement === end) { event.preventDefault(); start.focus(); }
    }
    function contain(event: FocusEvent) { if (event.target instanceof Node && !panel.current?.contains(event.target)) first(); }
    document.addEventListener('keydown', keydown);
    document.addEventListener('focusin', contain);
    return () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('focusin', contain);
      inert.forEach(([node,value]) => value === null ? node.removeAttribute('inert') : node.setAttribute('inert', value));
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, [open]);
  if (!open) return null;
  return createPortal(<div ref={overlay} className="dialog-backdrop"><div ref={panel} className="dialog" role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} aria-describedby={`${id}-consequence`} tabIndex={-1}>
    <h2 id={`${id}-title`}>{title}</h2><p id={`${id}-consequence`}>{consequence}</p>
    <div className="dialog-actions"><Button variant="text" onClick={onClose}>{t('common.cancel')}</Button><Button loading={busy} onClick={onConfirm}>{confirmLabel}</Button></div>
  </div></div>, document.body);
}
