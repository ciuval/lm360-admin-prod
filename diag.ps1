param(
  [string]$Token,
  [string]$EnvPath = ".\.env.prod",
  [switch]$Raw
)

$uri = 'https://app.lovematch360.com/api/diag'

function Get-DiagToken {
  param([string]$Token,[string]$EnvPath)
  if ($Token)          { return $Token.Trim('"',' ',"`r","`n") }
  if ($env:DIAG_TOKEN) { return $env:DIAG_TOKEN.Trim('"',' ',"`r","`n") }
  if (Test-Path $EnvPath) {
    $l = Select-String -Path $EnvPath -Pattern '^\s*DIAG_TOKEN\s*=' | Select-Object -First 1
    if ($l) { return $l.ToString().Split('=',2)[1].Trim('"',' ',"`r","`n") }
  }
  throw "DIAG_TOKEN non trovato: passa -Token, o imposta env:DIAG_TOKEN, o definiscilo in $EnvPath."
}

$tk  = Get-DiagToken $Token $EnvPath
$res = Invoke-RestMethod -Uri $uri -Headers @{ 'x-diag-token' = $tk }

if ($Raw) { $res | ConvertTo-Json -Depth 5; exit }

[PSCustomObject]@{
  ok            = $res.ok
  time          = $res.time
  SUPABASE_URL  = $res.env.SUPABASE_URL
  SUPABASE_ANON = $res.env.SUPABASE_ANON
} | Format-List
