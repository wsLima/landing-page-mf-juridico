-- Banco de dados do site MF Escritório Jurídico.
-- Rode este arquivo uma vez no Supabase: painel do projeto › SQL Editor › New query › colar › Run.

-- Áreas de atuação
create table if not exists public.areas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text not null default '',
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);

-- Equipe
create table if not exists public.equipe (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cargo text not null,
  oab text,
  bio text,
  foto_url text,
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);

-- Segurança: qualquer visitante pode LER (o site precisa mostrar os dados);
-- só usuários logados no painel podem criar, editar e excluir.
alter table public.areas enable row level security;
alter table public.equipe enable row level security;

drop policy if exists "areas: leitura pública" on public.areas;
create policy "areas: leitura pública" on public.areas for select to anon, authenticated using (true);
drop policy if exists "areas: edição pelo painel" on public.areas;
create policy "areas: edição pelo painel" on public.areas for all to authenticated using (true) with check (true);

drop policy if exists "equipe: leitura pública" on public.equipe;
create policy "equipe: leitura pública" on public.equipe for select to anon, authenticated using (true);
drop policy if exists "equipe: edição pelo painel" on public.equipe;
create policy "equipe: edição pelo painel" on public.equipe for all to authenticated using (true) with check (true);

-- Fotos da equipe (Storage): bucket público, só imagens de até 5 MB.
-- Visitantes não têm regra de leitura em storage.objects de propósito: as fotos abrem pelo endereço
-- público, mas ninguém de fora consegue listar os arquivos do bucket. O painel (logado) pode listar,
-- o que o Storage exige para trocar ou apagar arquivos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('equipe', 'equipe', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "fotos equipe: leitura pública" on storage.objects;
drop policy if exists "fotos equipe: leitura pelo painel" on storage.objects;
create policy "fotos equipe: leitura pelo painel" on storage.objects for select to authenticated using (bucket_id = 'equipe');
drop policy if exists "fotos equipe: envio pelo painel" on storage.objects;
create policy "fotos equipe: envio pelo painel" on storage.objects for insert to authenticated with check (bucket_id = 'equipe');
drop policy if exists "fotos equipe: troca pelo painel" on storage.objects;
create policy "fotos equipe: troca pelo painel" on storage.objects for update to authenticated using (bucket_id = 'equipe');
drop policy if exists "fotos equipe: exclusão pelo painel" on storage.objects;
create policy "fotos equipe: exclusão pelo painel" on storage.objects for delete to authenticated using (bucket_id = 'equipe');
