# LoveMatch360 — privacy/IDOR con terzo account sintetico temporaneo.
# Soltanto stack Docker LM360_FASE2_LAB esposto su localhost.
# PowerShell 5.1; mai output di chiavi, email, ID, testo messaggi.
# Non esegue db reset, deploy, Stripe, né Supabase cloud.
$ErrorActionPreference = 'Stop'
$lab = 'I:\lm360-clean\LM360_FASE2_LAB'
$branchExpected = 'integration/quality-gate-20261112'
$container = 'supabase_db_LM360_FASE2_LAB'
$envNames = @('LM360_LOCAL_SUPABASE_URL', 'LM360_LOCAL_SUPABASE_ANON_KEY',
              'LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY', 'LM360_LOCAL_ANON_DENIAL_GUARD')

if (-not (Test-Path -LiteralPath (Join-Path $lab 'supabase\config.toml') -PathType Leaf) -or
    -not (Test-Path -LiteralPath (Join-Path $lab 'node_modules') -PathType Container) -or
    -not (Test-Path -LiteralPath (Join-Path $lab 'scripts\e2e-third-account-privacy-local.mjs') -PathType Leaf)) {
  throw 'LOCAL_PRIVACY_TEST_PREREQUISITES_MISSING'
}
$branch = (& git -C $lab branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne $branchExpected) {
  throw 'LOCAL_LAB_BRANCH_MISMATCH'
}
# Gli endpoint del LAB devono essere in loopback, mai su interfacce pubbliche.
$containers = @(& docker ps --filter 'label=com.supabase.cli.project=LM360_FASE2_LAB' --format '{{.Names}}|{{.Ports}}')
if ($LASTEXITCODE -ne 0 -or $containers.Count -eq 0 -or
    -not ($containers -match '^supabase_kong_LM360_FASE2_LAB\|.*127\.0\.0\.1:54321->') -or
    -not ($containers -match '^supabase_db_LM360_FASE2_LAB\|') -or
    ($containers -match '0\.0\.0\.0:|\[::\]:|:::')) {
  throw 'LOCAL_DOCKER_NOT_ISOLATED'
}
$details = @((& docker inspect $container) | ConvertFrom-Json)
if ($LASTEXITCODE -ne 0 -or $details.Count -ne 1 -or
    $details[0].Config.Labels.'com.supabase.cli.project' -ne 'LM360_FASE2_LAB') {
  throw 'LOCAL_DATABASE_IDENTITY_MISMATCH'
}

# SQL metadata-only: non legge righe, contenuti della chat, token o utenti.
# Un 401 anon senza codice SQL e' PASS solo se il gateway accetta la chiave
# E questa verifica conferma RLS+assenza di SELECT anon nel database specifico.
$sql = @'
select case when exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'messaggi' and c.relrowsecurity
) and not has_table_privilege('anon', 'public.messaggi', 'SELECT')
  and has_table_privilege('authenticated', 'public.messaggi', 'SELECT')
then 'ANON_DB_GUARD=PASS' else 'ANON_DB_GUARD=FAIL' end;
'@
$guard = @(& docker exec $container psql -X -A -t -U postgres -d postgres -v ON_ERROR_STOP=1 -c $sql 2>$null)
if ($LASTEXITCODE -ne 0 -or $guard.Count -ne 1 -or $guard[0] -ne 'ANON_DB_GUARD=PASS') {
  throw 'LOCAL_ANON_DATABASE_GUARD_FAILED'
}

Push-Location $lab
try {
  # CLI status restituisce chiavi private, dunque mai Out-Host o stdout.
  $savedErrorActionPreference = $ErrorActionPreference
  try {
    $ErrorActionPreference = 'Continue'
    $raw = @(& npx --no-install supabase status -o env 2>$null)
    $statusExitCode = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $savedErrorActionPreference
  }
  if ($statusExitCode -ne 0) { throw 'LOCAL_SUPABASE_STATUS_FAILED' }
  $keys = @{}
  foreach ($row in $raw) {
    if ([string]$row -match '^(?:export\s+)?(ANON_KEY|SERVICE_ROLE_KEY)=(.*)$') {
      $keys[$Matches[1]] = $Matches[2].Trim().Trim('"').Trim("'")
    }
  }
  if (-not $keys['ANON_KEY'] -or -not $keys['SERVICE_ROLE_KEY']) {
    throw 'LOCAL_KEYS_NOT_AVAILABLE'
  }
  $env:LM360_LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321'
  $env:LM360_LOCAL_ANON_DENIAL_GUARD = 'YES'
  $env:LM360_LOCAL_SUPABASE_ANON_KEY = $keys['ANON_KEY']
  $env:LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY = $keys['SERVICE_ROLE_KEY']
  $keys.Clear()
  $raw = @()

  Write-Host '===== LOVEMATCH360 PRIVACY TEST SOLO LAB ====='
  Write-Host 'ANON_DB_GUARD=PASS (RLS attiva; SELECT anon negato)'
  Write-Host 'Account A/B: lettura di metadati sintetici, senza modifiche'
  Write-Host 'Account C: creazione temporanea, verifica RLS, eliminazione'
  & node scripts/e2e-third-account-privacy-local.mjs
  if ($LASTEXITCODE -ne 0) { throw 'LOCAL_THIRD_ACCOUNT_TEST_FAILED' }
  Write-Host '===== COLLAUDO PRIVACY LOCALE SUPERATO ====='
} finally {
  foreach ($name in $envNames) {
    Remove-Item -Path ('Env:\' + $name) -ErrorAction SilentlyContinue
  }
  Pop-Location
}
