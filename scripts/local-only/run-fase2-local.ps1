# LoveMatch360 — Fase 2, prova vera con A/B nel Supabase LOCALE.
# Non mostra chiavi, email, password, UUID o contenuto dei messaggi.
# Richiede Docker Desktop con Port binding behavior: Localhost only.
# Usa il database SOLO del clone I:\lm360-clean\LM360_FASE2_LAB.
# PowerShell 5.1; nessun supabase link / push / reset / deploy.

$ErrorActionPreference = 'Stop'
$lab = 'I:\lm360-clean\LM360_FASE2_LAB'
$branchExpected = 'integration/quality-gate-20261112'
$envNames = @(
  'LM360_LOCAL_SUPABASE_URL',
  'LM360_LOCAL_SUPABASE_ANON_KEY',
  'LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY'
)

if (-not (Test-Path -LiteralPath $lab -PathType Container)) {
  throw 'LAB_NOT_FOUND'
}
if (-not (Test-Path -LiteralPath (Join-Path $lab 'supabase\config.toml') -PathType Leaf)) {
  throw 'LAB_CONFIG_NOT_FOUND'
}
if (-not (Test-Path -LiteralPath (Join-Path $lab 'scripts\e2e-two-accounts-local.mjs') -PathType Leaf)) {
  throw 'TEST_HARNESS_NOT_FOUND'
}
$branch = (& git -C $lab branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne $branchExpected) {
  throw 'LAB_BRANCH_MISMATCH'
}

# Non si usa Supabase cloud, neppure per recuperare le chiavi.
$ports = @(
  & docker ps --filter 'label=com.supabase.cli.project=LM360_FASE2_LAB' --format '{{.Ports}}'
)
if ($LASTEXITCODE -ne 0 -or $ports.Count -eq 0) {
  throw 'LOCAL_DOCKER_STACK_NOT_RUNNING'
}
if (($ports -match '0\.0\.0\.0:|\[::\]:|:::') -or
    -not ($ports -match '127\.0\.0\.1:54321->')) {
  throw 'LOCAL_DOCKER_PORTS_NOT_ISOLATED'
}

Push-Location $lab
try {
  Write-Host '===== LOVEMATCH360: COLLAUDO LOCALE ====='
  Write-Host 'Step 1/3: installazione dipendenze dal lockfile locale'
  & npm ci --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) {
    throw 'NPM_CI_FAILED'
  }

  Write-Host 'Step 2/3: lettura riservata delle sole chiavi Supabase locali'
  # Niente Out-Host o stampa della risposta di status: contiene segreti.
  # Windows PowerShell 5.1 converte lo stderr di programmi nativi in
  # NativeCommandError. "Stopped services" puo essere solo informativo:
  # intercettiamo lo stderr senza renderlo bloccante, ma verifichiamo il codice.
  $savedErrorActionPreference = $ErrorActionPreference
  try {
    $ErrorActionPreference = 'Continue'
    $raw = @(& npx --yes supabase status -o env 2>$null)
    $statusExitCode = $LASTEXITCODE
  }
  finally {
    $ErrorActionPreference = $savedErrorActionPreference
  }
  if ($statusExitCode -ne 0) {
    throw 'LOCAL_SUPABASE_STATUS_FAILED'
  }
  $keys = @{}
  foreach ($row in $raw) {
    $line = [string]$row
    if ($line -match '^(?:export\s+)?(ANON_KEY|SERVICE_ROLE_KEY)=(.*)$') {
      $keys[$Matches[1]] = $Matches[2].Trim().Trim('"').Trim("'")
    }
  }
  if (-not $keys['ANON_KEY'] -or -not $keys['SERVICE_ROLE_KEY']) {
    throw 'LOCAL_SUPABASE_KEYS_MISSING'
  }

  $env:LM360_LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321'
  $env:LM360_LOCAL_SUPABASE_ANON_KEY = $keys['ANON_KEY']
  $env:LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY = $keys['SERVICE_ROLE_KEY']
  $keys.Clear()
  $raw = @()

  Write-Host 'Step 3/3: percorso reale con account sintetici A/B'
  & npm run test:e2e:local
  $result = $LASTEXITCODE
  Write-Host ('Esito Fase 2 API: ' + $(if ($result -eq 0) {'PASS'} else {'FAIL'}))
  if ($result -ne 0) {
    throw 'LOCAL_TWO_ACCOUNT_TEST_FAILED'
  }
}
finally {
  foreach ($name in $envNames) {
    Remove-Item -Path ('Env:\' + $name) -ErrorAction SilentlyContinue
  }
  Pop-Location
}
