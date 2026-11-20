# Gate 2.1-B — prova negativa revoca SOLO Docker Supabase locale.
# NON usare cloud, utenti browser esistenti, db reset, deploy o Stripe.
# Nessuna chiave, email, UUID o messaggio stampato.
$ErrorActionPreference = 'Stop'
$lab = 'I:\lm360-clean\LM360_FASE2_LAB'
$dbName = 'supabase_db_LM360_FASE2_LAB'
$expectedBranch = 'integration/quality-gate-20261112'
$vars = @('LM360_LOCAL_SUPABASE_URL','LM360_LOCAL_SUPABASE_ANON_KEY',
          'LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY','LM360_GATE21_LOCAL_GUARD')

if (-not (Test-Path -LiteralPath (Join-Path $lab 'supabase\config.toml') -PathType Leaf) -or
    -not (Test-Path -LiteralPath (Join-Path $lab 'node_modules') -PathType Container) -or
    -not (Test-Path -LiteralPath (Join-Path $lab 'scripts\e2e-gate21-revocation-local.mjs') -PathType Leaf)) {
  throw 'GATE21_LOCAL_PREREQUISITES_MISSING'
}
$branch = (& git -C $lab branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne $expectedBranch) { throw 'GATE21_WRONG_BRANCH' }
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
  throw 'GATE21_WRONG_DATABASE'
}
Push-Location $lab
try {
  $savePreference = $ErrorActionPreference
  try {
    $ErrorActionPreference = 'Continue'
    $raw = @(& npx --no-install supabase status -o env 2>$null)
    $exitStatus = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $savePreference
  }
  if ($exitStatus -ne 0) { throw 'GATE21_LOCAL_STATUS_FAILED' }
  $keys = @{}
  foreach ($row in $raw) {
    if ([string]$row -match '^(?:export\s+)?(ANON_KEY|SERVICE_ROLE_KEY)=(.*)$') {
      $keys[$Matches[1]] = $Matches[2].Trim().Trim('"').Trim("'")
    }
  }
  if (-not $keys['ANON_KEY'] -or -not $keys['SERVICE_ROLE_KEY']) {
    throw 'GATE21_LOCAL_KEYS_MISSING'
  }
  $env:LM360_LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321'
  $env:LM360_LOCAL_SUPABASE_ANON_KEY = $keys['ANON_KEY']
  $env:LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY = $keys['SERVICE_ROLE_KEY']
  $env:LM360_GATE21_LOCAL_GUARD = 'YES'
  $keys.Clear()
  $raw = @()
  Write-Host '===== GATE 2.1 - PROVA REVOCA IN LAB DOCKER ====='
  & node scripts/e2e-gate21-revocation-local.mjs
  $result = $LASTEXITCODE
  Write-Host ('GATE21_PROCESS=' + $(if ($result -eq 0) {'PASS'} else {'FAIL'}))
  if ($result -ne 0) { throw 'GATE21_TEST_NOT_PASSED' }
} finally {
  foreach ($name in $vars) {
    Remove-Item -Path ('Env:\' + $name) -ErrorAction SilentlyContinue
  }
  Pop-Location
}
