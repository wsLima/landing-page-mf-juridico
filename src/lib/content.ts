import { useCallback, useEffect, useState } from 'react';
import { areasDemo, equipeDemo } from '../content/site';
import { supabase } from './supabase';

// Áreas de atuação e equipe. Com o Supabase configurado, tudo é lido e salvo nas tabelas `areas` e `equipe`
// (supabase/schema.sql). Sem ele, os dados ficam na memória do navegador (modo demonstração).

export type Area = { id: string; nome: string; descricao: string; ordem: number };
export type Membro = {
  id: string;
  nome: string;
  cargo: string;
  oab: string | null;
  bio: string | null;
  foto_url: string | null;
  ordem: number;
};

export type AreaInput = Omit<Area, 'id' | 'ordem'>;
export type MembroInput = Omit<Membro, 'id' | 'ordem'>;

export const isDemo = !supabase;
export const isPlaceholder = (s?: string | null) => !!s && s.startsWith('[');

const PHOTO_BUCKET = 'equipe';

let demoAreas: Area[] = areasDemo.map((a, i) => ({ ...a, id: `demo-area-${i}`, ordem: i }));
let demoEquipe: Membro[] = equipeDemo.map((m, i) => ({
  oab: null, bio: null, ...m, foto_url: null, id: `demo-membro-${i}`, ordem: i,
}));
let demoSeq = 0;

type Table = 'areas' | 'equipe';
type Row = { id: string; ordem: number };

function demoList(table: Table): Row[] {
  return table === 'areas' ? demoAreas : demoEquipe;
}

function setDemoList(table: Table, rows: Row[]) {
  if (table === 'areas') demoAreas = rows as Area[];
  else demoEquipe = rows as Membro[];
}

async function list<T extends Row>(table: Table): Promise<T[]> {
  if (!supabase) return [...demoList(table)].sort((a, b) => a.ordem - b.ordem) as T[];
  const { data, error } = await supabase.from(table).select('*').order('ordem').order('created_at');
  if (error) throw error;
  return data as T[];
}

async function save<T extends Row>(table: Table, id: string | null, values: Partial<T>): Promise<void> {
  if (!supabase) {
    const rows = demoList(table);
    if (id) setDemoList(table, rows.map((r) => (r.id === id ? { ...r, ...values } : r)));
    else setDemoList(table, [...rows, { ...values, id: `demo-${table}-new-${demoSeq++}`, ordem: Math.max(-1, ...rows.map((r) => r.ordem)) + 1 } as Row]);
    return;
  }
  if (id) {
    const { error } = await supabase.from(table).update(values as Record<string, unknown>).eq('id', id);
    if (error) throw error;
  } else {
    const { data: last } = await supabase.from(table).select('ordem').order('ordem', { ascending: false }).limit(1);
    const ordem = last && last.length ? last[0].ordem + 1 : 0;
    const { error } = await supabase.from(table).insert({ ...values, ordem });
    if (error) throw error;
  }
}

async function remove(table: Table, id: string): Promise<void> {
  if (!supabase) {
    setDemoList(table, demoList(table).filter((r) => r.id !== id));
    return;
  }
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

/** Troca a posição de dois itens vizinhos (botões ↑ ↓ do painel). */
async function swap(table: Table, a: Row, b: Row): Promise<void> {
  if (!supabase) {
    setDemoList(table, demoList(table).map((r) => (r.id === a.id ? { ...r, ordem: b.ordem } : r.id === b.id ? { ...r, ordem: a.ordem } : r)));
    return;
  }
  // Se duas linhas tiverem a mesma ordem, usa as posições na lista para garantir a troca.
  const [oa, ob] = a.ordem === b.ordem ? [a.ordem, a.ordem + 1] : [a.ordem, b.ordem];
  const r1 = await supabase.from(table).update({ ordem: ob }).eq('id', a.id);
  if (r1.error) throw r1.error;
  const r2 = await supabase.from(table).update({ ordem: oa }).eq('id', b.id);
  if (r2.error) throw r2.error;
}

export const areasApi = {
  list: () => list<Area>('areas'),
  save: (id: string | null, v: AreaInput) => save<Area>('areas', id, v),
  remove: (id: string) => remove('areas', id),
  swap: (a: Area, b: Area) => swap('areas', a, b),
};

export const equipeApi = {
  list: () => list<Membro>('equipe'),
  save: (id: string | null, v: MembroInput) => save<Membro>('equipe', id, v),
  remove: (id: string) => remove('equipe', id),
  swap: (a: Membro, b: Membro) => swap('equipe', a, b),
};

/** Envia a foto para o Storage do Supabase e devolve o endereço público. */
export async function uploadFoto(file: File): Promise<string> {
  if (!supabase) return URL.createObjectURL(file);
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}

function useList<T>(load: () => Promise<T[]>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try {
      setItems(await load());
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, loading, error, reload };
}

export const useAreas = () => useList(areasApi.list);
export const useEquipe = () => useList(equipeApi.list);
