# LoveMatch360 / Ponte360 Gate 2.1 - REAL JWT consent probe in existing Docker LAB.
# Windows PowerShell 5.1, local-only. NO cloud, db reset, docker prune or deploy.
# Local fixture briefly committed for distinct HTTP requests then precisely removed.
$ErrorActionPreference = 'Stop'
$lab = 'I:\lm360-clean\LM360_FASE2_LAB'
$branchExpected = 'integration/quality-gate-20261112'
$db = 'supabase_db_LM360_FASE2_LAB'
$vars = @(
  'LM360_LOCAL_SUPABASE_URL',
  'LM360_LOCAL_SUPABASE_ANON_KEY',
  'LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY',
  'LM360_GATE21_JWT_LOCAL_GUARD'
)
$files = @(
  'scripts/e2e-gate21-jwt-consent-local.mjs',
  'scripts/local-only/gate21-jwt-ephemeral-setup.sql',
  'scripts/local-only/gate21-jwt-ephemeral-cleanup.sql',
  'scripts/local-only/run-gate21-jwt-consent-local.ps1'
)
if (-not (Test-Path -LiteralPath (Join-Path $lab '.git') -PathType Container) -or
    -not (Test-Path -LiteralPath (Join-Path $lab 'supabase\config.toml') -PathType Leaf) -or
    -not (Test-Path -LiteralPath (Join-Path $lab 'node_modules') -PathType Container)) {
  throw 'GATE21_JWT_LAB_PREREQUISITES_MISSING'
}
foreach ($relative in $files) {
  if (-not (Test-Path -LiteralPath (Join-Path $lab $relative) -PathType Leaf)) {
    throw 'GATE21_JWT_SCRIPT_FILE_MISSING'
  }
}
$branch = (& git -C $lab branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne $branchExpected) {
  throw 'GATE21_JWT_WRONG_BRANCH'
}
foreach ($relative in $files) {
  $modified = @(& git -C $lab status --porcelain -- $relative)
  if ($LASTEXITCODE -ne 0 -or $modified.Count -gt 0) {
    throw 'GATE21_JWT_SCRIPT_HAS_LOCAL_CHANGES'
  }
}
$containers = @(& docker ps --filter 'label=com.supabase.cli.project=LM360_FASE2_LAB' --format '{{.Names}}|{{.Ports}}')
if ($LASTEXITCODE -ne 0 -or
    -not ($containers -match '^supabase_kong_LM360_FASE2_LAB\|.*127\.0\.0\.1:54321->') -or
    -not ($containers -match '^supabase_db_LM360_FASE2_LAB\|') -or
    ($containers -match '0\.0\.0\.0:|\[::\]:|:::')) {
  throw 'GATE21_JWT_DOCKER_NOT_ISOLATED'
}
$inspect = @((& docker inspect $db 2>$null) | ConvertFrom-Json)
if ($LASTEXITCODE -ne 0 -or $inspect.Count -ne 1 -or
    $inspect[0].Config.Labels.'com.supabase.cli.project' -ne 'LM360_FASE2_LAB') {
  throw 'GATE21_JWT_DB_IDENTITY_MISMATCH'
}
# Fail closed when a prior interrupted probe left test objects.
$preflightSql = @'
select case when (
  select count(*) from pg_catalog.pg_namespace
  where nspname like 'lm360_gate21_jwt_probe_%'
) = 0 and (
  select count(*) from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and (p.proname like 'lm360_probe_consent_%'
      or p.proname like 'lm360_probe_can_open_%'
      or p.proname like 'lm360_probe_withdraw_%')
) = 0 then 'GATE21_JWT_NO_PREEXISTING_FIXTURE=PASS'
else 'GATE21_JWT_NO_PREEXISTING_FIXTURE=FAIL' end;
'@
$check = @(& docker exec $db psql -X -A -t -U postgres -d postgres -v ON_ERROR_STOP=1 -c $preflightSql 2>$null)
if ($LASTEXITCODE -ne 0 -or $check.Count -ne 1 -or
    $check[0] -ne 'GATE21_JWT_NO_PREEXISTING_FIXTURE=PASS') {
  throw 'GATE21_JWT_STALE_FIXTURE_OR_PREFLIGHT_FAILED'
}
Push-Location $lab
try {
  $priorErrorActionPreference = $ErrorActionPreference
  try {
    $ErrorActionPreference = 'Continue'
    $raw = @(& npx --no-install supabase status -o env 2>$null)
    $statusExitCode = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $priorErrorActionPreference
  }
  if ($statusExitCode -ne 0) { throw 'GATE21_JWT_SUPABASE_LOCAL_STATUS_FAILED' }
  $keys = @{}
  foreach ($row in $raw) {
    if ([string]$row -match '^(?:export\s+)?(ANON_KEY|SERVICE_ROLE_KEY)=(.*)$') {
      $keys[$Matches[1]] = $Matches[2].Trim().Trim('"').Trim("'")
    }
  }
  if (-not $keys['ANON_KEY'] -or -not $keys['SERVICE_ROLE_KEY']) {
    throw 'GATE21_JWT_LOCAL_KEYS_UNAVAILABLE'
  }
  $env:LM360_LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321'
  $env:LM360_LOCAL_SUPABASE_ANON_KEY = $keys['ANON_KEY']
  $env:LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY = $keys['SERVICE_ROLE_KEY']
  $env:LM360_GATE21_JWT_LOCAL_GUARD = 'YES'
  $keys.Clear()
  $raw = @()

  Write-Host '===== GATE 2.1 - TEST CONSENSO CON JWT REALI - SOLO LAB ====='
  Write-Host 'Quattro account sintetici, schema/funzioni univoci, cleanup automatico.'
  & node scripts/e2e-gate21-jwt-consent-local.mjs
  $result = $LASTEXITCODE
  if ($result -ne 0) { throw 'GATE21_JWT_TEST_NOT_PASSED' }
} finally {
  foreach ($name in $vars) {
    Remove-Item -Path ('Env:\' + $name) -ErrorAction SilentlyContinue
  }
  Pop-Location
}
