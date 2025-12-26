-- Abilita funzione uuid_generate_v4 se non c'è
create extension if not exists "uuid-ossp";

-- Crea la tabella se non esiste (schema base coerente col feed)
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  content text not null check (char_length(content) between 1 and 2000),
  image_path text,
  visibility text not null default 'public' check (visibility in ('public','premium')),
  likes_count int not null default 0,
  created_at timestamptz not null default now()
);

-- Se esiste 'utente_id' e manca 'user_id' -> rinomina
do $base/api/posts-list
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='posts' and column_name='utente_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='posts' and column_name='user_id'
  ) then
    execute 'alter table public.posts rename column utente_id to user_id';
  end if;
end $base/api/posts-list;

-- Se ancora manca 'user_id' -> aggiungi
do $base/api/posts-list
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='posts' and column_name='user_id'
  ) then
    execute 'alter table public.posts add column user_id uuid';
  end if;
end $base/api/posts-list;

-- Se c'è ancora la colonna vecchia, copia i valori (best-effort)
do $base/api/posts-list
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='posts' and column_name='utente_id'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='posts' and column_name='user_id'
  ) then
    execute 'update public.posts set user_id = utente_id where user_id is null';
  end if;
end $base/api/posts-list;

-- RLS & policy coerenti con 'user_id'
alter table public.posts enable row level security;

drop policy if exists "read public posts" on public.posts;
drop policy if exists "read own" on public.posts;
drop policy if exists "insert own" on public.posts;

create policy "read public posts" on public.posts
for select using (visibility = 'public');

create policy "read own" on public.posts
for select using (auth.uid() = user_id);

create policy "insert own" on public.posts
for insert with check (auth.uid() = user_id);

-- Indici utili
create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_user_id_idx   on public.posts (user_id);
