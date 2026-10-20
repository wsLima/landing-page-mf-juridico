export type Status = 'rascunho' | 'publicado';

export type AdminPost = {
  id: number;
  title: string;
  cat: string;
  resumo: string;
  body: string;
  status: Status;
  date: string;
};

export type Draft = Omit<AdminPost, 'id' | 'date'> & { id: number | null };

export type Subscriber = { nome: string; email: string; date: string; origem: string };

export type Campaign = { assunto: string; date: string; n: number; k: number };

export type Screen = 'login' | 'painel' | 'posts' | 'editor' | 'areas' | 'equipe' | 'newsletter' | 'inscritos';

export const emptyDraft = (): Draft => ({ id: null, title: '', cat: 'Geral', resumo: '', body: '', status: 'rascunho' });

export const today = () => new Date().toLocaleDateString('pt-BR');

export const titleShown = (p: { title: string }) => p.title || '(sem título)';
