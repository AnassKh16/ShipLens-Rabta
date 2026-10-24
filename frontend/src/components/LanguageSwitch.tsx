import { useTranslation } from 'react-i18next';
export function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  return <div role="group" aria-label={t('language.label')}>
    <button type="button" lang="en" aria-pressed={i18n.language === 'en'} onClick={() => void i18n.changeLanguage('en')}>{t('language.en')}</button>
    <span aria-hidden="true"> | </span>
    <button type="button" lang="ur" aria-pressed={i18n.language === 'ur'} onClick={() => void i18n.changeLanguage('ur')}>{t('language.ur')}</button>
  </div>;
}
