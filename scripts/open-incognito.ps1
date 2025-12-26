param([Parameter(Mandatory=$true)][string]$Url)
$edge = @(
 "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
 "$env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe",
 "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe"
) | ?{ Test-Path $_ } | Select-Object -First 1
if ($edge) { Start-Process $edge -ArgumentList "--inprivate","--disable-extensions","$Url"; return }
$chrome = @(
 "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
 "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe",
 "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
) | ?{ Test-Path $_ } | Select-Object -First 1
if ($chrome) { Start-Process $chrome -ArgumentList "--incognito","--disable-extensions","$Url"; return }
Start-Process "cmd" -ArgumentList "/c start `"$Url`""
