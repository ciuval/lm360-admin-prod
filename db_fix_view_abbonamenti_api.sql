create or replace view public.abbonamenti_api as
select
  utente_id,
  subscription_id,
  status,
  inizio,
  ultima_modifica,
  scadenza,
  price_id,
  source,        -- mantieni il nome/posizione esistente
  customer_id    -- nuova colonna aggiunta in coda
from public.abbonamenti;
