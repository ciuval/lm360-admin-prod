drop view if exists public.abbonamenti_api;

create view public.abbonamenti_api as
select
  utente_id,
  subscription_id,
  status,
  inizio,
  ultima_modifica,
  scadenza,
  price_id,
  source,
  customer_id
from public.abbonamenti;

grant select on public.abbonamenti_api to anon, authenticated;
