param([int]$Port = 3010)
$ErrorActionPreference = 'Continue'
Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)

# avvia vercel dev in una nuova finestra
$proj   = (Get-Location).Path
$vercel = Start-Process -PassThru powershell -ArgumentList "cd `"$proj`"; vercel dev -l $Port"

# attendi che /api/ping risponda
$base = "http://localhost:$Port"
for ($i = 0; $i -lt 60; $i++) {
  try { $pong = Invoke-RestMethod -Uri "$base/api/ping" -TimeoutSec 1; if ($pong.ok) { break } } catch {}
  Start-Sleep -Seconds 1
}

# apri il browser su login DEV
Start-Process "$base/#/dev-auth"

# tieni in vita la finestra finché vercel è attivo
Wait-Process -Id $vercel.Id
