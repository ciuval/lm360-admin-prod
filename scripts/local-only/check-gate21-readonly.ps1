# LoveMatch360 - Gate 2.1: ricognizione SOLO metadati nel Supabase Docker LAB.
# PowerShell 5.1/7; nessuna lettura di righe, utenti, chat, chiavi o UUID.
# Nessun INSERT/UPDATE/DELETE/DDL, db reset, cloud, deploy o Stripe.
$ErrorActionPreference = 'Stop'
$lab = 'I:\lm360-clean\LM360_FASE2_LAB'
$expectedBranch = 'integration/quality-gate-20261112'
$dbName = 'supabase_db_LM360_FASE2_LAB'

if (-not (Test-Path -LiteralPath (Join-Path $lab '.git') -PathType Container) -or
    -not (Test-Path -LiteralPath (Join-Path $lab 'supabase\config.toml') -PathType Leaf)) {
  throw 'GATE21_LAB_NOT_FOUND'
}
$branch = (& git -C $lab branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne $expectedBranch) {
  throw 'GATE21_BRANCH_MISMATCH'
}

$containers = @(& docker ps --filter 'label=com.supabase.cli.project=LM360_FASE2_LAB' --format '{{.Names}}|{{.Ports}}')
if ($LASTEXITCODE -ne 0 -or $containers.Count -eq 0 -or
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

# Non interrogare le tabelle applicative: solo pg_catalog, pg_policies e GRANT.
# LIKE_DELETE_TRIGGER=NO non basta a dimostrare un bug senza test effettivo:
# possono esistere ulteriori RPC o percorsi di revoca da auditare.
$sql = @'
select label || '=' || case when present then 'YES' else 'NO' end
from (
  select 1 sort, 'LIKES_RLS' label,
    exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and c.relname='likes' and c.relrowsecurity) present
  union all
  select 2, 'LIKES_DELETE_GRANT',
    has_table_privilege('authenticated','public.likes','DELETE')
  union all
  select 3, 'LIKES_DELETE_POLICY',
    exists(select 1 from pg_policies where schemaname='public'
      and tablename='likes' and cmd in ('DELETE','ALL')
      and roles @> array['authenticated']::name[])
  union all
  select 4, 'LIKES_DELETE_TRIGGER',
    exists(select 1 from pg_trigger t join pg_class c on c.oid=t.tgrelid
      join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and c.relname='likes'
        and not t.tgisinternal and (t.tgtype::int & 8) = 8)
  union all
  select 5, 'MATCH_RLS',
    exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and c.relname='match_scores' and c.relrowsecurity)
  union all
  select 6, 'MATCH_DIRECT_WRITE_GRANT',
    has_table_privilege('authenticated','public.match_scores','INSERT')
    or has_table_privilege('authenticated','public.match_scores','UPDATE')
    or has_table_privilege('authenticated','public.match_scores','DELETE')
  union all
  select 7, 'MESSAGGI_RLS',
    exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and c.relname='messaggi' and c.relrowsecurity)
  union all
  select 8, 'MESSAGGI_READ_POLICY',
    exists(select 1 from pg_policies where schemaname='public'
      and tablename='messaggi' and cmd in ('SELECT','ALL')
      and roles @> array['authenticated']::name[])
  union all
  select 9, 'MESSAGGI_DIRECT_INSERT_GRANT',
    has_table_privilege('authenticated','public.messaggi','INSERT')
  union all
  select 10, 'CAN_OPEN_STANZA_RPC',
    to_regprocedure('public.can_open_stanza(uuid)') is not null
  union all
  select 11, 'SEND_STANZA_MESSAGE_RPC',
    to_regprocedure('public.send_stanza_message(uuid,text)') is not null
) q
order by sort;
'@

Write-Host '===== LOVEMATCH360 GATE 2.1 - AUDIT SOLO LAB ====='
$lines = @(& docker exec $dbName psql -X -A -t -U postgres -d postgres -v ON_ERROR_STOP=1 -c $sql 2>$null)
if ($LASTEXITCODE -ne 0) { throw 'GATE21_METADATA_QUERY_FAILED' }
$labels = @(
  'LIKES_RLS', 'LIKES_DELETE_GRANT', 'LIKES_DELETE_POLICY',
  'LIKES_DELETE_TRIGGER', 'MATCH_RLS', 'MATCH_DIRECT_WRITE_GRANT',
  'MESSAGGI_RLS', 'MESSAGGI_READ_POLICY', 'MESSAGGI_DIRECT_INSERT_GRANT',
  'CAN_OPEN_STANZA_RPC', 'SEND_STANZA_MESSAGE_RPC'
)
if ($lines.Count -ne $labels.Count) { throw 'GATE21_METADATA_OUTPUT_INVALID' }
foreach ($label in $labels) {
  $matching = @($lines | Where-Object { $_ -eq ($label + '=YES') -or $_ -eq ($label + '=NO') })
  if ($matching.Count -ne 1) { throw 'GATE21_METADATA_OUTPUT_INVALID' }
  Write-Host $matching[0]
}
Write-Host 'GATE21_METADATA_READ_ONLY=COMPLETE'
Write-Host 'GATE21_REVOCATION_E2E=NOT_TESTED'
Write-Host 'Nessun dato modificato. Nessun contenuto chat o identificativo letto.'
