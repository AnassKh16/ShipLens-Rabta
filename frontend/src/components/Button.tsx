import type { ButtonHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'text' | 'pill'; loading?: boolean };
export function Button({ variant = 'primary', loading = false, disabled, children, className = '', type = 'button', ...props }: ButtonProps) {
  const { t } = useTranslation();
  return <button {...props} type={type} className={`button button--${variant} ${className}`} disabled={disabled || loading} aria-busy={loading || undefined}>
    {children}{loading && <span role="status">{t('common.loading')}</span>}
  </button>;
}
