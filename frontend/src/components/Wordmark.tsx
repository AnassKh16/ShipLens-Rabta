import { useTranslation } from 'react-i18next';
export function Wordmark() {
  const { t } = useTranslation();
  return <span className="wordmark"><span lang="en" dir="ltr" className="wordmark-latin">{t('primitives.wordmarkLatin')}</span><span lang="ur" dir="rtl" className="wordmark-urdu">{t('primitives.wordmarkUrdu')}</span></span>;
}
