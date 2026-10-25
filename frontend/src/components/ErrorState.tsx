import { useTranslation } from 'react-i18next';
import { CircleAlert } from 'lucide-react';
import { Button } from './Button';
export function ErrorState({message, onRetry}: {message: string; onRetry: () => void}) {
  const { t } = useTranslation();
  return <div className="plain-state"><p className="field-error" role="alert"><CircleAlert aria-hidden="true" />{message}</p><Button variant="secondary" onClick={onRetry}>{t('common.retry')}</Button></div>;
}
