import { useState, type FormEvent } from 'react';
import { track } from '../lib/analytics';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const canSubscribe = email.indexOf('@') > 0 && consent;

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    // TODO: enviar para o serviço de newsletter (double opt-in).
    if (!canSubscribe) return;
    setSubscribed(true);
    track('sign_up', { method: 'newsletter' });
  };

  return (
    <section className="newsletter" aria-labelledby="nl-t">
      <div className="container newsletter__inner">
        <div className="newsletter__copy">
          <p className="eyebrow eyebrow--light">Newsletter</p>
          <h2 id="nl-t">Receba os novos artigos por e-mail</h2>
          <p>Conteúdo informativo, sem spam. Você pode cancelar quando quiser.</p>
        </div>
        {subscribed ? (
          <p className="newsletter__done" role="status">
            Quase lá! Enviamos um e-mail de confirmação para <strong>{email}</strong>. A inscrição é concluída após a
            confirmação.
          </p>
        ) : (
          <form className="newsletter__form" onSubmit={subscribe} aria-labelledby="nl-t">
            <div className="newsletter__row">
              <label className="sr-only" htmlFor="nl-email">Seu e-mail</label>
              <input
                id="nl-email"
                className="field"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn--accent" type="submit" disabled={!canSubscribe}>Inscrever-me</button>
            </div>
            <label className="check" htmlFor="nl-ok">
              <input id="nl-ok" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>
                Autorizo o envio de conteúdos informativos por e-mail, conforme o{' '}
                <a href="/#privacidade">aviso de privacidade</a>.
              </span>
            </label>
          </form>
        )}
      </div>
    </section>
  );
}
