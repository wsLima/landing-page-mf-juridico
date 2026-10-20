import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CloseIcon } from '../components/Icons';
import { Logo } from '../components/Logo';
import { isDemo } from '../lib/content';
import { supabase } from '../lib/supabase';
import { usePageTitle } from '../lib/usePageTitle';
import '../styles/admin.css';
import { AreasScreen, EquipeScreen } from './cadastros';
import { Dashboard, Editor, NewsletterScreen, PostsList, Subscribers } from './screens';
import { emptyDraft, today, type AdminPost, type Campaign, type Draft, type Screen, type Status, type Subscriber } from './types';

const navDef: [Screen, string][] = [
  ['painel', 'Painel'],
  ['posts', 'Publicações'],
  ['areas', 'Áreas de atuação'],
  ['equipe', 'Equipe'],
  ['newsletter', 'Newsletter'],
  ['inscritos', 'Inscritos'],
];

/**
 * Área administrativa. Áreas de atuação e equipe são salvas no Supabase (quando configurado);
 * publicações, newsletter e inscritos ainda são protótipo e vivem só na memória do navegador.
 */
export default function Admin() {
  usePageTitle('Área administrativa — MF Escritório Jurídico');

  const [screen, setScreen] = useState<Screen>('login');
  const [checkingSession, setCheckingSession] = useState(!!supabase);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setScreen('painel');
      setCheckingSession(false);
    });
  }, []);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [nextId, setNextId] = useState(1);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [checks, setChecks] = useState([false, false, false, false]);
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [flash, setFlash] = useState('');

  const go = (s: Screen) => {
    setScreen(s);
    setFlash('');
  };

  const openDraft = (p: AdminPost | null) => {
    setScreen('editor');
    setFlash('');
    setChecks([false, false, false, false]);
    setDraft(p ? { id: p.id, title: p.title, cat: p.cat, resumo: p.resumo, body: p.body, status: p.status } : emptyDraft());
  };

  const savePost = (status: Status) => {
    let id = draft.id;
    const rec: Omit<AdminPost, 'id'> = { title: draft.title, cat: draft.cat, resumo: draft.resumo, body: draft.body, status, date: today() };
    if (id == null) {
      id = nextId;
      setNextId(nextId + 1);
      setPosts([{ ...rec, id }, ...posts]);
    } else {
      const existing = id;
      setPosts(posts.map((p) => (p.id === existing ? { ...rec, id: existing } : p)));
    }
    setDraft({ ...draft, id, status });
    setFlash(status === 'publicado' ? 'Publicação publicada no site.' : 'Rascunho salvo.');
  };

  const removePost = (id: number) => {
    setPosts(posts.filter((p) => p.id !== id));
    setFlash('Publicação excluída.');
  };

  const logout = async () => {
    await supabase?.auth.signOut();
    go('login');
  };

  if (checkingSession) return <div className="admin" aria-busy="true" />;

  if (screen === 'login') {
    return (
      <div className="admin">
        <Login onLogin={() => go('painel')} />
      </div>
    );
  }

  const activeNav = screen === 'editor' ? 'posts' : screen;
  const published = posts.filter((p) => p.status === 'publicado');
  const stats = { pub: published.length, draft: posts.length - published.length, subs: subs.length, camps: campaigns.length };

  return (
    <div className="admin">
      <div className="adm-shell">
        <aside className="adm-sidebar">
          <div className="adm-sidebar__brand">
            <Logo variant="mark" className="adm-sidebar__logo" title="" />
            <span className="adm-sidebar__name">
              <strong>Matos Franquilino</strong>
              <span>Painel</span>
            </span>
          </div>
          <nav aria-label="Menu do painel">
            {navDef.map(([key, label]) => (
              <button
                key={key}
                className="adm-nav-item"
                type="button"
                aria-current={activeNav === key ? 'page' : undefined}
                onClick={() => go(key)}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="adm-sidebar__foot">
            <Link className="adm-nav-item" to="/">Ver site</Link>
            <button className="adm-nav-item" type="button" onClick={logout}>Sair</button>
          </div>
        </aside>

        <main className="adm-main">
          {isDemo && (
            <p className="adm-demo" role="note">
              Modo demonstração: o banco de dados ainda não foi configurado, então as alterações somem ao recarregar a
              página. Veja o README para ativar o Supabase.
            </p>
          )}
          {flash && (
            <div className="adm-flash" role="status">
              <span>{flash}</span>
              <button className="adm-tool" type="button" aria-label="Fechar aviso" onClick={() => setFlash('')}>
                <CloseIcon />
              </button>
            </div>
          )}

          {screen === 'painel' && (
            <Dashboard stats={stats} posts={posts} onNewPost={() => openDraft(null)} onEdit={openDraft} go={go} />
          )}
          {screen === 'posts' && (
            <PostsList posts={posts} onNewPost={() => openDraft(null)} onEdit={openDraft} onRemove={removePost} />
          )}
          {screen === 'editor' && (
            <Editor
              draft={draft}
              setDraft={setDraft}
              checks={checks}
              setChecks={setChecks}
              onSave={savePost}
              onBack={() => go('posts')}
            />
          )}
          {screen === 'areas' && <AreasScreen setFlash={setFlash} />}
          {screen === 'equipe' && <EquipeScreen setFlash={setFlash} />}
          {screen === 'newsletter' && (
            <NewsletterScreen
              published={published}
              subsCount={subs.length}
              campaigns={campaigns}
              onSend={(c) => {
                setCampaigns([c, ...campaigns]);
                setFlash('Newsletter enviada (simulação do protótipo).');
              }}
            />
          )}
          {screen === 'inscritos' && <Subscribers subs={subs} setSubs={setSubs} setFlash={setFlash} />}
        </main>
      </div>
    </div>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return onLogin();
    setBusy(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
    setBusy(false);
    if (error) setError('E-mail ou senha incorretos.');
    else onLogin();
  };

  const forgot = async () => {
    if (!supabase) return;
    if (!email.trim()) return setError('Digite seu e-mail acima para receber o link de nova senha.');
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/admin` });
    setError(error ? 'Não foi possível enviar o e-mail. Tente novamente.' : 'Se o e-mail estiver cadastrado, você receberá um link para criar nova senha.');
  };

  return (
    <main className="adm-login">
      <form onSubmit={submit} aria-labelledby="login-t">
        <div className="adm-login__brand">
          <Logo variant="mark" className="adm-login__logo" title="Matos Franquilino Advocacia" />
          <span className="adm-login__kicker">Área restrita</span>
        </div>
        <h1 id="login-t">Entrar no painel</h1>
        <div className="adm-field-group">
          <label className="adm-label" htmlFor="l-email">E-mail</label>
          <input id="l-email" className="adm-field" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="adm-field-group">
          <label className="adm-label" htmlFor="l-senha">Senha</label>
          <input id="l-senha" className="adm-field" type="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </div>
        {error && <p className="adm-error" role="alert">{error}</p>}
        <button className="adm-btn adm-btn--primary" type="submit" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
        {supabase && <button className="adm-link" type="button" onClick={forgot}>Esqueci minha senha</button>}
        {!supabase && <p className="adm-note">Modo demonstração: qualquer valor acessa o painel.</p>}
      </form>
    </main>
  );
}
