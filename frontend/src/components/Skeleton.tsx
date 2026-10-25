import { useTranslation } from 'react-i18next';
export function Skeleton({label}: {label?: string}) {
  const { t } = useTranslation();
  return <div role="status" aria-label={label ?? t('common.loading')} className="skeleton" />;
}
