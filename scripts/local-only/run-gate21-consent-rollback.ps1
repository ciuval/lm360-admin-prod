# LoveMatch360 - Gate 2.1: SOLO Docker LAB. SQL in transazione con ROLLBACK.
# Nessun utente creato, nessun dato reale letto, nessuna modifica persistente.
# Non esegue migrazioni, db reset, deploy o operazioni su Supabase cloud.
$ErrorActionPreference = 'Stop'
$lab = 'I:\lm360-clean\LM360_FASE2_LAB'
$expectedBranch = 'integration/quality-gate-20261112'
$db = 'supabase_db_LM360_FASE2_LAB'
$sqlRelative = 'scripts/local-only/gate21-consent-rollback.sql'
$sqlFile = Join-Path $lab 'scripts\local-only\gate21-consent-rollback.sql'

if (-not (Test-Path -LiteralPath (Join-Path $lab '.git') -PathType Container) -or
    -not (Test-Path -LiteralPath (Join-Path $lab 'supabase\config.toml') -PathType Leaf) -or
    -not (Test-Path -LiteralPath $sqlFile -PathType Leaf)) {
  throw 'GATE21_CONSENT_LAB_PREREQUISITES_MISSING'
}
$branch = (& git -C $lab branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne $expectedBranch) {
  throw 'GATE21_CONSENT_LAB_BRANCH_MISMATCH'
}
$changes = @(& git -C $lab status --porcelain -- $sqlRelative)
if ($LASTEXITCODE -ne 0 -or $changes.Count -ne 0) {
  throw 'GATE21_CONSENT_SQL_HAS_LOCAL_CHANGES'
}
$containers = @(& docker ps --filter 'label=com.supabase.cli.project=LM360_FASE2_LAB' --format '{{.Names}}|{{.Ports}}')
if ($LASTEXITCODE -ne 0 -or
    -not ($containers -match '^supabase_kong_LM360_FASE2_LAB\|.*127\.0\.0\.1:54321->') -or
    -not ($containers -match '^supabase_db_LM360_FASE2_LAB\|') -or
    ($containers -match '0\.0\.0\.0:|\[::\]:|:::')) {
  throw 'GATE21_CONSENT_DOCKER_NOT_ISOLATED'
}
$details = @((& docker inspect $db 2>$null) | ConvertFrom-Json)
if ($LASTEXITCODE -ne 0 -or $details.Count -ne 1 -or
    $details[0].Config.Labels.'com.supabase.cli.project' -ne 'LM360_FASE2_LAB') {
  throw 'GATE21_CONSENT_DB_IDENTITY_MISMATCH'
}
$sqlText = [System.IO.File]::ReadAllText($sqlFile)
if ($sqlText -notmatch '(?im)^begin;\s*$' -or
    $sqlText -notmatch '(?im)^rollback;\s*$' -or
    $sqlText -match '(?im)^\s*commit\s*;' -or
    $sqlText -notmatch 'GATE21_CONSENT_SQL_SIMULATION=PASS') {
  throw 'GATE21_CONSENT_SQL_ROLLBACK_GUARD_FAILED'
}

Write-Host '===== GATE 2.1 - CONSENSO SIMULATO NEL SOLO DOCKER LAB ====='
Write-Host 'Identita sintetiche, nessuna lettura dei messaggi, transazione con rollback.'
# psql esegue l'intero file in una SOLA connessione. Qualunque errore prima
# del ROLLBACK chiude la connessione e annulla la transazione in corso.
$output = @($sqlText | & docker exec -i $db psql -X -q -A -t -U postgres -d postgres -v ON_ERROR_STOP=1 2>$null)
$code = $LASTEXITCODE
if ($code -ne 0 -or
    @($output | Where-Object { $_ -eq 'GATE21_CONSENT_SQL_SIMULATION=PASS' }).Count -ne 1) {
  throw 'GATE21_CONSENT_SQL_FAILED'
}
# Indipendentemente dal risultato psql, controlla che lo schema non esista.
$check = @(& docker exec $db psql -X -A -t -U postgres -d postgres -v ON_ERROR_STOP=1 -c "select case when to_regnamespace('lm360_gate21_consent_probe') is null then 'GATE21_LOCAL_SCHEMA_CLEAN=PASS' else 'GATE21_LOCAL_SCHEMA_CLEAN=FAIL' end;" 2>$null)
if ($LASTEXITCODE -ne 0 -or $check.Count -ne 1 -or $check[0] -ne 'GATE21_LOCAL_SCHEMA_CLEAN=PASS') {
  throw 'GATE21_CONSENT_SCHEMA_NOT_CLEAN'
}
Write-Host 'GATE21_CONSENT_SQL_SIMULATION=PASS'
Write-Host 'GATE21_LOCAL_SCHEMA_CLEAN=PASS'
Write-Host 'GATE21_CONSENT_AUTH_JWT_E2E=NOT_TESTED'
Write-Host 'Nessuna struttura persistente creata. Produzione non toccata.'
