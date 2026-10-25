import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';
import { Field } from '../../components/Field';
import { Select } from '../../components/Select';
import { Checkbox } from '../../components/Checkbox';
import { Table } from '../../components/Table';
import { StatusLabel, statuses } from '../../components/StatusLabel';
import { SectionHeader } from '../../components/SectionHeader';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { Skeleton } from '../../components/Skeleton';
import { Dialog } from '../../components/Dialog';
import { Toast } from '../../components/Toast';
import { Wordmark } from '../../components/Wordmark';
import { EchoText } from '../../components/EchoText';
import { Ltr } from '../../components/Ltr';
import './components-preview.css';
export default function ComponentsPage() {
  const { t } = useTranslation();
  const [dialog, setDialog] = useState(false), [message, setMessage] = useState(''), [retried,setRetried] = useState(false);
  const focusTarget = useRef<HTMLInputElement>(null);
  const options = ['active','paused','closed'].map(value => ({value,label:t(`statuses.${value}`)}));
  const rows = [{code:'DEMO-A', name:t('showcase.sampleA'),amount:2400},{code:'DEMO-B',name:t('showcase.sampleB'),amount:1200},{code:'DEMO-C',name:t('showcase.sampleC'),amount:3600}];
  return <main id="main" className="component-showcase">
    <h1>{t('showcase.title')}</h1><p>{t('showcase.intro')}</p>
    <section><SectionHeader title={t('showcase.buttons')} description={t('showcase.hoverNote')} />
      <div className="demo-actions"><Button>{t('showcase.primary')}</Button><Button variant="secondary">{t('showcase.secondary')}</Button><Button variant="text">{t('showcase.text')}</Button><Button variant="pill">{t('showcase.pill')}</Button><Button disabled>{t('showcase.disabled')}</Button><Button loading>{t('showcase.loading')}</Button></div>
    </section>
    <section><SectionHeader title={t('showcase.forms')} />
      <div className="demo-fields"><h3>{t('showcase.defaultTitle')}</h3><Field label={t('showcase.name')} helper={t('showcase.helper')} required validate={value => !value.trim() ? t('showcase.fieldError') : undefined} />
        <Field label={t('showcase.password')} type="password" autoComplete="new-password" />
        <Select label={t('showcase.select')} options={options} required /><Checkbox label={t('showcase.checkbox')} />
        <h3>{t('showcase.invalidTitle')}</h3><Field label={t('showcase.name')} helper={t('showcase.helper')} error={t('showcase.fieldError')} required /><Select label={t('showcase.select')} options={options} error={t('showcase.fieldError')} /><Checkbox label={t('showcase.checkbox')} error={t('showcase.checkboxError')} />
        <h3>{t('showcase.disabledTitle')}</h3><Field label={t('showcase.fieldDisabled')} defaultValue={t('showcase.sampleRef')} disabled /><Select label={t('showcase.select')} options={options} disabled /><Checkbox label={t('showcase.checkbox')} disabled />
      </div>
    </section>
    <section><SectionHeader title={t('showcase.table')} /><Table caption={t('showcase.caption')} rows={rows} rowKey={row => row.code} emptyMessage={t('showcase.empty')} pageSizes={[2,10]} columns={[
      {key:'code',label:t('showcase.code'),value:row => row.code,render:row => <Ltr>{row.code}</Ltr>,sortable:true},
      {key:'name',label:t('showcase.branch'),value:row => row.name,sortable:true},
      {key:'amount',label:t('showcase.amount'),value:row => row.amount,numeric:true,sortable:true}
    ]} /></section>
    <section><SectionHeader title={t('showcase.status')} /><ul className="demo-statuses">{statuses.map(status => <li key={status}><StatusLabel status={status} /></li>)}</ul></section>
    <section><SectionHeader title={t('showcase.feedback')} />
      <h3>{t('showcase.loadingTitle')}</h3><Skeleton /><h3>{t('showcase.emptyTitle')}</h3><EmptyState message={t('showcase.empty')} action={<Button variant="text">{t('showcase.clear')}</Button>} />
      <h3>{t('showcase.errorTitle')}</h3>{retried ? <p role="status">{t('showcase.caption')}</p> : <ErrorState message={t('showcase.error')} onRetry={() => setRetried(true)} />}
      <h3>{t('showcase.contentTitle')}</h3><Button variant="secondary" onClick={() => setMessage(t('showcase.toast'))}>{t('showcase.showToast')}</Button><Toast message={message} />
    </section>
    <section><SectionHeader title={t('showcase.brand')} /><Wordmark /><p className="demo-echo"><EchoText text={t('showcase.echo')} /></p></section>
    <section><SectionHeader title={t('showcase.keyboard')} description={t('showcase.focusNote')} /><div className="demo-fields"><label htmlFor="focus-destination">{t('showcase.focusTarget')}</label><input ref={focusTarget} id="focus-destination" /><div className="demo-actions"><Button variant="secondary" onClick={() => focusTarget.current?.focus()}>{t('showcase.focusAction')}</Button><Button onClick={() => setDialog(true)}>{t('showcase.dialogOpen')}</Button></div></div></section>
    <Dialog open={dialog} title={t('showcase.dialogTitle')} consequence={t('showcase.consequence')} confirmLabel={t('showcase.confirm')} onClose={() => setDialog(false)} onConfirm={() => {setDialog(false);setMessage(t('showcase.dialogDone'));}} />
  </main>;
}
