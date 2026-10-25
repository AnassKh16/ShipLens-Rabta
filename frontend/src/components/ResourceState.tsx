import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
type Props = { state: 'loading' | 'empty' | 'error' | 'content'; children?: ReactNode; onRetry: () => void };
/** Shared request states; feature-specific empty explanations can replace this default. */
export function ResourceState({ state, children, onRetry }: Props) {
  const { t } = useTranslation();
  if (state === 'loading') return <p role="status" aria-live="polite">{t('common.loading')}</p>;
  if (state === 'empty') return <p role="status">{t('common.empty')}</p>;
  if (state === 'error') return <div><p role="alert">{t('common.error')}</p><button type="button" onClick={onRetry}>{t('common.retry')}</button></div>;
  return <>{children}</>;
}
