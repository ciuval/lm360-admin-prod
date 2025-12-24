Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$app = "src/App.jsx"
$tracked = git ls-files
if (-not $tracked) { throw "git ls-files vuoto: repo non ok o non sei nella cartella giusta" }
if (-not (Test-Path $app)) { throw "Manca $app" }

function GetDir([string]$p) {
  $i = $p.LastIndexOf("/")
  if ($i -lt 0) { return "" }
  return $p.Substring(0, $i + 1)
}

function LeafNoExt([string]$p) {
  $leaf = ($p -split "/")[-1]
  $dot = $leaf.LastIndexOf(".")
  if ($dot -gt 0) { return $leaf.Substring(0, $dot) }
  return $leaf
}

$content = Get-Content $app -Raw

# prende tutti i from "./..."
$importRegex = [regex]'from\s+"(\./[^"]+)"'
$paths = @{}
foreach ($m in $importRegex.Matches($content)) {
  $p = $m.Groups[1].Value
  if ($p.StartsWith("./")) { $paths[$p] = $true }
}

$changes = New-Object System.Collections.Generic.List[object]
$unresolved = New-Object System.Collections.Generic.List[string]

foreach ($old in $paths.Keys) {
  $repo = "src/" + $old.Substring(2)

  # 1) match esatto (case-sensitive)
  $exact = $tracked | Where-Object { $_ -ceq $repo } | Select-Object -First 1
  if ($exact) { continue }

  # 2) match case-insensitive sul path completo
  $found = $tracked | Where-Object { $_.ToLowerInvariant() -eq $repo.ToLowerInvariant() } | Select-Object -First 1

  if (-not $found) {
    # 3) fuzzy: stessa cartella (ignora case) + basename che inizia con lo stesso prefisso
    $dir = GetDir $repo
    $base = (LeafNoExt $repo).ToLowerInvariant()

    $cands = $tracked | Where-Object {
      $_.ToLowerInvariant().StartsWith($dir.ToLowerInvariant()) -and
      (LeafNoExt $_).ToLowerInvariant().StartsWith($base)
    }

    # scegli il più "vicino": nome file più corto
    $found = $cands | Sort-Object { (($_ -split "/")[-1]).Length } | Select-Object -First 1
  }

  if ($found) {
    $new = "./" + $found.Substring(4) # rimuove "src/"
    if ($new -ne $old) {
      $content = $content.Replace('from "' + $old + '"', 'from "' + $new + '"')
      $changes.Add([pscustomobject]@{ From = $old; To = $new }) | Out-Null
    }
  } else {
    $unresolved.Add($old) | Out-Null
  }
}

if ($changes.Count -gt 0) {
  [System.IO.File]::WriteAllText($app, $content, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host "✅ Import sistemati (Linux-safe) in src/App.jsx:" -ForegroundColor Green
  $changes | Format-Table -AutoSize
} else {
  Write-Host "ℹ️ Nessun import da correggere in src/App.jsx" -ForegroundColor Yellow
}

if ($unresolved.Count -gt 0) {
  Write-Host "❌ Import non risolti (file non trovati in git):" -ForegroundColor Red
  $unresolved | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

exit 0