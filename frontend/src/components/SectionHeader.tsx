import type { ReactNode } from 'react';
export function SectionHeader({title, description, action, id}: {title: string; description?: string; action?: ReactNode; id?: string}) {
  return <header className="section-header"><div><h2 id={id}>{title}</h2>{description && <p>{description}</p>}</div>{action}</header>;
}
