import { useState, type FormEvent } from 'react';
import { ImageIcon } from '../components/Icons';
import {
  areasApi, equipeApi, uploadFoto, useAreas, useEquipe,
  type Area, type AreaInput, type Membro, type MembroInput,
} from '../lib/content';

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

function OrderButtons({ index, total, onMove }: { index: number; total: number; onMove: (dir: -1 | 1) => void }) {
  return (
    <span className="adm-order">
      <button className="adm-tool" type="button" aria-label="Mover para cima" disabled={index === 0} onClick={() => onMove(-1)}>↑</button>
      <button className="adm-tool" type="button" aria-label="Mover para baixo" disabled={index === total - 1} onClick={() => onMove(1)}>↓</button>
    </span>
  );
}

/* Áreas de atuação */

const emptyArea: AreaInput = { nome: '', descricao: '' };

export function AreasScreen({ setFlash }: { setFlash: (msg: string) => void }) {
  const { items, loading, error, reload } = useAreas();
  const [editing, setEditing] = useState<Area | 'new' | null>(null);
  const [form, setForm] = useState<AreaInput>(emptyArea);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  const open = (a: Area | 'new') => {
    setEditing(a);
    setForm(a === 'new' ? emptyArea : { nome: a.nome, descricao: a.descricao });
    setFormError('');
  };

  const run = async (action: () => Promise<void>, msg: string) => {
    setBusy(true);
    try {
      await action();
      await reload();
      setFlash(msg);
      return true;
    } catch (e) {
      setFormError(errMsg(e));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) return setFormError('Informe o nome da área.');
    const id = editing && editing !== 'new' ? editing.id : null;
    const values = { nome: form.nome.trim(), descricao: form.descricao.trim() };
    if (await run(() => areasApi.save(id, values), id ? 'Área atualizada.' : 'Área criada.')) setEditing(null);
  };

  const removeArea = (a: Area) => {
    if (!window.confirm(`Excluir a área "${a.nome}"? Ela deixa de aparecer no site.`)) return;
    run(() => areasApi.remove(a.id), 'Área excluída.');
    if (editing !== 'new' && editing?.id === a.id) setEditing(null);
  };

  const move = (i: number, dir: -1 | 1) => run(() => areasApi.swap(items[i], items[i + dir]), 'Ordem atualizada.');

  return (
    <div className="adm-stack">
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Áreas de atuação</h1>
          <p className="adm-note">Aparecem na seção “Áreas de Atuação” do site e como categorias do blog, nesta ordem.</p>
        </div>
        <button className="adm-btn adm-btn--primary" type="button" onClick={() => open('new')}>Nova área</button>
      </div>

      {error && <p className="adm-error" role="alert">Não foi possível carregar as áreas: {error}</p>}

      {editing && (
        <form className="adm-card adm-card--pad" onSubmit={submit} aria-labelledby="area-form-t">
          <h2 id="area-form-t" className="adm-h2">{editing === 'new' ? 'Nova área de atuação' : 'Editar área de atuação'}</h2>
          <div className="adm-field-group">
            <label className="adm-label" htmlFor="a-nome">Nome</label>
            <input id="a-nome" className="adm-field" type="text" placeholder="Ex.: Direito de Família" value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="adm-field-group">
            <label className="adm-label" htmlFor="a-desc">Descrição <small>— texto curto e informativo</small></label>
            <textarea id="a-desc" className="adm-field" rows={3} value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          </div>
          {formError && <p className="adm-error" role="alert">{formError}</p>}
          <div className="adm-actions">
            <button className="adm-btn adm-btn--primary" type="submit" disabled={busy}>{busy ? 'Salvando…' : 'Salvar'}</button>
            <button className="adm-btn adm-btn--secondary" type="button" onClick={() => setEditing(null)}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="adm-card adm-scroll">
        <table className="adm-table" style={{ minWidth: 560 }}>
          <thead>
            <tr>
              <th scope="col">Ordem</th><th scope="col">Nome</th><th scope="col">Descrição</th>
              <th scope="col"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody>
            {items.map((a, i) => (
              <tr key={a.id}>
                <td><OrderButtons index={i} total={items.length} onMove={(d) => move(i, d)} /></td>
                <td className="cell-strong">{a.nome}</td>
                <td className="cell-soft adm-clamp">{a.descricao}</td>
                <td className="cell-actions">
                  <button className="adm-link" type="button" onClick={() => open(a)}>Editar</button>
                  <button className="adm-link adm-link--danger" type="button" onClick={() => removeArea(a)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && items.length === 0 && <div className="adm-empty">Nenhuma área cadastrada. A seção fica oculta no site.</div>}
        {loading && <div className="adm-empty">Carregando…</div>}
      </div>
    </div>
  );
}

/* Equipe */

const emptyMembro: MembroInput = { nome: '', cargo: '', oab: '', bio: '', foto_url: null };

export function EquipeScreen({ setFlash }: { setFlash: (msg: string) => void }) {
  const { items, loading, error, reload } = useEquipe();
  const [editing, setEditing] = useState<Membro | 'new' | null>(null);
  const [form, setForm] = useState<MembroInput>(emptyMembro);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');

  const open = (m: Membro | 'new') => {
    setEditing(m);
    setForm(m === 'new' ? emptyMembro : { nome: m.nome, cargo: m.cargo, oab: m.oab ?? '', bio: m.bio ?? '', foto_url: m.foto_url });
    setFormError('');
  };

  const run = async (action: () => Promise<void>, msg: string) => {
    setBusy(true);
    try {
      await action();
      await reload();
      setFlash(msg);
      return true;
    } catch (e) {
      setFormError(errMsg(e));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const pickPhoto = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return setFormError('Escolha um arquivo de imagem (JPG, PNG ou WebP).');
    if (file.size > 5 * 1024 * 1024) return setFormError('A foto deve ter no máximo 5 MB.');
    setUploading(true);
    setFormError('');
    try {
      const url = await uploadFoto(file);
      setForm((f) => ({ ...f, foto_url: url }));
    } catch (e) {
      setFormError(`Não foi possível enviar a foto: ${errMsg(e)}`);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.cargo.trim()) return setFormError('Informe nome e cargo.');
    const id = editing && editing !== 'new' ? editing.id : null;
    const values: MembroInput = {
      nome: form.nome.trim(),
      cargo: form.cargo.trim(),
      oab: form.oab?.trim() || null,
      bio: form.bio?.trim() || null,
      foto_url: form.foto_url,
    };
    if (await run(() => equipeApi.save(id, values), id ? 'Cadastro atualizado.' : 'Pessoa cadastrada na equipe.')) setEditing(null);
  };

  const removeMembro = (m: Membro) => {
    if (!window.confirm(`Remover ${m.nome} da equipe? A pessoa deixa de aparecer no site.`)) return;
    run(() => equipeApi.remove(m.id), 'Pessoa removida da equipe.');
    if (editing !== 'new' && editing?.id === m.id) setEditing(null);
  };

  const move = (i: number, dir: -1 | 1) => run(() => equipeApi.swap(items[i], items[i + dir]), 'Ordem atualizada.');

  return (
    <div className="adm-stack">
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Equipe</h1>
          <p className="adm-note">Aparecem na seção “Equipe” do site, nesta ordem.</p>
        </div>
        <button className="adm-btn adm-btn--primary" type="button" onClick={() => open('new')}>Cadastrar pessoa</button>
      </div>

      {error && <p className="adm-error" role="alert">Não foi possível carregar a equipe: {error}</p>}

      {editing && (
        <form className="adm-card adm-card--pad" onSubmit={submit} aria-labelledby="membro-form-t">
          <h2 id="membro-form-t" className="adm-h2">{editing === 'new' ? 'Cadastrar pessoa' : 'Editar cadastro'}</h2>
          <div className="adm-member-form">
            <div className="adm-photo-field">
              {form.foto_url
                ? <img className="adm-photo" src={form.foto_url} alt="Foto atual" />
                : <div className="adm-photo adm-photo--empty"><ImageIcon size={28} strokeWidth={1.4} /></div>}
              <label className="adm-btn adm-btn--secondary adm-file">
                {uploading ? 'Enviando…' : form.foto_url ? 'Trocar foto' : 'Enviar foto'}
                <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading}
                  onChange={(e) => { pickPhoto(e.target.files?.[0]); e.target.value = ''; }} />
              </label>
              {form.foto_url && (
                <button className="adm-link adm-link--danger" type="button" onClick={() => setForm({ ...form, foto_url: null })}>Remover foto</button>
              )}
            </div>
            <div className="adm-member-fields">
              <div className="adm-field-group">
                <label className="adm-label" htmlFor="m-nome">Nome</label>
                <input id="m-nome" className="adm-field" type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div className="adm-field-group">
                <label className="adm-label" htmlFor="m-cargo">Cargo</label>
                <input id="m-cargo" className="adm-field" type="text" placeholder="Ex.: Advogada, Secretária, Estagiário" value={form.cargo}
                  onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
              </div>
              <div className="adm-field-group">
                <label className="adm-label" htmlFor="m-oab">OAB <small>— opcional, só para advogados(as)</small></label>
                <input id="m-oab" className="adm-field" type="text" placeholder="Ex.: OAB/AM 12.345" value={form.oab ?? ''}
                  onChange={(e) => setForm({ ...form, oab: e.target.value })} />
              </div>
              <div className="adm-field-group">
                <label className="adm-label" htmlFor="m-bio">Apresentação <small>— opcional</small></label>
                <textarea id="m-bio" className="adm-field" rows={3} placeholder="Formação e áreas em que atua." value={form.bio ?? ''}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              </div>
            </div>
          </div>
          {formError && <p className="adm-error" role="alert">{formError}</p>}
          <div className="adm-actions">
            <button className="adm-btn adm-btn--primary" type="submit" disabled={busy || uploading}>{busy ? 'Salvando…' : 'Salvar'}</button>
            <button className="adm-btn adm-btn--secondary" type="button" onClick={() => setEditing(null)}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="adm-card adm-scroll">
        <table className="adm-table" style={{ minWidth: 620 }}>
          <thead>
            <tr>
              <th scope="col">Ordem</th><th scope="col">Pessoa</th><th scope="col">Cargo</th><th scope="col">OAB</th>
              <th scope="col"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody>
            {items.map((m, i) => (
              <tr key={m.id}>
                <td><OrderButtons index={i} total={items.length} onMove={(d) => move(i, d)} /></td>
                <td>
                  <span className="adm-person">
                    {m.foto_url
                      ? <img className="adm-thumb" src={m.foto_url} alt="" />
                      : <span className="adm-thumb adm-thumb--empty" aria-hidden="true" />}
                    <span className="cell-strong">{m.nome}</span>
                  </span>
                </td>
                <td className="cell-soft">{m.cargo}</td>
                <td className="cell-soft">{m.oab || '—'}</td>
                <td className="cell-actions">
                  <button className="adm-link" type="button" onClick={() => open(m)}>Editar</button>
                  <button className="adm-link adm-link--danger" type="button" onClick={() => removeMembro(m)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && items.length === 0 && <div className="adm-empty">Ninguém cadastrado. A seção fica oculta no site.</div>}
        {loading && <div className="adm-empty">Carregando…</div>}
      </div>
    </div>
  );
}
