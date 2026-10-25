import { Component, lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from '../components/LanguageSwitch';
import i18n from '../i18n';
const PublicRoutes = lazy(() => import('../features/public/PublicRoutes'));
const AdminRoutes = lazy(() => import('../features/admin/AdminRoutes'));
// Vite removes this import and its entire chunk from production builds.
const TokenPage = import.meta.env.DEV ? lazy(() => import('../features/dev/TokenPage')) : null;
const ComponentsPage = import.meta.env.DEV ? lazy(() => import('../features/dev/ComponentsPage')) : null;
const queryClient = new QueryClient();
class PageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <main id="main"><p role="alert">{i18n.t('common.error')}</p><button onClick={() => window.location.reload()}>{i18n.t('common.retry')}</button></main> : this.props.children;
  }
}
export function App() {
  const { t } = useTranslation();
  return <QueryClientProvider client={queryClient}><BrowserRouter>
    <a className="skip-link" href="#main">{t('common.skip')}</a>
    <header className="app-header"><Link to="/">{t('brand')}</Link><LanguageSwitch /></header>
    <PageBoundary><Suspense fallback={<main id="main" aria-busy="true"><p role="status">{t('common.loading')}</p></main>}>
      <Routes><Route path="/admin/*" element={<AdminRoutes />} />
        {ComponentsPage && <Route path="/dev/components" element={<ComponentsPage />} />}
        {TokenPage && <Route path="/dev/tokens" element={<TokenPage />} />}
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </Suspense></PageBoundary>
  </BrowserRouter></QueryClientProvider>;
}
