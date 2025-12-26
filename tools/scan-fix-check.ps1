<# 
  tools/scan-fix-check.ps1
  Scan + Fix + Check per env Supabase in Vite/React.
  Compatibile con Windows PowerShell 5.x
#>

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path ".").Path

function Write-NoBom {
  param([string]$Path, [string]$Content)
  $dir = Split-Path -Parent $Path
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  $enc = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $enc)
}

function Sanit {
  param([string]$s)
  if (-not $s) { return "<vuoto>" }
  if ($s -match '^https?://([^/]+)/?') { return "url:$($Matches[1])" }
  if ($s.Length -gt 8) { return $s.Substring(0,2) + "…" + $s.Substring($s.Length-6) }
  return $s
}

function Read-DotEnv {
  param([string]$path)
  $map = @{}
  if (-not (Test-Path $path)) { return $map }
  Get-Content $path | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) { return }
    $kv = $line.Split("=",2)
    if ($kv.Count -eq 2) {
      $k = $kv[0].Trim()
      $v = $kv[1].Trim().Trim('"','''')
      $map[$k] = $v
    }
  }
  return $map
}

function Ensure-SupabaseClient {
  param([string]$path)
  $expected = @"
import { createClient } from "@supabase/supabase-js";

const url  = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error("Env mancanti: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(url, anon);
"@
  if (Test-Path $path) {
    $current = (Get-Content $path -Raw)
    if ($current -match 'VITE_SUPABASE_URL' -and $current -match 'VITE_SUPABASE_ANON_KEY') {
      return $false
    }
  }
  Write-NoBom $path $expected
  return $true
}

Write-Host "=== LoveMatch360 Doctor: scan + fix + check ===" -ForegroundColor Cyan

$src = Join-Path $root "src"
if (-not (Test-Path $src)) { throw "Non trovo la cartella 'src' nella root: $root" }

$files = Get-ChildItem $src -Recurse -File -Include *.js,*.jsx,*.ts,*.tsx
$changed = @()
$scanHits = 0
foreach ($f in $files) {
  $txt = Get-Content $f.FullName -Raw
  $before = $txt

  $txt = $txt -replace 'process\.env\.SUPABASE_URL','import.meta.env.VITE_SUPABASE_URL'
  $txt = $txt -replace 'process\.env\.SUPABASE_ANON(_KEY)?','import.meta.env.VITE_SUPABASE_ANON_KEY'
  $txt = $txt -replace 'import\.meta\.env\.SUPABASE_URL','import.meta.env.VITE_SUPABASE_URL'
  $txt = $txt -replace 'import\.meta\.env\.SUPABASE_ANON(_KEY)?','import.meta.env.VITE_SUPABASE_ANON_KEY'

  if ($before -ne $txt) {
    $scanHits++
    $bak = "$($f.FullName).bak"
    if (-not (Test-Path $bak)) { Copy-Item $f.FullName $bak }
    Write-NoBom $f.FullName $txt
    $changed += $f.FullName
  }
}

$envLocal = Join-Path $root ".env.local"
$envDev   = Join-Path $root ".env"
function ReadEnv([string]$k) {
  $m1 = (Read-DotEnv $envLocal)[$k]
  if ($m1) { return $m1 }
  return (Read-DotEnv $envDev)[$k]
}
$viteUrl  = ReadEnv 'VITE_SUPABASE_URL'
$viteAnon = ReadEnv 'VITE_SUPABASE_ANON_KEY'

$envWarn = @()
if (-not $viteUrl)  { $envWarn += "Manca VITE_SUPABASE_URL in .env.local o .env" }
if (-not $viteAnon) { $envWarn += "Manca VITE_SUPABASE_ANON_KEY in .env.local o .env" }

$clientPath = Join-Path $src "lib\supabase.js"
$clientCreated = Ensure-SupabaseClient $clientPath

Write-Host ""
Write-Host "=== Report ===" -ForegroundColor Yellow
Write-Host ("File scansionati     : {0}" -f $files.Count)
Write-Host ("Righe modificate     : {0}" -f $scanHits)
if ($changed.Count -gt 0) {
  Write-Host "File aggiornati:" -ForegroundColor Yellow
  $changed | ForEach-Object { Write-Host "  - $_" }
} else {
  Write-Host "Nessuna sostituzione necessaria."
}

Write-Host ""
Write-Host "Env (sanitized):" -ForegroundColor Yellow
Write-Host ("  VITE_SUPABASE_URL       = {0}" -f (Sanit $viteUrl))
Write-Host ("  VITE_SUPABASE_ANON_KEY  = {0}" -f (Sanit $viteAnon))

if ($envWarn.Count -gt 0) {
  Write-Host ""
  Write-Host "⚠️  Problemi env:" -ForegroundColor Red
  $envWarn | ForEach-Object { Write-Host " - $_" }
}

Write-Host ""
Write-Host ("Client supabase.js    : {0}" -f ($(if ($clientCreated) {"CREATO/AGGIORNATO"} else {"OK"})))

Write-Host ""
Write-Host "=== Next steps ===" -ForegroundColor Cyan
if ($envWarn.Count -eq 0) {
  Write-Host "1) Riavvia il dev server (Vite rilegge gli env all’avvio):"
  Write-Host "     npx vercel@latest dev" -ForegroundColor Green
  Write-Host "2) Apri http://localhost:3000 e verifica che l’errore 'supabaseUrl is required' sia sparito."
} else {
  Write-Host "1) Aggiungi gli env mancanti nel file .env.local (consigliato) oppure .env:"
  Write-Host "     VITE_SUPABASE_URL=<https://xxx.supabase.co>"
  Write-Host "     VITE_SUPABASE_ANON_KEY=<anon-key>"
  Write-Host "2) Riavvia il dev server:"
  Write-Host "     npx vercel@latest dev" -ForegroundColor Green
}
Write-Host ""
Write-Host "Tip: per importare il client usa:  import { supabase } from './lib/supabase';" -ForegroundColor DarkGray