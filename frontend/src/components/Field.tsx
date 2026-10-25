import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleAlert, Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';
export function FieldFrame({ id, label, helper, error, required, children }: { id: string; label: string; helper?: string; error?: string; required?: boolean; children: ReactNode }) {
  const { t } = useTranslation();
  return <div className="field"><label htmlFor={id}>{label}{required && <span>{' '}{t('primitives.required')}</span>}</label>
    {helper && <p className="field-helper" id={`${id}-helper`}>{helper}</p>}{children}
    {error && <p className="field-error" id={`${id}-error`} aria-live="polite"><CircleAlert aria-hidden="true" />{error}</p>}
  </div>;
}
export function describedBy(id: string, helper?: string, error?: string, extra?: string) {
  return [helper && `${id}-helper`, error && `${id}-error`, extra].filter(Boolean).join(' ') || undefined;
}
type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; helper?: string; error?: string; validate?: (value: string) => string | undefined };
export function Field({ label, helper, error, validate, id: givenId, type = 'text', onBlur, onChange, onInvalid, ...props }: Props) {
  const generated = useId(), id = givenId ?? generated;
  const [visible, setVisible] = useState(false), [localError, setLocalError] = useState<string>();
  const { t } = useTranslation();
  const message = error || localError;
  return <FieldFrame id={id} label={label} helper={helper} error={message} required={props.required}>
    <div className="field-control"><input {...props} id={id} type={type === 'password' && visible ? 'text' : type}
      aria-invalid={message ? true : props['aria-invalid']} aria-describedby={describedBy(id, helper, message, props['aria-describedby'])}
      onBlur={event => { const input = event.currentTarget; setLocalError(validate?.(input.value) ?? (!input.validity.valid ? t(input.validity.valueMissing ? 'errors.required' : 'errors.invalid') : undefined)); onBlur?.(event); }}
      onChange={event => { if (localError) setLocalError(validate?.(event.currentTarget.value)); onChange?.(event); }}
      onInvalid={event => { if (!event.currentTarget.validity.valid) setLocalError(t(event.currentTarget.validity.valueMissing ? 'errors.required' : 'errors.invalid')); onInvalid?.(event); }} />
      {type === 'password' && <Button variant="text" aria-controls={id} aria-pressed={visible} onClick={() => setVisible(!visible)}>
        {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}{t(visible ? 'primitives.hidePassword' : 'primitives.showPassword')}
      </Button>}
    </div>
  </FieldFrame>;
}
