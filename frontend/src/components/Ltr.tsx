import type { ReactNode } from 'react';
export function Ltr({ children }: { children: ReactNode }) {
  return <bdi dir="ltr" className="ltr-identifier">{children}</bdi>;
}
