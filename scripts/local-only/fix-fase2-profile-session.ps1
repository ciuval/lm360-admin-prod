# LoveMatch360: correzione SOLO LAB colonna necessaria al controllo sessione
# PowerShell 5.1; non invoca Supabase cloud, Stripe o deploy.
$ErrorActionPreference = 'Stop'

$lab = 'I:\lm360-clean\LM360_FASE2_LAB'
$branchExpected = 'integration/quality-gate-20261112'
$dbContainer = 'supabase_db_LM360_FASE2_LAB'

if (-not (Test-Path -LiteralPath (Join-Path $lab '.git') -PathType Container)) {
    throw 'LAB_NOT_FOUND'
}
$branch = (& git -C $lab branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne $branchExpected) {
    throw 'LAB_BRANCH_MISMATCH'
}
$source = Join-Path $lab 'scripts\local-only\20260910_lm360_core_lab.sql'
$installed = Join-Path $lab 'supabase\migrations\20260910_lm360_core_lab.sql'
if (-not (Test-Path -LiteralPath $source -PathType Leaf) -or
    -not (Test-Path -LiteralPath $installed -PathType Leaf)) {
    throw 'LAB_BASELINE_MISSING'
}

$containers = @(
  & docker ps --filter 'label=com.supabase.cli.project=LM360_FASE2_LAB' --format '{{.Names}}|{{.Ports}}'
)
if ($LASTEXITCODE -ne 0 -or $containers.Count -eq 0 -or
    -not ($containers -match '^supabase_kong_LM360_FASE2_LAB\|.*127\.0\.0\.1:54321->') -or
    ($containers -match '0\.0\.0\.0:|\[::\]:|:::') -or
    -not ($containers -match '^supabase_db_LM360_FASE2_LAB\|')) {
    throw 'LOCAL_DOCKER_PORTS_NOT_ISOLATED'
}
$details = @((& docker inspect $dbContainer) | ConvertFrom-Json)
if ($LASTEXITCODE -ne 0 -or $details.Count -ne 1 -or
    $details[0].Config.Labels.'com.supabase.cli.project' -ne 'LM360_FASE2_LAB') {
    throw 'LOCAL_DB_CONTAINER_IDENTITY_MISMATCH'
}

$updated = [string](Get-Content -LiteralPath $source -Raw)
$existing = [string](Get-Content -LiteralPath $installed -Raw)
$normalize = {
    param([string]$value)
    $value.Replace(([string][char]13 + [char]10), [string][char]10).TrimEnd([char[]]@([char]13,[char]10))
}
$insert = @'
  -- Solo colonna di compatibilità con loadCurrentAccountTier.
  -- Non contiene alcun customer ID reale e non viene usata per pagamenti.
  stripe_customer_id text,
'@
$newText = & $normalize $updated
$oldText = $newText.Replace((& $normalize $insert) + [char]10, '')
$existingText = & $normalize $existing
if ($existingText -ne $newText) {
    if ($existingText -ne $oldText) {
        throw 'LAB_MIGRATION_MODIFIED_STOP'
    }
    Copy-Item -LiteralPath $source -Destination $installed -Force
    Write-Host 'PASS: fixture locale aggiornata senza toccare altre migrazioni'
}
else {
    Write-Host 'PASS: fixture locale già aggiornata'
}

$sql = @'
ALTER TABLE public.profili
  ADD COLUMN IF NOT EXISTS stripe_customer_id text;
SELECT CASE WHEN EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'profili'
    AND column_name = 'stripe_customer_id'
) THEN 'PASS_PROFILE_TIER_COLUMN' ELSE 'FAIL_PROFILE_TIER_COLUMN' END;
'@

Write-Host '===== RIPARAZIONE GATE AUTH - SOLO LAB ====='
$output = @(& docker exec $dbContainer psql -U postgres -d postgres -X -A -t -v ON_ERROR_STOP=1 -c $sql)
if ($LASTEXITCODE -ne 0 -or -not ($output -contains 'PASS_PROFILE_TIER_COLUMN')) {
    throw 'LOCAL_PROFILE_COLUMN_PATCH_FAILED'
}
Write-Host 'PASS: profili.stripe_customer_id disponibile nel database locale'
Write-Host 'Nessun dato di produzione modificato. Nessun intervento su Stripe.'
