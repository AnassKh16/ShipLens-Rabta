import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ur from './ur.json';
export function applyLanguage(language: string) {
  const lang = language === 'ur' ? 'ur' : 'en';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
  try { localStorage.setItem('rabta-language', lang); } catch { /* Storage may be disabled. */ }
}
let preferred = 'en';
try { preferred = localStorage.getItem('rabta-language') === 'ur' ? 'ur' : 'en'; } catch { /* English is the default. */ }
i18n.on('languageChanged', applyLanguage);
void i18n.use(initReactI18next).init({ resources: { en: { translation: en }, ur: { translation: ur } }, lng: preferred, fallbackLng: 'en', interpolation: { escapeValue: false }, initAsync: false });
applyLanguage(preferred);
export default i18n;
