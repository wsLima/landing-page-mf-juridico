// Google Analytics 4 com consentimento (LGPD).
// - O gtag.js só é carregado depois que o visitante aceita os cookies de medição.
// - Consent Mode v2: armazenamento de publicidade sempre negado; Google Signals desligado.
// - Nunca enviamos dados pessoais (nome, e-mail, telefone, texto de mensagens) nos eventos.
// - page_view é enviado manualmente a cada troca de rota (o site é uma SPA); /admin não é medido.
// - Em desenvolvimento, nada é enviado: os eventos aparecem no console.

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const SEND = import.meta.env.PROD;
const CONSENT_KEY = 'mf-consent-analytics';
export const OPEN_CONSENT_EVENT = 'mf:open-consent';

/** true quando há um ID do GA4 configurado (o banner de cookies só aparece nesse caso). */
export const analyticsConfigured = !!GA_ID;

export type Consent = 'granted' | 'denied';
type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

let loaded = false;
let lastPath = '';

const isUntracked = (path: string) => path.startsWith('/admin');

// O gtag.js exige o objeto `arguments`, não um array comum.
function gtag(..._args: unknown[]) {
  window.dataLayer.push(arguments);
}

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

function load() {
  if (loaded || !GA_ID || !SEND) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  gtag('js', new Date());
  gtag('config', GA_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

/** Remove os cookies _ga* quando o visitante retira o consentimento. */
function clearGaCookies() {
  const host = window.location.hostname;
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (!name.startsWith('_ga')) return;
    domains.forEach((d) => {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`;
    });
  });
}

const canTrack = () => !!GA_ID && getConsent() === 'granted' && !isUntracked(window.location.pathname);

function send(name: string, params: Params) {
  if (!SEND) {
    console.debug('[analytics]', name, params);
    return;
  }
  gtag('event', name, params);
}

export function setConsent(consent: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // sem armazenamento (navegação privada): a escolha vale só para esta visita
  }
  if (consent === 'granted') {
    load();
    if (loaded) gtag('consent', 'update', { analytics_storage: 'granted' });
    lastPath = '';
    trackPage(window.location.pathname + window.location.search);
  } else {
    if (loaded) gtag('consent', 'update', { analytics_storage: 'denied' });
    clearGaCookies();
  }
}

/** Registra a visualização de página. Mudanças só de âncora (#secao) não contam como nova página. */
export function trackPage(path: string) {
  if (!canTrack() || path === lastPath) return;
  lastPath = path;
  send('page_view', {
    page_location: window.location.origin + path,
    page_title: document.title,
  });
}

/** Evento personalizado. Use nomes recomendados do GA4 e nunca passe dados pessoais. */
export function track(name: string, params: Params = {}) {
  if (!canTrack()) return;
  send(name, params);
}

/**
 * Cliques em elementos com `data-ga-event` viram eventos, ex.:
 * <a data-ga-event="generate_lead" data-ga-method="whatsapp" data-ga-location="contato">
 */
function onClick(e: MouseEvent) {
  const el = (e.target as Element | null)?.closest<HTMLElement>('[data-ga-event]');
  if (!el) return;
  const { gaEvent, gaMethod, gaLocation } = el.dataset;
  if (gaEvent) track(gaEvent, { method: gaMethod, location: gaLocation });
}

export function initAnalytics() {
  if (!GA_ID) return;
  if (getConsent() === 'granted') load();
  document.addEventListener('click', onClick, { capture: true });
}

export function openConsentPreferences() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
