import { useId, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';
import { EmptyState } from './EmptyState';
import { Ltr } from './Ltr';
export type Column<T> = {key: string; label: string; value: (row: T) => string | number; render?: (row: T) => ReactNode; numeric?: boolean; sortable?: boolean};
type Props<T> = {caption: string; columns: Column<T>[]; rows: T[]; rowKey: (row: T) => string; emptyMessage: string; pageSizes?: number[]};
export function Table<T>({caption, columns, rows, rowKey, emptyMessage, pageSizes = [10,25,50]}: Props<T>) {
  const { t, i18n } = useTranslation(), id = useId();
  const [sort, setSort] = useState<{key: string; direction: 'ascending' | 'descending'}>();
  const [size, setSize] = useState(pageSizes[0]), [page, setPage] = useState(0);
  const column = columns.find(item => item.key === sort?.key);
  const ordered = column && sort ? [...rows].sort((a,b) => {
    const av = column.value(a), bv = column.value(b);
    const result = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv), i18n.language);
    return sort.direction === 'ascending' ? result : -result;
  }) : rows;
  const pages = Math.max(1, Math.ceil(rows.length / size)), current = Math.min(page, pages - 1);
  const visible = ordered.slice(current * size, (current + 1) * size);
  return <div className="table-component"><div className="table-scroll" role="region" aria-labelledby={id} tabIndex={0}>
    <table className="data-table"><caption id={id}>{caption}</caption><thead><tr>{columns.map(col => <th key={col.key} scope="col" className={col.numeric ? 'numeric' : undefined} aria-sort={col.sortable ? sort?.key === col.key ? sort.direction : 'none' : undefined}>
      {col.sortable ? <Button variant="text" onClick={() => {setSort({key: col.key, direction: sort?.key === col.key && sort.direction === 'ascending' ? 'descending' : 'ascending'}); setPage(0);}}>
        {col.label}{sort?.key === col.key ? sort.direction === 'ascending' ? <ArrowUp aria-hidden="true" /> : <ArrowDown aria-hidden="true" /> : <ArrowUpDown aria-hidden="true" />}
      </Button> : col.label}
    </th>)}</tr></thead><tbody>{visible.map(row => <tr key={rowKey(row)}>{columns.map(col => <td key={col.key} className={col.numeric ? 'numeric' : undefined}>
      <span className="cell-label" aria-hidden="true">{col.label}</span><span>{col.render ? col.render(row) : col.numeric ? <Ltr>{col.value(row)}</Ltr> : col.value(row)}</span>
    </td>)}</tr>)}</tbody></table>
    {!rows.length && <EmptyState message={emptyMessage} />}
  </div><footer className="table-pagination">
    <Button variant="text" disabled={current === 0} onClick={() => setPage(current - 1)}>{t('primitives.previous')}</Button>
    <span role="status">{t('primitives.page', {current: current + 1, total: pages})}</span>
    <Button variant="text" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>{t('primitives.next')}</Button>
    <Select label={t('primitives.pageSize')} value={String(size)} options={pageSizes.map(value => ({value: String(value),label: String(value)}))} onChange={event => {setSize(Number(event.target.value)); setPage(0);}} />
  </footer></div>;
}
