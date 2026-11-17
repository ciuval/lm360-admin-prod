# Gate 2.1 - deterministic concurrency probe, ONLY Docker Supabase LAB.
# No real profiles, chats, accounts, cloud, reset, deploy, or secrets.
$ErrorActionPreference = 'Stop'
$lab = 'I:\lm360-clean\LM360_FASE2_LAB'
$db = 'supabase_db_LM360_FASE2_LAB'
$script = 'scripts\e2e-gate21-race-local.mjs'

if (-not (Test-Path -LiteralPath (Join-Path $lab '.git') -PathType Container) -or
    -not (Test-Path -LiteralPath (Join-Path $lab 'supabase\config.toml') -PathType Leaf) -or
    -not (Test-Path -LiteralPath (Join-Path $lab $script) -PathType Leaf)) {
  throw 'GATE21_RACE_LAB_PREREQUISITES_MISSING'
}
$branch = (& git -C $lab branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne 'integration/quality-gate-20261112') {
  throw 'GATE21_RACE_WRONG_BRANCH'
}
$changes = @(& git -C $lab status --porcelain -- $script)
if ($LASTEXITCODE -ne 0 -or $changes.Count -ne 0) {
  throw 'GATE21_RACE_SCRIPT_HAS_LOCAL_CHANGES'
}
$containers = @(& docker ps --filter 'label=com.supabase.cli.project=LM360_FASE2_LAB' --format '{{.Names}}|{{.Ports}}')
if ($LASTEXITCODE -ne 0 -or
    -not ($containers -match '^supabase_kong_LM360_FASE2_LAB\|.*127\.0\.0\.1:54321->') -or
    -not ($containers -match '^supabase_db_LM360_FASE2_LAB\|') -or
    ($containers -match '0\.0\.0\.0:|\[::\]:|:::')) {
  throw 'GATE21_RACE_DOCKER_NOT_ISOLATED'
}
$details = @((& docker inspect $db 2>$null) | ConvertFrom-Json)
if ($LASTEXITCODE -ne 0 -or $details.Count -ne 1 -or
    $details[0].Config.Labels.'com.supabase.cli.project' -ne 'LM360_FASE2_LAB') {
  throw 'GATE21_RACE_WRONG_DATABASE'
}
$isolation = @(& docker exec $db psql -X -A -t -U postgres -d postgres -v ON_ERROR_STOP=1 -c 'show default_transaction_isolation;' 2>$null)
if ($LASTEXITCODE -ne 0 -or $isolation.Count -ne 1 -or $isolation[0] -ne 'read committed') {
  throw 'GATE21_RACE_ISOLATION_UNEXPECTED'
}
$preflightSql = @'
select case when not exists(
  select 1 from pg_catalog.pg_namespace
  where nspname like 'lm360_gate21_race_%'
) then 'GATE21_RACE_NO_STALE_FIXTURE=PASS'
else 'GATE21_RACE_NO_STALE_FIXTURE=FAIL' end;
'@
$preflight = @(& docker exec $db psql -X -A -t -U postgres -d postgres -v ON_ERROR_STOP=1 -c $preflightSql 2>$null)
if ($LASTEXITCODE -ne 0 -or $preflight.Count -ne 1 -or
    $preflight[0] -ne 'GATE21_RACE_NO_STALE_FIXTURE=PASS') {
  throw 'GATE21_RACE_STALE_FIXTURE_OR_PREFLIGHT_FAILED'
}
Push-Location $lab
try {
  $env:LM360_GATE21_RACE_LOCAL_GUARD = 'YES'
  Write-Host '===== GATE 2.1 - CONCORRENZA SINTETICA, SOLO DOCKER LAB ====='
  & node $script
  $result = $LASTEXITCODE
  if ($result -ne 0) { throw 'GATE21_RACE_TEST_NOT_PASSED' }
} finally {
  Remove-Item Env:\LM360_GATE21_RACE_LOCAL_GUARD -ErrorAction SilentlyContinue
  Pop-Location
}
