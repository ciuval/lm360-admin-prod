# LoveMatch360 — anteprima browser Vite con Supabase SOLO locale.
# Avvio manuale esclusivamente nel clone LAB, mai in produzione.
# Non stampa le chiavi e non imposta SERVICE_ROLE nel browser.
# Arrestare con Ctrl+C; le variabili del test vengono ripulite.
$ErrorActionPreference = 'Stop'

$lab = 'I:\lm360-clean\LM360_FASE2_LAB'
if (-not (Test-Path -LiteralPath (Join-Path $lab 'supabase\config.toml') -PathType Leaf)) {
  throw 'LAB_CONFIG_MISSING'
}
if (-not (Test-Path -LiteralPath (Join-Path $lab 'node_modules') -PathType Container)) {
  throw 'DEPENDENCIES_MISSING_RUN_NPM_CI_IN_LAB'
}
$branch = (& git -C $lab branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne 'integration/quality-gate-20261112') {
  throw 'LAB_BRANCH_MISMATCH'
}
$ports = @(& docker ps --filter 'label=com.supabase.cli.project=LM360_FASE2_LAB' --format '{{.Ports}}')
if ($LASTEXITCODE -ne 0 -or $ports.Count -eq 0 -or
    ($ports -match '0\.0\.0\.0:|\[::\]:|:::') -or
    -not ($ports -match '127\.0\.0\.1:54321->')) {
  throw 'SUPABASE_LOCAL_ONLY_CHECK_FAILED'
}

Push-Location $lab
try {
  # Supabase CLI avvisa su stderr quando imgproxy/pooler non sono avviati.
  # Su PS 5.1 non trasformiamo l'avviso informativo in errore fatale.
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

  $anonKey = $null
  foreach ($row in $raw) {
    if ([string]$row -match '^(?:export\s+)?ANON_KEY=(.*)$') {
      $anonKey = $Matches[1].Trim().Trim('"').Trim("'")
    }
  }
  $raw = @()
  if ([string]::IsNullOrWhiteSpace($anonKey)) {
    throw 'LOCAL_ANON_KEY_MISSING'
  }

  # Vite dà priorità alle variabili già presenti nel processo, rispetto ai
  # vecchi .env. Il browser riceve SOLTANTO la chiave pubblica locale.
  $env:VITE_SUPABASE_URL = 'http://127.0.0.1:54321'
  $env:VITE_SUPABASE_ANON_KEY = $anonKey
  $anonKey = $null

  Write-Host '===== LOVEMATCH360 - ANTEPRIMA BROWSER LOCALE ====='
  Write-Host 'Supabase: loopback 127.0.0.1:54321 (verificato)'
  Write-Host 'App: http://127.0.0.1:5174/#/register'
  Write-Host 'Mailpit: http://127.0.0.1:54324 (solo email sintetiche)'
  Write-Host 'Arresto del server Vite: Ctrl+C'
  & npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
}
finally {
  Remove-Item Env:\VITE_SUPABASE_URL -ErrorAction SilentlyContinue
  Remove-Item Env:\VITE_SUPABASE_ANON_KEY -ErrorAction SilentlyContinue
  Pop-Location
}
