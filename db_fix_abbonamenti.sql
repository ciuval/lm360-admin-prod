-- Crea la tabella se manca (schema minimo compatibile col webhook)
create table if not exists public.abbonamenti (
  subscription_id text primary key,
  status          text,
  inizio          timestamptz,
  scadenza        timestamptz,
  price_id        text,
  ultima_modifica timestamptz,
  source          text
);

-- Se la tabella esiste già, aggiungi le colonne mancanti (safe)
alter table if exists public.abbonamenti
  add column if not exists subscription_id text,
  add column if not exists status          text,
  add column if not exists inizio          timestamptz,
  add column if not exists scadenza        timestamptz,
  add column if not exists price_id        text,
  add column if not exists ultima_modifica timestamptz,
  add column if not exists source          text;

-- Assicura univocità/PK su subscription_id
do http://localhost:3010/api/debug-abbonamenti-last
begin
  if not exists (select 1 from pg_indexes where schemaname='public' and indexname='abbonamenti_subscription_id_key') then
    create unique index abbonamenti_subscription_id_key on public.abbonamenti (subscription_id);
  end if;
end http://localhost:3010/api/debug-abbonamenti-last;

do http://localhost:3010/api/debug-abbonamenti-last
begin
  if not exists (
    select 1
    from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    join pg_namespace n on n.oid = t.relnamespace
    where c.contype='p' and t.relname='abbonamenti' and n.nspname='public'
  ) then
    alter table public.abbonamenti
      add constraint abbonamenti_pkey primary key using index abbonamenti_subscription_id_key;
  end if;
end http://localhost:3010/api/debug-abbonamenti-last;
