# LoveMatch360 — Gate 2.1C: live Realtime in isolated Docker LAB only.
# No production, no schema changes, no user data, no credentials in console.
$ErrorActionPreference = 'Stop'
$lab = 'I:\lm360-clean\LM360_FASE2_LAB'
$dbName = 'supabase_db_LM360_FASE2_LAB'
$branchExpected = 'integration/quality-gate-20261112'
$guardVars = @('LM360_LOCAL_SUPABASE_URL','LM360_LOCAL_SUPABASE_ANON_KEY',
               'LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY','LM360_GATE21_LOCAL_GUARD',
               'LM360_REALTIME_LOCAL_GUARD')

# Refuse to override any preexisting environment credentials.
foreach ($name in $guardVars) {
  if (Test-Path ('Env:\' + $name)) { throw 'LOCAL_ENV_ALREADY_SET' }
}
if (-not (Test-Path -LiteralPath (Join-Path $lab 'supabase\config.toml') -PathType Leaf) -or
    -not (Test-Path -LiteralPath (Join-Path $lab 'node_modules') -PathType Container) -or
    -not (Test-Path -LiteralPath (Join-Path $lab 'scripts\e2e-gate21-realtime-local.mjs') -PathType Leaf)) {
  throw 'GATE21C_LOCAL_PREREQUISITES_MISSING'
}
$branch = (& git -C $lab branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne $branchExpected) { throw 'GATE21C_WRONG_BRANCH' }
$head = (& git -C $lab rev-parse --short HEAD).Trim()
if ($LASTEXITCODE -ne 0 -or $head -ne '34fc7e3') { throw 'GATE21C_WRONG_HEAD' }
$changed = @(& git -C $lab diff --name-only)
if ($LASTEXITCODE -ne 0 -or $changed.Count -ne 2 -or
    $changed -notcontains 'src/pages/ChatBox.jsx' -or
    $changed -notcontains 'tests/chatSendUi.test.js') { throw 'GATE21C_UNEXPECTED_DIFF' }
$staged = @(& git -C $lab diff --cached --name-only)
if ($LASTEXITCODE -ne 0 -or $staged.Count -ne 0) { throw 'GATE21C_UNEXPECTED_STAGING' }

$containers = @(& docker ps --filter 'label=com.supabase.cli.project=LM360_FASE2_LAB' --format '{{.Names}}|{{.Ports}}')
if ($LASTEXITCODE -ne 0 -or
    -not ($containers -match '^supabase_kong_LM360_FASE2_LAB\|.*127\.0\.0\.1:54321->') -or
    -not ($containers -match '^supabase_db_LM360_FASE2_LAB\|') -or
    -not ($containers -match '^supabase_realtime_LM360_FASE2_LAB\|') -or
    ($containers -match '0\.0\.0\.0:|\[::\]:|:::')) {
  throw 'GATE21C_DOCKER_NOT_ISOLATED_OR_REALTIME_MISSING'
}
$details = @((& docker inspect $dbName 2>$null) | ConvertFrom-Json)
if ($LASTEXITCODE -ne 0 -or $details.Count -ne 1 -or
    $details[0].Config.Labels.'com.supabase.cli.project' -ne 'LM360_FASE2_LAB') {
  throw 'GATE21C_WRONG_DATABASE'
}

Push-Location $lab
try {
  & node --check (Join-Path $lab 'scripts\e2e-gate21-realtime-local.mjs')
  if ($LASTEXITCODE -ne 0) { throw 'GATE21C_NODE_SYNTAX_FAILED' }
  $savedPreference = $ErrorActionPreference
  try {
    $ErrorActionPreference = 'Continue'
    $raw = @(& npx --no-install supabase status -o env 2>$null)
    $exitStatus = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $savedPreference
  }
  if ($exitStatus -ne 0) { throw 'GATE21C_LOCAL_STATUS_FAILED' }
  $keys = @{}
  foreach ($row in $raw) {
    if ([string]$row -match '^(?:export\s+)?(ANON_KEY|SERVICE_ROLE_KEY)=(.*)$') {
      $keys[$Matches[1]] = $Matches[2].Trim().Trim('"').Trim("'")
    }
  }
  if (-not $keys['ANON_KEY'] -or -not $keys['SERVICE_ROLE_KEY']) {
    throw 'GATE21C_LOCAL_KEYS_MISSING'
  }
  $env:LM360_LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321'
  $env:LM360_LOCAL_SUPABASE_ANON_KEY = $keys['ANON_KEY']
  $env:LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY = $keys['SERVICE_ROLE_KEY']
  $env:LM360_GATE21_LOCAL_GUARD = 'YES'
  $env:LM360_REALTIME_LOCAL_GUARD = 'YES'
  $keys.Clear()
  $raw = @()
  Write-Host '===== GATE 2.1C - REALTIME E2E, SOLO DOCKER LAB ====='
  & node scripts/e2e-gate21-realtime-local.mjs
  $exitCode = $LASTEXITCODE
  Write-Host ('GATE21C_PROCESS=' + $(if ($exitCode -eq 0) { 'PASS' } else { 'FAIL' }))
  if ($exitCode -ne 0) { throw 'GATE21C_TEST_FAILED' }
} finally {
  foreach ($name in $guardVars) {
    Remove-Item -Path ('Env:\' + $name) -ErrorAction SilentlyContinue
  }
  Pop-Location
}
