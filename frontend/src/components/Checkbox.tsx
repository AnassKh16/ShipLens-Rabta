import { useId, type InputHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleAlert } from 'lucide-react';
import { describedBy } from './Field';
export function Checkbox({label, error, id: givenId, ...props}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {label: string; error?: string}) {
  const generated = useId(), id = givenId ?? generated;
  const { t } = useTranslation();
  return <div><label className="checkbox" htmlFor={id}><input {...props} id={id} type="checkbox" aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy(id, undefined, error, props['aria-describedby'])} /><span>{label}{props.required && <span>{' '}{t('primitives.required')}</span>}</span></label>
    {error && <p className="field-error" id={`${id}-error`} aria-live="polite"><CircleAlert aria-hidden="true" />{error}</p>}
  </div>;
}
