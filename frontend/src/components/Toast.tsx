export function Toast({message}: {message: string}) {
  // Keep the live region mounted so later message changes are announced.
  return <div className="toast" role="status" aria-live="polite" aria-atomic="true">{message}</div>;
}
