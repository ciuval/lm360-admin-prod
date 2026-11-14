-- LoveMatch360: SECURITY GATES · SOLO LETTURA
-- Non modifica database, ruoli, tabelle, policy, trigger o funzioni.
-- Non estrae righe utenti, profili, like, match o messaggi.
-- Uso: verificare gli esiti in una sessione autenticata di amministrazione DB.
-- La sola lettura dei metadati NON sostituisce test Auth/RLS con utenti sintetici.

WITH watched AS (
  SELECT name FROM (VALUES
    ('profili'), ('profili_foto'), ('likes'), ('match_scores'), ('messaggi')
  ) AS t(name)
), status AS (
  SELECT w.name,
         c.oid IS NOT NULL AS exists_in_public,
         coalesce(c.relrowsecurity, false) AS rls_enabled
  FROM watched w
  LEFT JOIN pg_catalog.pg_namespace n ON n.nspname = 'public'
  LEFT JOIN pg_catalog.pg_class c ON c.relnamespace = n.oid
    AND c.relname = w.name AND c.relkind IN ('r', 'p')
)
SELECT name AS area, exists_in_public, rls_enabled
FROM status ORDER BY name;

-- I GRANT sono distinti dalle policy RLS; un ruolo può avere un grant ampio
-- anche quando alcune righe sono protette da una policy.
SELECT t.table_name,
       t.grantee,
       string_agg(DISTINCT t.privilege_type, ', ' ORDER BY t.privilege_type)
         AS granted_operations
FROM information_schema.role_table_grants t
WHERE t.table_schema='public'
  AND t.table_name IN ('profili','profili_foto','likes','match_scores','messaggi')
  AND t.grantee IN ('anon','authenticated')
GROUP BY t.table_name,t.grantee
ORDER BY t.table_name,t.grantee;

-- Conta le policy senza pubblicarne le espressioni o i dettagli degli utenti.
SELECT tablename,cmd,permissive,count(*) AS policies
FROM pg_catalog.pg_policies
WHERE schemaname='public'
  AND tablename IN ('profili','profili_foto','likes','match_scores','messaggi')
GROUP BY tablename,cmd,permissive
ORDER BY tablename,cmd,permissive;

-- Dipendenze di funzione della app: solo presenza, niente sorgenti né segreti.
SELECT name AS api_function,
       (to_regprocedure('public.' || name) IS NOT NULL) AS present
FROM (VALUES
  ('can_chat_100(uuid,uuid)'),
  ('get_stanza_compatibility(uuid)'),
  ('send_stanza_message(uuid,text)'),
  ('lm360_get_public_profiles(uuid)')
) AS t(name)
ORDER BY name;

-- I dati futuri del feedback non devono essere aggiunti prima del gate RLS.
SELECT column_name AS dialogue_column_already_exists
FROM information_schema.columns
WHERE table_schema='public' AND table_name='match_scores'
  AND column_name IN ('dialogue_v1_a','dialogue_v1_b')
ORDER BY column_name;

-- Se la colonna futura è presente, bisogna inoltre verificare i PRIVILEGI
-- EFFETTIVI a livello tabella E colonna, e il comportamento SELECT *:
-- revocare un grant di colonna non annulla un GRANT SELECT sull'intera tabella.
