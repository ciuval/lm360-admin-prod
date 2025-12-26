alter table public.abbonamenti
  add column if not exists utente_id uuid,
  add column if not exists customer_id text;

create index if not exists abbo_utente_idx on public.abbonamenti (utente_id);
create index if not exists abbo_customer_idx on public.abbonamenti (customer_id);
