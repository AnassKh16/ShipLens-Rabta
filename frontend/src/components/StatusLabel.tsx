import { Clock, Check, Undo2, LockKeyhole, UserCheck, UserX, ClipboardList, Sprout, CircleCheck, Pause, CircleX, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const icons = {pending: Clock, approved: Check, returned: Undo2, locked: LockKeyhole, accepted: UserCheck, declined: UserX, applied: ClipboardList, forming: Sprout, active: CircleCheck, paused: Pause, closed: CircleX, editable: Pencil};
export type Status = keyof typeof icons;
export const statuses = Object.keys(icons) as Status[];
export function StatusLabel({status, label}: {status: Status; label?: string}) {
  const { t } = useTranslation();
  const Icon = icons[status];
  return <span className={`status-label status-label--${status}`}><Icon aria-hidden="true" /><span>{label ?? t(`statuses.${status}`)}</span></span>;
}
