import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import App from './App';
import { CookieConsent } from './components/CookieConsent';
import { initAnalytics, trackPage } from './lib/analytics';
import './styles/global.css';

/** Scrolls to the top on route changes, or to the #section when the URL has one. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

/** Sends a page_view on each route change. Rendered after <App /> so the page has already set its title. */
function PageViewTracker() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    trackPage(pathname + search);
  }, [pathname, search]);
  return null;
}

initAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollManager />
      <App />
      <PageViewTracker />
      <CookieConsent />
    </BrowserRouter>
  </StrictMode>,
);
