# MF Escritório Jurídico — site

Site institucional, blog e área administrativa (Vite + React + TypeScript, dados no Supabase).

```sh
npm install
npm run dev      # http://localhost:5173
npm run build
```

Rotas: `/` (página única), `/blog`, `/blog/:slug`, `/admin` (área administrativa).

Copie `.env.example` para `.env.local` e preencha as variáveis.

Textos entre colchetes (`[...]`, destacados em bege no site) ainda precisam ser confirmados pelo escritório — a maior parte está em [src/content/site.ts](src/content/site.ts).

## Área administrativa

Pelo `/admin` o escritório cadastra, edita, reordena e exclui:

- **Áreas de atuação** — aparecem na seção do site e como categorias do blog;
- **Equipe** — nome, cargo, OAB (opcional), apresentação (opcional) e foto.

Publicações, newsletter e inscritos ainda são protótipo: funcionam na tela, mas não são salvos.

Sem o Supabase configurado, o painel abre em **modo demonstração** (qualquer login entra e nada é salvo).

### Ativar o Supabase (uma vez)

1. Crie uma conta e um projeto em [supabase.com](https://supabase.com) (o plano gratuito basta).
2. No projeto, abra **SQL Editor › New query**, cole o conteúdo de [supabase/schema.sql](supabase/schema.sql) e clique em **Run**.
3. Em **Authentication › Sign In / Providers**, desative **Allow new users to sign up** — assim ninguém cria conta sozinho.
4. Em **Authentication › Users › Add user**, crie o login de quem vai usar o painel (e-mail e senha, marcando *Auto Confirm User*).
5. Em **Project Settings › API**, copie a *Project URL* e a chave *anon public* para `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no `.env.local` (e nas variáveis de ambiente da hospedagem).
6. Em **Authentication › URL Configuration**, informe o endereço do site em *Site URL* (usado no link de "Esqueci minha senha").

A chave *anon* pode ficar no site: as regras do `schema.sql` só deixam visitantes **ler** os dados; criar, editar e excluir exige login no painel.

## Google Analytics 4

A medição está em [src/lib/analytics.ts](src/lib/analytics.ts) e segue a LGPD:

- o Analytics **só carrega depois que o visitante aceita** o aviso de cookies (Aceitar e Recusar têm o mesmo destaque); a escolha pode ser revista em "Preferências de cookies", no rodapé, e ao recusar os cookies `_ga` são apagados;
- Consent Mode v2 com publicidade sempre negada, Google Signals e personalização de anúncios desligados;
- **nenhum dado pessoal** (nome, e-mail, telefone, texto de mensagem) é enviado nos eventos;
- `page_view` é enviado a cada troca de página (sem duplicar e sem contar âncoras como `#contato`); o `/admin` não é medido;
- em `npm run dev` nada é enviado — os eventos aparecem no console do navegador.

Eventos enviados:

| Evento | Quando | Parâmetros |
|---|---|---|
| `generate_lead` | clique no WhatsApp, telefone ou e-mail, ou envio do formulário de contato | `method` (`whatsapp`, `telefone`, `email`, `formulario_whatsapp`), `location` (`cabecalho`, `menu_movel`, `contato`) |
| `sign_up` | inscrição na newsletter | `method: newsletter` |
| `share` | compartilhar artigo | `method` (`whatsapp`, `linkedin`, `copiar_link`), `content_type: artigo`, `item_id` |

Para marcar um novo elemento clicável, basta adicionar `data-ga-event`, `data-ga-method` e `data-ga-location` a ele.

### Configurar (uma vez)

1. Em [analytics.google.com](https://analytics.google.com), crie uma propriedade GA4 e um **fluxo de dados Web** com o endereço do site.
2. Copie o **ID da métrica** (`G-XXXXXXXXXX`) para `VITE_GA_MEASUREMENT_ID` no `.env.local` e nas variáveis da hospedagem.
3. No fluxo de dados › **Medição otimizada** › engrenagem de *Visualizações de página*: **desmarque** "Alterações de página com base em eventos do histórico do navegador" (o site já envia o `page_view`; deixar marcado duplica as contagens).
4. Em **Administrador › Coleta e retenção de dados**: deixe os **Google Signals desativados** e ajuste a **retenção de dados** para 14 meses.
5. Em **Administrador › Eventos-chave**, marque `generate_lead` e `sign_up` como eventos-chave (conversões).
6. Em **Administrador › Fluxos de dados › Configurar tag › Definir tráfego interno**, cadastre o IP do escritório e ative o filtro de tráfego interno, para não contar as próprias visitas.
7. Para conferir: aceite os cookies no site publicado e veja os eventos chegando em **Relatórios › Tempo real**.

### Hospedagem

O site é uma aplicação de página única: configure a hospedagem para responder `index.html` em qualquer rota (Vercel e Netlify detectam o Vite; na Netlify, um arquivo `public/_redirects` com `/* /index.html 200`).
