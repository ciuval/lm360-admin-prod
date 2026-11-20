# LoveMatch360 — Gate 2.1: audit modello di stato SOLO metadati Docker LAB.
# Non accede a righe utenti/chat, non legge segreti, non esegue SQL mutativo.
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

# Introspezione del solo catalogo PostgreSQL. Nessuna query alle righe applicative.
# I "hint" sono indizi di nomi, NON prova definitiva di uno stato implementato.
$sql = @'
with columns as (
  select c.relname as table_name, a.attname as column_name
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  join pg_catalog.pg_attribute a on a.attrelid = c.oid
  where n.nspname = 'public' and c.relkind in ('r','p')
    and a.attnum > 0 and not a.attisdropped
), tables as (
  select c.relname as table_name
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind in ('r','p')
), functions as (
  select p.proname as function_name
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
), answers as (
  select 1 as ord, 'MATCH_PAIR_COLUMNS_COMPLETE' as label,
    case when (select count(*) from columns
      where table_name='match_scores' and column_name in ('user_a','user_b','score'))=3
    then 'YES' else 'NO' end as answer
  union all
  select 2, 'LIKE_PAIR_COLUMNS_COMPLETE',
    case when (select count(*) from columns
      where table_name='likes' and column_name in ('user_id','user_from','user_to'))=3
    then 'YES' else 'NO' end
  union all
  select 3, 'PAUSE_COLUMN_NAME_HINTS',
    (select count(*)::text from columns
      where column_name ~* '(paus|sospes|suspend)')
  union all
  select 4, 'PAUSE_TABLE_NAME_HINTS',
    (select count(*)::text from tables
      where table_name ~* '(paus|sospes|suspend)')
  union all
  select 5, 'CLOSURE_COLUMN_NAME_HINTS',
    (select count(*)::text from columns
      where column_name ~* '(clos|chius|unmatch|ended)')
  union all
  select 6, 'CLOSURE_TABLE_NAME_HINTS',
    (select count(*)::text from tables
      where table_name ~* '(clos|chius|unmatch|ended)')
  union all
  select 7, 'BLOCK_COLUMN_NAME_HINTS',
    (select count(*)::text from columns
      where column_name ~* '(block|blocc)')
  union all
  select 8, 'BLOCK_TABLE_NAME_HINTS',
    (select count(*)::text from tables
      where table_name ~* '(block|blocc)')
  union all
  select 9, 'REQUEST_COLUMN_NAME_HINTS',
    (select count(*)::text from columns
      where column_name ~* '(request|richiest|ripres|scus|apolog)')
  union all
  select 10, 'REQUEST_TABLE_NAME_HINTS',
    (select count(*)::text from tables
      where table_name ~* '(request|richiest|ripres|scus|apolog)')
  union all
  select 11, 'STATE_FUNCTION_NAME_HINTS',
    (select count(*)::text from functions
      where function_name ~* '(paus|sospes|close|chiud|unmatch|block|blocc|ripres|scus|apolog)')
)
select label || '=' || answer from answers order by ord;
'@

Write-Host '===== LOVEMATCH360 GATE 2.1 - STATO RELAZIONE SOLO LAB ====='
$lines = @(& docker exec $dbName psql -X -A -t -U postgres -d postgres -v ON_ERROR_STOP=1 -c $sql 2>$null)
if ($LASTEXITCODE -ne 0) { throw 'GATE21_METADATA_QUERY_FAILED' }
$labels = @(
  'MATCH_PAIR_COLUMNS_COMPLETE','LIKE_PAIR_COLUMNS_COMPLETE',
  'PAUSE_COLUMN_NAME_HINTS','PAUSE_TABLE_NAME_HINTS',
  'CLOSURE_COLUMN_NAME_HINTS','CLOSURE_TABLE_NAME_HINTS',
  'BLOCK_COLUMN_NAME_HINTS','BLOCK_TABLE_NAME_HINTS',
  'REQUEST_COLUMN_NAME_HINTS','REQUEST_TABLE_NAME_HINTS',
  'STATE_FUNCTION_NAME_HINTS'
)
if ($lines.Count -ne $labels.Count) { throw 'GATE21_METADATA_OUTPUT_INVALID' }
foreach ($label in $labels) {
  $match = @($lines | Where-Object { $_ -match ('^' + [regex]::Escape($label) + '=(YES|NO|[0-9]+)$') })
  if ($match.Count -ne 1) { throw 'GATE21_METADATA_OUTPUT_INVALID' }
  Write-Host $match[0]
}
Write-Host 'GATE21_STATE_MODEL_METADATA_ONLY=COMPLETE'
Write-Host 'GATE21_PAUSE_CLOSURE_FEATURES=NOT_TESTED'
Write-Host 'Nessuna riga utente letta. Nessun dato modificato.'
