# scripts\report.ps1 — scarica CSV settimanale e apre la dashboard
$ErrorActionPreference = "SilentlyContinue"
$base = "http://127.0.0.1:3000"
$csvUrl = "$base/api/ab-weekly-report?format=csv"
$dir = Join-Path $PSScriptRoot "..\reports"
New-Item -Force -ItemType Directory -Path $dir | Out-Null
$fname = "ab_weekly_{0:yyyyMMdd_HHmm}.csv" -f (Get-Date)
$path = Join-Path $dir $fname
Invoke-WebRequest -UseBasicParsing -Uri $csvUrl -OutFile $path
Start-Process $path
Start-Process "http://127.0.0.1:5173/#/admin/ab-test"
Write-Host "Report salvato: $path"
