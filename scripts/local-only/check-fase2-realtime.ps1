# LoveMatch360 — diagnosi READ-ONLY Realtime, solo Docker locale LAB.
# PowerShell 5.1. Non legge il testo dei messaggi e non stampa credenziali.
$ErrorActionPreference = 'Stop'

$lab = 'I:\lm360-clean\LM360_FASE2_LAB'
$expectedBranch = 'integration/quality-gate-20261112'
$dbName = 'supabase_db_LM360_FASE2_LAB'
$realtimeName = 'supabase_realtime_LM360_FASE2_LAB'

if (-not (Test-Path -LiteralPath (Join-Path $lab '.git') -PathType Container)) {
    throw 'LAB_NOT_FOUND'
}
$branch = (& git -C $lab branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne $expectedBranch) {
    throw 'LAB_BRANCH_MISMATCH'
}

# Tutti i container pubblicati del laboratorio devono rimanere su localhost.
$containers = @(& docker ps --filter 'label=com.supabase.cli.project=LM360_FASE2_LAB' --format '{{.Names}}|{{.Ports}}')
if ($LASTEXITCODE -ne 0 -or $containers.Count -eq 0 -or
    -not ($containers -match '^supabase_kong_LM360_FASE2_LAB\|.*127\.0\.0\.1:54321->') -or
    ($containers -match '0\.0\.0\.0:|\[::\]:|:::') -or
    -not ($containers -match '^supabase_db_LM360_FASE2_LAB\|')) {
    throw 'LOCAL_DOCKER_PORTS_NOT_ISOLATED'
}
$details = @((& docker inspect $dbName) | ConvertFrom-Json)
if ($LASTEXITCODE -ne 0 -or $details.Count -ne 1 -or
    $details[0].Config.Labels.'com.supabase.cli.project' -ne 'LM360_FASE2_LAB') {
    throw 'LOCAL_DB_CONTAINER_IDENTITY_MISMATCH'
}

$sql = @'
select 'PUBLICATION=' ||
    case when exists(select 1 from pg_publication where pubname='supabase_realtime')
        then 'PRESENT' else 'MISSING' end
union all
select 'MESSAGGI_PUBLISHED=' ||
    case when exists (
      select 1 from pg_publication_tables
      where pubname='supabase_realtime'
        and schemaname='public' and tablename='messaggi'
    ) then 'YES' else 'NO' end
union all
select 'MESSAGGI_RLS=' ||
    case when exists (
      select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and c.relname='messaggi' and c.relrowsecurity
    ) then 'ENABLED' else 'DISABLED' end
union all
select 'MESSAGGI_SELECT_GRANT=' ||
    case when has_table_privilege('authenticated','public.messaggi','SELECT')
        then 'YES' else 'NO' end
union all
select 'MESSAGGI_SELECT_POLICY=' ||
    case when exists (
      select 1 from pg_policies
      where schemaname='public' and tablename='messaggi'
      and cmd in ('SELECT','ALL') and roles @> ARRAY['authenticated']::name[]
    ) then 'PRESENT' else 'MISSING' end;
'@

Write-Host '===== LOVEMATCH360: REALTIME DIAGNOSI SOLO LAB ====='
$lines = @(& docker exec $dbName psql -X -A -t -U postgres -d postgres -v ON_ERROR_STOP=1 -c $sql 2>$null)
if ($LASTEXITCODE -ne 0) {
    throw 'LOCAL_REALTIME_DIAGNOSTIC_FAILED'
}
$expectedPrefixes = @('PUBLICATION=','MESSAGGI_PUBLISHED=','MESSAGGI_RLS=','MESSAGGI_SELECT_GRANT=','MESSAGGI_SELECT_POLICY=')
foreach ($prefix in $expectedPrefixes) {
    $matches = @($lines | Where-Object { $_.StartsWith($prefix, [System.StringComparison]::Ordinal) })
    if ($matches.Count -ne 1) { throw ('DIAGNOSTIC_OUTPUT_INVALID_' + $prefix) }
    Write-Host $matches[0]
}
$realtimeRunning = @($containers | Where-Object { $_ -match '^supabase_realtime_LM360_FASE2_LAB\|' }).Count -eq 1
Write-Host ('REALTIME_CONTAINER=' + $(if ($realtimeRunning) {'RUNNING'} else {'STOPPED'}))
Write-Host 'READ_ONLY_DIAGNOSTIC_COMPLETED'
Write-Host 'Nessun dato modificato. Nessun testo di messaggi o token letto.'
