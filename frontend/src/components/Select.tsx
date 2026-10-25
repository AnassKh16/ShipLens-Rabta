import { useId, type SelectHTMLAttributes } from 'react';
import { FieldFrame, describedBy } from './Field';
type Props = SelectHTMLAttributes<HTMLSelectElement> & {label: string; helper?: string; error?: string; options: {value: string; label: string}[]};
export function Select({label, helper, error, options, id: givenId, ...props}: Props) {
  const generated = useId(), id = givenId ?? generated;
  return <FieldFrame id={id} label={label} helper={helper} error={error} required={props.required}>
    <select {...props} id={id} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy(id, helper, error, props['aria-describedby'])}>
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </FieldFrame>;
}
