# scripts\run-abtest.ps1 — UI+API+Stripe+A/B (robusto)
$ErrorActionPreference = "SilentlyContinue"
$ProjectPath = "C:\Users\Ellav\Downloads\lm360-admin-prod\lm360-admin-prod"

# URL
$UiHome    = "http://127.0.0.1:5173/#/"
$UiPremium = "http://127.0.0.1:5173/#/premium"
$UiSuccess = "http://127.0.0.1:5173/#/checkout-success"
$UiAbDash  = "http://127.0.0.1:5173/#/admin/ab-test"
$ApiPing   = "http://127.0.0.1:3000/api/ping"
$ApiDebug  = "http://127.0.0.1:3000/api/debug-env"
$Checkout  = "http://127.0.0.1:3000/api/checkout-create"

function Wait-Port([int]$port, [int]$timeoutSec=120) {
  $sw = [Diagnostics.Stopwatch]::StartNew()
  while ($sw.Elapsed.TotalSeconds -lt $timeoutSec) {
    if (Test-NetConnection -ComputerName 127.0.0.1 -Port $port -InformationLevel Quiet) { return $true }
    Start-Sleep -Milliseconds 400
  }
  return $false
}
function Wait-Http([string]$url, [int]$timeoutSec=60) {
  $sw = [Diagnostics.Stopwatch]::StartNew()
  while ($sw.Elapsed.TotalSeconds -lt $timeoutSec) {
    try { $r = Invoke-WebRequest -UseBasicParsing -Uri $url -Method Get -TimeoutSec 5
          if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { return $true } } catch { }
    Start-Sleep -Milliseconds 500
  }
  return $false
}
function Open-Edge([string]$url) {
  try { Start-Process msedge.exe -ArgumentList @("--inprivate", $url) }
  catch { Start-Process $url }
}

Write-Host "`n== 1/10 Chiudo porte 3000,5173 (se occupate) ==" -ForegroundColor Yellow
foreach ($p in 3000,5173) {
  Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess |
    ForEach-Object { taskkill /PID $_ /T /F } 2>$null
}

Write-Host "== 2/10 Avvio API (Vercel dev) su 3000 ==" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$ProjectPath`"; vercel dev" | Out-Null

Write-Host "== 3/10 Avvio UI (Vite) su 5173 ==" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$ProjectPath`"; npm run dev" | Out-Null

Write-Host "== 4/10 Attendo porte aperte ==" -ForegroundColor Yellow
if (!(Wait-Port 3000 120)) { Write-Host "API porta 3000 KO" -ForegroundColor Red; exit 1 }
if (!(Wait-Port 5173 120)) { Write-Host "UI porta 5173 KO" -ForegroundColor Red; exit 1 }

Write-Host "== 5/10 Smoke HTTP ==" -ForegroundColor Yellow
if (!(Wait-Http $ApiPing 90)) { Write-Host "/api/ping KO" -ForegroundColor Red; exit 1 }
# UI: prova 127.0.0.1 poi localhost
if (!(Wait-Http "http://127.0.0.1:5173" 60)) {
  if (!(Wait-Http "http://localhost:5173" 60)) { Write-Host "UI HTTP KO" -ForegroundColor Red; exit 1 }
}

Write-Host "== 6/10 Apro Home e Premium ==" -ForegroundColor Yellow
Open-Edge $UiHome
Open-Edge $UiPremium

Write-Host "== 7/10 Stripe listen (webhook→3000) ==" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$ProjectPath`"; stripe listen --forward-to http://127.0.0.1:3000/api/stripe-webhook" | Out-Null
Start-Sleep -Seconds 2

Write-Host "== 8/10 Provo /api/checkout-create (no toast rossi) ==" -ForegroundColor Yellow
# Leggi price opzionale da .env.local
$envFile = Join-Path $ProjectPath ".env.local"
$priceId = $null
if (Test-Path $envFile) {
  $hit = Select-String -Path $envFile -Pattern '^\s*STRIPE_TEST_PRICE_ID\s*=\s*(.+)\s*$' | Select-Object -First 1
  if ($hit) { $priceId = ($hit.Matches[0].Groups[1].Value).Trim().Trim("`"'") }
}
$userId = "abtest_user_local"
$email  = "test@example.com"
$body = "userId=$userId&email=$email"
if ($priceId) { $body += "&price=$priceId" }
$resp = & curl.exe -s -X POST -H "Content-Type: application/x-www-form-urlencoded" -d $body $Checkout
Write-Host "checkout-create => $resp"

Write-Host "== 9/10 Trigger Stripe + Success + Dashboard ==" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$ProjectPath`"; stripe trigger checkout.session.completed" | Out-Null
Start-Sleep -Seconds 1
Open-Edge $UiSuccess
Open-Edge $UiAbDash

Write-Host "`nTutto acceso. Se vuoi rifare il giro, rilancia questo script. 🚀" -ForegroundColor Green
