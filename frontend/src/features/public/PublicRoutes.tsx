import { Link, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
function Foundation() {
  const { t } = useTranslation();
  return <main id="main"><h1>{t('foundation.title')}</h1><p>{t('foundation.body')}</p>{import.meta.env.DEV && <Link to="/dev/tokens">{t('foundation.devLink')}</Link>}</main>;
}
function NotFound() { const { t } = useTranslation(); return <main id="main"><h1>{t('common.notFound')}</h1><Link to="/">{t('nav.home')}</Link></main>; }
export default function PublicRoutes() { return <Routes><Route index element={<Foundation />} /><Route path="*" element={<NotFound />} /></Routes>; }
