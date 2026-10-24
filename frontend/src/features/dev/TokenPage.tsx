import { useEffect, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import './tokens-preview.css';
const colors = ['paper','white','ink','ground-dark','footer','muted','hairline','hairline-on-dark','echo-1','echo-2','echo-3','echo-4','primary','primary-hover','accent-mint','chart-2','chart-3','danger','danger-tint'];
const scales = ['display','h1','h2','h3','body','ui','label'];
const spaces = [4,8,12,16,24,32,48,64,96,128];
function rgba(value: string): number[] {
  if (value.startsWith('#')) return [...value.slice(1).match(/../g)!.map(v => parseInt(v,16)), 1];
  const values = value.match(/[\d.]+/g)!.map(Number);
  return [values[0],values[1],values[2],values[3] ?? 1];
}
function luminance(values: number[]) {
  const linear = values.slice(0,3).map(v => { const c = v / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; });
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
}
export function contrast(foreground: string, background: string) {
  const fg = rgba(foreground), bg = rgba(background);
  const mixed = fg.slice(0,3).map((v,i) => v * fg[3] + bg[i] * (1 - fg[3]));
  const a = luminance(mixed), b = luminance(bg);
  return ((Math.max(a,b) + .05) / (Math.min(a,b) + .05)).toFixed(2);
}
export default function TokenPage() {
  const { t } = useTranslation();
  const [ratios, setRatios] = useState<Record<string, string[]>>({});
  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const get = (name: string) => style.getPropertyValue(`--${name}`).trim();
    setRatios(Object.fromEntries(colors.map(name => [name, [contrast(get(name),get('paper')), contrast(get(name),get('ground-dark'))]])));
  }, []);
  return <main id="main" className="token-page"><h1>{t('tokens.title')}</h1><p>{t('tokens.intro')}</p>
    <section><h2>{t('tokens.colors')}</h2><p>{t('tokens.alpha')}</p><ul className="swatches">{colors.map(name => <li key={name}>
      <span className="swatch" style={{ background: `var(--${name})` }} aria-hidden="true" />
      <code>{`--${name}`}</code><span>{t('tokens.paper')}{': '}{t('tokens.ratio',{ value: ratios[name]?.[0] ?? '…' })}</span><span>{t('tokens.dark')}{': '}{t('tokens.ratio',{value:ratios[name]?.[1] ?? '…'})}</span>
    </li>)}</ul></section>
    <section><h2>{t('tokens.type')}</h2>{scales.map(scale => <div className="type-row" key={scale}>
      <code>{`--${scale}`}</code><p lang="en" style={{fontSize:`var(--${scale})`}}>{t('tokens.sampleEn')}</p><p lang="ur" dir="rtl" style={{fontSize:`var(--${scale})`}}>{t('tokens.sampleUr')}</p>
    </div>)}</section>
    <section><h2>{t('tokens.spacing')}</h2><ul className="spacing-list">{spaces.map(value => <li key={value}><code>{`--space-${value}`}</code><span className="spacing-bar" style={{'--sample-space':`var(--space-${value})`} as CSSProperties} aria-hidden="true" /><span>{t('tokens.space',{value})}</span></li>)}</ul></section>
  </main>;
}
