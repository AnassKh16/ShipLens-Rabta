import { useTranslation } from 'react-i18next';
export function EchoText({text}: {text: string}) {
  const { i18n } = useTranslation();
  const enabled = i18n.resolvedLanguage !== 'ur' && /^[\p{Script=Latin}\p{N}\p{P}\p{Zs}]+$/u.test(text);
  return <span className="echo-text"><span className="echo-original">{text}</span>{enabled && [1,2,3,4].map(layer => <span key={layer} aria-hidden="true" className={`echo-layer echo-layer--${layer}`}>{text}</span>)}</span>;
}
