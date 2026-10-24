import { useTranslation } from 'react-i18next';
export default function AdminRoutes() {
  const { t } = useTranslation();
  return <main id="main"><h1>{t('foundation.adminTitle')}</h1><p>{t('foundation.adminBody')}</p></main>;
}
