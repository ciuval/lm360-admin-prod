# LoveMatch360 Gate 2.1-C - FIX sperimentale SOLO nel Docker LAB.
# Zero nuove tabelle/colonne, nessun SQL cloud, db reset, deploy o dati reali.
# Dopo la revoca di un like: score=0 e cronologia non leggibile in chat attiva.
# Non implementa ancora la pausa, blocco, segnalazione o chiusura irreversibile.
param([switch]$Rollback)
$ErrorActionPreference = 'Stop'
$lab = 'I:\lm360-clean\LM360_FASE2_LAB'
$dbName = 'supabase_db_LM360_FASE2_LAB'
$expectedBranch = 'integration/quality-gate-20261112'

if (-not (Test-Path -LiteralPath (Join-Path $lab '.git') -PathType Container) -or
    -not (Test-Path -LiteralPath (Join-Path $lab 'supabase\config.toml') -PathType Leaf)) {
  throw 'GATE21_LAB_NOT_FOUND'
}
$branch = (& git -C $lab branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne $expectedBranch) {
  throw 'GATE21_BRANCH_MISMATCH'
}
$containers = @(& docker ps --filter 'label=com.supabase.cli.project=LM360_FASE2_LAB' --format '{{.Names}}|{{.Ports}}')
if ($LASTEXITCODE -ne 0 -or
    -not ($containers -match '^supabase_kong_LM360_FASE2_LAB\|.*127\.0\.0\.1:54321->') -or
    -not ($containers -match '^supabase_db_LM360_FASE2_LAB\|') -or
    ($containers -match '0\.0\.0\.0:|\[::\]:|:::')) {
  throw 'GATE21_DOCKER_NOT_ISOLATED'
}
$details = @((& docker inspect $dbName 2>$null) | ConvertFrom-Json)
if ($LASTEXITCODE -ne 0 -or $details.Count -ne 1 -or
    $details[0].Config.Labels.'com.supabase.cli.project' -ne 'LM360_FASE2_LAB') {
  throw 'GATE21_DB_IDENTITY_MISMATCH'
}

$preflight = @'
do $verify$
begin
  if not (
    select count(*) = 3 from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname in ('likes','match_scores','messaggi')
      and c.relrowsecurity
  ) then
    raise exception 'GATE21_RLS_PRECONDITION';
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'messaggi'
      and policyname = 'messaggi_read_participants' and cmd = 'SELECT'
  ) then
    raise exception 'GATE21_POLICY_PRECONDITION';
  end if;
  if has_table_privilege('authenticated', 'public.match_scores', 'UPDATE')
     or has_table_privilege('authenticated', 'public.messaggi', 'INSERT') then
    raise exception 'GATE21_GRANT_PRECONDITION';
  end if;
  if to_regprocedure('public.can_open_stanza(uuid)') is null
     or to_regprocedure('public.send_stanza_message(uuid,text)') is null then
    raise exception 'GATE21_RPC_PRECONDITION';
  end if;
end
$verify$;
'@

if ($Rollback) {
  $sql = @'
begin;
'@
  $sql += $preflight
  $sql += @'
do $guard$
begin
  if not exists (
    select 1 from pg_trigger t join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'likes'
      and t.tgname = 'lm360_lab_revoke_after_unlike'
      and not t.tgisinternal
  ) then
    raise exception 'GATE21_PATCH_NOT_PRESENT';
  end if;
end
$guard$;

drop trigger lm360_lab_revoke_after_unlike on public.likes;
drop function public.lm360_lab_revoke_match_after_unlike();
alter policy messaggi_read_participants on public.messaggi
  using ((mittente_id = (select auth.uid())) or (destinatario_id = (select auth.uid())));
commit;
select 'GATE21_LAB_PATCH_ROLLBACK=PASS';
'@
} else {
  $sql = @'
begin;
'@
  $sql += $preflight
  $sql += @'
do $guard$
begin
  if exists (
    select 1 from pg_trigger t join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'likes'
      and not t.tgisinternal and (t.tgtype::integer & 8) = 8
  ) then
    raise exception 'GATE21_LIKES_DELETE_TRIGGER_ALREADY_PRESENT';
  end if;
  if to_regprocedure('public.lm360_lab_revoke_match_after_unlike()') is not null then
    raise exception 'GATE21_PATCH_FUNCTION_ALREADY_PRESENT';
  end if;
end
$guard$;

create function public.lm360_lab_revoke_match_after_unlike()
returns trigger
language plpgsql
security definer
set search_path = ''
as $body$
begin
  -- Ownership della DELETE già verificata dalla policy likes_delete_own.
  -- Operazione atomica: un match a 100 diventa inattivo nella stessa transazione.
  update public.match_scores
     set score = 0, updated_at = now()
   where user_a = least(old.user_from, old.user_to)
     and user_b = greatest(old.user_from, old.user_to)
     and score = 100;
  return old;
end
$body$;
revoke all on function public.lm360_lab_revoke_match_after_unlike() from public, anon, authenticated;
create trigger lm360_lab_revoke_after_unlike
after delete on public.likes
for each row execute function public.lm360_lab_revoke_match_after_unlike();

-- Le righe storiche restano archiviate, ma non sono più leggibili dalla chat.
-- Il client legge solo le proprie coppie; match_scores ha RLS per partecipanti.
alter policy messaggi_read_participants on public.messaggi
  using (
    (mittente_id = (select auth.uid()) or destinatario_id = (select auth.uid()))
    and exists (
      select 1 from public.match_scores ms
      where ms.user_a = least(mittente_id, destinatario_id)
        and ms.user_b = greatest(mittente_id, destinatario_id)
        and ms.score = 100
    )
  );
commit;
select 'GATE21_LAB_PATCH_APPLIED=PASS';
'@
}

Write-Host '===== LOVEMATCH360 GATE 2.1 - PATCH SOLO DOCKER LAB ====='
$lines = @(& docker exec $dbName psql -X -q -A -t -U postgres -d postgres -v ON_ERROR_STOP=1 -c $sql 2>$null)
if ($LASTEXITCODE -ne 0) { throw 'GATE21_LAB_SQL_FAILED_NO_CHANGE_COMMITTED' }
$expected = $(if ($Rollback) { 'GATE21_LAB_PATCH_ROLLBACK=PASS' } else { 'GATE21_LAB_PATCH_APPLIED=PASS' })
if (-not ($lines -contains $expected)) { throw 'GATE21_LAB_PATCH_RESULT_UNKNOWN' }
Write-Host $expected -ForegroundColor Green
Write-Host 'Solo Docker LAB. Nessuna tabella/colonna aggiunta e nessuna cronologia eliminata.'
