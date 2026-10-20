import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsConfigured, getConsent, OPEN_CONSENT_EVENT, setConsent, type Consent } from '../lib/analytics';

// Aviso de cookies de medição (LGPD): aceitar e recusar têm o mesmo destaque,
// e a escolha pode ser revista pelo link "Preferências de cookies" no rodapé.

export function CookieConsent() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(() => analyticsConfigured && getConsent() === null);

  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!open || !analyticsConfigured || pathname.startsWith('/admin')) return null;

  const choose = (c: Consent) => {
    setConsent(c);
    setOpen(false);
  };

  return (
    <section className="consent" role="dialog" aria-modal="false" aria-labelledby="consent-t" aria-describedby="consent-d">
      <div className="consent__text">
        <h2 id="consent-t">Cookies de medição</h2>
        <p id="consent-d">
          Com a sua autorização, usamos o Google Analytics para entender, de forma agregada, como o site é visitado.
          Não usamos cookies de publicidade. <a href="/#privacidade">Saiba mais</a>.
        </p>
      </div>
      <div className="consent__actions">
        <button className="btn btn--outline btn--sm" type="button" onClick={() => choose('denied')}>Recusar</button>
        <button className="btn btn--primary btn--sm" type="button" onClick={() => choose('granted')}>Aceitar</button>
      </div>
    </section>
  );
}
