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

### Hospedagem

O site é uma aplicação de página única: configure a hospedagem para responder `index.html` em qualquer rota (Vercel e Netlify detectam o Vite; na Netlify, um arquivo `public/_redirects` com `/* /index.html 200`).
