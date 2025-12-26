# scripts\stop-all.ps1 — spegne UI, API, Stripe
$ErrorActionPreference = "SilentlyContinue"
foreach ($p in 3000,5173) {
  Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess |
    ForEach-Object { taskkill /PID $_ /T /F } 2>$null
}
Get-Process -Name stripe -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name node   -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "Dev servers chiusi. ✅"
