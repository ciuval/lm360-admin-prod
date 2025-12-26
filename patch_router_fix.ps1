[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
Write-Host "== LM360 Router Patch (fix): start ==" -ForegroundColor Cyan

# 1) Trova main.jsx/tsx (esclude node_modules/dist)
$main = Get-ChildItem -Path . -Recurse -Include main.jsx,main.tsx |
  Where-Object { $_.FullName -notmatch "\\node_modules\\|\\dist\\|\\build\\" } |
  Select-Object -First 1
if (-not $main) { Write-Error "main.jsx/tsx non trovato. Dimmi il path e lo adatto."; exit 1 }

$base = $main.DirectoryName
$ext  = "jsx"
if ($main.Name -like "*.tsx") { $ext = "tsx" }

Write-Host ("main: " + $main.FullName + "  (ext="+$ext+")") -ForegroundColor Green

# 2) react-router-dom se manca
try {
  $pkg = Get-Content .\package.json -Raw | ConvertFrom-Json
  $hasRRD = $false
  if ($pkg.dependencies)     { $hasRRD = $pkg.dependencies.PSObject.Properties.Name -contains 'react-router-dom' }
  if (-not $hasRRD -and $pkg.devDependencies) { $hasRRD = $pkg.devDependencies.PSObject.Properties.Name -contains 'react-router-dom' }
  if (-not $hasRRD) { Write-Host "Installo react-router-dom..." -ForegroundColor Yellow; npm i react-router-dom@^6 }
} catch {}

# Helper
function Write-IfMissing([string]$path,[string]$content){
  if (-not (Test-Path $path)) {
    New-Item -Force -ItemType Directory (Split-Path $path -Parent) | Out-Null
    Set-Content -Encoding UTF8 -Path $path -Value $content
    Write-Host "Creato: $path"
  } else { Write-Host "Esiste già: $path (ok)" }
}

# 3) Header/Footer
$Header = @"
import React from "react";
export default function Header(){
  return (
    <header style={{padding:"12px 16px", borderBottom:"1px solid rgba(0,0,0,0.1)"}}>
      <nav aria-label="Navigazione principale" style={{display:"flex", gap:16, alignItems:"center", flexWrap:"wrap"}}>
        <a href="#/discover">Scopri</a>
        <a href="#/likes">Like</a>
        <a href="#/matches">Match</a>
        <a href="#/chat">Chat</a>
        <a href="#/premium" aria-label="Vai a Premium">Premium</a>
        <span style={{marginLeft:"auto"}}><a href="#/signup">Iscriviti</a></span>
      </nav>
    </header>
  );
}
"@
$Footer = @"
import React from "react";
export default function Footer(){
  return (
    <footer style={{padding:"16px", borderTop:"1px solid rgba(0,0,0,0.1)", marginTop:24}}>
      <nav aria-label="Link utili" style={{display:"flex", gap:16, flexWrap:"wrap"}}>
        <a href="#/privacy">Privacy</a>
        <a href="#/termini">Termini</a>
        <a href="#/about">About</a>
        <a href="#/contatti">Contatti</a>
      </nav>
    </footer>
  );
}
"@
Write-IfMissing (Join-Path $base "components\Header.$ext") $Header
Write-IfMissing (Join-Path $base "components\Footer.$ext") $Footer

# 4) Pagine stub
function PageStub([string]$name,[string]$desc){ return @"
import React from "react";
export default function $name(){
  return (
    <main id="main" tabIndex={-1} style={{padding:"24px", maxWidth: 960, margin: "0 auto"}}>
      <h1>$name</h1>
      <p className="muted">$desc</p>
    </main>
  );
}
"@ }
Write-IfMissing (Join-Path $base "pages\Signup.$ext")   (PageStub "Signup"  "Crea il tuo profilo in 3 step. Serio ma caloroso, zero caos.")
Write-IfMissing (Join-Path $base "pages\Discover.$ext") (PageStub "Discover" "Profili compatibili vicino a te.")
Write-IfMissing (Join-Path $base "pages\Likes.$ext")    (PageStub "Likes"    "Invia e ricevi like. Sblocca il match reciproco.")
Write-IfMissing (Join-Path $base "pages\Matches.$ext")  (PageStub "Matches"  "Qui compaiono i match reciproci.")
Write-IfMissing (Join-Path $base "pages\Chat.$ext")     (PageStub "Chat"     "Chat elegante, notifiche realtime.")
Write-IfMissing (Join-Path $base "pages\Premium.$ext")  (PageStub "Premium"  "Filtri avanzati, boost, read receipts. Trial 7 giorni a €1.")
Write-IfMissing (Join-Path $base "pages\Privacy.$ext")  (PageStub "Privacy"  "GDPR, diritti, contatti: support@lovematch360.com")
Write-IfMissing (Join-Path $base "pages\Terms.$ext")    (PageStub "Terms"    "Termini del servizio e rimborsi 30 giorni.")

# 5) AppRouter
$appRouterPath = Join-Path $base "AppRouter.$ext"
$AppRouter = @"
import React from "react";
import { HashRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Signup   = React.lazy(() => import("./pages/Signup"));
const Discover = React.lazy(() => import("./pages/Discover"));
const Likes    = React.lazy(() => import("./pages/Likes"));
const Matches  = React.lazy(() => import("./pages/Matches"));
const Chat     = React.lazy(() => import("./pages/Chat"));
const Premium  = React.lazy(() => import("./pages/Premium"));
const Privacy  = React.lazy(() => import("./pages/Privacy"));
const Terms    = React.lazy(() => import("./pages/Terms"));

function Layout(){
  return (
    <div className="app-shell" style={{minHeight:"100dvh", display:"flex", flexDirection:"column"}}>
      <a className="sr-only" href="#main">Salta al contenuto</a>
      <Header />
      <div style={{flex:1}}>
        <React.Suspense fallback={<main id="main" style={{padding:24}}>Caricamento…</main>}>
          <Outlet />
        </React.Suspense>
      </div>
      <Footer />
    </div>
  );
}

function NotFound(){
  return (
    <main id="main" tabIndex={-1} style={{padding:"24px"}}>
      <h1>Pagina non trovata</h1>
      <p><a href="#/discover">Torna a Scopri</a></p>
    </main>
  );
}

export default function AppRouter(){
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/discover" replace />} />
          <Route path="/signup"   element={<Signup />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/likes"    element={<Likes />} />
          <Route path="/matches"  element={<Matches />} />
          <Route path="/chat"     element={<Chat />} />
          <Route path="/premium"  element={<Premium />} />
          <Route path="/privacy"  element={<Privacy />} />
          <Route path="/termini"  element={<Terms />} />
          <Route path="*"         element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
"@
Set-Content -Encoding UTF8 -Path $appRouterPath -Value $AppRouter
Write-Host ("AppRouter scritto: " + $appRouterPath) -ForegroundColor Green

# 6) Backup + patch main (senza else appesi)
$backup = "$($main.FullName).bak.lm360"
Copy-Item $main.FullName $backup -Force
Write-Host ("Backup: " + $backup) -ForegroundColor Yellow

$content = Get-Content $main.FullName -Raw
if ($content -notmatch 'import\s+AppRouter\s+from') {
  $lines = $content -split "`r?`n"
  $lastImport = ($lines | Select-String -Pattern '^\s*import\s' | Select-Object -Last 1).LineNumber
  if ($lastImport) {
    $lines = @($lines[0..($lastImport-1)]) + @('import AppRouter from "./AppRouter";') + @($lines[$lastImport..($lines.Length-1)])
    $content = ($lines -join "`r`n")
    Write-Host "Import AppRouter aggiunto."
  } else {
    $content = 'import AppRouter from "./AppRouter";' + "`r`n" + $content
    Write-Host "Import AppRouter aggiunto in testa."
  }
}

# sostituzioni comuni
$content = $content -replace '<App\s*/>', '<AppRouter />'
$content = [regex]::Replace($content, '<App>.*?</App>', '<AppRouter />', 'Singleline')
$content = [regex]::Replace($content, 'createRoot\((.*?)\)\.render\((.|\s)*?\);', 'createRoot($1).render(<AppRouter />);')

Set-Content -Encoding UTF8 -Path $main.FullName -Value $content
Write-Host ("Patch completata su " + $main.FullName) -ForegroundColor Green
Write-Host "== LM360 Router Patch (fix): done ==" -ForegroundColor Cyan
