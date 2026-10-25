import { useTranslation } from 'react-i18next';
export function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  return <div className="language-switch" role="group" aria-label={t('language.label')}>
    <button type="button" lang="en" aria-label={t('language.english')} aria-current={i18n.language === 'en' ? 'true' : undefined} onClick={() => void i18n.changeLanguage('en')}>{t('language.en')}</button>
    <span className="language-separator" aria-hidden="true"> | </span>
    <button type="button" lang="ur" aria-current={i18n.language === 'ur' ? 'true' : undefined} onClick={() => void i18n.changeLanguage('ur')}>{t('language.ur')}</button>
  </div>;
}
