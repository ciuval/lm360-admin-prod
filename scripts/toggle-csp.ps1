$path = Join-Path (Split-Path $MyInvocation.MyCommand.Path -Parent) "..\vercel.json"
$bak  = "$path.bak"
if (Test-Path $path) { Rename-Item $path $bak -Force; Write-Host "CSP OFF (renamed -> vercel.json.bak)"; return }
if (Test-Path $bak)  { Rename-Item $bak  $path -Force; Write-Host "CSP ON  (restored vercel.json)";   return }
Write-Host "Nessun file CSP trovato."
