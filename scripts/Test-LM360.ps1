param(
  [string]$Apex = "https://lovematch360.com",
  [string]$WWW  = "https://www.lovematch360.com",
  [string]$APP  = "https://app.lovematch360.com"
)

$ErrorActionPreference = "Stop"

function Ok($msg){ Write-Host "âœ… $msg" }
function Bad($msg){ Write-Host "âŒ $msg" -ForegroundColor Red }
function Warn($msg){ Write-Host "âš ï¸  $msg" -ForegroundColor Yellow }

function Get-Status([string]$url){
  $code = & curl.exe -s -L -o NUL -w "%{http_code}" $url
  return [int]$code
}

function Get-Headers([string]$url){
  return (& curl.exe -s -I -L $url) -join "`n"
}

function Must-Status($url, [int[]]$allowed){
  $code = Get-Status $url
  if($allowed -contains $code){ Ok "$url -> HTTP $code" } else { Bad "$url -> HTTP $code (atteso: $($allowed -join ','))" }
}

function Must-HeaderContains($url, $needle){
  $h = Get-Headers $url
  if($h.ToLower().Contains($needle.ToLower())){ Ok "Header OK su $url -> contiene '$needle'" } else { Bad "Header MANCANTE su $url -> '$needle'" }
}

function Must-BodyContains($url, $needle){
  # Forza body NON compresso e output stabile
  $out = & curl.exe -sS -L -H "Accept-Encoding: identity" $url

  # Sempre stringa unica (anche se curl ritorna array di linee)
  $body = ($out | Out-String)

  # BOM + normalize
  $body = $body -replace "^\uFEFF",""
  $body = $body -replace "\uFEFF",""
  $body = $body -replace "`r",""
  $body = $body -replace "`t"," "
  $body = $body -replace " +"," "

  if([string]::IsNullOrWhiteSpace($body)){
    Bad "Body VUOTO su $url"
    return
  }

  if($body.ToLower().Contains($needle.ToLower())){
    Ok "Body OK su $url -> contiene '$needle'"
  } else {
    Bad "Body MANCANTE su $url -> '$needle'"
  }
}

Write-Host "`n=== DOMINI (reachability) ==="
Must-Status $Apex @(200,301,302,307,308)
Must-Status $WWW  @(200,301,302,307,308)
Must-Status $APP  @(200,301,302,307,308)

Write-Host "`n=== APP (noindex + security headers) ==="
# per app vogliamo noindex, nosniff, HSTS (se hai messo vercel.json come da audit)
Must-HeaderContains $APP  "x-robots-tag: noindex"
Must-HeaderContains $APP  "x-content-type-options: nosniff"
Must-HeaderContains $APP  "strict-transport-security"

Write-Host "`n=== WWW (SEO: robots + sitemap) ==="
Must-Status "$WWW/robots.txt" @(200)
Must-BodyContains "$WWW/robots.txt" "sitemap:"
Must-Status "$WWW/sitemap.xml" @(200)
Must-BodyContains "$WWW/sitemap.xml" "<urlset"

Write-Host "`n=== APEX sanity ==="
Must-Status $Apex @(200,301,302,307,308) -FollowWrite-Host "`n=== API sanity (non 500) ==="
# accettiamo 200/400/401/405 a seconda dell'endpoint
$api = @(
  "$Apex/api/get-prices",
  "$Apex/api/stripe-portal",
  "$Apex/api/stripe-webhook",
  "$Apex/api/stripe-refund-runner"
)

foreach($u in $api){
  $code = Get-Status $u
  if(@(200,400,401,403,404,405) -contains $code){
    if($code -eq 500){ Bad "$u -> 500 (NO)" }
    elseif($code -eq 404){ Warn "$u -> 404 (ok solo se endpoint non usato)" }
    else { Ok "$u -> HTTP $code" }
  } else {
    Bad "$u -> HTTP $code"
  }
}

Write-Host "`n=== DONE ==="
