import { useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import { ImageIcon } from '../components/Icons';
import { Logo } from '../components/Logo';
import { useAreas } from '../lib/content';
import { today, titleShown, type AdminPost, type Campaign, type Draft, type Screen, type Status, type Subscriber } from './types';

type Stats = { pub: number; draft: number; subs: number; camps: number };

function StatusBadge({ status }: { status: Status }) {
  return status === 'publicado'
    ? <span className="adm-badge adm-badge--pub">Publicado</span>
    : <span className="adm-badge adm-badge--draft">Rascunho</span>;
}

/* Painel */

export function Dashboard({ stats, posts, onNewPost, onEdit, go }: {
  stats: Stats;
  posts: AdminPost[];
  onNewPost: () => void;
  onEdit: (p: AdminPost) => void;
  go: (s: Screen) => void;
}) {
  const cards: [string, number][] = [
    ['Publicadas', stats.pub],
    ['Rascunhos', stats.draft],
    ['Inscritos na newsletter', stats.subs],
    ['Newsletters enviadas', stats.camps],
  ];

  return (
    <div className="adm-stack" style={{ gap: 28 }}>
      <div className="adm-head">
        <div>
          <p className="adm-kicker">Bem-vindo(a) ao painel</p>
          <h1 className="adm-title">Visão geral</h1>
        </div>
        <div className="adm-actions">
          <button className="adm-btn adm-btn--secondary" type="button" onClick={() => go('newsletter')}>Nova newsletter</button>
          <button className="adm-btn adm-btn--primary" type="button" onClick={onNewPost}>Nova publicação</button>
        </div>
      </div>
      <div className="adm-stats">
        {cards.map(([label, n]) => (
          <div key={label} className="adm-card adm-stat">
            <span>{label}</span>
            <strong>{n}</strong>
          </div>
        ))}
      </div>
      <section className="adm-card" aria-labelledby="rec-t">
        <div className="adm-card__head">
          <h2 id="rec-t" className="adm-h2">Publicações recentes</h2>
          <button className="adm-link" type="button" onClick={() => go('posts')}>Ver todas</button>
        </div>
        {posts.length === 0 ? (
          <div className="adm-empty">
            <span>Nenhuma publicação ainda.</span>
            <button className="adm-btn adm-btn--secondary" type="button" onClick={onNewPost}>Escrever a primeira</button>
          </div>
        ) : (
          posts.slice(0, 5).map((p) => (
            <div key={p.id} className="adm-recent-row">
              <button className="adm-link adm-link--title" type="button" onClick={() => onEdit(p)}>{titleShown(p)}</button>
              <span>{p.status === 'publicado' ? 'Publicado' : 'Rascunho'} · {p.date}</span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

/* Publicações */

const filterDef = [
  ['todas', 'Todas'],
  ['pub', 'Publicadas'],
  ['draft', 'Rascunhos'],
] as const;
type Filter = (typeof filterDef)[number][0];

export function PostsList({ posts, onNewPost, onEdit, onRemove }: {
  posts: AdminPost[];
  onNewPost: () => void;
  onEdit: (p: AdminPost) => void;
  onRemove: (id: number) => void;
}) {
  const [filter, setFilter] = useState<Filter>('todas');
  const listed = posts.filter((p) => filter === 'todas' || (filter === 'pub') === (p.status === 'publicado'));

  return (
    <div className="adm-stack">
      <div className="adm-head">
        <h1 className="adm-title">Publicações</h1>
        <button className="adm-btn adm-btn--primary" type="button" onClick={onNewPost}>Nova publicação</button>
      </div>
      <div className="adm-tabs" role="tablist" aria-label="Filtrar publicações">
        {filterDef.map(([key, label]) => (
          <button key={key} className="adm-tab" type="button" role="tab" aria-selected={filter === key} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>
      <div className="adm-card adm-scroll">
        <table className="adm-table" style={{ minWidth: 640 }}>
          <thead>
            <tr>
              <th scope="col">Título</th>
              <th scope="col">Categoria</th>
              <th scope="col">Status</th>
              <th scope="col">Data</th>
              <th scope="col"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody>
            {listed.map((p) => (
              <tr key={p.id}>
                <td className="cell-strong">{titleShown(p)}</td>
                <td className="cell-soft">{p.cat}</td>
                <td><StatusBadge status={p.status} /></td>
                <td className="cell-soft" style={{ whiteSpace: 'nowrap' }}>{p.date}</td>
                <td className="cell-actions">
                  <button className="adm-link" type="button" onClick={() => onEdit(p)}>Editar</button>
                  <button className="adm-link adm-link--danger" type="button" onClick={() => onRemove(p.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {listed.length === 0 && <div className="adm-empty">Nenhuma publicação neste filtro.</div>}
      </div>
    </div>
  );
}

/* Editor */

const checkLabels = [
  'Conteúdo de caráter informativo, sem promessa de resultado.',
  'Sem menção a valores, gratuidade ou formas de pagamento.',
  'Sem referência a clientes ou casos concretos identificáveis.',
  'Linguagem sóbria, sem autopromoção ou comparação com outros escritórios.',
];

const toolbar = [
  { label: 'Negrito', icon: <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />, sw: 2 },
  { label: 'Itálico', icon: <path d="M14 5h-4M14 19h-4M14 5l-4 14" /> },
  { label: 'Subtítulo', text: 'H2' },
  { label: 'Lista', icon: <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" /> },
  { label: 'Citação', icon: <path d="M5 6v12M9 8h10M9 12h10M9 16h6" /> },
  { label: 'Inserir link', icon: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /> },
];

export function Editor({ draft, setDraft, checks, setChecks, onSave, onBack }: {
  draft: Draft;
  setDraft: Dispatch<SetStateAction<Draft>>;
  checks: boolean[];
  setChecks: Dispatch<SetStateAction<boolean[]>>;
  onSave: (status: Status) => void;
  onBack: () => void;
}) {
  const { items: categorias } = useAreas();
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const canPublish = !!draft.title.trim() && checks.every(Boolean);
  const statusLabel = draft.status === 'publicado' ? 'Publicado' : draft.id == null ? 'Novo' : 'Rascunho';

  return (
    <div className="adm-stack">
      <div className="adm-head" style={{ alignItems: 'center' }}>
        <button className="adm-link adm-link--flush" type="button" onClick={onBack}>← Publicações</button>
        <div className="adm-actions">
          <button className="adm-btn adm-btn--secondary" type="button" onClick={() => onSave('rascunho')}>Salvar rascunho</button>
          <button className="adm-btn adm-btn--primary" type="button" disabled={!canPublish} onClick={() => canPublish && onSave('publicado')}>
            Publicar
          </button>
        </div>
      </div>
      <div className="adm-row">
        <div className="adm-card adm-editor">
          <label className="sr-only" htmlFor="e-title">Título da publicação</label>
          <input
            id="e-title"
            className="adm-editor__title"
            type="text"
            placeholder="Título da publicação"
            value={draft.title}
            onChange={(e) => set('title', e.target.value)}
          />
          <div className="adm-field-group">
            <label className="adm-label" htmlFor="e-resumo">
              Resumo <small>— aparece na listagem e na newsletter</small>
            </label>
            <textarea id="e-resumo" className="adm-field" rows={2} value={draft.resumo} onChange={(e) => set('resumo', e.target.value)} />
          </div>
          <div className="adm-field-group">
            <span id="e-body-l" className="adm-label">Conteúdo</span>
            <div className="adm-rte">
              <div className="adm-rte__toolbar" role="toolbar" aria-label="Formatação">
                {toolbar.map((t) =>
                  t.text ? (
                    <button key={t.label} className="adm-tool adm-tool--text" type="button" aria-label={t.label}>{t.text}</button>
                  ) : (
                    <button key={t.label} className="adm-tool" type="button" aria-label={t.label}>
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={t.sw ?? 1.8} strokeLinecap="round" strokeLinejoin="round">
                        {t.icon}
                      </svg>
                    </button>
                  ),
                )}
                <button className="adm-tool" type="button" aria-label="Inserir imagem">
                  <ImageIcon size={16} strokeWidth={1.6} />
                </button>
              </div>
              <textarea aria-labelledby="e-body-l" rows={14} value={draft.body} onChange={(e) => set('body', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="adm-side">
          <div className="adm-card adm-panel">
            <h2>Publicação</h2>
            <div className="adm-panel__kv"><span>Status</span><span>{statusLabel}</span></div>
            <div className="adm-field-group">
              <label htmlFor="e-cat">Categoria</label>
              <select id="e-cat" className="adm-field" value={draft.cat} onChange={(e) => set('cat', e.target.value)}>
                {['Geral', ...categorias.map((a) => a.nome)].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="adm-field-group">
              <span>Imagem de capa</span>
              <button className="adm-btn adm-btn--secondary adm-btn--upload" type="button">Enviar imagem</button>
            </div>
          </div>
          <fieldset className="adm-card adm-panel">
            <legend>Revisão ética</legend>
            <p className="adm-note">Confirme antes de publicar (Provimento 205/2021 da OAB).</p>
            {checkLabels.map((label, i) => (
              <label key={label} className="adm-check">
                <input
                  type="checkbox"
                  checked={checks[i]}
                  onChange={(e) => setChecks((c) => c.map((v, j) => (j === i ? e.target.checked : v)))}
                />
                <span>{label}</span>
              </label>
            ))}
            {!canPublish && <p className="adm-hint">Para publicar: título preenchido e todos os itens confirmados.</p>}
          </fieldset>
        </div>
      </div>
    </div>
  );
}

/* Newsletter */

export function NewsletterScreen({ published, subsCount, campaigns, onSend }: {
  published: AdminPost[];
  subsCount: number;
  campaigns: Campaign[];
  onSend: (c: Campaign) => void;
}) {
  const [assunto, setAssunto] = useState('');
  const [intro, setIntro] = useState('');
  const [sel, setSel] = useState<Record<number, boolean>>({});
  const selected = published.filter((p) => sel[p.id]);
  const canSend = !!assunto.trim() && subsCount > 0;

  const send = () => {
    if (!canSend) return;
    onSend({ assunto: assunto.trim(), date: today(), n: subsCount, k: selected.length });
    setAssunto('');
    setIntro('');
    setSel({});
  };

  return (
    <div className="adm-stack">
      <div className="adm-head">
        <h1 className="adm-title">Newsletter</h1>
        <span style={{ fontSize: 14, color: 'var(--muted)' }}>{subsCount} inscrito(s) ativo(s)</span>
      </div>
      <div className="adm-row">
        <div className="adm-card adm-card--pad adm-col">
          <h2 className="adm-h2">Nova edição</h2>
          <div className="adm-field-group">
            <label className="adm-label" htmlFor="n-assunto">Assunto do e-mail</label>
            <input id="n-assunto" className="adm-field" type="text" value={assunto} onChange={(e) => setAssunto(e.target.value)} />
          </div>
          <div className="adm-field-group">
            <label className="adm-label" htmlFor="n-intro">Texto de abertura</label>
            <textarea id="n-intro" className="adm-field" rows={4} value={intro} onChange={(e) => setIntro(e.target.value)} />
          </div>
          <fieldset className="adm-fieldset">
            <legend>Publicações incluídas</legend>
            {published.length === 0 && <p className="adm-note" style={{ fontSize: 14 }}>Ainda não há publicações publicadas para incluir.</p>}
            {published.map((p) => (
              <label key={p.id} className="adm-check" style={{ color: 'inherit' }}>
                <input type="checkbox" checked={!!sel[p.id]} onChange={(e) => setSel({ ...sel, [p.id]: e.target.checked })} />
                <span>{titleShown(p)}</span>
              </label>
            ))}
          </fieldset>
          <div className="adm-actions" style={{ paddingTop: 4 }}>
            <button className="adm-btn adm-btn--primary" type="button" disabled={!canSend} onClick={send}>
              Enviar para {subsCount} inscrito(s)
            </button>
          </div>
          <p className="adm-note">
            Envio apenas a quem se inscreveu e confirmou o e-mail. Todo envio inclui link de descadastro (LGPD).
          </p>
        </div>

        <div className="adm-col adm-preview-wrap">
          <span className="adm-overline">Pré-visualização</span>
          <article className="adm-card" aria-label="Pré-visualização do e-mail">
            <div className="adm-email__top">
              <Logo variant="mark" className="adm-email__logo" title="" />
              <span>Matos Franquilino Advocacia</span>
            </div>
            <div className="adm-email__body">
              <h3>{assunto.trim() || 'Assunto da newsletter'}</h3>
              <p>{intro.trim() || 'O texto de abertura aparece aqui.'}</p>
              {selected.map((p) => (
                <div key={p.id} className="adm-email__item">
                  <strong>{titleShown(p)}</strong>
                  <span>{p.resumo}</span>
                  <span>Ler no site →</span>
                </div>
              ))}
            </div>
            <div className="adm-email__foot">
              Você recebe este e-mail porque se inscreveu no site do MF Escritório Jurídico. Conteúdo de caráter
              informativo. <u>Cancelar inscrição</u>
            </div>
          </article>
        </div>
      </div>

      <section className="adm-card adm-scroll" aria-labelledby="camp-t">
        <h2 id="camp-t" className="adm-h2" style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)' }}>Edições enviadas</h2>
        {campaigns.length === 0 ? (
          <div className="adm-empty" style={{ padding: '28px 20px' }}>Nenhuma edição enviada ainda.</div>
        ) : (
          <table className="adm-table" style={{ minWidth: 520 }}>
            <thead>
              <tr><th scope="col">Assunto</th><th scope="col">Data</th><th scope="col">Destinatários</th><th scope="col">Publicações</th></tr>
            </thead>
            <tbody>
              {campaigns.map((c, i) => (
                <tr key={i}><td className="cell-strong">{c.assunto}</td><td>{c.date}</td><td>{c.n}</td><td>{c.k}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

/* Inscritos */

export function Subscribers({ subs, setSubs, setFlash }: {
  subs: Subscriber[];
  setSubs: Dispatch<SetStateAction<Subscriber[]>>;
  setFlash: (msg: string) => void;
}) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const add = (e: FormEvent) => {
    e.preventDefault();
    const addr = email.trim();
    if (!addr || addr.indexOf('@') < 1) return setFlash('Informe um e-mail válido.');
    if (subs.some((s) => s.email === addr)) return setFlash('Este e-mail já está inscrito.');
    setSubs([...subs, { nome: nome.trim() || '—', email: addr, date: today(), origem: 'Manual' }]);
    setNome('');
    setEmail('');
    setFlash('Inscrito adicionado.');
  };

  return (
    <div className="adm-stack">
      <h1 className="adm-title">Inscritos</h1>
      <form className="adm-card adm-inline-form" onSubmit={add} aria-label="Adicionar inscrito">
        <div className="adm-field-group" style={{ flex: '1 1 200px' }}>
          <label className="adm-label" htmlFor="s-nome">Nome</label>
          <input id="s-nome" className="adm-field" type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="adm-field-group" style={{ flex: '1 1 240px' }}>
          <label className="adm-label" htmlFor="s-email">E-mail</label>
          <input id="s-email" className="adm-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className="adm-btn adm-btn--primary" type="submit">Adicionar</button>
        <p className="adm-note">
          Inclua manualmente apenas quem autorizou o recebimento. Inscrições pelo site entram aqui após confirmação por e-mail.
        </p>
      </form>
      <div className="adm-card adm-scroll">
        <table className="adm-table" style={{ minWidth: 560 }}>
          <thead>
            <tr>
              <th scope="col">Nome</th><th scope="col">E-mail</th><th scope="col">Desde</th><th scope="col">Origem</th>
              <th scope="col"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.email}>
                <td className="cell-strong">{s.nome}</td>
                <td>{s.email}</td>
                <td>{s.date}</td>
                <td className="cell-soft">{s.origem}</td>
                <td className="cell-actions">
                  <button className="adm-link adm-link--danger" type="button" onClick={() => setSubs(subs.filter((x) => x.email !== s.email))}>
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subs.length === 0 && <div className="adm-empty">Nenhum inscrito ainda.</div>}
      </div>
    </div>
  );
}
