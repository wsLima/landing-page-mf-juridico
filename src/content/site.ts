// Conteúdo institucional. Itens entre colchetes ainda precisam ser confirmados pelo escritório.

export const INSTAGRAM_URL = 'https://www.instagram.com/mfescritoriojuridico/';
export const INSTAGRAM_HANDLE = '@mfescritoriojuridico';

// Áreas de atuação e equipe são cadastradas pela área administrativa (/admin) e ficam no Supabase.
// As listas abaixo são só demonstração: aparecem enquanto o Supabase não estiver configurado (ver README).
export const areasDemo = [1, 2, 3, 4].map((n) => ({
  nome: `[Área de atuação ${n}]`,
  descricao: '[Descrição informativa curta sobre os temas atendidos nesta área.]',
}));

export const equipeDemo = [
  { nome: '[Nome do(a) advogado(a)]', cargo: 'Advogado(a) responsável', oab: '[OAB/AM 000.000]', bio: '[Formação e principais áreas de atuação.]' },
  { nome: '[Nome do(a) advogado(a)]', cargo: 'Advogado(a)', oab: '[OAB/AM 000.000]', bio: '[Formação e principais áreas de atuação.]' },
  { nome: '[Nome do(a) colaborador(a)]', cargo: '[Cargo — ex.: Secretária, Estagiário(a)]' },
];

export const valores = [
  {
    title: 'Ética profissional',
    desc: 'Atuação em conformidade com o Código de Ética e Disciplina da OAB e com o dever de sigilo.',
  },
  {
    title: 'Atendimento humanizado',
    desc: 'Escuta atenta e respeito à história e ao momento de cada pessoa atendida.',
  },
  {
    title: 'Clareza na comunicação',
    desc: 'Explicações objetivas, em linguagem acessível, sobre cada etapa e suas possibilidades.',
  },
  {
    title: 'Compromisso e responsabilidade',
    desc: 'Dedicação diligente a cada demanda, com transparência sobre prazos e andamento.',
  },
];

export const RAZAO_SOCIAL = 'Matos Franquilino Advocacia';

export const contato = {
  telefones: [
    { label: '(92) 98236-3086', tel: '+5592982363086' },
    { label: '(92) 99466-2923', tel: '+5592994662923' },
  ],
  email: 'mfescritoriojuridico@gmail.com',
  endereco: '[Endereço completo do atendimento presencial]',
  horario: 'Segunda a sexta, das 8h às 17h30',
  atendimento: [
    { title: 'Atendimento online', desc: 'Mediante agendamento' },
    { title: 'Atendimento presencial', desc: 'Exclusivamente sob agendamento' },
  ],
};

const areaLabels = areasDemo.map((a) => a.nome);

export type Post = { slug: string; title: string; cat: string };

export const posts: Post[] = [1, 2, 3, 4, 5, 6].map((n) => ({
  slug: `artigo-${n}`,
  title: `[Título do artigo ${n}]`,
  cat: areaLabels[(n - 1) % areaLabels.length],
}));
