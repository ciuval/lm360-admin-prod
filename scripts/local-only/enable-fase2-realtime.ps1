# LoveMatch360 - Realtime messaggi, SOLO LAB Supabase Docker locale.
# La modifica e' reversibile con: ...\enable-fase2-realtime.ps1 -Rollback
# NON usa Supabase cloud, NON stampa credenziali, messaggi, email o UUID.
# PowerShell 5.1. Esegue un unico ALTER PUBLICATION per public.messaggi,
# senza cambiare RLS, ruoli, policy, dati o altre tabelle.

param([switch]$Rollback)
$ErrorActionPreference = 'Stop'

$lab = 'I:\lm360-clean\LM360_FASE2_LAB'
$expectedBranch = 'integration/quality-gate-20261112'
$dbName = 'supabase_db_LM360_FASE2_LAB'

if (-not (Test-Path -LiteralPath (Join-Path $lab 'supabase\config.toml') -PathType Leaf)) {
    throw 'LAB_CONFIG_NOT_FOUND'
}
$branch = (& git -C $lab branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne $expectedBranch) {
    throw 'LAB_BRANCH_MISMATCH'
}
$containers = @(& docker ps --filter 'label=com.supabase.cli.project=LM360_FASE2_LAB' --format '{{.Names}}|{{.Ports}}')
if ($LASTEXITCODE -ne 0 -or $containers.Count -eq 0 -or
    -not ($containers -match '^supabase_kong_LM360_FASE2_LAB\|.*127\.0\.0\.1:54321->') -or
    -not ($containers -match '^supabase_db_LM360_FASE2_LAB\|') -or
    ($containers -match '0\.0\.0\.0:|\[::\]:|:::')) {
    throw 'LOCAL_DOCKER_PORTS_NOT_ISOLATED'
}
$details = @((& docker inspect $dbName) | ConvertFrom-Json)
if ($LASTEXITCODE -ne 0 -or $details.Count -ne 1 -or
    $details[0].Config.Labels.'com.supabase.cli.project' -ne 'LM360_FASE2_LAB') {
    throw 'LOCAL_DB_CONTAINER_IDENTITY_MISMATCH'
}

# Guardie atomiche lato database prima di qualsiasi ALTER.
# Richiedono RLS, un'unica policy SELECT dei partecipanti, nessun SELECT anon,
# SELECT per authenticated, e publication esplicitamente per tabelle selezionate.
# Nessuna lettura di righe o contenuti della chat.
$action = if ($Rollback) { 'DROP' } else { 'ADD' }
$sql = @'
do $lm360$
declare
    is_published boolean;
begin
    if not exists (
        select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
        where n.nspname='public' and c.relname='messaggi'
          and c.relkind in ('r','p') and c.relrowsecurity
    ) then
        raise exception 'LOCAL_MESSAGGI_RLS_MISSING';
    end if;

    if not has_table_privilege('authenticated','public.messaggi','SELECT')
       or has_table_privilege('anon','public.messaggi','SELECT') then
        raise exception 'LOCAL_MESSAGGI_READ_GRANTS_UNSAFE';
    end if;

    if (select count(*) from pg_policies
        where schemaname='public' and tablename='messaggi'
          and cmd in ('SELECT','ALL')) <> 1
       or not exists (
           select 1 from pg_policies
           where schemaname='public' and tablename='messaggi'
             and policyname='messaggi_read_participants'
             and cmd='SELECT'
             and roles = array['authenticated']::name[]
             and qual like '%auth.uid()%'
             and qual like '%mittente_id%'
             and qual like '%destinatario_id%'
       ) then
        raise exception 'LOCAL_MESSAGGI_PARTICIPANT_POLICY_UNEXPECTED';
    end if;

    if not exists (
        select 1 from pg_publication
        where pubname='supabase_realtime' and not puballtables
    ) then
        raise exception 'LOCAL_REALTIME_PUBLICATION_UNSAFE';
    end if;

    select exists (
        select 1 from pg_publication_tables
        where pubname='supabase_realtime'
          and schemaname='public' and tablename='messaggi'
    ) into is_published;

    if 'LM360_ACTION' = 'ADD' and not is_published then
        execute 'alter publication supabase_realtime add table public.messaggi';
    elsif 'LM360_ACTION' = 'DROP' and is_published then
        execute 'alter publication supabase_realtime drop table public.messaggi';
    end if;
end;
$lm360$;

select 'MESSAGGI_PUBLISHED=' ||
    case when exists (
       select 1 from pg_publication_tables
       where pubname='supabase_realtime'
         and schemaname='public' and tablename='messaggi'
    ) then 'YES' else 'NO' end;
'@
$sql = $sql.Replace('LM360_ACTION', $action)

Write-Host '===== LOVEMATCH360 REALTIME - SOLO LAB ====='
Write-Host ('Operazione: ' + $(if ($Rollback) {'ROLLBACK publication'} else {'ENABLE publication'}))
# psql non riceve alcuna password e usa il solo socket interno del container DB.
$lines = @(& docker exec $dbName psql -X -A -t -U postgres -d postgres -v ON_ERROR_STOP=1 -c $sql 2>$null)
if ($LASTEXITCODE -ne 0) {
    throw 'LOCAL_REALTIME_PUBLICATION_CHANGE_BLOCKED'
}
$expected = if ($Rollback) { 'MESSAGGI_PUBLISHED=NO' } else { 'MESSAGGI_PUBLISHED=YES' }
if (-not ($lines -contains $expected)) {
    throw 'LOCAL_REALTIME_PUBLICATION_POSTCHECK_FAILED'
}
Write-Host $expected
Write-Host 'PASS: guardie RLS, isolamento LAB e modifica publication verificati.'
Write-Host 'Nessun dato messaggio, ruolo, policy, credenziale o produzione modificati.'
